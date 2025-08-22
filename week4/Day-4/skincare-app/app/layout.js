"use client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-pink-100 min-h-screen">
        {/* ✅ Tailwind via CDN */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}