import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#174D32] to-[#27683E] text-white shadow-[0_4px_14px_0_rgba(23,77,50,0.35)] hover:shadow-[0_6px_20px_rgba(23,77,50,0.48)] hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-white text-[#174D32] border border-[#63A66B] hover:bg-[#F0F6F2] hover:border-[#174D32] shadow-sm',
    gold:
      'bg-gradient-to-r from-[#E5B64B] to-[#ECC772] text-[#202B24] font-bold shadow-[0_4px_14px_0_rgba(229,182,75,0.38)] hover:shadow-[0_6px_20px_rgba(229,182,75,0.5)] hover:-translate-y-0.5 active:translate-y-0',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 shadow-sm hover:shadow',
    ghost:
      'bg-transparent text-[#202B24] hover:bg-[#DCEADF]/40',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 ease-in-out cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#63A66B]/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;

