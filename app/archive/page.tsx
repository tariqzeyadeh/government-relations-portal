'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderOpen, Folder, Upload, FileText, FileSpreadsheet, File,
  Search, Download, ChevronRight, X, ScanLine, CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { ARCHIVE_FOLDERS, ARCHIVE_FILES } from '@/lib/ops-mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const FILE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PDF: FileText,
  DOCX: FileText,
  XLSX: FileSpreadsheet,
}

function OcrSimulator({ file, onDone }: { file: File; onDone: () => void }) {
  const [phase, setPhase] = useState<'scanning' | 'extracting' | 'done'>('scanning')
  const [progress, setProgress] = useState(0)
  const [lines, setLines] = useState<string[]>([])

  const SAMPLE_LINES = [
    'المملكة العربية السعودية — وزارة الشؤون الخارجية',
    'مذكرة تفاهم بين المملكة العربية السعودية والمملكة الأردنية الهاشمية',
    'في مجال التعاون في مجال الطاقة المتجددة والهيدروجين الأخضر',
    'المادة الأولى: يلتزم الطرفان بتبادل الخبرات التقنية...',
    'المادة الثانية: تُنشأ لجنة مشتركة للإشراف على التنفيذ...',
    'تاريخ التوقيع: 5 أغسطس 2026',
    'مكان التوقيع: الرياض، المملكة العربية السعودية',
  ]

  useState(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setPhase('done')
          return 100
        }
        if (p === 40) setPhase('extracting')
        if (p > 40 && p % 15 === 0) {
          setLines((prev) => [...prev, SAMPLE_LINES[Math.floor(prev.length % SAMPLE_LINES.length)]])
        }
        return p + 5
      })
    }, 180)
    return () => clearInterval(interval)
  })

  return (
    <Card className="border-primary/20 bg-primary/5 rounded-2xl mt-4">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-[13px] font-bold text-foreground">
            {phase === 'done' ? 'اكتمل استخراج النص' : phase === 'extracting' ? 'جارٍ استخراج النص…' : 'جارٍ مسح الملف…'}
          </span>
          <span className="ms-auto text-[12px] text-primary font-bold">{progress}%</span>
        </div>
        <div className="h-2 bg-border/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {lines.length > 0 && (
          <div className="bg-card rounded-xl border border-border/40 p-3 font-mono text-[11px] text-foreground space-y-1 max-h-36 overflow-y-auto">
            {lines.map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="leading-relaxed">
                {l}
              </motion.div>
            ))}
          </div>
        )}
        {phase === 'done' && (
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[12px] font-semibold">تم الاستخراج بنجاح — {lines.length} سطراً</span>
            <button onClick={onDone} className="ms-auto text-[11px] text-muted-foreground hover:text-foreground transition-colors">إغلاق</button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function ArchivePage() {
  const { isRtl, showToast } = useApp()
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [dragging, setDragging] = useState(false)
  const [ocrFile, setOcrFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) { setOcrFile(f); showToast(`جارٍ معالجة "${f.name}" بتقنية OCR`, 'info') }
  }, [showToast])

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { setOcrFile(f); showToast(`جارٍ معالجة "${f.name}" بتقنية OCR`, 'info') }
  }

  const folder = selectedFolder ? ARCHIVE_FOLDERS.find((f) => f.id === selectedFolder) : null
  const files = (selectedFolder ? ARCHIVE_FILES[selectedFolder] ?? [] : []).filter((f) =>
    !search || f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center gap-3">
        {selectedFolder && (
          <button onClick={() => setSelectedFolder(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowRight className={`w-4 h-4 text-muted-foreground ${isRtl ? '' : 'rotate-180'}`} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-extrabold text-foreground">
            {folder ? folder.name : 'مركز الأرشيف الرقمي'}
          </h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {folder ? `${files.length} وثيقة` : `${ARCHIVE_FOLDERS.reduce((a, f) => a + f.count, 0)} وثيقة في ${ARCHIVE_FOLDERS.length} مجلدات`}
          </p>
        </div>
      </div>

      {!selectedFolder ? (
        /* ── Folder Grid ── */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ARCHIVE_FOLDERS.map((f) => (
            <motion.div
              key={f.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedFolder(f.id)}
              className="cursor-pointer"
            >
              <Card className="border-border/50 shadow-sm rounded-2xl hover:border-primary/30 hover:shadow-md transition-all">
                <CardContent className="p-5 text-center space-y-2">
                  <div className="text-3xl">{f.icon}</div>
                  <p className="text-[13px] font-bold text-foreground leading-snug">{f.name}</p>
                  <Badge variant="secondary" className="text-[10px]">{f.count} وثيقة</Badge>
                  <p className="text-[10px] text-muted-foreground">{f.lastModified}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        /* ── File list inside folder ── */
        <Card className="border-border/50 rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="px-5 pt-4 pb-3 border-b border-border/50 flex flex-row items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="البحث في الوثائق…"
                className="w-full ps-9 pe-3 h-9 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  {['اسم الوثيقة', 'النوع', 'الحجم', 'تاريخ الرفع', 'الرافع', ''].map((h) => (
                    <th key={h} className="text-start px-4 py-2.5 font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {files.map((f) => {
                  const Icon = FILE_ICONS[f.type] ?? File
                  return (
                    <tr key={f.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="font-medium text-foreground">{f.name}</span>
                      </td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{f.type}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground">{f.size}</td>
                      <td className="px-4 py-3 text-muted-foreground">{f.uploaded}</td>
                      <td className="px-4 py-3 text-muted-foreground">{f.uploader}</td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="تنزيل">
                          <Download className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ── Dropzone + OCR ── */}
      <div className="space-y-3">
        <h2 className="text-[14px] font-bold text-foreground">رفع وثيقة جديدة + استخراج نص OCR</h2>
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          animate={{ borderColor: dragging ? 'var(--primary)' : 'var(--border)', background: dragging ? 'var(--primary)08' : 'transparent' }}
          className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors hover:border-primary/40"
        >
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-[14px] font-semibold text-foreground">اسحب وأفلت الملف هنا</p>
          <p className="text-[12px] text-muted-foreground mt-1">أو انقر للاختيار — PDF, DOCX, XLSX, صور</p>
          <p className="text-[10px] text-muted-foreground mt-2">سيتم تحليل الملف تلقائياً بتقنية OCR</p>
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.xlsx,.png,.jpg" onChange={onFileSelect} />
        </motion.div>

        <AnimatePresence>
          {ocrFile && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <OcrSimulator file={ocrFile} onDone={() => setOcrFile(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
