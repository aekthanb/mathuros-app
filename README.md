# มธุรส — Next.js

โปรเจกต์ Next.js สำหรับหน้าเว็บขายผลไม้ “มธุรส” ที่ย้ายมาจากไฟล์ HTML ต้นฉบับเป็น React Client Component และเพิ่ม responsive layout สำหรับมือถือ

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## API กลาง

ตั้ง URL ของ Backend เพียงครั้งเดียวใน `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

จากนั้นแต่ละ feature เปลี่ยนเพียง `method`, `endpoint` และส่ง `data` เมื่อจำเป็น:

```ts
import { api } from "../api/client";

type Product = {
  id: string;
  name: string;
};

const products = await api.get<Product[]>("/products");

const product = await api.post<Product>("/products", {
  name: "มะม่วงน้ำดอกไม้",
});
```

Axios client กลางจะแนบ access token และแปลงข้อผิดพลาดเป็น `ApiError` ซึ่งมี `status` และ `data` ให้ทุก feature ใช้รูปแบบเดียวกัน

แต่ละ module แยกเป็นไฟล์ของตัวเองภายใน `api/` และ export request functions โดยตรง:

```ts
import {
  getCurrentUserRequest,
  loginWithGoogleRequest,
} from "../api/auth";

const session = await loginWithGoogleRequest({ idToken });
const user = await getCurrentUserRequest();
```

## ตรวจสอบ production build

```bash
npm run build
npm start
```

ส่วน UI และ state หลักอยู่ที่ `components/Storefront.tsx` ส่วน global styles, responsive breakpoints และ design tokens อยู่ที่ `app/globals.css`.
