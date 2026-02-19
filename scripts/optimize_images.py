"""
สคริปต์สำหรับลดขนาดไฟล์รูปภาพ
รองรับ: JPG, JPEG, PNG, WEBP
"""
from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Optional

try:
    from PIL import Image
except ImportError:
    print("❌ ต้องติดตั้ง Pillow ก่อน: pip install Pillow")
    sys.exit(1)

WORKSPACE_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_IMAGES_DIR = WORKSPACE_ROOT / "public" / "images"
BACKUP_DIR = WORKSPACE_ROOT / "public" / "images_backup"

# การตั้งค่า
MAX_WIDTH = 1920  # ความกว้างสูงสุด (px) - สำหรับ mobile ใช้ 1920 ก็พอ
QUALITY_JPEG = 85  # คุณภาพ JPEG (1-100, ยิ่งสูงไฟล์ยิ่งใหญ่)
QUALITY_WEBP = 85  # คุณภาพ WebP
PNG_COMPRESSION = 6  # การบีบอัด PNG (0-9, ยิ่งสูงบีบอัดมาก)


def optimize_image(input_path: Path, output_path: Path, max_width: int = MAX_WIDTH) -> bool:
    """Optimize รูปภาพเดียว"""
    try:
        with Image.open(input_path) as img:
            # แปลง RGBA เป็น RGB สำหรับ JPEG (ถ้าเป็น PNG ที่มี transparency)
            if img.mode in ("RGBA", "LA", "P"):
                # สร้างพื้นหลังขาว
                background = Image.new("RGB", img.size, (255, 255, 255))
                if img.mode == "P":
                    img = img.convert("RGBA")
                background.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
                img = background
            elif img.mode != "RGB":
                img = img.convert("RGB")

            # Resize ถ้าใหญ่เกิน
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

            # บันทึกตามนามสกุล
            ext = input_path.suffix.lower()
            if ext in (".jpg", ".jpeg"):
                img.save(output_path, "JPEG", quality=QUALITY_JPEG, optimize=True)
            elif ext == ".png":
                img.save(output_path, "PNG", optimize=True, compress_level=PNG_COMPRESSION)
            elif ext == ".webp":
                img.save(output_path, "WEBP", quality=QUALITY_WEBP, method=6)
            else:
                print(f"⚠️  ไม่รองรับไฟล์: {input_path.name}")
                return False

            return True
    except Exception as e:
        print(f"❌ Error processing {input_path.name}: {e}")
        return False


def get_file_size_mb(path: Path) -> float:
    """คำนวณขนาดไฟล์เป็น MB"""
    return path.stat().st_size / (1024 * 1024)


def main() -> int:
    if not PUBLIC_IMAGES_DIR.exists():
        print(f"❌ ไม่พบโฟลเดอร์: {PUBLIC_IMAGES_DIR}")
        return 1

    # สร้าง backup
    print("📦 สร้าง backup รูปภาพเดิม...")
    if BACKUP_DIR.exists():
        import shutil
        shutil.rmtree(BACKUP_DIR)
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    # Copy ทั้งหมดไป backup
    for category_dir in PUBLIC_IMAGES_DIR.iterdir():
        if not category_dir.is_dir():
            continue
        backup_cat_dir = BACKUP_DIR / category_dir.name
        backup_cat_dir.mkdir(exist_ok=True)
        for img_file in category_dir.iterdir():
            if img_file.is_file() and img_file.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"):
                import shutil
                shutil.copy2(img_file, backup_cat_dir / img_file.name)

    print(f"✅ Backup ไว้ที่: {BACKUP_DIR}\n")

    # Optimize รูปภาพ
    total_files = 0
    success_count = 0
    total_original_size = 0
    total_optimized_size = 0

    print(f"🖼️  เริ่ม optimize รูปภาพ (max width: {MAX_WIDTH}px)...\n")

    for category_dir in PUBLIC_IMAGES_DIR.iterdir():
        if not category_dir.is_dir():
            continue

        print(f"📁 Processing: {category_dir.name}/")
        category_count = 0

        for img_file in sorted(category_dir.iterdir()):
            if not img_file.is_file():
                continue
            if img_file.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
                continue

            total_files += 1
            category_count += 1

            original_size = get_file_size_mb(img_file)
            total_original_size += original_size

            # Optimize (เขียนทับไฟล์เดิม)
            if optimize_image(img_file, img_file, MAX_WIDTH):
                optimized_size = get_file_size_mb(img_file)
                total_optimized_size += optimized_size
                success_count += 1

                saved = original_size - optimized_size
                saved_percent = (saved / original_size * 100) if original_size > 0 else 0

                if saved_percent > 5:  # แสดงเฉพาะที่ลดได้มากกว่า 5%
                    print(
                        f"  ✓ {img_file.name:30s} "
                        f"{original_size:6.2f}MB → {optimized_size:6.2f}MB "
                        f"(-{saved_percent:.1f}%)"
                    )

        if category_count > 0:
            print(f"  ✅ Processed {category_count} images\n")

    # สรุปผล
    print("=" * 60)
    print("📊 สรุปผลการ Optimize")
    print("=" * 60)
    print(f"จำนวนไฟล์ทั้งหมด: {total_files}")
    print(f"สำเร็จ: {success_count}")
    print(f"ขนาดเดิมรวม: {total_original_size:.2f} MB")
    print(f"ขนาดใหม่รวม: {total_optimized_size:.2f} MB")
    if total_original_size > 0:
        saved_total = total_original_size - total_optimized_size
        saved_percent = (saved_total / total_original_size * 100)
        print(f"ประหยัด: {saved_total:.2f} MB ({saved_percent:.1f}%)")
    print("=" * 60)
    print(f"\n💾 Backup ไฟล์เดิมไว้ที่: {BACKUP_DIR}")
    print("   ถ้าต้องการคืนค่า ให้ copy ไฟล์จาก backup กลับมา\n")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
