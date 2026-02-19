# 📤 คู่มือ Push โปรเจกต์ขึ้น GitHub

คู่มือนี้จะสอนวิธี push โปรเจกต์ `memory-gallery` ขึ้น GitHub เพื่อ deploy บน Vercel

---

## 📋 สิ่งที่ต้องมีก่อนเริ่ม

1. **GitHub Account** - สร้างได้ที่ [github.com](https://github.com)
2. **Git** - ติดตั้งแล้ว (ถ้ายังไม่มี ดาวน์โหลดที่ [git-scm.com](https://git-scm.com))

---

## 🚀 ขั้นตอนการ Push ขึ้น GitHub

### 1. สร้าง Repository บน GitHub

1. เข้า [github.com](https://github.com) แล้ว Sign in
2. กด **+** (มุมบนขวา) → **New repository**
3. ตั้งชื่อ repository เช่น `memory-gallery`
4. เลือก **Public** หรือ **Private** (ตามต้องการ)
5. **อย่า** check "Add a README file" (เพราะเรามีโค้ดอยู่แล้ว)
6. กด **Create repository**

---

### 2. เปิด Terminal ในโฟลเดอร์โปรเจกต์

เปิด PowerShell หรือ Command Prompt แล้วเข้าโฟลเดอร์:

```bash
cd d:\M6\memory-gallery
```

---

### 3. Initialize Git (ถ้ายังไม่มี)

```bash
git init
```

---

### 4. สร้างไฟล์ .gitignore (ถ้ายังไม่มี)

สร้างไฟล์ `.gitignore` เพื่อไม่ให้ push ไฟล์ที่ไม่จำเป็น:

```bash
# สร้างไฟล์ .gitignore
echo node_modules/ > .gitignore
echo dist/ >> .gitignore
echo .vite/ >> .gitignore
echo .DS_Store >> .gitignore
echo *.log >> .gitignore
```

หรือสร้างไฟล์ `.gitignore` ด้วยมือ แล้วใส่:

```
node_modules/
dist/
.vite/
.DS_Store
*.log
.env.local
.env.*.local
```

---

### 5. Add ไฟล์ทั้งหมด

```bash
git add .
```

---

### 6. Commit ครั้งแรก

```bash
git commit -m "Initial commit: Memory Gallery project"
```

---

### 7. เชื่อมต่อกับ GitHub Repository

**แทนที่ `YOUR_USERNAME` และ `YOUR_REPO_NAME` ด้วยชื่อจริงของคุณ**

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

ตัวอย่าง:
```bash
git remote add origin https://github.com/john/memory-gallery.git
```

---

### 8. Push ขึ้น GitHub

```bash
git branch -M main
git push -u origin main
```

**ครั้งแรกจะถาม username และ password:**
- **Username**: ชื่อ GitHub ของคุณ
- **Password**: ใช้ **Personal Access Token** (ไม่ใช่ password จริง)
  - สร้างได้ที่: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - กด **Generate new token (classic)**
  - Check `repo` (full control)
  - Copy token มาใช้แทน password

---

## 🔄 อัปเดตโค้ด (Push ครั้งถัดไป)

เมื่อแก้ไขโค้ดเสร็จแล้ว:

```bash
# 1. ดูว่ามีไฟล์อะไรเปลี่ยนบ้าง
git status

# 2. Add ไฟล์ที่แก้ไข
git add .

# 3. Commit พร้อมข้อความอธิบาย
git commit -m "แก้ไข: เพิ่มฟีเจอร์ใหม่"

# 4. Push ขึ้น GitHub
git push
```

---

## ⚠️ หมายเหตุสำคัญ

### ไฟล์ที่ควร ignore

- `node_modules/` - ไม่ต้อง push (ใหญ่เกินไป)
- `dist/` - Vercel จะ build เอง
- `.vite/` - cache files
- `images_backup/` - backup รูปภาพ (ถ้ามี)

### ไฟล์ที่ต้อง push

- `src/` - โค้ดทั้งหมด
- `public/images/` - รูปภาพ (แต่ควร optimize ก่อน)
- `package.json` - dependencies
- `tailwind.config.js`, `tsconfig.json` - config files
- `vercel.json` - Vercel config

---

## 🐛 แก้ปัญหา

### ถ้า push ไม่ได้ (authentication failed)

1. ใช้ **Personal Access Token** แทน password
2. หรือใช้ **GitHub Desktop** (GUI) แทน command line

### ถ้า repository มีไฟล์อยู่แล้ว

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### ถ้าลืม .gitignore และ push node_modules ไปแล้ว

```bash
# ลบ node_modules ออกจาก git (แต่ยังเก็บไฟล์ไว้)
git rm -r --cached node_modules
git commit -m "Remove node_modules from git"
git push
```

---

## 📚 เรียนรู้เพิ่มเติม

- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [GitHub Docs](https://docs.github.com/en/get-started)
