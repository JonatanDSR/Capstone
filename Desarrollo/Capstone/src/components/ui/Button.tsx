import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({ 
  className, 
  fullWidth, 
  variant = 'primary',
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
        variant === 'primary' && 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500',
        variant === 'secondary' && 'bg-secondary-500 hover:bg-secondary-600 focus:ring-secondary-500',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}