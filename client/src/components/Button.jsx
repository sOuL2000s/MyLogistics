import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'font-bold rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/30 hover:shadow-primary/40 focus:ring-primary',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 focus:ring-slate-800',
    outline: 'bg-transparent border-2 border-primary/20 text-primary hover:border-primary hover:bg-primary/5 focus:ring-primary',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-xl shadow-rose-500/20 hover:shadow-rose-500/30 focus:ring-rose-500',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 focus:ring-emerald-500',
    dark: 'bg-slate-900 text-white hover:bg-black focus:ring-slate-900 shadow-xl shadow-black/20 hover:shadow-black/30',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs uppercase tracking-widest',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
