import React, { useState, useCallback } from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, X, Check, Info } from 'lucide-react';

/**
 * Confirmation Modal component
 *
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {function} props.onConfirm - Function to call when confirmed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Confirmation message
 * @param {string} props.type - Modal type (danger, warning, info)
 * @param {string} props.confirmText - Text for confirm button
 * @param {string} props.cancelText - Text for cancel button
 * @param {boolean} props.requireConfirmationText - Whether to require typing confirmation text
 * @param {string} props.confirmationText - Text user must type to confirm
 * @param {React.ReactNode} props.children - Additional content
 * @returns {JSX.Element} - Confirmation Modal component
 */
const ConfirmationModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  requireConfirmationText = false,
  confirmationText = '',
  children
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  // Icon based on type
  const getIcon = useCallback(() => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-blue-500" />;
    }
  }, [type]);

  // Button variant based on type
  const getConfirmButtonVariant = useCallback(() => {
    switch (type) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      default:
        return 'primary';
    }
  }, [type]);

  // Handle confirm
  const handleConfirm = useCallback(() => {
    if (requireConfirmationText && inputValue !== confirmationText) {
      return;
    }

    setIsConfirming(true);
    if (onConfirm) {
      const result = onConfirm();
      if (result && typeof result.then === 'function') {
        result.finally(() => setIsConfirming(false));
      } else {
        setIsConfirming(false);
      }
    }
    onClose();
  }, [onConfirm, onClose, requireConfirmationText, inputValue, confirmationText]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  // Check if confirm button should be disabled
  const isConfirmDisabled = requireConfirmationText && inputValue !== confirmationText;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      closeOnOutsideClick={!requireConfirmationText}
      closeOnEscape={!requireConfirmationText}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>

        <div className="flex-1">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {message}
          </p>

          {children}

          {requireConfirmationText && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type <span className="font-bold text-red-600 dark:text-red-400">{confirmationText}</span> to confirm:
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="input w-full"
                placeholder={`Type "${confirmationText}"`}
              />
              {inputValue && inputValue !== confirmationText && (
                <p className="text-sm text-red-500 mt-1">
                  Confirmation text does not match
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-4">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isConfirming}
        >
          {cancelText}
        </Button>

        <Button
          variant={getConfirmButtonVariant()}
          onClick={handleConfirm}
          disabled={isConfirmDisabled || isConfirming}
          isLoading={isConfirming}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

// Hook version
export const useConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({});

  const open = useCallback((newConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setConfig({});
  }, []);

  return {
    isOpen,
    open,
    close,
    ConfirmationModal: () => (
      <ConfirmationModal
        isOpen={isOpen}
        onClose={close}
        {...config}
      />
    )
  };
};

export default ConfirmationModal;