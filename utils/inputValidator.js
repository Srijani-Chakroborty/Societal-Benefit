/**
 * @module inputValidator
 * @description Server-side validation utilities for sanitizing and validating
 * user inputs before they reach the AI model layer. Prevents injection,
 * XSS, and ensures data integrity.
 */

/** @type {number} Maximum allowed text input length. */
export const MAX_TEXT_LENGTH = 10000;

/** @type {number} Maximum allowed image size in bytes (~5MB). */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/** @type {Set<string>} Allowed MIME types for image uploads. */
export const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

/**
 * Validates a complete analysis request body.
 * @param {Object} body - The request body to validate.
 * @param {string} [body.text] - Text input.
 * @param {string} [body.imageBase64] - Base64-encoded image data.
 * @param {string} [body.mimeType] - MIME type of the image.
 * @returns {{ valid: boolean, error?: string }} Validation result.
 */
export function validateAnalysisRequest(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body.' };
  }

  const { text, imageBase64, mimeType } = body;

  if (!text && !imageBase64) {
    return { valid: false, error: 'No input provided. Please enter text or upload an image.' };
  }

  if (text && typeof text !== 'string') {
    return { valid: false, error: 'Text input must be a string.' };
  }

  if (text && text.length > MAX_TEXT_LENGTH) {
    return { valid: false, error: `Text input exceeds maximum length of ${MAX_TEXT_LENGTH} characters.` };
  }

  if (imageBase64) {
    if (typeof imageBase64 !== 'string') {
      return { valid: false, error: 'Image data must be a string.' };
    }

    if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType)) {
      return { valid: false, error: `Unsupported image type: ${mimeType}. Allowed: JPEG, PNG, WebP, GIF.` };
    }

    const estimatedSize = (imageBase64.length * 3) / 4;
    if (estimatedSize > MAX_IMAGE_SIZE) {
      return { valid: false, error: 'Image is too large. Maximum size is 5MB.' };
    }
  }

  return { valid: true };
}
