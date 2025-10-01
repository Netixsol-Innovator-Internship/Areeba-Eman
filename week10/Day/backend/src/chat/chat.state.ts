import { BaseMessage, SystemMessage } from "@langchain/core/messages";
import { Document } from "mongoose";
import { Product } from "../products/schemas/productschema"; 

export interface ChatState {
  systemMessage: SystemMessage; // ✅ add this
  messages: BaseMessage[];
  intent?: string;
  query?: string;
  keywords?: string[];
  products?: (Document<unknown, {}, Product> & Product & { _id: unknown })[];
  explanation?: string;
}
