'use client';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  console.log('User in Navbar:', user);
  if (loading) return null; // prevent flicker before auth state is ready
  const theme = useStore(s => s.theme);
  const setTheme = useStore(s => s.setTheme);
  const unread = useStore(s => s.unread);

  return (
    <header className="sticky top-0 z-30 bg-white/60 dark:bg-gray-900/60 backdrop-blur border-b border-white/20">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-3">
        <Link href="/" className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-indigo-500 to-brand-500">Commently</Link>
        <nav className="flex items-center gap-3">
          <Link href="/notifications" className="relative px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            Notifications
            {unread > 0 && <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full px-2">{unread}</span>}
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link href={`/profile`} className="hover:underline">@{user.username}</Link>
              <Button onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </div>
          )}
          <button
            className="px-3 py-2 rounded-xl border"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌞' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
}
