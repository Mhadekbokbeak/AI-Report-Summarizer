import { ensureGeminiReady } from '../config/gemini.js';
import { Type } from '@google/genai';



// Retry Helper
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const generateWithRetry = async (fn, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response =  await fn();

       // สำเร็จ → ต้อง return response
      return response ;
    } catch (error) {
      const status = error?.status || error?.error?.code;

      // ถ้าไม่ใช่ 503 → ไม่ต้อง retry
      if (status !== 503 || attempt === retries) {
        throw error;
      }
    }

    const delay = attempt * 2000;

    console.log(
      `Gemini unavailable. Retry ${attempt}/${retries} in ${delay}ms...`,
    );

    await sleep(delay);
  }
};

// Defind Schema When Ai Response JSON Struture
const summaryResponseSchema = {
  type: Type.OBJECT,
  properties: {
    // What in properties have !
    overview: {
      type: Type.STRING,
      description: "สรุปภาพรวมของรายงานโดยย่อ",
    },
    keyPoints: {
      type: Type.STRING,
      description: "ประเด็นสำคัญของรายงาน",
    },
    problems: {
      type: Type.STRING,
      description: "ปัญหาหรืออุปสรรคที่พบในรายงาน",
    },
    importantData: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "ข้อมูล สถิติ หรือตัวเลขสำคัญ",
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "ข้อเสนอแนะหรือแนวทางการแก้ไข",
    },
  },
  required: [
    "overview",
    "keyPoints",
    "problems",
    "importantData",
    "recommendations",
  ], // AI have to Response These field !!
};

export const summarizeText = async (text) => {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error('ข้อความรายงานไม่ถูกต้อง');
  }

  const sanitizedText = text.trim().slice(0, 100000);
  const prompt = `Summarize the following report in Thai based on the provided JSON structure.

Report:${sanitizedText}`;
  const client = ensureGeminiReady();

  const response = await generateWithRetry(() => {
    return client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: summaryResponseSchema,
        temperature: 0.2,
      },
    });
  });

  const parsedSummary = JSON.parse(response.text);

  return parsedSummary;
};
