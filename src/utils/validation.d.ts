export interface ValidationError {
    field: string;
    message: string;
}
export declare function validateEmail(email: string): ValidationError | null;
export declare function validatePhoneNumber(phone: string): ValidationError | null;
export declare function validateMinLength(value: string, min: number, fieldName: string): ValidationError | null;
export declare function validateMaxLength(value: string, max: number, fieldName: string): ValidationError | null;
export declare function sanitizeInput(input: string): string;
export declare function sanitizeEmail(email: string): string;
export declare function validateRequired(value: unknown, fieldName: string): ValidationError | null;
//# sourceMappingURL=validation.d.ts.map