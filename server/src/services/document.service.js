import { PDFParse } from 'pdf-parse';
import path from 'path';

export const extractTextFromFile = async (file)  => {
          if (!file || !file.buffer) {
                    throw new Error('ไม่พบข้อมูลไฟล์ที่อัปโหลด');
          }

          const ext = path.extname(file.originalname).toLowerCase();
          const mimeType = file.mimeType;

          // Case file .txt 
          if (mimeType === 'text/plain' || ext === 'txt') {
                    const text = file.buffer.toString('utf-8');
                    return text
          }

          // Case file .pdf 
          if (mimeType === 'application/pdf' || ext === '.pdf') {
                    const parser = new PDFParse({
                              data:file.buffer
                    });

                    const result = await parser.getText();

                    await parser.destroy();

                    return result.text;
          }

          throw new Error('ประเภทไฟล์ไม่รองรับ (รองรับเฉพาะ .pdf และ .txt)');
};