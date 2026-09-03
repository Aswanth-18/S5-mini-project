import React, { useState, useCallback, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * Reusable Search Bar component
 *
 * @param {object} props - Component props
 * @param {string} props.placeholder - Placeholder text
 * @param {function} props.onSearch - Function to call with search query
 * @param {number} props.debounce - Debounce delay in ms (default: 300)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether search is disabled
 * @param {React.ReactNode} props.leftIcon - Icon to display on the left
 * @param {React.ReactNode} props.rightIcon - Icon to display on the right
 * @returns {JSX.Element} - Search Bar component
 */
const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  debounce = 300,
  className = '',
  disabled = false,
  leftIcon,
  rightIcon
}) => {
  const { isDarkMode } = useTheme();
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, debounce);

  // Call onSearch with debounced value
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  }, [onSearch, value]);

  const handleClear = useCallback(() => {
    setValue('');
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  // Default search icon
  const defaultLeftIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        {/* Left icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {leftIcon || defaultLeftIcon}
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`block w-full pl-10 pr-10 py-2.5 rounded-lg border ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />

        {/* Clear button (appears when there's text) */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Right icon */}
        {rightIcon && !value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;