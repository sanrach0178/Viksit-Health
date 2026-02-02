export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { field: 'email', message: 'Please enter a valid email address' };
  }
  return null;
}

export function validatePhoneNumber(phone: string): ValidationError | null {
  const phoneRegex = /^\d{10}$/;
  const digitsOnly = phone.replace(/\D/g, '');
  if (!digitsOnly || !phoneRegex.test(digitsOnly)) {
    return { field: 'phone', message: 'Please enter a valid 10-digit phone number' };
  }
  return null;
}

export function validateMinLength(
  value: string,
  min: number,
  fieldName: string
): ValidationError | null {
  if (!value || value.trim().length < min) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${min} characters`,
    };
  }
  return null;
}

export function validateMaxLength(
  value: string,
  max: number,
  fieldName: string
): ValidationError | null {
  if (value && value.trim().length > max) {
    return {
      field: fieldName,
      message: `${fieldName} must not exceed ${max} characters`,
    };
  }
  return null;
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>{}]/g, '')
    .slice(0, 500);
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 254);
}

export function validateRequired(value: unknown, fieldName: string): ValidationError | null {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  return null;
}
