import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          'w-full px-4 py-2 rounded-xl border outline-none resize-none',
          'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
          'focus:ring-2 focus:ring-brand-400',
          className
        )}
        rows={4}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
