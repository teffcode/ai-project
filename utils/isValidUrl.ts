/**
 * Checks if a given text is a valid URL.
 *
 * @param {string} text - The string to validate as a URL.
 * @returns {boolean} - Returns `true` if the text is a valid URL, otherwise `false`.
 */
export const isValidUrl = (text: string): boolean => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};
