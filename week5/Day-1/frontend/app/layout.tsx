// frontend/src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext"

export const metadata = {
  title: "Realtime Comments App",
  description: "Socket.IO + NestJS + Next.js realtime comments",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center">
         <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
