export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export function validateName(value: string) {
  const name = value.trim().replace(/\s+/g, " ");

  if (name.length < 2 || name.length > 80) {
    return { error: "Name must be between 2 and 80 characters." };
  }

  return { value: name };
}

export function validateAdminPassword(value: string) {
  if (value.length < 12) {
    return "Password must be at least 12 characters.";
  }

  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
    return "Password must include uppercase, lowercase, and number characters.";
  }

  return null;
}
