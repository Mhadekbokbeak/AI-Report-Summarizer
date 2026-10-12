import { DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';
import 'pdfjs-dist/legacy/build/pdf.worker.mjs';
import path from 'path';

globalThis.DOMMatrix ??= DOMMatrix;
globalThis.ImageData ??= ImageData;
globalThis.Path2D ??= Path2D;

const { PDFParse } = await import('pdf-parse');

export const extractTextFromFile = async (file) => {
  if (!file || !Buffer.isBuffer(file.buffer)) {
    throw new Error('ไม่พบข้อมูลไฟล์ที่อัปโหลด');
  }

  const ext = path.extname(file.originalname || '').toLowerCase();
  const mimeType = (file.mimetype || '').toLowerCase();

  if (
    ext === '.txt' &&
    (mimeType === 'text/plain' ||
      mimeType === 'application/octet-stream' ||
      !mimeType)
  ) {
    if (file.buffer.includes(0)) {
      throw new Error('ไฟล์ TXT มีข้อมูลไบนารีที่ไม่รองรับ');
    }

    return file.buffer.toString('utf-8');
  }

  if (
    ext === '.pdf' &&
    (mimeType === 'application/pdf' ||
      mimeType === 'application/octet-stream' ||
      !mimeType)
  ) {
    const pdfHeader = file.buffer.indexOf(Buffer.from('%PDF-'), 0, 1024);
    if (pdfHeader === -1) {
      throw new Error('เนื้อหาไฟล์ไม่ใช่ PDF ที่ถูกต้อง');
    }

    const parser = new PDFParse({ data: file.buffer });

    try {
      const result = await parser.getText();
      return result.text || '';
    } finally {
      await parser.destroy();
    }

  }

  throw new Error('ประเภทไฟล์ไม่รองรับ (รองรับเฉพาะ .pdf และ .txt)');
};