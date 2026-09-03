import React, { useState, useCallback, Children, cloneElement } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Tab component for organizing content
 *
 * @param {object} props - Component props
 * @param {number} props.activeTab - Index of the active tab
 * @param {function} props.onChange - Function to call when tab changes
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Tab content
 * @returns {JSX.Element} - Tabs component
 */
const Tabs = ({ activeTab = 0, onChange, className = '', children }) => {
  const { isDarkMode } = useTheme();
  const [active, setActive] = useState(activeTab);

  // Handle tab change
  const handleChange = useCallback((index) => {
    setActive(index);
    if (onChange) {
      onChange(index);
    }
  }, [onChange]);

  // Get tab headers from children
  const tabHeaders = Children.map(children, (child, index) => {
    if (!child) return null;

    const isActive = index === active;
    const { label, disabled } = child.props;

    return (
      <button
        key={`tab-${index}`}
        onClick={() => !disabled && handleChange(index)}
        disabled={disabled}
        className={`
          flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium
          rounded-lg transition-all duration-200 focus:outline-none
          ${isActive
            ? 'bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-blue-300'
            : `text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800
               ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`
          }
        `}
        role="tab"
        aria-selected={isActive}
        aria-disabled={disabled}
      >
        {child.props.icon && cloneElement(child.props.icon, {
          className: `w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`
        })}
        <span>{label}</span>
      </button>
    );
  });

  // Get active tab content
  const tabContent = Children.toArray(children)[active]?.props.children;

  return (
    <div className={`tabs ${className}`}>
      {/* Tab headers */}
      <div
        className="flex gap-1 mb-4 border-b border-gray-200 dark:border-gray-700"
        role="tablist"
      >
        {tabHeaders}
      </div>

      {/* Tab content */}
      <div className="tab-content">
        {tabContent}
      </div>
    </div>
  );
};

/**
 * Tab Panel component (to be used as child of Tabs)
 *
 * @param {object} props - Component props
 * @param {string} props.label - Tab label
 * @param {React.ReactNode} props.icon - Tab icon
 * @param {boolean} props.disabled - Whether tab is disabled
 * @param {React.ReactNode} props.children - Tab content
 * @returns {JSX.Element} - Tab Panel component
 */
const TabPanel = ({ label, icon, disabled = false, children }) => {
  return (
    <div role="tabpanel">
      {children}
    </div>
  );
};

// Named exports
export { TabPanel };
export default Tabs;