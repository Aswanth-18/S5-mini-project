/**
 * CyberNex - Validation Utilities
 * Each validateX() returns '' when valid, or an error message string.
 * Matches the shape useForm(initialValues, validators, onSubmit) expects.
 */
import { VALIDATION_PATTERNS, ERROR_MESSAGES } from './constants';

export const isEmpty = (value) =>
  value === null || value === undefined ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0);

export const validateRequired = (value) => (isEmpty(value) ? ERROR_MESSAGES.REQUIRED : '');

export const isValidEmail = (email) =>
  typeof email === 'string' && VALIDATION_PATTERNS.EMAIL.test(email.trim());

export const validateEmail = (email) => {
  if (isEmpty(email)) return ERROR_MESSAGES.REQUIRED;
  return isValidEmail(email) ? '' : ERROR_MESSAGES.INVALID_EMAIL;
};

export const isStrongPassword = (password) =>
  typeof password === 'string' && VALIDATION_PATTERNS.PASSWORD.test(password);

export const validatePassword = (password) => {
  if (isEmpty(password)) return ERROR_MESSAGES.REQUIRED;
  return isStrongPassword(password) ? '' : ERROR_MESSAGES.INVALID_PASSWORD;
};

export const validatePasswordConfirmation = (confirmation, values = {}) => {
  if (isEmpty(confirmation)) return ERROR_MESSAGES.REQUIRED;
  return confirmation === values.password ? '' : ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
};

export const isValidPhone = (phone) =>
  typeof phone === 'string' && VALIDATION_PATTERNS.PHONE.test(phone.replace(/[\s-()]/g, ''));

export const validatePhone = (phone, { required = false } = {}) => {
  if (isEmpty(phone)) return required ? ERROR_MESSAGES.REQUIRED : '';
  return isValidPhone(phone) ? '' : 'Please enter a valid phone number';
};

export const isValidUsername = (username) =>
  typeof username === 'string' && VALIDATION_PATTERNS.USERNAME.test(username);

export const validateUsername = (username) => {
  if (isEmpty(username)) return ERROR_MESSAGES.REQUIRED;
  return isValidUsername(username)
    ? '' : 'Username must be 4-20 characters, letters, numbers, or underscores only';
};

// ===== CYBERNEX-SPECIFIC =====

export const isValidFlag = (flag) =>
  typeof flag === 'string' && VALIDATION_PATTERNS.FLAG.test(flag.trim());

export const validateFlag = (flag) => {
  if (isEmpty(flag)) return ERROR_MESSAGES.REQUIRED;
  return isValidFlag(flag) ? '' : ERROR_MESSAGES.INVALID_FLAG;
};

export const isValidCourseId = (id) =>
  typeof id === 'string' && VALIDATION_PATTERNS.COURSE_ID.test(id.trim());

export const isValidLabId = (id) =>
  typeof id === 'string' && VALIDATION_PATTERNS.LAB_ID.test(id.trim());

export const isValidAssessmentId = (id) =>
  typeof id === 'string' && VALIDATION_PATTERNS.ASSESSMENT_ID.test(id.trim());

// ===== NUMBERS / RANGES =====

export const validateNumberRange = (value, { min, max, required = true } = {}) => {
  if (isEmpty(value)) return required ? ERROR_MESSAGES.REQUIRED : '';
  const num = Number(value);
  if (Number.isNaN(num)) return 'Please enter a valid number';
  if (min !== undefined && num < min) return `Value must be at least ${min}`;
  if (max !== undefined && num > max) return `Value must be at most ${max}`;
  return '';
};

export const validateMinLength = (value, minLength) => {
  if (isEmpty(value)) return ERROR_MESSAGES.REQUIRED;
  return String(value).length >= minLength ? '' : `Must be at least ${minLength} characters`;
};

export const validateMaxLength = (value, maxLength) => {
  if (isEmpty(value)) return '';
  return String(value).length <= maxLength ? '' : `Must be at most ${maxLength} characters`;
};

// ===== DATES =====

export const isValidDate = (value) => {
  if (!value) return false;
  const d = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(d.getTime());
};

export const validateDate = (value, { required = true } = {}) => {
  if (isEmpty(value)) return required ? ERROR_MESSAGES.REQUIRED : '';
  return isValidDate(value) ? '' : 'Please enter a valid date';
};

export const validateDateRange = (endDate, values = {}, startKey = 'startDate') => {
  if (isEmpty(endDate)) return ERROR_MESSAGES.REQUIRED;
  if (!isValidDate(endDate)) return 'Please enter a valid date';
  const start = values[startKey];
  if (start && isValidDate(start) && new Date(endDate) < new Date(start)) {
    return 'End date must be after start date';
  }
  return '';
};

export const validateFutureDate = (value, { required = true } = {}) => {
  if (isEmpty(value)) return required ? ERROR_MESSAGES.REQUIRED : '';
  if (!isValidDate(value)) return 'Please enter a valid date';
  return new Date(value).getTime() > Date.now() ? '' : 'Date must be in the future';
};

// ===== FILES =====

export const validateFileType = (file, allowedTypes = []) => {
  if (!file) return ERROR_MESSAGES.REQUIRED;
  if (!allowedTypes.length) return '';
  const ok = allowedTypes.some((type) =>
    type.includes('/') ? file.type === type : file.name?.toLowerCase().endsWith(type)
  );
  return ok ? '' : `File must be one of: ${allowedTypes.join(', ')}`;
};

export const validateFileSize = (file, maxBytes) => {
  if (!file) return ERROR_MESSAGES.REQUIRED;
  return file.size <= maxBytes
    ? '' : `File must be smaller than ${(maxBytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ===== COMPOSITION HELPER =====

export const composeValidators = (...validators) => (value, values) => {
  for (const validate of validators) {
    const error = validate(value, values);
    if (error) return error;
  }
  return '';
};

export default {
  isEmpty, validateRequired, isValidEmail, validateEmail, isStrongPassword,
  validatePassword, validatePasswordConfirmation, isValidPhone, validatePhone,
  isValidUsername, validateUsername, isValidFlag, validateFlag, isValidCourseId,
  isValidLabId, isValidAssessmentId, validateNumberRange, validateMinLength,
  validateMaxLength, isValidDate, validateDate, validateDateRange,
  validateFutureDate, validateFileType, validateFileSize, composeValidators,
};