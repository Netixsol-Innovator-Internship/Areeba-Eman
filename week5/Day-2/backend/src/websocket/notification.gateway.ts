import {
  WebSocketGateway,
  WebSocketServer,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
} from "@nestjs/websockets"
import type { Server, Socket } from "socket.io"
import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { NotificationService } from "../notification/notification.service"
import type { NotificationDocument } from "../schemas/notification.schema"

interface AuthenticatedSocket extends Socket {
  userId?: string
  username?: string
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private connectedUsers = new Map<string, string>() // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(" ")[1]

      if (!token) {
        client.disconnect()
        return
      }

      const payload = this.jwtService.verify(token)
      client.userId = payload.sub
      client.username = payload.username

      // Store user connection
      this.connectedUsers.set(client.userId, client.id)

      // Join user to their personal room
      client.join(`user_${client.userId}`)

      console.log(`User ${client.username} connected with socket ${client.id}`)

      // Send unread notifications count
      const unreadCount = await this.notificationService.getUnreadCount(client.userId)
      client.emit("unread_count", { count: unreadCount })
    } catch (error) {
      console.error("WebSocket authentication failed:", error)
      client.disconnect()
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId)
      console.log(`User ${client.username} disconnected`)
    }
  }

  handleJoinRoom(client: AuthenticatedSocket, data: { room: string }) {
    client.join(data.room)
    client.emit("joined_room", { room: data.room })
  }

  handleLeaveRoom(client: AuthenticatedSocket, data: { room: string }) {
    client.leave(data.room)
    client.emit("left_room", { room: data.room })
  }

  // Emit new comment notification to all users
  async emitNewComment(comment: any, authorId: string) {
    const notification = await this.notificationService.createNotification(
      "all", // Special case for broadcasting
      authorId,
      "comment" as any,
      `${comment.author.username} posted a new comment`,
      comment._id,
    )

    const notificationDoc = notification as NotificationDocument & { createdAt: Date }

    this.server.emit("new_comment", {
      comment,
      notification: {
        id: notificationDoc._id,
        message: notificationDoc.message,
        type: notificationDoc.type,
        sender: comment.author,
        createdAt: notificationDoc.createdAt,
      },
    })
  }

  // Emit reply notification to comment author
  async emitNewReply(reply: any, parentComment: any, authorId: string) {
    if (parentComment.author._id.toString() !== authorId) {
      const notification = await this.notificationService.createNotification(
        parentComment.author._id,
        authorId,
        "reply" as any,
        `${reply.author.username} replied to your comment`,
        reply._id,
      )

      const notificationDoc = notification as NotificationDocument & { createdAt: Date }

      this.server.to(`user_${parentComment.author._id}`).emit("new_reply", {
        reply,
        parentComment,
        notification: {
          id: notificationDoc._id,
          message: notificationDoc.message,
          type: notificationDoc.type,
          sender: reply.author,
          createdAt: notificationDoc.createdAt,
        },
      })

      // Update unread count
      const unreadCount = await this.notificationService.getUnreadCount(parentComment.author._id)
      this.server.to(`user_${parentComment.author._id}`).emit("unread_count", { count: unreadCount })
    }
  }

  // Emit like notification to comment author
  async emitCommentLike(like: any, comment: any, userId: string) {
    if (comment.author._id.toString() !== userId) {
      const notification = await this.notificationService.createNotification(
        comment.author._id,
        userId,
        "like" as any,
        `${like.user.username} liked your comment`,
        comment._id,
      )

      const notificationDoc = notification as NotificationDocument & { createdAt: Date }

      this.server.to(`user_${comment.author._id}`).emit("comment_liked", {
        like,
        comment,
        notification: {
          id: notificationDoc._id,
          message: notificationDoc.message,
          type: notificationDoc.type,
          sender: like.user,
          createdAt: notificationDoc.createdAt,
        },
      })

      // Update unread count
      const unreadCount = await this.notificationService.getUnreadCount(comment.author._id)
      this.server.to(`user_${comment.author._id}`).emit("unread_count", { count: unreadCount })
    }
  }

  // Emit follow notification
  async emitNewFollower(follow: any, followerId: string) {
    const notification = await this.notificationService.createNotification(
      follow.following._id,
      followerId,
      "follow" as any,
      `${follow.follower.username} started following you`,
    )

    const notificationDoc = notification as NotificationDocument & { createdAt: Date }

    this.server.to(`user_${follow.following._id}`).emit("new_follower", {
      follow,
      notification: {
        id: notificationDoc._id,
        message: notificationDoc.message,
        type: notificationDoc.type,
        sender: follow.follower,
        createdAt: notificationDoc.createdAt,
      },
    })

    // Update unread count
    const unreadCount = await this.notificationService.getUnreadCount(follow.following._id)
    this.server.to(`user_${follow.following._id}`).emit("unread_count", { count: unreadCount })
  }

  // Emit real-time comment updates
  emitCommentUpdate(comment: any) {
    this.server.emit("comment_updated", { comment })
  }

  // Emit real-time comment deletion
  emitCommentDelete(commentId: string) {
    this.server.emit("comment_deleted", { commentId })
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId)
  }

  // Get online users count
  getOnlineUsersCount(): number {
    return this.connectedUsers.size
  }
}
