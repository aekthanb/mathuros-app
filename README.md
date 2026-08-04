# มธุรส — Next.js

โปรเจกต์ Next.js สำหรับหน้าเว็บขายผลไม้ “มธุรส” ที่ย้ายมาจากไฟล์ HTML ต้นฉบับเป็น React Client Component และเพิ่ม responsive layout สำหรับมือถือ

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## ตรวจสอบ production build

```bash
npm run build
npm start
```

ส่วน UI และ state หลักอยู่ที่ `components/Storefront.tsx` ส่วน global styles, responsive breakpoints และ design tokens อยู่ที่ `app/globals.css`.
