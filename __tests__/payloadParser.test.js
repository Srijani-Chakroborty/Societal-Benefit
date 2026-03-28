import { describe, it, expect } from 'vitest';
import {
  parseAndValidatePayload,
  createFallbackPayload,
  clampNumber,
  ensureString,
  ensureStringArray,
} from '../utils/payloadParser';

// ============================================================
// Unit Tests: clampNumber
// ============================================================
describe('clampNumber', () => {
  it('should clamp a number within the given range', () => {
    expect(clampNumber(3, 1, 5, 3)).toBe(3);
  });

  it('should clamp values below min to min', () => {
    expect(clampNumber(-10, 1, 5, 3)).toBe(1);
  });

  it('should clamp values above max to max', () => {
    expect(clampNumber(100, 1, 5, 3)).toBe(5);
  });

  it('should return default for NaN', () => {
    expect(clampNumber(NaN, 1, 5, 3)).toBe(3);
  });

  it('should return default for non-number types', () => {
    expect(clampNumber('hello', 1, 5, 3)).toBe(3);
    expect(clampNumber(undefined, 1, 5, 3)).toBe(3);
    expect(clampNumber(null, 1, 5, 3)).toBe(3);
  });

  it('should round floating point numbers', () => {
    expect(clampNumber(2.7, 1, 5, 3)).toBe(3);
    expect(clampNumber(4.2, 1, 5, 3)).toBe(4);
  });
});

// ============================================================
// Unit Tests: ensureString
// ============================================================
describe('ensureString', () => {
  it('should return the string if valid', () => {
    expect(ensureString('hello', 'default')).toBe('hello');
  });

  it('should return default for empty string', () => {
    expect(ensureString('', 'default')).toBe('default');
  });

  it('should return default for whitespace-only string', () => {
    expect(ensureString('   ', 'default')).toBe('default');
  });

  it('should return default for non-string types', () => {
    expect(ensureString(42, 'default')).toBe('default');
    expect(ensureString(null, 'default')).toBe('default');
    expect(ensureString(undefined, 'default')).toBe('default');
    expect(ensureString([], 'default')).toBe('default');
  });

  it('should trim whitespace from valid strings', () => {
    expect(ensureString('  hello  ', 'default')).toBe('hello');
  });
});

// ============================================================
// Unit Tests: ensureStringArray
// ============================================================
describe('ensureStringArray', () => {
  it('should return the array if valid', () => {
    expect(ensureStringArray(['a', 'b'], [])).toEqual(['a', 'b']);
  });

  it('should return default for non-array values', () => {
    expect(ensureStringArray('not an array', ['fallback'])).toEqual(['fallback']);
    expect(ensureStringArray(null, ['fallback'])).toEqual(['fallback']);
    expect(ensureStringArray(42, ['fallback'])).toEqual(['fallback']);
  });

  it('should filter out non-string items from the array', () => {
    expect(ensureStringArray(['a', 42, 'b', null], [])).toEqual(['a', 'b']);
  });

  it('should return default when array contains only non-strings', () => {
    expect(ensureStringArray([42, null, undefined], ['fallback'])).toEqual(['fallback']);
  });

  it('should filter out empty strings', () => {
    expect(ensureStringArray(['valid', '', '  '], ['fallback'])).toEqual(['valid']);
  });
});

// ============================================================
// Integration Tests: parseAndValidatePayload
// ============================================================
describe('parseAndValidatePayload', () => {
  it('should return fallback payload for null input', () => {
    const result = parseAndValidatePayload(null);
    expect(result.crisisLevel).toBe(1);
    expect(result.incidentType).toBe('Error Parsing Data');
  });

  it('should return fallback payload for undefined input', () => {
    const result = parseAndValidatePayload(undefined);
    expect(result.crisisLevel).toBe(1);
  });

  it('should return fallback payload for array input', () => {
    const result = parseAndValidatePayload([1, 2, 3]);
    expect(result.incidentType).toBe('Error Parsing Data');
  });

  it('should return fallback payload for string input', () => {
    const result = parseAndValidatePayload('not an object');
    expect(result.crisisLevel).toBe(1);
  });

  it('should validate and clamp crisis levels', () => {
    expect(parseAndValidatePayload({ crisisLevel: -5 }).crisisLevel).toBe(1);
    expect(parseAndValidatePayload({ crisisLevel: 0 }).crisisLevel).toBe(1);
    expect(parseAndValidatePayload({ crisisLevel: 10 }).crisisLevel).toBe(5);
    expect(parseAndValidatePayload({ crisisLevel: 3 }).crisisLevel).toBe(3);
  });

  it('should ensure arrays for steps and resources', () => {
    const data = { actionableSteps: 'not an array', requiredResources: null };
    const result = parseAndValidatePayload(data);
    expect(Array.isArray(result.actionableSteps)).toBe(true);
    expect(Array.isArray(result.requiredResources)).toBe(true);
  });

  it('should preserve valid incoming data perfectly', () => {
    const validData = {
      crisisLevel: 3,
      incidentType: 'Fire',
      extractedLocation: '123 Main St',
      medicalSummary: 'None',
      actionableSteps: ['Evacuate'],
      requiredResources: ['Firetruck'],
    };
    const result = parseAndValidatePayload(validData);
    expect(result).toEqual(validData);
  });

  it('should handle partially valid data gracefully', () => {
    const partial = { crisisLevel: 4, incidentType: 'Medical' };
    const result = parseAndValidatePayload(partial);
    expect(result.crisisLevel).toBe(4);
    expect(result.incidentType).toBe('Medical');
    expect(result.extractedLocation).toBe('Not Provided');
    expect(Array.isArray(result.actionableSteps)).toBe(true);
  });

  it('should handle empty object gracefully', () => {
    const result = parseAndValidatePayload({});
    expect(result.crisisLevel).toBe(3); // default
    expect(result.incidentType).toBe('Unknown');
  });
});

// ============================================================
// Unit Tests: createFallbackPayload
// ============================================================
describe('createFallbackPayload', () => {
  it('should return a valid payload structure', () => {
    const fallback = createFallbackPayload();
    expect(fallback).toHaveProperty('crisisLevel');
    expect(fallback).toHaveProperty('incidentType');
    expect(fallback).toHaveProperty('extractedLocation');
    expect(fallback).toHaveProperty('medicalSummary');
    expect(fallback).toHaveProperty('actionableSteps');
    expect(fallback).toHaveProperty('requiredResources');
  });

  it('should return crisis level 1 for fallback', () => {
    expect(createFallbackPayload().crisisLevel).toBe(1);
  });

  it('should return arrays for steps and resources', () => {
    const fallback = createFallbackPayload();
    expect(Array.isArray(fallback.actionableSteps)).toBe(true);
    expect(Array.isArray(fallback.requiredResources)).toBe(true);
  });

  it('should return a new object each time (no shared references)', () => {
    const a = createFallbackPayload();
    const b = createFallbackPayload();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});
