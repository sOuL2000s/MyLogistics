import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white p-5 sm:p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] shadow-soft border border-slate-100/50 hover:shadow-elevated transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
