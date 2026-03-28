import { describe, it, expect } from 'vitest';
import { validateAnalysisRequest, MAX_TEXT_LENGTH, ALLOWED_MIME_TYPES } from '../utils/inputValidator';

describe('Input Validator - validateAnalysisRequest', () => {
  it('should reject null body', () => {
    expect(validateAnalysisRequest(null).valid).toBe(false);
  });

  it('should reject empty object (no inputs)', () => {
    const result = validateAnalysisRequest({});
    expect(result.valid).toBe(false);
    expect(result.error).toContain('No input');
  });

  it('should accept valid text input', () => {
    expect(validateAnalysisRequest({ text: 'help me' }).valid).toBe(true);
  });

  it('should accept valid image input', () => {
    expect(validateAnalysisRequest({ imageBase64: 'abc123', mimeType: 'image/png' }).valid).toBe(true);
  });

  it('should reject non-string text', () => {
    expect(validateAnalysisRequest({ text: 123 }).valid).toBe(false);
  });

  it('should reject text exceeding max length', () => {
    const longText = 'a'.repeat(MAX_TEXT_LENGTH + 1);
    const result = validateAnalysisRequest({ text: longText });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('maximum length');
  });

  it('should reject unsupported MIME types', () => {
    const result = validateAnalysisRequest({ imageBase64: 'abc', mimeType: 'application/pdf' });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unsupported');
  });

  it('should accept all allowed MIME types', () => {
    for (const mime of ALLOWED_MIME_TYPES) {
      expect(validateAnalysisRequest({ imageBase64: 'abc', mimeType: mime }).valid).toBe(true);
    }
  });

  it('should reject oversized images', () => {
    // Create a string that would decode to > 5MB
    const oversized = 'a'.repeat(7 * 1024 * 1024);
    const result = validateAnalysisRequest({ imageBase64: oversized, mimeType: 'image/png' });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('too large');
  });
});
