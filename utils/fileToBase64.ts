import { Buffer } from "buffer";

/**
 * Converts a file (Buffer) into a base64 string.
 * 
 * @param {Buffer} fileBuffer - The buffer of the image file.
 * @returns {string} - The base64 string representation of the file.
 */
export function fileToBase64(fileBuffer: Buffer): string {
  return fileBuffer.toString("base64");
}
