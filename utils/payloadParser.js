/**
 * Utility functions for parsing the Gemini output
 * ensuring the schema is somewhat robust even if the AI hallucinates.
 */

/**
 * Safely parses the raw payload returned by the Gemini model into a defined structure.
 * Validates array types, strings, and clamps the crisis level correctly.
 * @param {*} data - Raw JSON object returned from Gemini.
 * @returns {Object} A strictly typed and validated emergency payload struct.
 */
export function parseAndValidatePayload(data) {
  if (!data || typeof data !== 'object') {
    return createFallbackPayload();
  }

  return {
    crisisLevel: typeof data.crisisLevel === 'number' ? Math.min(Math.max(data.crisisLevel, 1), 5) : 3,
    incidentType: typeof data.incidentType === 'string' ? data.incidentType : 'Unknown',
    extractedLocation: typeof data.extractedLocation === 'string' ? data.extractedLocation : 'Not Provided',
    medicalSummary: typeof data.medicalSummary === 'string' ? data.medicalSummary : 'None detected',
    actionableSteps: Array.isArray(data.actionableSteps) ? data.actionableSteps : ['Assess situation', 'Call local authorities if needed'],
    requiredResources: Array.isArray(data.requiredResources) ? data.requiredResources : []
  };
}

/**
 * Generates a safe fallback payload in case the model's output cannot be parsed.
 * @returns {Object} Fallback emergency payload.
 */
export function createFallbackPayload() {
  return {
    crisisLevel: 1,
    incidentType: 'Error Parsing Data',
    extractedLocation: 'Unknown',
    medicalSummary: 'Could not process input.',
    actionableSteps: ['Please try submitting again', 'If emergency, dial 911 directly'],
    requiredResources: []
  };
}
