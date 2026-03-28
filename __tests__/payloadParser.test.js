import { describe, it, expect } from 'vitest';
import { parseAndValidatePayload, createFallbackPayload } from '../utils/payloadParser';

describe('Payload Parser Utility', () => {
  it('should return fallback payload for null or non-object', () => {
    const result = parseAndValidatePayload(null);
    expect(result.crisisLevel).toBe(1);
    expect(result.incidentType).toBe('Error Parsing Data');
  });

  it('should validate and clamp crisis levels', () => {
    const dataLow = { crisisLevel: -5 };
    const dataHigh = { crisisLevel: 10 };
    expect(parseAndValidatePayload(dataLow).crisisLevel).toBe(1);
    expect(parseAndValidatePayload(dataHigh).crisisLevel).toBe(5);
  });

  it('should ensure arrays for steps and resources', () => {
    const data = {
      actionableSteps: 'not an array',
      requiredResources: null
    };
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
      requiredResources: ['Firetruck']
    };
    const result = parseAndValidatePayload(validData);
    expect(result).toEqual(validData);
  });
});
