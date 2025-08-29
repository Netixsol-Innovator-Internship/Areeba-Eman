import { HTMLAttributes } from 'react';
import clsx from 'clsx';

export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur border border-white/20 shadow-md p-4',
        className
      )}
      {...props}
    />
  );
}
