import type { UserDocument } from "../schemas/user.schema"

declare module "express-serve-static-core" {
  namespace Express {
    interface Request {
      user?: UserDocument
    }
  }
}
