import React from 'react';

const Input = React.forwardRef(
  ({ label, type = 'text', name, value, onChange, placeholder, className = '', error, ...props }, ref) => {
    const inputClasses = `block w-full px-5 py-3 bg-slate-50 border-2 rounded-2xl shadow-sm focus:ring-primary/20 focus:border-primary sm:text-sm transition-all duration-300 outline-none
      ${error ? 'border-rose-300 focus:border-rose-500 bg-rose-50' : 'border-slate-100 hover:border-slate-200'}`;

    return (
      <div className={`mb-6 ${className}`}>
        {label && (
          <label htmlFor={name} className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
            {label}
          </label>
        )}
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input'; // Add display name for forwardRef

export default Input;
