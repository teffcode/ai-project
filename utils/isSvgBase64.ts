/**
 * Checks if a given image is in SVG base64 format.
 * 
 * @param {string} image - The base64-encoded image string to check.
 * @returns {boolean} - Returns true if the image is an SVG in base64 format, false otherwise.
 */
export function isSvgBase64(image: string): boolean {
  return image.startsWith("data:image/svg+xml;base64,");
}
