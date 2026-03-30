import React from 'react';

const Input = React.forwardRef(
  ({ label, type = 'text', name, value, onChange, placeholder, className = '', error, ...props }, ref) => {
    const inputClasses = `block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200
      ${error ? 'border-error focus:border-error focus:ring-error' : 'border-gray-300'}`;

    return (
      <div className={`mb-4 ${className}`}>
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
