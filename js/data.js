/* ==========================================================================
   Fon Paradise - Dog Puppies Dataset & JSON Database Manager
   ========================================================================== */

const DB_KEY = 'fonparadise_dogs_db';
const JSON_FILE_PATH = 'data/dogs.json';

// Embedded fallback in case fetch is blocked by CORS in file:// protocol
const FALLBACK_DOGS_DATA = [
  {
    id: "pompom-01",
    name: "น้องปอมน่ารัก (Mochi)",
    breed: "Pomeranian",
    breedTh: "ปอมเมอเรเนียน",
    price: 18500,
    gender: "female",
    age: "2.5 เดือน",
    color: "ส้มครีม (Orange Cream)",
    vaccinated: "ฉีดวัคซีนแล้ว 1 เข็ม",
    microchip: "มีไมโครชิปแท้",
    pedigree: "ใบเพ็ดดีกรีสมาคมฯ 4 เจน",
    images: [
      "uploads/images/pompom.svg",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    audioBark: "playful_yap",
    customAudioUrl: "",
    description: "น้องมูจิ ปอมเมอเรเนียนเพศเมีย หน้าหมี ขนแน่นหนา ฟูฟ่อง ซน น่ารัก สดใส ขี้อ้อน ชอบเล่นกับคน กินเก่งมาก สุขภาพแข็งแรง 100%",
    fatherBreed: "Pomeranian แชมป์ประเทศไทย",
    motherBreed: "Pomeranian เกรดโชว์"
  },
  {
    id: "corgi-02",
    name: "น้องคอร์กี้ขาขด (Peanut)",
    breed: "Welsh Corgi",
    breedTh: "เวลช์ คอร์กี้",
    price: 25000,
    gender: "male",
    age: "3 เดือน",
    color: "สามสี (Tricolor)",
    vaccinated: "ฉีดวัคซีนครบ 2 เข็ม",
    microchip: "มีไมโครชิปแท้",
    pedigree: "ใบเพ็ดสมาคมเต็มใบ",
    images: [
      "https://images.unsplash.com/photo-1612536057832-2ff7ead7819c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    audioBark: "boof_bark",
    customAudioUrl: "",
    description: "น้องพีนัท คอร์กี้เพศผู้ ขาสั้น ดูก้นดุ๊กดิ๊ก หน้าตาฉลาด อารมณ์ดี ร่าเริง ชอบวิ่งเล่นในสนามหญ้า ฝึกขับถ่ายบนแผ่นรองได้แล้ว",
    fatherBreed: "Pembroke Corgi Import",
    motherBreed: "Pembroke Corgi TH CH"
  },
  {
    id: "frenchie-03",
    name: "น้องเฟรนช์บลูด็อก (Boba)",
    breed: "French Bulldog",
    breedTh: "เฟรนช์ บูลด็อก",
    price: 22000,
    gender: "male",
    age: "2 เดือน",
    color: "ลายเสือ (Brindle)",
    vaccinated: "ฉีดวัคซีนแล้ว 1 เข็ม",
    microchip: "มีไมโครชิปแท้",
    pedigree: "ใบเพ็ดสมาคมฯ",
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    audioBark: "cute_snort",
    customAudioUrl: "",
    description: "น้องโบบา เฟรนช์บูลด็อกโครงสร้างสวย โครงใหญ่ หน้าสั้นย่นน่ารัก ขี้ประจบ เงียบสงบ ไม่เห่าพร่ำเพรื่อ เหมาะเลี้ยงในคอนโด",
    fatherBreed: "Frenchie Champion Line",
    motherBreed: "Frenchie Standard Line"
  },
  {
    id: "golden-04",
    name: "น้องโกลเด้นยิ้มหวาน (Cookie)",
    breed: "Golden Retriever",
    breedTh: "โกลเด้น รีทรีฟเวอร์",
    price: 19500,
    gender: "female",
    age: "2.5 เดือน",
    color: "ทองสว่าง (Light Golden)",
    vaccinated: "ฉีดวัคซีน 2 เข็ม + ถ่ายพยาธิ",
    microchip: "มีไมโครชิปแท้",
    pedigree: "ใบเพ็ดสมาคมฯ 4 เจน",
    images: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    audioBark: "happy_bark",
    customAudioUrl: "",
    description: "น้องคุกกี้ โกลเด้นตัวน้อย นิสัยใจดี เป็นมิตรกับทุกคนและเด็กๆ ขนหนาเงางาม ชอบเล่นคาบของ ร่าเริงแจ่มใสที่สุด",
    fatherBreed: "Golden Retriever Grand Champion",
    motherBreed: "Golden Retriever High Bloodline"
  },
  {
    id: "poodle-05",
    name: "น้องพุดเดิ้ลทอย (Teddy)",
    breed: "Poodle Toy",
    breedTh: "พุดเดิ้ล ทอย",
    price: 15000,
    gender: "male",
    age: "2 เดือน",
    color: "น้ำตาลแดง (Red Brown)",
    vaccinated: "ฉีดวัคซีนแล้ว 1 เข็ม",
    microchip: "มีไมโครชิปแท้",
    pedigree: "ใบเพ็ดสมาคมฯ",
    images: [
      "https://images.unsplash.com/photo-1591769225440-811ad7d6eca2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    audioBark: "playful_yap",
    customAudioUrl: "",
    description: "น้องเทดดี้ พุดเดิ้ลทอยเหมือนตุ๊กตาหมี ขนหยิกนุ่ม ขนไม่ร่วง เหมาะสำหรับคนแพ้ขนสัตว์ ฉลาดเรียนรู้ไว ฝึกง่าย",
    fatherBreed: "Poodle Toy Red Line",
    motherBreed: "Poodle Toy Red Line"
  },
  {
    id: "shiba-06",
    name: "น้องชิบะอินุญี่ปุ่น (Kenji)",
    breed: "Shiba Inu",
    breedTh: "ชิบะ อินุ",
    price: 29000,
    gender: "male",
    age: "3 เดือน",
    color: "แดงส้ม (Akame Red)",
    vaccinated: "ฉีดวัคซีนครบ 2 เข็ม",
    microchip: "มีไมโครชิปแท้ ฝังชิปสากล",
    pedigree: "ใบเพ็ดสมาคมสุนัขแห่งประเทศไทย",
    images: [
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    audioBark: "boof_bark",
    customAudioUrl: "",
    description: "น้องเคนจิ ชิบะอินุสายเลือดญี่ปุ่นแท้ หน้าสุ่มยิ้ม ยิ้มเก่ง สะอาด เป็นระเบียบ รักความสะอาด หน้าตามีเสน่ห์ดึงดูดใจ",
    fatherBreed: "Shiba Inu Japan Import",
    motherBreed: "Shiba Inu Champion Line"
  }
];

// Async Fetch method for data/dogs.json file
window.fetchDogsJSON = async function() {
  try {
    const response = await fetch(JSON_FILE_PATH);
    if (!response.ok) throw new Error('HTTP error ' + response.status);
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn("Could not fetch data/dogs.json file directly, using fallback:", err);
    return FALLBACK_DOGS_DATA;
  }
};

// Database Handler Functions
window.loadDogsDatabase = function() {
  try {
    const stored = localStorage.getItem(DB_KEY) || localStorage.getItem('pawparadise_dogs_db');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Error reading localStorage database:", e);
  }
  // Default fallback
  window.saveDogsDatabase(FALLBACK_DOGS_DATA);
  return FALLBACK_DOGS_DATA;
};

window.saveDogsDatabase = function(dogsArray) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(dogsArray));
    window.DOGS_DATA = dogsArray;
  } catch (e) {
    console.error("Error saving to localStorage database:", e);
  }
};

window.resetDogsDatabase = async function() {
  const json = await window.fetchDogsJSON();
  window.saveDogsDatabase(json);
  return json;
};

// Global export initialization
window.DOGS_DATA = window.loadDogsDatabase();
var DOGS_DATA = window.DOGS_DATA;
