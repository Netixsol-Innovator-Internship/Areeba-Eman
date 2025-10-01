// types/chat.ts
export interface ChatProduct {
  name: string;
  price?: number | string;
  brand?: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;              // always a string
  products?: ChatProduct[];  // optional product list
}
