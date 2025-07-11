import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hashes a plain-text password using bcrypt.
 * @param password The plain-text password to hash.
 * @returns A promise that resolves to the hashed password string.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password.");
  }
}

/**
 * Verifies a plain-text password against a stored bcrypt hash.
 * @param password The plain-text password to verify.
 * @param hashedPassword The stored bcrypt hash to compare against.
 * @returns A promise that resolves to true if the password matches, false otherwise.
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}

/**
 * Validates a password against complexity requirements:
 * - Min 8 characters
 * - At least 1 uppercase, 1 lowercase, 1 number, and 1 special character
 * @param password The password to validate
 * @returns true if valid, false otherwise
 */
export function isValidPassword(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  return regex.test(password);
}
