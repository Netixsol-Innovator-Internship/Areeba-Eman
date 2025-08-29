import { Controller, Get, Put, Delete, Param, UseGuards, Req } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";
import { UserDocument } from "../schemas/user.schema";


@Controller("notifications")
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()

  async getMyNotifications(@Req() req: Request) {
  const user = req.user as UserDocument;
    const notifications = await this.notificationService.getUserNotifications(user._id);
    return {
      message: "Notifications retrieved successfully",
      notifications,
    };
  }// async getMyNotifications(@Req() req: any) {
//   console.log('req.user =', req.user); // 🔍 check if user is attached
//   return { message: 'test' };
// }

  @UseGuards(JwtAuthGuard)
  @Get("unread-count")
  async getUnreadCount(@Req() req: Request) {
    const user = req.user as UserDocument;
    const count = await this.notificationService.getUnreadCount(user._id);
    return {
      message: "Unread count retrieved successfully",
      count,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    const notification = await this.notificationService.markAsRead(id);
    return {
      message: 'Notification marked as read',
      notification,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put("mark-all-read")
  async markAllAsRead(@Req() req: Request) {
    const user = req.user as UserDocument;
    await this.notificationService.markAllAsRead(user._id);
    return {
      message: "All notifications marked as read",
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    await this.notificationService.deleteNotification(id);
    return {
      message: 'Notification deleted successfully',
    };
  }
}

// import { Controller, Get, Put, Delete, Param, UseGuards, Req } from "@nestjs/common"
// import  { NotificationService } from "./notification.service"
// import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
// import { Request } from "express"
// import  { UserDocument } from "../schemas/user.schema"
// // import "../types/express";

// @Controller("notifications")
// export class NotificationController {
//   constructor(private notificationService: NotificationService) {}

//   @UseGuards(JwtAuthGuard)
//   @Get()
//   async getMyNotifications(@Req() req: Request) {
//     const user = req.user as UserDocument
//     const notifications = await this.notificationService.getUserNotifications(user._id)
//     return {
//       message: "Notifications retrieved successfully",
//       notifications,
//     }
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get("unread-count")
//   async getUnreadCount(req: Request) {
//     const user = req.user as UserDocument
//     const count = await this.notificationService.getUnreadCount(user._id)
//     return {
//       message: "Unread count retrieved successfully",
//       count,
//     }
//   }

//   @UseGuards(JwtAuthGuard)
//   @Put(':id/read')
//   async markAsRead(@Param('id') id: string) {
//     const notification = await this.notificationService.markAsRead(id);
//     return {
//       message: 'Notification marked as read',
//       notification,
//     };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Put("mark-all-read")
//   async markAllAsRead(req: Request) {
//     const user = req.user as UserDocument
//     await this.notificationService.markAllAsRead(user._id)
//     return {
//       message: "All notifications marked as read",
//     }
//   }

//   @UseGuards(JwtAuthGuard)
//   @Delete(':id')
//   async deleteNotification(@Param('id') id: string) {
//     await this.notificationService.deleteNotification(id);
//     return {
//       message: 'Notification deleted successfully',
//     };
//   }
// }
