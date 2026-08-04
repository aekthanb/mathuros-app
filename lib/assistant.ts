import type { Message } from "./data";

export function getReply(text: string): Message {
  const normalized = text.toLowerCase();
  if (normalized.includes("ฝาก") || normalized.includes("ผู้ใหญ่") || normalized.includes("ของขวัญ")) {
    return {
      role: "assistant",
      text: "สำหรับของฝากผู้ใหญ่ แนะนำสองตัวนี้ค่ะ ทั้งคู่จัดกล่องของขวัญพร้อมการ์ดเขียนมือได้",
      picks: [
        { sku: "grape", reason: "หน้าตาดี หอม กินง่าย เป็นของฝากที่ไม่พลาด" },
        { sku: "pomelo", reason: "ปอกและแยกกลีบให้แล้ว ผู้ใหญ่ทานสะดวก" },
      ],
    };
  }
  if (normalized.includes("หวาน")) {
    return {
      role: "assistant",
      text: "สัปดาห์นี้ค่าความหวานสูงสุดอยู่ที่สองตัวนี้ค่ะ วัดจากล็อตที่เพิ่งเข้าห้องคัดเมื่อเช้า",
      picks: [
        { sku: "durian", reason: "๓๐–๓๒ Brix เนื้อแห้ง หนึบ หวานมัน" },
        { sku: "longan", reason: "๑๙–๒๑ Brix เนื้อหนา เมล็ดเล็ก" },
      ],
    };
  }
  if (normalized.includes("งบ") || normalized.includes("1,000") || normalized.includes("1000")) {
    return {
      role: "assistant",
      text: "ในงบไม่เกิน ฿1,000 สองตัวนี้คุ้มที่สุดในฤดูนี้ค่ะ",
      picks: [
        { sku: "som", reason: "ตะกร้า ๒ กก. หวานอมเปรี้ยว กินได้ทั้งบ้าน" },
        { sku: "mango", reason: "กล่อง ๕ ลูก สุกกำลังดีวันที่ถึงมือ" },
      ],
    };
  }
  if (normalized.includes("เด็ก")) {
    return {
      role: "assistant",
      text: "ถ้ามีเด็กในบ้าน แนะนำผลไม้ที่ไม่ต้องปอกยากและไม่มีเมล็ดค่ะ",
      picks: [
        { sku: "grape", reason: "ไร้เมล็ด กินได้ทั้งเปลือก หยิบง่าย" },
        { sku: "straw", reason: "ผลเล็กพอดีคำ หวานอมเปรี้ยว" },
      ],
    };
  }
  return {
    role: "assistant",
    text: "จากที่สวนตัดได้ตอนนี้ เราเลือกสองตัวนี้ให้ก่อนค่ะ ถ้าบอกงบหรือโอกาสที่จะใช้ เราคัดให้ละเอียดขึ้นได้",
    picks: [
      { sku: "fuji", reason: "กรอบ น้ำเยอะ เก็บได้นาน ๗–๑๐ วัน" },
      { sku: "mango", reason: "สุกกำลังดีสัปดาห์นี้ หวาน ๑๖–๑๘ Brix" },
    ],
  };
}
