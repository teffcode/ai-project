/**
 * Checks if a URL corresponds to an image based on its file extension.
 * 
 * @param {string} url - The URL to check.
 * @returns {boolean} - Returns `true` if the URL is a valid image URL, 
 *                      otherwise returns `false`.
 */
export const isValidImageUrl = (url: string): boolean => {
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|tiff)$/i;
  return imageExtensions.test(url);
};
