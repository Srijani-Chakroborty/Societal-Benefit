import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the SDK. It automatically picks up GEMINI_API_KEY from environment variables
// but we wrap it in a try-catch later to handle missing keys gracefully for the hackathon.
const initAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const ai = initAI();

/**
 * System instruction defining the behavior and standard JSON return type for the Gemini model.
 */
const SYSTEM_INSTRUCTION = `You are the Lifeline Core API, an emergency triage assistant. 
Your job is to take chaotic, messy input (which could be text, voice transcripts, or messy medical records) 
and return a highly structured JSON object representing the crisis assessment.

ALWAYS return valid JSON matching this exact schema:
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
 * Next.js POST Route handler.
 * Interfaces with the Gemini AI model to process unstructured incoming data.
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} The JSON structured response or an error.
 */
export async function POST(request) {
  try {
    if (!ai) {
      return NextResponse.json(
        { error: 'Gemini API Key is not configured. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { text, imageBase64, mimeType } = body;

    if (!text && !imageBase64) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 });
    }

    const contents = [];

    if (imageBase64) {
      // Clean base64 string if it has a prefix
      const base64Data = imageBase64.includes('base64,') 
        ? imageBase64.split('base64,')[1] 
        : imageBase64;
        
      contents.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType || 'image/jpeg',
        }
      });
    }

    if (text) {
      contents.push(text);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    
    // Safety check: parse JSON from the response text
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Gemini output:', responseText);
      return NextResponse.json({ error: 'Failed to generate structured data' }, { status: 500 });
    }

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Validation Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during analysis.' },
      { status: 500 }
    );
  }
}
