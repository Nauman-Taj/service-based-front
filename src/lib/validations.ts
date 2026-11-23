/**
 * Shared field validators used by the auth forms (and reusable elsewhere).
 * Each returns an error message, or undefined when the value is valid.
 */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(value: string): string | undefined {
  if (value.trim().length < 2) {
    return "Please enter your full name.";
  }
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  if (!EMAIL_PATTERN.test(value.trim())) {
    return "Please enter a valid email address.";
  }
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  if (!value.trim()) {
    return undefined; // Phone is optional.
  }
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) {
    return "Please enter a valid phone number.";
  }
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (value.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return "Include at least one letter and one number.";
  }
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirm: string,
): string | undefined {
  if (!confirm) {
    return "Please confirm your password.";
  }
  if (password !== confirm) {
    return "Passwords do not match.";
  }
  return undefined;
}

export function validateRequired(
  value: string,
  message: string,
): string | undefined {
  return value.trim() ? undefined : message;
}
