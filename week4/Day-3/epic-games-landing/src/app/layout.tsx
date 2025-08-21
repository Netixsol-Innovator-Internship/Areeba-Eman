import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Metadata } from "next";
import type { ReactNode } from "react";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Load the Poppins font with specific weights
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // You can customize weights
  variable: "--font-poppins", // Optional: for CSS variable usage
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Game Arena",
  description: "welcome to my epic games",
    icons: {
    icon: "/image2.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}