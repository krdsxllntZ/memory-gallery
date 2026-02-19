import { useMemo, useState } from "react"
import { imagesData, type GalleryImage, type ImageCategory } from "./data/imagesData"

type ActivePage = "gallery" | "search" | "contact"

const CATEGORIES: { key: "ALL" | ImageCategory; label: string }[] = [
  { key: "ALL", label: "ทั้งหมด" },
  { key: "CH", label: "Childhood (CH)" },
  { key: "MT", label: "ม.ต้น (MT)" },
  { key: "M4", label: "ม. 4 (M4)" },
  { key: "M5", label: "ม. 5 (M5)" },
  { key: "M6", label: "ม. 6 (M6)" },
]

function shuffleAndPick<T>(items: T[], maxCount = 300): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, Math.min(maxCount, arr.length))
}

function App() {
  const [activePage, setActivePage] = useState<ActivePage>("gallery")
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<"ALL" | ImageCategory>("ALL")

  const randomImages = useMemo(() => shuffleAndPick(imagesData, 300), [])
  // Hero image สำหรับหน้า Gallery (เฉพาะหน้า main)
  const mainHeroImage = imagesData.find((img) => img.label === "M6_001") ?? null

  const filteredImages = useMemo(() => {
    const term = searchTerm.trim().toUpperCase()

    return imagesData.filter((img) => {
      const matchCategory = activeCategory === "ALL" ? true : img.category === activeCategory
      const matchSearch = term ? img.label.toUpperCase().includes(term) : true
      return matchCategory && matchSearch
    })
  }, [searchTerm, activeCategory])

  function handleDownload(image: GalleryImage) {
    const link = document.createElement("a")
    link.href = image.src
    link.download = image.label || "image"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-rice-100 text-ink-800 flex flex-col">
      <header className="border-b border-rice-300 bg-rice-50/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              {/* แก้ข้อความ "Photo Archive" ได้ที่บรรทัดนี้ */}
              <span className="text-xs uppercase tracking-[0.25em] text-ink-500">ปัจฉิมนิเทศ 2569</span>
              <h1 className="text-lg font-semibold text-ink-900">KKW 128 โรงละครแห่งวัยเรียน</h1>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActivePage("gallery")}
              className={`px-3 py-1.5 rounded-full transition text-[11px] font-medium ${
                activePage === "gallery"
                  ? "bg-accent-sky text-ink-900 shadow-sm"
                  : "bg-rice-200 text-ink-600 hover:text-ink-900 hover:bg-rice-300"
              }`}
            >
              หน้า 1: แกลเลอรี
            </button>
            <button
              type="button"
              onClick={() => setActivePage("search")}
              className={`px-3 py-1.5 rounded-full transition text-[11px] font-medium ${
                activePage === "search"
                  ? "bg-accent-pink text-white shadow-sm"
                  : "bg-rice-200 text-ink-600 hover:text-ink-900 hover:bg-rice-300"
              }`}
            >
              หน้า 2: ค้นหา
            </button>
            <button
              type="button"
              onClick={() => setActivePage("contact")}
              className={`px-3 py-1.5 rounded-full transition text-[11px] font-medium ${
                activePage === "contact"
                  ? "bg-accent-yellow text-ink-900 shadow-sm"
                  : "bg-rice-200 text-ink-600 hover:text-ink-900 hover:bg-rice-300"
              }`}
            >
              ติดต่อ
            </button>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfHkX1zGcVVzEEvVQdbKI0zwwQmJ6c4Wlh3MfdjjqN2QRJtNw/viewform?usp=publish-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full transition text-[11px] font-medium bg-rice-200 text-ink-600 hover:text-ink-900 hover:bg-rice-300 flex items-center gap-1.5"
            >
              <span>บอกรูปที่คุณชอบให้ผมหน่อยสิ</span>
              <span>🥰</span>
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-4 pb-24">
          {activePage === "gallery" ? (
            <GalleryPage mainHeroImage={mainHeroImage} randomImages={randomImages} onOpenImage={setSelectedImage} />
          ) : activePage === "search" ? (
            <SearchPage
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              filteredImages={filteredImages}
              onOpenImage={setSelectedImage}
            />
          ) : (
            <ContactPage heroImage={mainHeroImage} />
          )}
        </div>
      </main>

      {selectedImage && (
        <FullImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  )
}

interface GalleryPageProps {
  mainHeroImage: GalleryImage | null
  randomImages: GalleryImage[]
  onOpenImage: (image: GalleryImage) => void
}

function GalleryPage({ mainHeroImage, randomImages, onOpenImage }: GalleryPageProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-rice-50 via-rice-100 to-rice-200 border border-rice-300 shadow-soft">
        <div className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:p-6">
          <div className="flex-1 space-y-2">
            <p className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-ink-700 border border-rice-300">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow animate-pulse" />
              คาบบ่ายรอบนี้ไม่เจอกันแล้วนะ
            </p>
            {/* แก้ข้อความ Hero section ได้ที่บรรทัดนี้ (รวม Childhood... ไว้ในที่เดียว) */}
            <h2 className="text-2xl font-semibold leading-snug text-ink-900">
              รวมรูปภาพของนายตุลชาติ ดีบ้างเกรียนบ้างปะปนกันไป พอให้ได้คิดถึงกัน{" "}
              {/*<span className="text-ink-900 underline decoration-accent-pink/60 decoration-4 underline-offset-4">
                Childhood – ม.ต้น – ม.4 – ม.5 – ม.6
              </span>{" "}
              ไว้ในที่เดียว*/}
            </h2>
            {/* แก้ข้อความคำอธิบายได้ที่บรรทัดนี้ 
            <p className="text-sm leading-relaxed text-ink-700">
              เลื่อนลงเพื่อดูภาพแบบสุ่มจากทุกช่วงเวลาในชีวิตนักเรียน แตะที่รูปเพื่อขยายเต็มจอและดูโค้ดรูปภาพ
            </p>
            */}
            {/* แก้ข้อความหมายเหตุได้ที่บรรทัดนี้ */}
            <p className="text-[11px] text-ink-500">
              * เว็บไซต์นี้เริ่มทำตอนเที่ยงคืนวันปัจฉิม💀💀💀
            </p>
          </div>

          {mainHeroImage && (
            <div className="w-full flex justify-center">
              <button
                type="button"
                onClick={() => onOpenImage(mainHeroImage)}
                className="relative group w-full max-w-md sm:max-w-lg md:max-w-xl rounded-3xl overflow-hidden border-2 border-rice-300 shadow-soft bg-white"
              >
                <img
                  src={mainHeroImage.src}
                  alt={mainHeroImage.label}
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-ink-900/10 to-transparent opacity-90" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-sm text-white">
                  <span className="font-semibold bg-black/50 px-3 py-1.5 rounded-full">{mainHeroImage.label}</span>
                  <span className="bg-accent-sky px-3 py-1.5 rounded-full text-xs font-semibold shadow">แตะเพื่อขยาย</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-900">
            ภาพสุ่มจากทั้งหมด ({randomImages.length} ภาพ)
          </h3>
          <p className="text-[11px] text-ink-500">แตะรูปเพื่อดูแบบเต็มจอ</p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {randomImages.map((img) => (
            <button
              type="button"
              key={img.id}
              onClick={() => onOpenImage(img)}
              className="group flex flex-col gap-1"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl border border-rice-300 bg-white shadow-soft">
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] font-medium text-ink-700 truncate text-left">{img.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

interface SearchPageProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  activeCategory: "ALL" | ImageCategory
  setActiveCategory: (value: "ALL" | ImageCategory) => void
  filteredImages: GalleryImage[]
  onOpenImage: (image: GalleryImage) => void
}

function SearchPage({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  filteredImages,
  onOpenImage,
}: SearchPageProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink-900">ค้นหาจากรหัสรูปภาพ</label>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ใส่โค้ดรูป เช่น M4_070"
              className="w-full rounded-2xl bg-white border border-rice-300 px-3 py-2 text-sm text-ink-900
                         placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-sky focus:border-transparent shadow-soft"
            />
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink-400">
              <span className="text-[11px] uppercase">Search</span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-ink-500">
          พิมพ์บางส่วนก็ได้ เช่น{" "}
          <code className="font-mono bg-rice-200 px-1 rounded border border-rice-300">M4_0</code>{" "}
          เพื่อหา M4 ทั้งหมดที่ขึ้นต้นด้วย 0
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-ink-900">เลือกช่วงชั้น / หมวดหมู่</h3>
        <div className="grid grid-cols-3 gap-2 text-[11px] sm:flex sm:flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex-1 min-w-[90px] rounded-2xl border px-2.5 py-1.5 font-medium transition
              ${
                activeCategory === cat.key
                  ? "bg-accent-yellow border-rice-300 text-ink-900 shadow-soft"
                  : "bg-white border-rice-300 text-ink-800 hover:border-accent-sky/60 hover:text-ink-900 shadow-soft"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-ink-500">
        <span>พบภาพทั้งหมด {filteredImages.length} ภาพ</span>
        <span>แตะรูปเพื่อดูแบบเต็มจอ</span>
      </div>

      {filteredImages.length === 0 ? (
        <p className="text-sm text-ink-500 italic">ยังไม่พบรูปที่ตรงกับการค้นหา</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {filteredImages.map((img) => (
            <button
              type="button"
              key={img.id}
              onClick={() => onOpenImage(img)}
              className="group flex flex-col gap-1"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl border border-rice-300 bg-white shadow-soft">
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] font-medium text-ink-700 truncate text-left">{img.label}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

interface FullImageModalProps {
  image: GalleryImage
  onClose: () => void
  onDownload?: (image: GalleryImage) => void
}

function FullImageModal({ image, onClose, onDownload }: FullImageModalProps) {
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  function handleDownload() {
    if (onDownload) {
      onDownload(image)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={handleBackdropClick}
    >
      <div className="max-w-md w-full space-y-3 relative">
        <div className="aspect-[3/4] w-full rounded-3xl overflow-hidden border border-rice-300 bg-white shadow-soft">
          <img src={image.src} alt={image.label} className="w-full h-full object-contain bg-white" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="font-semibold bg-white/95 text-ink-900 px-3 py-1.5 rounded-full border border-rice-300 text-xs">
              {image.label}
            </span>
            <span className="text-white/90 text-xs bg-black/30 px-2 py-1 rounded-full">{image.category}</span>
          </div>
          <div className="flex gap-2">
            {onDownload && (
              <button
                type="button"
                onClick={handleDownload}
                className="rounded-full bg-accent-pink text-white px-4 py-1.5 text-xs font-semibold shadow-soft hover:bg-accent-pink/90 transition-colors"
              >
                ดาวน์โหลด
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/95 border border-rice-300 px-4 py-1.5 text-xs text-ink-900 shadow-soft hover:bg-rice-50 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ContactPageProps {
  heroImage: GalleryImage | null
}

function ContactPage({ heroImage }: ContactPageProps) {
  const contactImage = heroImage // M6_109

  return (
    <section className="space-y-6">
      {contactImage && (
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl rounded-3xl overflow-hidden border-2 border-rice-300 shadow-soft bg-white">
            <img
              src={contactImage.src}
              alt={contactImage.label}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      )}

      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-semibold text-ink-900">CONTACTS</h2>
        <p className="text-sm text-ink-700">นายตุลชาติ โมลีวิศิลา ม.6/1 KKW 128 <br></br> ผู้แทนศูนย์ฯ สอวน.คอมพิวเตอร์ 2568<br></br> วิศวกรรมคอมพิวเตอร์ จุฬาลงกรณ์มหาวิทยาลัย</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-2xl mx-auto">
        <a
          href="https://web.facebook.com/tombstone.piledriver.180"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-rice-300 shadow-soft hover:bg-rice-50 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-xl font-bold">
            f
          </div>
          <span className="text-xs font-medium text-ink-900 text-center">ตุลชาติ โมลีวิศิลา</span>
        </a>

        <a
          href="https://www.instagram.com/krdsxllnt/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-rice-300 shadow-soft hover:bg-rice-50 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center text-white text-xl font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-ink-900 text-center">krdsxllnt</span>
        </a>

        <a
          href="https://line.me/ti/p/~tull13579"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-rice-300 shadow-soft hover:bg-rice-50 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-[#00C300] flex items-center justify-center text-white text-xl font-bold">
            L
          </div>
          <span className="text-xs font-medium text-ink-900 text-center">tull13579</span>
        </a>

        <a
          href="tel:0813909179"
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-rice-300 shadow-soft hover:bg-rice-50 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-accent-yellow flex items-center justify-center text-ink-900 text-xl font-bold">
            📞
          </div>
          <span className="text-xs font-medium text-ink-900 text-center">0813909179</span>
        </a>
      </div>
    </section>
  )
}

export default App

