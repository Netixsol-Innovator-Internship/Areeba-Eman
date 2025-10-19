import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "SimpleSwap DEX",
  description: "A minimal decentralized token swap platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
