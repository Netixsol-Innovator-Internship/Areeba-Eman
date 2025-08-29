export type SocketUser = {
  username: string;
  socketId: string;
};

export interface WsComment {
  id: number;
  user: string;
  text: string;
  to?: string | null;
  createdAt: number;
}
