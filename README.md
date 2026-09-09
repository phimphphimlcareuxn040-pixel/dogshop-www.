# 🐾 FonParadise Shop — Pink & Blue Responsive Dog Selling Web Application

เว็บไซต์จำหน่ายสุนัขพันธุ์แท้ **Fon Paradise** พัฒนาด้วย **HTML5, CSS3, JavaScript (ES6+)** พร้อมระบบสภาพอากาศเรียลไทม์, ระบบ Overlay มัลติมีเดีย, ปุ่มเล่นเพลงบรรเลงพื้นหลัง, ระบบผู้ดูแลระบบ (Admin Zone) และเซิร์ฟเวอร์อัปโหลดไฟล์ตรงลงฮาร์ดดิสก์

---

## 🚀 วิธีเปิดใช้งานเพียง 1-Click (One-Click Launchers)

คุณสามารถเปิดใช้งานเว็บและเซิร์ฟเวอร์อัปโหลดได้ง่ายๆ เพียงดับเบิลคลิกไฟล์ในโฟลเดอร์โปรเจกต์:

1. **`start_server.bat`** (ดับเบิลคลิกเปิดหน้าแรก):
   - เปิดเซิร์ฟเวอร์ Python อัตโนมัติที่ `http://localhost:8000/`
   - เด้งเปิดหน้าเว็บแรกใน Web Browser ให้อัตโนมัติ

2. **`start_admin.bat`** (ดับเบิลคลิกเปิดหน้าผู้ดูแลระบบ):
   - เปิดเซิร์ฟเวอร์และเด้งเข้าสู่หน้า **Admin Zone** (`http://localhost:8000/admin.html`) ทันที

---

## 📁 โครงสร้างโปรเจกต์ (Project Directory)

```text
d:/DevNew/py/docshop/
├── start_server.bat     # 🚀 สคริปต์ ดับเบิลคลิกรันเซิร์ฟเวอร์ + เปิดหน้าแรกอัตโนมัติ
├── start_admin.bat      # ⚙️ สคริปต์ ดับเบิลคลิกรันเซิร์ฟเวอร์ + เปิดหน้า Admin อัตโนมัติ
├── server.py            # 🐍 Python Server (จัดการอัปโหลดไฟล์ตรงลงดิสก์ & JSON DB)
├── index.html           # 🏠 หน้าแรก (สภาพอากาศเรียลไทม์ & ไฮไลท์น้องหมา)
├── dogs.html            # 🐕 หน้าคลังสุนัขทั้งหมด (ค้นหา & กรองสายพันธุ์)
├── dog-detail.html      # 📋 หน้ารายละเอียดสุนัขรายตัว (เพ็ดดีกรี & ฟอร์มจอง)
├── gallery.html         # 🎥 คลังมัลติมีเดีย & Live Dog API
├── care.html            # 💊 คู่มือดูแล & เครื่องคำนวณอากาศ
├── contact.html         # 📞 ติดต่อเรา & แผนที่ Overlay
├── admin.html           # ⚙️ หน้าผู้ดูแลระบบ (CRUD + อัปโหลดสื่อ + JSON DB)
├── data/
│   └── dogs.json        # 📄 ฐานข้อมูลสุนัขหลักแบบ JSON
├── css/
│   └── style.css        # 🎨 สไตล์ชีตธีมสีชมพู-น้ำเงินสดใส (Responsive)
├── js/
│   ├── app.js           # ⚡ สคริปต์หลัก (Overlays, สภาพอากาศ, เครื่องเล่นเพลง)
│   ├── admin.js         # 🛠️ สคริปต์หน้า Admin (CRUD & Upload Handlers)
│   ├── weather.js       # 🌤️ ระบบนาฬิกาเรียลไทม์ & อัปเดตสภาพอากาศ
│   └── data.js          # 💾 ตัวจัดการฐานข้อมูล JSON & LocalStorage
└── uploads/
    ├── images/          # 🖼️ โฟลเดอร์เก็บบันทึกไฟล์รูปภาพที่อัปโหลด
    ├── audio/           # 🔊 โฟลเดอร์เก็บบันทึกไฟล์เสียงที่อัปโหลด
    └── video/           # 🎥 โฟลเดอร์เก็บบันทึกไฟล์วิดีโอที่อัปโหลด
```

---

## 🌟 ฟีเจอร์เด่นในระบบ

1. **🎨 Vibrant Pink & Blue Theme**: ตกแต่งด้วยโทนสีชมพู-น้ำเงินสดใส รองรับการแสดงผลทุกหน้าจอ (Responsive Breakpoints)
2. **🌤️ Real-time Weather Widget**: อัปเดตเวลาเรียลไทม์วินาทีต่อวินาที พร้อมสภาพอากาศ อุณหภูมิ และความชื้นสด
3. **🖼️ 🎥 🔊 🌐 Interactive Overlays (5 รูปแบบ)**:
   - **🎵 Floating Ambient Music**: ปุ่มเล่นเพลงบรรเลงมุมขวาล่างเปิด/ปิดได้
   - **🖼️ Lightbox Image**: ป๊อปอัปขยายรูปความละเอียดสูง
   - **🎥 Video Overlay**: รองรับทั้งไฟล์วิดีโอ MP4 และ **แปะลิงก์ YouTube (Watch / Shorts / Embed)**
   - **🔊 Audio Sound Overlay**: รองรับทั้งไฟล์เสียงอัปโหลดจริง และ Web Audio Bark Synth พร้อมปุ่มกดเล่น/หยุดเสียง
   - **🌐 Live Dog API Overlay**: เชื่อมต่อ Dog.ceo API สุ่มพันธุ์สุนัขสดๆ
4. **⚙️ Admin Zone & Hard Disk Uploads**:
   - เพิ่ม แก้ไข ลบ ข้อมูลสุนัข
   - อัปโหลดไฟล์รูปภาพ เสียง วิดีโอ **ลงโฟลเดอร์ `uploads/` บนฮาร์ดดิสก์จริง (เมื่อรันบน Local Server)** หรือใช้ Base64 Data URL อัตโนมัติเมื่อรันบน **GitHub Pages**
   - ส่งออก (Export) และนำเข้า (Import) ไฟล์ฐานข้อมูล JSON

---

## 🌐 การนำไปขึ้น GitHub Pages (Static Web Hosting)

โปรเจกต์นี้ได้รับการปรับแต่งให้รองรับการทำงานเป็น **Static Website 100%** บน **GitHub Pages** ได้ทันทีโดยไม่ต้องใช้ Backend Server:

### 🛠️ ขั้นตอนการ Deploy ขึ้น GitHub Pages:
1. **สร้าง Git Repository**:
   ```bash
   git init
   git add .
   git commit -m "Deploy Fon Paradise to GitHub Pages"
   ```
2. **สร้าง Repository บน GitHub** แล้วกด Push โค้ดขึ้นไป:
   ```bash
   git remote add origin https://github.com/USERNAME/REPOSITORY_NAME.git
   git branch -M main
   git push -u origin main
   ```
3. **เปิดใช้งาน GitHub Pages**:
   - ไปที่หน้า **Settings** ใน Repository ของคุณบน GitHub
   - เลือกเมนู **Pages** (ทางซ้ายมือ)
   - ในหัวข้อ **Build and deployment -> Source** ให้เลือก **Deploy from a branch**
   - ในช่อง **Branch** ให้เลือก `main` / `root` แล้วกด **Save**
4. **เข้าใช้งานเว็บ**:
   - รอ 1-2 นาที เว็บของคุณจะพร้อมใช้งานสดบนอินเทอร์เน็ตที่ URL:  
     `https://<username>.github.io/<repository-name>/`

### 💡 หมายเหตุสำหรับการทำงานบน GitHub Pages:
- **`data/dogs.json`**: ถูกดึงผ่าน Static HTTP Fetch อัตโนมัติ
- **`.nojekyll`**: มีไฟล์ `.nojekyll` ในโปรเจกต์เพื่อป้องกัน GitHub Pages ข้ามโฟลเดอร์สื่อ
- **`404.html`**: มีหน้า 404 Custom Fon Paradise สำหรับจัดการ Route
- **ระบบ Admin บน GitHub Pages**: การเพิ่ม/แก้ไขข้อมูลจะถูกบันทึกไว้ใน Browser `localStorage` (หากต้องการอัปเดตไฟล์ `data/dogs.json` ถาวร ให้กดปุ่ม **"ส่งออก JSON"** ในหน้า Admin แล้วนำไฟล์มาวางทับใน GitHub Repository)

