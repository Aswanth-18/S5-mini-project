import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Reusable Tooltip component
 * @param {object} props - Component props
 * @param {React.ReactNode} props.content - Tooltip content
 * @param {string} props.position - Position (top, bottom, left, right)
 * @param {React.ReactNode} props.children - Wrapped element
 * @param {number} props.delay - Show delay in ms
 * @param {string} props.className - Additional classes
 * @returns {JSX.Element}
 */
const Tooltip = ({
  content,
  position = 'top',
  children,
  delay = 300,
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(position);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Calculate tooltip position based on viewport
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return position;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // Check for overflow
    const positions = ['top', 'bottom', 'left', 'right'];
    let bestPosition = position;

    for (const pos of positions) {
      if (pos === 'top' && triggerRect.top < tooltipRect.height + 10) {
        continue;
      }
      if (pos === 'bottom' && window.innerHeight - triggerRect.bottom < tooltipRect.height + 10) {
        continue;
      }
      if (pos === 'left' && triggerRect.left < tooltipRect.width + 10) {
        continue;
      }
      if (pos === 'right' && window.innerWidth - triggerRect.right < tooltipRect.width + 10) {
        continue;
      }
      bestPosition = pos;
      break;
    }

    return bestPosition;
  }, [position]);

  // Show tooltip
  const showTooltip = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const pos = calculatePosition();
      setTooltipPosition(pos);
      setIsVisible(true);
    }, delay);
  }, [calculatePosition, delay]);

  // Hide tooltip
  const hideTooltip = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);

  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  // Arrow classes
  const arrowClasses = {
    top: 'bottom-0 left-1/2 -translate-x-1/2',
    bottom: 'top-0 left-1/2 -translate-x-1/2',
    left: 'right-0 top-1/2 -translate-y-1/2',
    right: 'left-0 top-1/2 -translate-y-1/2'
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-2 py-1 text-xs rounded-md shadow-lg whitespace-nowrap ${
            isDarkMode
              ? 'bg-gray-800 text-gray-100 border border-gray-700'
              : 'bg-gray-900 text-white'
          } ${positionClasses[tooltipPosition]} ${className}`}
          role="tooltip"
        >
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-inherit transform rotate-45 ${
              arrowClasses[tooltipPosition]
            }`}
          />

          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;