/**
 * @module payloadParser
 * @description Utility functions for parsing and validating the AI model's output.
 * Ensures the schema is robust even if the AI hallucinates or returns malformed data.
 */

/**
 * @typedef {Object} EmergencyPayload
 * @property {number} crisisLevel - Crisis severity (1-5).
 * @property {string} incidentType - Type of incident (e.g., Medical, Fire, Police).
 * @property {string} extractedLocation - Extracted location string.
 * @property {string} medicalSummary - Summary of medical conditions.
 * @property {string[]} actionableSteps - List of immediate actions.
 * @property {string[]} requiredResources - List of required dispatch resources.
 */

/**
 * Safely parses the raw payload returned by the AI model into a defined structure.
 * Validates array types, strings, and clamps the crisis level correctly.
 * @param {*} data - Raw JSON object returned from the AI model.
 * @returns {EmergencyPayload} A strictly typed and validated emergency payload.
 */
export function parseAndValidatePayload(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return createFallbackPayload();
  }

  return {
    crisisLevel: clampNumber(data.crisisLevel, 1, 5, 3),
    incidentType: ensureString(data.incidentType, 'Unknown'),
    extractedLocation: ensureString(data.extractedLocation, 'Not Provided'),
    medicalSummary: ensureString(data.medicalSummary, 'None detected'),
    actionableSteps: ensureStringArray(data.actionableSteps, ['Assess situation', 'Call local authorities if needed']),
    requiredResources: ensureStringArray(data.requiredResources, []),
  };
}

/**
 * Generates a safe fallback payload in case the model's output cannot be parsed.
 * @returns {EmergencyPayload} Fallback emergency payload.
 */
export function createFallbackPayload() {
  return {
    crisisLevel: 1,
    incidentType: 'Error Parsing Data',
    extractedLocation: 'Unknown',
    medicalSummary: 'Could not process input.',
    actionableSteps: ['Please try submitting again', 'If emergency, dial 911 directly'],
    requiredResources: [],
  };
}

/**
 * Clamps a number between min and max, returning a default if the value is not a number.
 * @param {*} value - The value to clamp.
 * @param {number} min - Minimum allowed value.
 * @param {number} max - Maximum allowed value.
 * @param {number} defaultValue - Default value if input is not a number.
 * @returns {number} The clamped number.
 */
export function clampNumber(value, min, max, defaultValue) {
  if (typeof value !== 'number' || Number.isNaN(value)) return defaultValue;
  return Math.min(Math.max(Math.round(value), min), max);
}

/**
 * Ensures a value is a string. Returns defaultValue if not.
 * @param {*} value - The value to check.
 * @param {string} defaultValue - Fallback string.
 * @returns {string} A valid string.
 */
export function ensureString(value, defaultValue) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : defaultValue;
}

/**
 * Ensures a value is an array of strings. Filters out non-string entries.
 * @param {*} value - The value to check.
 * @param {string[]} defaultValue - Fallback array.
 * @returns {string[]} A valid array of strings.
 */
export function ensureStringArray(value, defaultValue) {
  if (!Array.isArray(value)) return defaultValue;
  const filtered = value.filter((item) => typeof item === 'string' && item.trim().length > 0);
  return filtered.length > 0 ? filtered : defaultValue;
}
