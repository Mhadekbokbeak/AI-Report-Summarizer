import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();
const allowedMimeTypes = new Set(['application/pdf', 'text/plain']);
const allowedExtensions = new Set(['.pdf', '.txt']);

const fileFilter = (req, file, cb) => {
  const mimeType = (file.mimetype || '').toLowerCase();
  const extension = path.extname(file.originalname || '').toLowerCase();
  const isAllowedMime = allowedMimeTypes.has(mimeType);
  const isAllowedExtension = allowedExtensions.has(extension);
  const hasGenericMimeType =
    !mimeType || mimeType === 'application/octet-stream';

  if (isAllowedExtension && (isAllowedMime || hasGenericMimeType)) {
    cb(null, true);
    return;
  }

  const error = new Error('รองรับเฉพาะไฟล์เอกสารประเภท .pdf และ .txt เท่านั้น');
  error.code = 'UNSUPPORTED_FILE_TYPE';
  cb(error);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadReport = (req, res, next) => {
  upload.single('file')(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      const message =
        error.code === 'LIMIT_FILE_SIZE'
          ? 'ไฟล์ต้องมีขนาดไม่เกิน 10 MB'
          : 'รูปแบบการอัปโหลดไฟล์ไม่ถูกต้อง';
      res.status(status).json({ error: message });
      return;
    }

    if (error.code === 'UNSUPPORTED_FILE_TYPE') {
      res.status(400).json({ error: error.message });
      return;
    }

    next(error);
  });
};
