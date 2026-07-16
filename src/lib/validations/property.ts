/**
 * Shared validation logic for property creation and editing.
 */

// UK Postcode Regex: Standard formats like "SW1A 1AA", "M1 1AE", "B33 8TH", etc.
export const UK_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;

// Phone number: Only allow digits, spaces, plus (+), minus (-), and parentheses
export const PHONE_ALLOWED_CHARS = /^[0-9+\s-()]+$/;

export function validatePostcode(postcode: string): boolean {
  if (!postcode) return false;
  return UK_POSTCODE_REGEX.test(postcode.trim());
}

export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  const trimmed = phone.trim();
  // Must only contain allowed characters
  if (!PHONE_ALLOWED_CHARS.test(trimmed)) return false;
  // Must not contain any letters
  if (/[a-zA-Z]/.test(trimmed)) return false;
  // Extract digits
  const digits = trimmed.replace(/\D/g, "");
  // Standard phone length (at least 10 digits, max 15 digits)
  return digits.length >= 10 && digits.length <= 15;
}

export function validatePriceBounds(intent: string, price: number): { isValid: boolean; error?: string } {
  if (intent === 'renting' || intent === 'letting') {
    if (price < 100 || price > 10000) {
      return { isValid: false, error: 'Monthly rent must be between £100 and £10,000 PCM' };
    }
  } else {
    // selling or letting-selling (stores sale value in budget column)
    if (price < 50000 || price > 5000000) {
      return { isValid: false, error: 'Estimated property value must be between £50,000 and £5,000,000' };
    }
  }
  return { isValid: true };
}
