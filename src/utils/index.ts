// Utility functions for the SDK

/**
 * Validates if a URL is properly formatted
 * @param url The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Formats an error message with a prefix
 * @param message The error message
 * @param prefix The prefix to add
 * @returns Formatted error message
 */
export function formatErrorMessage(
  message: string,
  prefix = "SDK Error"
): string {
  return `${prefix}: ${message}`;
}

/**
 * Deep clones an object
 * @param obj The object to clone
 * @returns A deep clone of the object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}
