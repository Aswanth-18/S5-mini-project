import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing form state with validation
 *
 * @param {object} initialValues - Initial form values
 * @param {object} validators - Validation functions for each field
 * @param {function} onSubmit - Submit handler
 * @returns {object} - Form state and handlers
 */
export const useForm = (initialValues = {}, validators = {}, onSubmit = () => {}) => {
  // Form state
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitCount, setSubmitCount] = useState(0);

  // Validate a single field
  const validateField = useCallback((name, value) => {
    if (validators[name]) {
      return validators[name](value, values);
    }
    return '';
  }, [validators, values]);

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};
    let valid = true;

    Object.keys(validators).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        valid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(valid);
    return valid;
  }, [validators, values, validateField]);

  // Handle field change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkboxes
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Validate field on change if it's been touched
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [touched, validateField]);

  // Handle blur (mark field as touched)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    const error = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [values, validateField]);

  // Handle submit
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();

    setSubmitCount(prev => prev + 1);
    setTouched(prev => {
      const newTouched = { ...prev };
      Object.keys(values).forEach(name => {
        newTouched[name] = true;
      });
      return newTouched;
    });

    const isFormValid = validateForm();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      // You can handle errors here, e.g., show error notification
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  // Set form values (for programmatic updates)
  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsValid(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // Set field error manually
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  // Clear field error
  const clearFieldError = useCallback((name) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  // Check if field has error
  const hasError = useCallback((name) => {
    return !!errors[name];
  }, [errors]);

  // Get error for field
  const getError = useCallback((name) => {
    return errors[name] || '';
  }, [errors]);

  // Check if field was touched
  const isTouched = useCallback((name) => {
    return !!touched[name];
  }, [touched]);

  // Check if field should show error (touched and has error)
  const shouldShowError = useCallback((name) => {
    return isTouched(name) && hasError(name);
  }, [isTouched, hasError]);

  // Get form values
  const getValues = useCallback(() => {
    return values;
  }, [values]);

  // Get value for specific field
  const getValue = useCallback((name) => {
    return values[name];
  }, [values]);

  // Validate on mount if initial values are provided
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      validateForm();
    }
  }, [initialValues, validateForm]);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    submitCount,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Setters
    setFormValues,
    setFieldError,
    clearFieldError,
    resetForm,

    // Getters
    getValues,
    getValue,
    hasError,
    getError,
    isTouched,
    shouldShowError,

    // Validation
    validateField,
    validateForm,
  };
};

export default useForm;