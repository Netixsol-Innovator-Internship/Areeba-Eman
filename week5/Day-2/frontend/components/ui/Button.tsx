import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export default function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-2xl shadow-sm font-medium transition active:scale-[.98]',
        'bg-gradient-to-r from-pink-500 via-indigo-500 to-brand-500 text-white',
        'hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-400',
        className
      )}
      {...props}
    />
  );
}
