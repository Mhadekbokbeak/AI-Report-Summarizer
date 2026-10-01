import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
          throw new Error("GEMINI_API_KEY is missing in environment variables.");
}; // Catch error when api key not working base

const ai = new GoogleGenAI({
          apiKey:process.env.GEMINI_API_KEY,
});


export default ai;