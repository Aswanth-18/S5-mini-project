import React from 'react';

const Switch = ({ 
  checked = false, 
  onCheckedChange = () => {}, 
  disabled = false,
  className = '',
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-9 h-5',
    md: 'w-12 h-6',
    lg: 'w-14 h-7'
  };

  const thumbSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={`
        ${sizeClasses[size] || sizeClasses.md}
        relative inline-flex items-center rounded-full transition-colors
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${checked 
          ? 'bg-primary' 
          : 'bg-gray-200 dark:bg-gray-700'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span
        className={`
          ${thumbSizeClasses[size] || thumbSizeClasses.md}
          absolute left-0.5 bg-white rounded-full shadow-md transition-transform
          ${checked ? `translate-x-[calc(100%-${size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px'})]` : 'translate-x-0'}
        `}
      />
    </button>
  );
};

export default Switch;