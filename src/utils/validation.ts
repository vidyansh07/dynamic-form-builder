import { SchemaField, ValidationRules } from '../types/schema';

export const validateField = (
  value: any,
  rules?: ValidationRules
): string | null => {
  if (!rules) return null;

  // 1. Required Check
  const isEmpty = value === undefined || value === null || value === '' || value === false;
  if (rules.required && isEmpty) {
    return 'This field is required';
  }

  // Skip other validations if empty (unless required, which is caught above)
  if (isEmpty) return null;

  // 2. Pattern (Regex) Check
  if (rules.pattern) {
    const regex = new RegExp(rules.pattern);
    if (!regex.test(String(value))) {
      return 'Invalid format';
    }
  }

  // 3. Min/Max Length (Strings)
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum length is ${rules.minLength} characters`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength} characters`;
    }
  }

  // 4. Min/Max Value (Numbers)
  if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
    const numVal = Number(value);
    if (rules.min !== undefined && numVal < rules.min) {
      return `Value must be at least ${rules.min}`;
    }
    if (rules.max !== undefined && numVal > rules.max) {
      return `Value must be at most ${rules.max}`;
    }
  }

  return null;
};
