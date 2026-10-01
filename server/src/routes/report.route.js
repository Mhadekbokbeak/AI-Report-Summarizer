import Router from 'express';
import { summarizeReport, uploadAndSummarizeReport } from '../controller/report.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router(); // use Router

// POST /api/reports/summarize (JSON Body)
router.post('/summarize', summarizeReport);

// POST /api/reports/upload (file Upload)
// upload.single('file') Mean => gain file from name 'file' one file
router.post('/upload',upload.single('file'), uploadAndSummarizeReport);

export default router;