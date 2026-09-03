import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from './Button';

/**
 * Reusable Drawer (Slide-out Panel) component
 */
const Drawer = ({
  isOpen = false,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
  footer,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showCloseButton = true
}) => {
  const { isDarkMode } = useTheme();
  const drawerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting and body overflow
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsMounted(false);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (closeOnOutsideClick && drawerRef.current &&
          !drawerRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, closeOnOutsideClick]);

  // Size classes
  const sizeClasses = {
    sm: position === 'left' || position === 'right' ? 'w-64' : 'h-64',
    md: position === 'left' || position === 'right' ? 'w-96' : 'h-96',
    lg: position === 'left' || position === 'right' ? 'w-[400px]' : 'h-[400px]',
    xl: position === 'left' || position === 'right' ? 'w-[500px]' : 'h-[500px]',
    full: position === 'left' || position === 'right' ? 'w-full' : 'h-full'
  };

  // Position classes
  const positionClasses = {
    left: `inset-y-0 left-0 ${sizeClasses[size]}`,
    right: `inset-y-0 right-0 ${sizeClasses[size]}`,
    top: `inset-x-0 top-0 ${sizeClasses[size]}`,
    bottom: `inset-x-0 bottom-0 ${sizeClasses[size]}`
  };

  // выраstrong text
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity ${
          isMounted ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed z-50 ${positionClasses[position]} bg-white dark:bg-gray-800 shadow-2xl ${
          isMounted ? 'transition-transform duration-300 ease-out' : ''
        } ${
          position === 'left' ? 'translate-x-0' :
          position === 'right' ? 'translate-x-0' :
          position === 'top' ? 'translate-y-0' : 'translate-y-0'
        }`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1 -mr-2"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4 h-[calc(100%-60px)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </>,
    document.body
  );
};

export default Drawer;