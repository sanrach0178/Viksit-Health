import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePhoneNumber,
  validateMinLength,
  validateMaxLength,
  sanitizeInput,
  validateRequired,
} from '../validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBeNull();
    });

    it('should reject invalid email', () => {
      const result = validateEmail('invalid-email');
      expect(result).not.toBeNull();
      expect(result?.field).toBe('email');
    });

    it('should reject empty email', () => {
      expect(validateEmail('')).not.toBeNull();
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate 10-digit phone number', () => {
      expect(validatePhoneNumber('9876543210')).toBeNull();
    });

    it('should validate phone with formatting', () => {
      expect(validatePhoneNumber('98-765-43210')).toBeNull();
    });

    it('should reject invalid phone', () => {
      expect(validatePhoneNumber('123')).not.toBeNull();
    });
  });

  describe('validateMinLength', () => {
    it('should pass when string is long enough', () => {
      expect(validateMinLength('hello world', 5, 'message')).toBeNull();
    });

    it('should fail when string is too short', () => {
      const result = validateMinLength('hi', 5, 'message');
      expect(result).not.toBeNull();
      expect(result?.field).toBe('message');
    });
  });

  describe('validateMaxLength', () => {
    it('should pass when string is short enough', () => {
      expect(validateMaxLength('hello', 10, 'message')).toBeNull();
    });

    it('should fail when string is too long', () => {
      const result = validateMaxLength('hello world', 5, 'message');
      expect(result).not.toBeNull();
    });
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeInput('hello <script>alert("xss")</script>')).not.toContain('<');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should limit length to 500 chars', () => {
      const longString = 'a'.repeat(600);
      expect(sanitizeInput(longString).length).toBe(500);
    });
  });

  describe('validateRequired', () => {
    it('should pass for non-empty string', () => {
      expect(validateRequired('hello', 'field')).toBeNull();
    });

    it('should fail for empty string', () => {
      expect(validateRequired('', 'field')).not.toBeNull();
    });

    it('should fail for falsy values', () => {
      expect(validateRequired(null, 'field')).not.toBeNull();
      expect(validateRequired(undefined, 'field')).not.toBeNull();
    });
  });
});
