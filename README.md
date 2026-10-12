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

สร้างไฟล์ `server/.env` แล้วใส่ค่าต่อไปนี้ โดยแทน `ใส่_GEMINI_API_KEY_ของคุณ` ด้วย API key ของตัวเอง:

```env
GEMINI_API_KEY=ใส่_GEMINI_API_KEY_ของคุณ
PORT=5000
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
