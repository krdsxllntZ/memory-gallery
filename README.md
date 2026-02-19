# 📸 Memory Gallery

เว็บแอปพลิเคชันแกลเลอรีภาพความทรงจำที่สร้างด้วย React + Vite + Tailwind CSS

## ✨ Features

- 🖼️ แสดงรูปภาพจาก 5 หมวดหมู่: CH (Childhood), MT (ม.ต้น), M4, M5, M6
- 🔍 ค้นหารูปภาพด้วยรหัส (เช่น M4_070)
- 📱 Mobile-first design (รองรับทุกอุปกรณ์)
- 🎨 สีธีมข้าว + accent สีชมพู/ฟ้า/เหลือง
- ⚡ Fast loading ด้วย lazy loading และ image optimization

## 🚀 Quick Start

### ติดตั้ง Dependencies

```bash
npm install
```

### รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`

### Build สำหรับ Production

```bash
npm run build
```

---

## 📚 คู่มือเพิ่มเติม

- **[IMAGE_OPTIMIZATION_GUIDE.md](./IMAGE_OPTIMIZATION_GUIDE.md)** - วิธีลดขนาดไฟล์รูปภาพ
- **[GITHUB_GUIDE.md](./GITHUB_GUIDE.md)** - วิธี push โปรเจกต์ขึ้น GitHub
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - วิธี deploy ขึ้น Vercel
- **[EDIT_TEXT_GUIDE.md](./EDIT_TEXT_GUIDE.md)** - ตำแหน่งที่แก้ไขข้อความต่างๆ

---

## 🛠️ Scripts ที่มีให้

### Generate imagesData.ts อัตโนมัติ

```bash
python scripts/generate_images_data.py
```

สคริปต์จะสแกนรูปภาพใน `public/images/` และสร้างไฟล์ `src/data/imagesData.ts` อัตโนมัติ

### Optimize รูปภาพ (ลดขนาดไฟล์)

```bash
# ติดตั้ง Pillow ก่อน (ครั้งเดียว)
pip install Pillow

# รัน optimize
python scripts/optimize_images.py
```

สคริปต์จะ:
- สร้าง backup รูปภาพเดิมไว้ที่ `public/images_backup/`
- ลดขนาดรูปภาพทั้งหมด (resize + compress)
- แสดงสรุปผลการลดขนาด

---

## 📁 โครงสร้างโปรเจกต์

```
memory-gallery/
├── public/
│   └── images/          # รูปภาพทั้งหมด (CH, MT, M4, M5, M6)
├── src/
│   ├── data/
│   │   └── imagesData.ts # ข้อมูลรูปภาพ (auto-generated)
│   ├── App.tsx           # Component หลัก
│   └── main.tsx          # Entry point
├── scripts/
│   ├── generate_images_data.py  # Generate imagesData.ts
│   └── optimize_images.py      # Optimize รูปภาพ
└── vercel.json           # Vercel deployment config
```

---

## 🎨 Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Vercel** - Hosting

---

## 📝 License

Private project

---

## 👤 Author

สร้างด้วย ❤️ สำหรับเก็บความทรงจำ
