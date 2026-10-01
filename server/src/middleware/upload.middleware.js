import multer from 'multer';
import path from 'path';

// เก็บไฟล์ไว้ใน RAM ชั่วคราว (req.file.buffer)
const storage = multer.memoryStorage();

// Filter file 
const fileFilter = (req,file,cb) => {
          const allowedMinetypes = ['application/pdf', 'text/plain'];
          const ext = path.extname(file.originalname).toLowerCase();

          if (allowedMinetypes.includes(file.mimeType) || ext === '.pdf' || ext === '.txt') {
                    cb(null, true);
          } else {
                    cb(new Error('รองรับเฉพาะไฟล์เอกสารประเภท .pdf และ .txt เท่านั้น'), false);
          }
};

export const upload = multer({
          storage,
          fileFilter,
          limits: {
                    filesSize: 10 * 1024 * 1024, // จำกัดขนาดไฟล์ไม่เกิน 10MB
          },
});