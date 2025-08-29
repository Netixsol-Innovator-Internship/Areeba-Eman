import './globals.css';
import type { Metadata } from 'next';
import ThemeProvider from '@/context/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import SocketProvider from '@/context/SocketProvider';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Commently',
  description: 'Colorful, real-time comment system frontend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <Navbar />
              <main className="max-w-5xl mx-auto p-4">{children}</main>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
