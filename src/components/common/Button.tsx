import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-4 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-brand-600 text-white shadow-subtle hover:bg-brand-700 hover:shadow active:bg-brand-800 focus:ring-brand-500/20',
    secondary:
      'border border-slate-200 bg-white text-slate-700 shadow-subtle hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 focus:ring-slate-400/20',
    outline:
      'border border-brand-300 text-brand-700 bg-transparent hover:bg-brand-50/70 active:bg-brand-100 focus:ring-brand-500/20',
    danger:
      'bg-rose-600 text-white shadow-subtle hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500/20',
    ghost:
      'text-slate-600 bg-transparent hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus:ring-slate-400/20',
  }[variant];

  return (
    <button
      className={`${base} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin text-current shrink-0" />}
      {children}
    </button>
  );
}
