// components/ui/Input.tsx
'use client';
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, ref) => {
    return (
      <input
        ref={ref}
        className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
export default Input;

// import { InputHTMLAttributes } from 'react';
// import clsx from 'clsx';

// export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
//   return (
//     <input
//       className={clsx(
//         'w-full px-4 py-2 rounded-xl border outline-none',
//         'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
//         'focus:ring-2 focus:ring-brand-400',
//         className
//       )}
//       {...props}
//     />
//   );
// }
