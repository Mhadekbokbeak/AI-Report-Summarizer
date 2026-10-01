import { summarizeText } from "../services/gemini.service.js";
import { extractTextFromFile } from '../services/document.service.js'

export const summarizeReport = async (req , res) => {
          try {
                    const { text } = req.body;

                    if (!text || typeof text !== 'string' || text.trim() === '') {
                              return res.status(400).json({
                                        error:"กรุณาระบุข้อความรายงานใน field 'text'"
                              });
                    };

                    const summary = await summarizeText(text);
                    
                    return res.status(200).json({
                              summary,
                    });

          } catch (error) {
                    console.error("Error summarizing report:", error);
                    return res.status(500).json({
                              error:"เกิดข้อผิดพลาดในการประมวลผลรายงานด้วย Gemini API",
                              details:error.message,
                    });
          };
};

// Upload File
export const uploadAndSummarizeReport = async (req,res)=> {
          try {
                    if (!req.file) {
                              return res.status(400).json({
                                        error:"กรุณาแนบไฟล์เอกสาร (.pdf หรือ .txt) ใน field 'file'",
                              });
                    }

                    // Extract text From File 
                    const extractedText = await extractTextFromFile(req.file);

                    if (!extractedText || extractedText.trim() === '') {
                              return res.status(400).json({
                                        error:"ไม่สามารถอ่านข้อความจากไฟล์ได้ หรือไฟล์ไม่มีเนื้อหาข้อความ (เช่น PDF ที่สแกนมาเป็นภาพ)",
                              });
                    }

                    // Send Text's extract to Gemini Ai summary
                    const summary = await summarizeText(extractedText);

                    return res.status(200).json({
                              filename:req.file.originalname,
                              summary
                    });
          } catch (error) {
                    console.error("Error processing uploaded document:", error);
                    return res.status(500).json({
                              error:"เกิดข้อผิดพลาดในการประมวลผลไฟล์เอกสาร",
                              details:error.message,
                    });
          }
}