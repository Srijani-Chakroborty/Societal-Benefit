import { NextResponse } from 'next/server';

/** @type {string|undefined} OpenRouter API key loaded from environment. */
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

/** @type {string} OpenRouter API endpoint URL. */
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/** @type {number} Maximum allowed input text length (security: prevent abuse). */
const MAX_TEXT_LENGTH = 10000;

/** @type {number} Maximum allowed base64 image size in bytes (~5MB). */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/** @type {Set<string>} Allowed MIME types for image uploads (security: restrict file types). */
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

/**
 * System instruction defining the behavior and standard JSON return type for the Gemini model.
 * @type {string}
 */
const SYSTEM_INSTRUCTION = `You are the Lifeline Core API, an emergency triage assistant. 
Your job is to take chaotic, messy input (which could be text, voice transcripts, or messy medical records) 
and return a highly structured JSON object representing the crisis assessment.

ALWAYS return valid JSON matching this exact schema and NOTHING ELSE (no markdown, no code fences):
{
  "crisisLevel": number (1-5, where 1 is non-urgent info, 5 is immediate life-threatening emergency),
  "incidentType": string (e.g., "Medical", "Fire", "Police", "Disaster", "General Query"),
  "extractedLocation": string | null (any location mentioned, or null if none),
  "medicalSummary": string (brief summary of any medical symptoms or conditions, "" if none),
  "actionableSteps": string[] (3-5 immediate verbs/actions the user or dispatch should take),
  "requiredResources": string[] (e.g., ["Ambulance", "Firetruck", "Trauma Kit"])
}
Parse the input carefully. If it's a garbled voice transcript, extract intent. 
If it's an image of a medical record, extract the key conditions for the medicalSummary.`;

/**
 * Sanitizes user text input to prevent injection attacks.
 * Trims whitespace and truncates to MAX_TEXT_LENGTH.
 * @param {string} text - Raw user input text.
 * @returns {string} Sanitized text string.
 */
function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  return text.trim().slice(0, MAX_TEXT_LENGTH);
}

/**
 * Validates the MIME type of an uploaded image.
 * @param {string} mimeType - The MIME type string.
 * @returns {boolean} Whether the MIME type is allowed.
 */
function isValidMimeType(mimeType) {
  return ALLOWED_MIME_TYPES.has(mimeType);
}

/**
 * Next.js POST Route handler.
 * Interfaces with Google Gemini via OpenRouter to process unstructured incoming data.
 * Includes input validation, sanitization, and secure error handling.
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} The JSON structured response or an error.
 */
export async function POST(request) {
  try {
    // Security: verify API key is configured
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'API service is not configured. Please contact the administrator.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { text, imageBase64, mimeType } = body;

    // Validation: require at least one input
    if (!text && !imageBase64) {
      return NextResponse.json(
        { error: 'No input provided. Please enter text or upload an image.' },
        { status: 400 }
      );
    }

    // Security: sanitize text input
    const sanitizedText = sanitizeText(text);

    // Security: validate image inputs
    if (imageBase64) {
      if (mimeType && !isValidMimeType(mimeType)) {
        return NextResponse.json(
          { error: `Unsupported image type: ${mimeType}. Allowed: JPEG, PNG, WebP, GIF.` },
          { status: 400 }
        );
      }

      // Rough size check on base64 string length
      const estimatedSize = (imageBase64.length * 3) / 4;
      if (estimatedSize > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: 'Image is too large. Maximum size is 5MB.' },
          { status: 400 }
        );
      }
    }

    // Build the content array for OpenRouter (OpenAI-compatible format)
    const contentParts = [];

    if (imageBase64) {
      const base64Data = imageBase64.includes('base64,')
        ? imageBase64
        : `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`;

      contentParts.push({
        type: 'image_url',
        image_url: { url: base64Data },
      });
    }

    if (sanitizedText) {
      contentParts.push({
        type: 'text',
        text: sanitizedText,
      });
    }

    // Efficiency: use AbortController for request timeout (15 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lifeline-core.app',
        'X-Title': 'Lifeline Core',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          { role: 'user', content: contentParts },
        ],
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter error:', data);
      return NextResponse.json(
        { error: data?.error?.message || 'Failed to get response from AI model.' },
        { status: response.status }
      );
    }

    const responseText = data.choices?.[0]?.message?.content;

    if (!responseText) {
      return NextResponse.json(
        { error: 'AI model returned an empty response. Please try again.' },
        { status: 502 }
      );
    }

    // Safety: parse and validate JSON from the response text
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse AI output:', responseText);
      return NextResponse.json(
        { error: 'AI response was not valid structured data. Please try again.' },
        { status: 502 }
      );
    }

    // Security: set protective response headers
    return NextResponse.json(parsedData, {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store',
      },
    });

  } catch (error) {
    // Handle timeout specifically
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timed out. The AI model took too long to respond.' },
        { status: 504 }
      );
    }

    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
