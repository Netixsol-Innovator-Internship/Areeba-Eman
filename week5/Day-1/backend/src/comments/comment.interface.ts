export interface Comment {
  id: number;
  user: string;
  text: string;
  to?: string | null; // DM target username (optional)
  createdAt: number;
  // For ownership enforce via socket identity (no DB)
  creatorSocketId: string;
}
