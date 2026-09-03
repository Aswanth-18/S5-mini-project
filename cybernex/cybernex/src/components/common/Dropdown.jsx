import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Reusable Dropdown component
 *
 * @param {object} props - Component props
 * @param {string} props.label - Dropdown label
 * @param {Array} props.items - Array of dropdown items
 * @param {function} props.onSelect - Function to call when item is selected
 * @param {string} props.selectedKey - Currently selected item key
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Whether dropdown is disabled
 * @param {string} props.size - Dropdown size (sm, md, lg)
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.trigger - Custom trigger element
 * @returns {JSX.Element} - Dropdown component
 */
const Dropdown = ({
  label,
  items = [],
  onSelect,
  selectedKey,
  placeholder = 'Select an option',
  disabled = false,
  size = 'md',
  className = '',
  trigger
}) => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle item selection
  const handleSelect = useCallback((item) => {
    if (!item.disabled && onSelect) {
      onSelect(item.key);
      setIsOpen(false);
    }
  }, [onSelect]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Find selected item
  const selectedItem = items.find(item => item.key === selectedKey);

  // Size classes
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-5 text-base'
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between rounded-lg border
          ${isDarkMode
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-900'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${sizeClasses[size]}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
        `}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {trigger || (
            <>
              {selectedItem && selectedItem.icon && (
                <span>{selectedItem.icon}</span>
              )}
              <span>{selectedItem ? selectedItem.label : placeholder}</span>
            </>
          )}
        </span>

        <ChevronDown
          className={`
            w-4 h-4 flex-shrink-0 transition-transform
            ${isOpen ? 'rotate-180' : ''}
            ${disabled ? 'text-gray-400' : 'text-gray-500'}
          `}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 w-full mt-1 rounded-lg shadow-lg
            ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
            animate-fade-in
          `}
        >
          <ul className="p-1 max-h-60 overflow-y-auto">
            {items.map((item, index) => (
              <li key={item.key || index}>
                <button
                  onClick={() => handleSelect(item)}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 text-sm
                    ${isDarkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-800 hover:bg-gray-50'
                    }
                    ${selectedKey === item.key
                      ? isDarkMode
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-blue-50 text-blue-700'
                      : ''
                    }
                    ${item.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                    }
                    transition-colors duration-200
                  `}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                  {item.additionalInfo && (
                    <span className={`ml-auto text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.additionalInfo}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;