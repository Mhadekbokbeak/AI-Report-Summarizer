import ai from "../config/gemini.js";
import { Type } from "@google/genai";

// Defind Schema When Ai Response JSON Struture
const summaryResponseSchema = {
          type:Type.OBJECT,
          properties:{ // What in properties have !
                    overview:{
                              type:Type.STRING,
                              description:"สรุปภาพรวมของรายงานโดยย่อ",
                    },
                    keyPoints:{
                              type:Type.ARRAY,
                              description:"ประเด็นสำคัญของรายงาน"
                    },
                    problems:{
                              type:Type.ARRAY,
                              description:"ปัญหาหรืออุปสรรคที่พบในรายงาน"
                    },
                    importantData:{
                              type:Type.ARRAY,
                              items:{type:Type.STRING},
                              description:"ข้อมูล สถิติ หรือตัวเลขสำคัญ"
                    },
                    recommendations:{
                              type:Type.ARRAY,
                              items:{type:Type.STRING},
                              description:"ข้อเสนอแนะหรือแนวทางการแก้ไข"
                    },
          },
          required:["overview","keyPoints","problems","importantData","recommendations"], // AI have to Response These field !!
};

export const summarizeText = async (text) => {
          const propmt = `Summarize the following report in Thai based on the provided JSON structure.

Report:${text}`;

          const response = await ai.models.generateContent({
                    model:'gemini-2.5-flash',
                    contents:propmt,
                    config:{
                              responseMimeType:"application/json",
                              responseJsonSchema:summaryResponseSchema,
                              temperature:0.2, // ปรับอุณหภูมิให้ต่ำลงเพื่อลดความคลาดเคลื่อนของข้อมูล
                    },
          });

          const parsedSummary = JSON.parse(response.text);
          return parsedSummary;
};