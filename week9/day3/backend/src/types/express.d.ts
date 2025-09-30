import { User } from 'src/users/schemas/user.schema';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}
