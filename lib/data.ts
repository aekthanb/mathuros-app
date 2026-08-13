/**
 * ข้อมูลสินค้าชุดนี้ก๊อปมาจากตาราง products / product_sizes ใน Postgres ตรง ๆ
 * (สแนปช็อตวันที่ ๑๔ ส.ค. ๒๕๖๙) เพราะฝั่ง API ยังไม่มี product module ให้เรียก
 * — `id` คือ UUIDv7 ตัวจริงในฐานข้อมูล ต้องใช้ส่งเข้า POST /orders
 *
 * เมื่อ API สินค้าพร้อมแล้ว ให้ทิ้งไฟล์ส่วนนี้แล้วดึงจาก endpoint แทน
 * รูปยังชี้ไป /public เหมือนเดิม ไม่ได้ใช้ image_url (S3) จาก DB เพราะ next/image
 * ยังไม่ได้ตั้ง remotePatterns ให้โฮสต์นั้น
 */
export type Product = {
  /** products.id — UUIDv7 */
  id: string;
  sku: string;
  name: string;
  price: number;
  oldPrice: number;
  unit: string;
  origin: string;
  brix: string;
  keep: string;
  weight: string;
  description: string;
  label: string;
  badge?: string;
  image?: string;
};

export type ChatProductSize = {
  label: string;
  price: string;
};

export type ChatProduct = {
  id: string;
  sku: string;
  name: string;
  price: string;
  oldPrice?: string | null;
  imageUrl?: string | null;
  unit?: string | null;
  origin?: string | null;
  brix?: string | null;
  shelfLife?: string | null;
  weight?: string | null;
  badge?: string | null;
  description?: string | null;
  stockStatus?: string | null;
  availableQty?: number | null;
  nextCutDate?: string | null;
  sizes?: ChatProductSize[] | null;
};

export type ChatResponse = {
  sessionId: string;
  reply: string;
  products?: ChatProduct[];
};

export type Message = {
  role: "assistant" | "user";
  text: string;
  products?: ChatProduct[];
};

export const PRODUCTS: Product[] = [
  {
    id: "019fe838-1486-7cac-83a2-b5a2fdcb1258",
    sku: "fuji",
    name: "แอปเปิ้ลฟูจิ อาโอโมริ",
    price: 890,
    oldPrice: 1050,
    unit: "กล่อง ๖ ลูก · ห่อกระดาษรายลูก",
    origin: "อาโอโมริ ญี่ปุ่น",
    brix: "๑๕–๑๗ Brix",
    keep: "๗–๑๐ วัน (๔–๘°C)",
    weight: "≈ ๑.๘ กก.",
    description:
      "เนื้อแน่น กรอบ น้ำเยอะ ความหวานคมแต่ไม่เลี่ยน คัดเฉพาะลูกที่ผิวเนียนไร้ตำหนิและวัดได้ ๑๕ Brix ขึ้นไป ห่อกระดาษทีละลูกก่อนลงกล่อง",
    label: "แอปเปิ้ลฟูจิ 800×1000",
    badge: "ใหม่",
    image: "/img/list/apple.png",
  },
  {
    id: "019fe838-148d-7949-ab7c-26d480e6eb28",
    sku: "som",
    name: "ส้มสายน้ำผึ้ง ฝาง",
    price: 420,
    oldPrice: 490,
    unit: "ตะกร้า ๒ กก. · เบอร์ ๔",
    origin: "อ.ฝาง เชียงใหม่",
    brix: "๑๒–๑๔ Brix",
    keep: "๗ วัน (๔–๘°C)",
    weight: "≈ ๒.๐ กก.",
    description:
      "เปลือกบาง แกะง่าย เนื้อฉ่ำ หวานอมเปรี้ยว เก็บจากสวนในช่วงเช้าและส่งเข้าห้องคัดภายในวันเดียวกัน",
    label: "ส้มสายน้ำผึ้ง 800×1000",
    image: "/img/list/orange.png",
  },
  {
    id: "019fe838-1490-7579-ac7c-86e369a68c50",
    sku: "mango",
    name: "มะม่วงน้ำดอกไม้สีทอง",
    price: 650,
    oldPrice: 750,
    unit: "กล่อง ๕ ลูก · สุกกำลังดี",
    origin: "อ.บางคล้า ฉะเชิงเทรา",
    brix: "๑๖–๑๘ Brix",
    keep: "๔–๖ วัน (อุณหภูมิห้อง)",
    weight: "≈ ๑.๗ กก.",
    description:
      "คัดลูกที่แก่จัดคาต้น บ่มด้วยอุณหภูมิควบคุมให้สุกพอดีวันที่ถึงมือคุณ เนื้อละเอียด ไม่มีเสี้ยน หวานหอมแบบมะม่วงไทยแท้",
    label: "มะม่วงน้ำดอกไม้ 800×1000",
    badge: "ขายดี",
    image: "/img/list/mango.png",
  },
  {
    id: "019fe838-1493-7be5-b679-c174c93df3b7",
    sku: "grape",
    name: "องุ่นไชน์มัสแคท",
    price: 1290,
    oldPrice: 1490,
    unit: "๒ พวง · ไร้เมล็ด",
    origin: "นากาโนะ ญี่ปุ่น",
    brix: "๑๘–๒๐ Brix",
    keep: "๗–๑๐ วัน (๔–๘°C)",
    weight: "≈ ๑.๒ กก.",
    description:
      "ผลใหญ่ กรอบ ไร้เมล็ด กินได้ทั้งเปลือก กลิ่นหอมมัสแคทชัดเจน คัดเฉพาะพวงที่ผลเรียงสวยและสีสม่ำเสมอทั้งพวง",
    label: "องุ่นไชน์มัสแคท 800×1000",
    image: "/img/list/grape.png",
  },
  {
    id: "019fe838-1496-761b-b12a-099493ea4619",
    sku: "kiwi",
    name: "กีวีสีทอง",
    price: 490,
    oldPrice: 590,
    unit: "กล่อง ๘ ลูก · คัดลูกสุกพอดี",
    origin: "นิวซีแลนด์",
    brix: "๑๔–๑๖ Brix",
    keep: "๗–๑๐ วัน (๔–๘°C)",
    weight: "≈ ๑.๐ กก.",
    description:
      "เนื้อสีทอง ฉ่ำ หวานนำเปรี้ยวเบา ไม่มีขนที่เปลือก ปอกง่ายกินสะดวก คัดเฉพาะลูกที่สุกได้ที่และผิวไม่ช้ำ",
    label: "กีวีสีทอง 800×1000",
    image: "/img/list/kiwi.png",
  },
  {
    id: "019fe838-1499-70d4-a55d-da9661b1ce26",
    sku: "straw",
    name: "สตรอว์เบอร์รี พันธุ์ ๘๐",
    price: 540,
    oldPrice: 620,
    unit: "๒ กล่อง · จากดอยอินทนนท์",
    origin: "ดอยอินทนนท์ เชียงใหม่",
    brix: "๑๑–๑๓ Brix",
    keep: "๓–๕ วัน (๒–๔°C)",
    weight: "≈ ๐.๘ กก.",
    description:
      "เก็บตอนเช้ามืดขณะอากาศยังเย็น ลงกล่องควบคุมอุณหภูมิทันทีในสวน ผลแดงทั้งลูก หอม หวานอมเปรี้ยว",
    label: "สตรอว์เบอร์รีพันธุ์ ๘๐ 800×1000",
    image: "/img/list/storberry.png",
  },
  {
    id: "019fe838-149c-7b40-b9b8-297cf0be0579",
    sku: "longan",
    name: "ลำไยอีดอ ลำพูน",
    price: 480,
    oldPrice: 560,
    unit: "ช่อสด ๒ กก.",
    origin: "อ.ลี้ ลำพูน",
    brix: "๑๙–๒๑ Brix",
    keep: "๕–๗ วัน (๔–๘°C)",
    weight: "≈ ๒.๐ กก.",
    description:
      "ผลใหญ่ เนื้อหนา เมล็ดเล็ก ตัดเป็นช่อเพื่อรักษาความสดได้นานกว่าลำไยร่วง",
    label: "ลำไยอีดอ 800×1000",
    image: "/img/list/longan.png",
  },
  {
    id: "019fe838-149e-7bdf-87ad-0d91a9aebd3d",
    sku: "pomelo",
    name: "ส้มโอทองดี นครปฐม",
    price: 590,
    oldPrice: 690,
    unit: "๒ ลูก · ปอกให้พร้อมทาน",
    origin: "อ.นครชัยศรี นครปฐม",
    brix: "๑๒–๑๔ Brix",
    keep: "๗–๑๐ วัน (๔–๘°C)",
    weight: "≈ ๒.๔ กก.",
    description:
      "กุ้งใหญ่ แห้ง ไม่แฉะ หวานนำเปรี้ยวตาม ปอกและแยกกลีบให้เรียบร้อยก่อนแพ็กสุญญากาศ",
    label: "ส้มโอทองดี 800×1000",
    image: "/img/list/pomelo.png",
  },
  {
    id: "019fe838-14a1-7935-a91b-5f9236095451",
    sku: "coconut",
    name: "มะพร้าวน้ำหอมราชบุรี",
    price: 360,
    oldPrice: 420,
    unit: "๔ ลูก · เจียเปลือกแล้ว",
    origin: "อ.ดำเนินสะดวก ราชบุรี",
    brix: "๗–๘ Brix",
    keep: "๗ วัน (๔–๘°C)",
    weight: "≈ ๓.๒ กก.",
    description:
      "หอมชัดตั้งแต่เปิดฝา น้ำหวานเย็น เนื้ออ่อนนุ่ม เจียเปลือกให้เปิดง่ายพร้อมดื่มทันที",
    label: "มะพร้าวน้ำหอม 800×1000",
    image: "/img/list/coconut.png",
  },
];

export type ProductSize = {
  /** product_sizes.id — UUIDv7 */
  id: string;
  label: string;
  price: number;
};

/** เรียงตาม product_sizes.sort_order เหมือนที่ picker บนหน้าสินค้าแสดง */
export const SIZES: Record<string, ProductSize[]> = {
  fuji: [
    { id: "019fe83b-faa5-72c8-8f3f-638b2dfb75ba", label: "๖ ลูก", price: 890 },
    { id: "019fe83b-faa8-73dd-b6cb-e72fdb886168", label: "๑๒ ลูก", price: 1650 },
    { id: "019fe83b-faaa-7596-8aef-d055fcc4c178", label: "กล่องของขวัญ", price: 2190 },
  ],
  som: [
    { id: "019fe83b-faae-77b4-82ef-2166d73ff447", label: "ตะกร้า ๒ กก.", price: 420 },
    { id: "019fe83b-fab0-707c-a5b0-b6907ef9925a", label: "ลัง ๕ กก.", price: 980 },
    { id: "019fe83b-fab2-7975-a07f-e7acffeaf100", label: "กล่องของขวัญ", price: 1290 },
  ],
  mango: [
    { id: "019fe83b-fab7-74ef-a95d-93122ac6b959", label: "๕ ลูก", price: 650 },
    { id: "019fe83b-fab9-7949-bdf4-edc5d8885c32", label: "๑๐ ลูก", price: 1190 },
    { id: "019fe83b-faba-7006-b0a7-0eae2b1416c5", label: "กล่องของขวัญ", price: 1690 },
  ],
  grape: [
    { id: "019fe83b-fabe-71a6-99ef-95715f0ee7bf", label: "๒ พวง", price: 1290 },
    { id: "019fe83b-fac0-7808-83bd-8bc2f182b8be", label: "๔ พวง", price: 2390 },
    { id: "019fe83b-fac1-798f-9b53-87dda2bb6e72", label: "กล่องของขวัญ", price: 2890 },
  ],
  kiwi: [
    { id: "019fe83b-fac5-7313-bdf7-f1f1125f1d53", label: "๘ ลูก", price: 490 },
    { id: "019fe83b-fac6-773d-b20f-3c5577f879aa", label: "๑๖ ลูก", price: 890 },
    { id: "019fe83b-fac8-78fa-953f-fc1cb2d60292", label: "กล่องของขวัญ", price: 1290 },
  ],
  straw: [
    { id: "019fe83b-facb-70d7-842d-00675ac4ed16", label: "๒ กล่อง", price: 540 },
    { id: "019fe83b-facc-7f64-9892-354bf8070197", label: "๔ กล่อง", price: 1020 },
    { id: "019fe83b-face-7b14-b6e1-4d2412d11886", label: "กล่องของขวัญ", price: 1390 },
  ],
  longan: [
    { id: "019fe83b-fad2-7bdc-9359-b08cc8f96d0d", label: "ช่อสด ๒ กก.", price: 480 },
    { id: "019fe83b-fad3-7581-bdd4-37b7d2687635", label: "ช่อสด ๕ กก.", price: 1090 },
    { id: "019fe83b-fad4-73c7-9886-97979e758acf", label: "กล่องของขวัญ", price: 1290 },
  ],
  pomelo: [
    { id: "019fe83b-fad8-7999-a0bb-148f232c385e", label: "๒ ลูก", price: 590 },
    { id: "019fe83b-fad9-79f7-a1ea-5fe6e668ed72", label: "๔ ลูก", price: 1090 },
    { id: "019fe83b-fadb-7c7c-be89-f712f0a2b3c5", label: "กล่องของขวัญ", price: 1490 },
  ],
  coconut: [
    { id: "019fe83b-fade-7c8d-bbfc-da6699ae0c1b", label: "๔ ลูก", price: 360 },
    { id: "019fe83b-fadf-70bb-8614-49d370efe620", label: "๘ ลูก", price: 680 },
    { id: "019fe83b-fae1-7dd7-ac4d-3d74c4739209", label: "กล่องของขวัญ", price: 990 },
  ],
};

export const baht = (value: number) => `฿${value.toLocaleString("en-US")}`;

export const bahtAmount = (value: string | number) => {
  const amount = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(amount) ? baht(amount) : String(value);
};

export function priceFor(sku: string, sizeIndex: number) {
  const product = PRODUCTS.find((item) => item.sku === sku) ?? PRODUCTS[0];
  const sizes = SIZES[product.sku];
  const size = sizes[sizeIndex];
  const unitPrice = size?.price ?? product.price;
  return { product, sizes, size, unitPrice };
}
