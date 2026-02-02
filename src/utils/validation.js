export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return { field: 'email', message: 'Please enter a valid email address' };
    }
    return null;
}
export function validatePhoneNumber(phone) {
    const phoneRegex = /^\d{10}$/;
    const digitsOnly = phone.replace(/\D/g, '');
    if (!digitsOnly || !phoneRegex.test(digitsOnly)) {
        return { field: 'phone', message: 'Please enter a valid 10-digit phone number' };
    }
    return null;
}
export function validateMinLength(value, min, fieldName) {
    if (!value || value.trim().length < min) {
        return {
            field: fieldName,
            message: `${fieldName} must be at least ${min} characters`,
        };
    }
    return null;
}
export function validateMaxLength(value, max, fieldName) {
    if (value && value.trim().length > max) {
        return {
            field: fieldName,
            message: `${fieldName} must not exceed ${max} characters`,
        };
    }
    return null;
}
export function sanitizeInput(input) {
    return input
        .trim()
        .replace(/[<>{}]/g, '')
        .slice(0, 500);
}
export function sanitizeEmail(email) {
    return email.trim().toLowerCase().slice(0, 254);
}
export function validateRequired(value, fieldName) {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return { field: fieldName, message: `${fieldName} is required` };
    }
    return null;
}
//# sourceMappingURL=validation.js.map