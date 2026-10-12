import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : {
      models: {
        generateContent: async () => {
          throw new Error('GEMINI_API_KEY is missing in environment variables.');
        },
      },
    };

export const ensureGeminiReady = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in environment variables.');
  }

  return ai;
};

export default ai;