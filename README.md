# AI Report Summarizer

โปรเจกต์ทดลองสำหรับสรุปรายงานด้วย AI ทำขึ้นเพื่อความสนุกและการเรียนรู้ โดยใช้ AI ช่วยพัฒนา

เว็บแอปช่วยสรุปรายงานภาษาไทยจากข้อความหรือไฟล์ PDF/TXT แสดงภาพรวม ประเด็นสำคัญ ปัญหา ข้อมูลสำคัญ และข้อเสนอแนะ

> โปรเจกต์นี้เป็นงานทดลอง ผลลัพธ์จาก AI อาจคลาดเคลื่อน ควรตรวจสอบข้อมูลสำคัญก่อนนำไปใช้งานจริง

## เทคโนโลยี

- Frontend: React, Vite, Tailwind CSS และ Motion
- Backend: Node.js, Express และ Gemini API
- อ่านไฟล์ PDF ด้วย `pdf-parse`

## สิ่งที่ต้องเตรียม

- Node.js และ npm
- Gemini API key จาก [Google AI Studio](https://aistudio.google.com/app/apikey)

การเรียก Gemini API ใช้โควตาของโปรเจกต์ Google ที่ผูกกับ API key หากโควตาหมดจะต้องรอรอบรีเซ็ตหรือปรับแผนการใช้งาน

## ติดตั้งและเริ่มใช้งาน

เปิด Terminal 2 หน้าต่างจากโฟลเดอร์โปรเจกต์

### 1. ตั้งค่า Backend

คัดลอก `server/.env.example` เป็น `server/.env` แล้วใส่ API key ของตัวเอง:

```env
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

อย่าเผยแพร่หรือ commit ไฟล์ `.env` หรือ API key ขึ้น Git

ติดตั้งและเปิด server:

```powershell
cd server
npm.cmd install
npm.cmd run dev
```

เมื่อ server เริ่มทำงาน จะฟังที่ `http://localhost:5000`

### 2. ตั้งค่า Frontend

เปิด Terminal อีกหน้าต่าง:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

เปิด URL ที่ Vite แสดงใน Terminal โดยปกติคือ `http://localhost:5173`. หากพอร์ตนั้นถูกใช้งาน Vite จะเลือกพอร์ตถัดไปให้อัตโนมัติ

> ใน PowerShell บน Windows ให้ใช้ `npm.cmd` หากคำสั่ง `npm` ถูกปิดกั้นด้วย Execution Policy

## วิธีใช้งาน

1. เลือก **วางข้อความ** เพื่อวางเนื้อหารายงาน หรือเลือก **อัปโหลดไฟล์** เพื่อเลือกไฟล์ PDF/TXT
2. คลิก **สรุปรายงาน**
3. รอผลสรุปจาก AI

รองรับไฟล์ PDF และ TXT ขนาดไม่เกิน 10 MB และข้อความไม่เกิน 100,000 ตัวอักษร

## API

| Method | Endpoint | รายละเอียด |
| --- | --- | --- |
| `POST` | `/api/reports/summarize` | สรุปรายงานจาก JSON body |
| `POST` | `/api/reports/upload` | อัปโหลดและสรุปรายงาน โดยใช้ multipart field ชื่อ `file` |

ตัวอย่าง body สำหรับ endpoint สรุปข้อความ:

```json
{
  "text": "เนื้อหารายงานที่ต้องการสรุป"
}
```

Frontend สำหรับพัฒนาจะ proxy คำขอ `/api` ไปยัง backend ที่ `http://localhost:5000` โดยอัตโนมัติ

### Deploy บน Vercel แยก Frontend และ Backend

สร้าง Vercel Project สองโปรเจกต์จาก repository เดียวกัน:

- Frontend: **Root Directory** `frontend`, Framework `Vite`, Build Command `npm run build`, Output Directory `dist`
- Backend: **Root Directory** `server`, Framework `Express`

ตั้ง Environment Variables ใน Vercel Project ที่เกี่ยวข้อง (Production และ Preview ตามต้องการ):

| Project | Variable | Value |
| --- | --- | --- |
| Backend | `GEMINI_API_KEY` | Gemini API key (เก็บเป็น secret) |
| Backend | `CORS_ORIGIN` | Origin ของ frontend เช่น `https://ai-report-summarizer-rose.vercel.app` |
| Frontend | `VITE_API_BASE_URL` | Base URL ของ backend เช่น `https://your-backend.vercel.app` |

`CORS_ORIGIN` ต้องเป็น URL ต้นทางของหน้าเว็บ frontend ที่เปิดใน browser เท่านั้น: protocol + hostname ไม่มี path หรือ `/` ต่อท้าย เช่น `https://my-ui.vercel.app`. หากต้องอนุญาตหลาย frontend origins ให้คั่นด้วย comma. อย่าตั้งเป็น `*`.

ฝั่ง frontend อ่าน `VITE_API_BASE_URL` ตอน build ดังนั้นหลังเปลี่ยน environment variables ต้อง redeploy frontend และ backend. ใน browser DevTools → Network ให้ดูค่า **Request URL** (โดเมน backend) และ **Request Headers → Origin** (โดเมน frontend); ค่า Origin นี้ต้องตรงกับ `CORS_ORIGIN` ฝั่ง backend.

ตัวแปร `VITE_API_BASE_URL` ไม่ใช่ secret และจะถูกใส่ใน frontend bundle; ห้ามใส่ Gemini API key ในตัวแปรที่ขึ้นต้นด้วย `VITE_`.
