import ClientProvider from "./ClientProvider";
import "./globals.css";

export const metadata = {
  title: "Resume Builder",
  description: "Free and Open-Source Resume Builder",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black">
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
