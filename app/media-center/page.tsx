'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Image, Video, BookOpen, BarChart2, Upload, X } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { MEDIA } from '@/lib/ops-mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type MediaItem = typeof MEDIA[number]

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  صورة: Image, فيديو: Video, ألبوم: BookOpen, إنفوجرافيك: BarChart2,
}

const STATUS_CFG = {
  منشور:  { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  مسودة:  { bg: 'bg-amber-500/10',   text: 'text-amber-600'   },
}

export default function MediaCenterPage() {
  const { isRtl, showToast } = useApp()
  const [items, setItems] = useState<MediaItem[]>(MEDIA)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', titleEn: '', type: 'صورة', date: '', status: 'مسودة', tags: '', thumb: '📷' })

  const reset = () => { setForm({ title: '', titleEn: '', type: 'صورة', date: '', status: 'مسودة', tags: '', thumb: '📷' }); setEditId(null) }

  const openEdit = (item: MediaItem) => {
    setForm({ title: item.title, titleEn: item.titleEn, type: item.type, date: item.date, status: item.status, tags: item.tags.join(', '), thumb: item.thumb })
    setEditId(item.id)
    setShowForm(true)
  }

  const save = () => {
    if (!form.title.trim()) { showToast('يرجى إدخال عنوان الوسائط', 'error'); return }
    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)
    if (editId) {
      setItems((prev) => prev.map((i) => i.id === editId ? { ...i, ...form, tags, id: editId } : i))
      showToast('تم تحديث عنصر الوسائط', 'success')
    } else {
      const id = `MED-${String(items.length + 1).padStart(3, '0')}`
      setItems((prev) => [...prev, { id, ...form, tags }])
      showToast('تم نشر عنصر الوسائط بنجاح', 'success')
    }
    setShowForm(false)
    reset()
  }

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    showToast('تم حذف العنصر', 'info')
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">المركز الإعلامي</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">{items.length} عنصر وسائط</p>
        </div>
        <button
          onClick={() => { reset(); setShowForm(true) }}
          className="ms-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[12px] font-bold hover:brightness-105 transition-all shadow-sm shadow-primary/20"
        >
          <Plus className="w-3.5 h-3.5" /> نشر وسائط جديدة
        </button>
      </div>

      {/* Form Slide-over */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="border-primary/20 rounded-2xl shadow-md">
              <CardHeader className="px-5 pt-4 pb-2 flex flex-row items-center gap-2">
                <CardTitle className="text-[14px] font-bold">{editId ? 'تعديل وسائط' : 'نشر وسائط جديدة'}</CardTitle>
                <button onClick={() => { setShowForm(false); reset() }} className="ms-auto p-1 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </CardHeader>
              <CardContent className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">العنوان (عربي) *</label>
                  <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="عنوان الوسائط بالعربية"
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">العنوان (إنجليزي)</label>
                  <input value={form.titleEn} onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
                    placeholder="Title in English"
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40" dir="ltr" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">نوع الوسائط</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] text-foreground outline-none focus:border-primary/40">
                    {['صورة', 'فيديو', 'ألبوم', 'إنفوجرافيك'].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">التاريخ</label>
                  <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] text-foreground outline-none focus:border-primary/40" dir="ltr" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">الوسوم (مفصولة بفاصلة)</label>
                  <input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                    placeholder="مثال: أردن، مذكرات، توقيع"
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">الحالة</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] text-foreground outline-none focus:border-primary/40">
                    <option value="مسودة">مسودة</option>
                    <option value="منشور">منشور</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <div className="border-2 border-dashed border-border/50 rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/30 transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <p className="text-[12px] text-muted-foreground">رفع ملف الوسائط (صورة/فيديو)</p>
                    <p className="text-[10px] text-muted-foreground">JPG, PNG, MP4, PDF — حتى 50 MB</p>
                  </div>
                </div>
                <div className="md:col-span-2 flex gap-2 justify-end">
                  <button onClick={() => { setShowForm(false); reset() }} className="px-4 py-2 rounded-xl border border-border text-[12px] text-muted-foreground hover:bg-muted transition-colors">إلغاء</button>
                  <button onClick={save} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-[12px] font-bold hover:brightness-105 transition-all">
                    {editId ? 'حفظ التعديلات' : 'نشر'}
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => {
          const Icon = TYPE_ICON[item.type] ?? Image
          const stCfg = STATUS_CFG[item.status as keyof typeof STATUS_CFG] ?? STATUS_CFG['مسودة']
          return (
            <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-border/50 rounded-2xl shadow-sm overflow-hidden hover:border-primary/20 transition-all">
                <div className="h-24 bg-muted/30 flex items-center justify-center text-4xl">{item.thumb}</div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-bold text-foreground leading-snug flex-1">{item.title}</p>
                    <div className={`p-1 rounded-lg shrink-0 ${stCfg.bg}`}>
                      <Icon className={`w-3 h-3 ${stCfg.text}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-[9px]">{item.type}</Badge>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${stCfg.bg} ${stCfg.text}`}>{item.status}</span>
                    <span className="text-[9px] text-muted-foreground ms-auto">{item.date}</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {item.tags.map((t) => <span key={t} className="text-[9px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">#{t}</span>)}
                  </div>
                  <div className="flex gap-1 pt-1">
                    <button onClick={() => openEdit(item)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
                      <Edit2 className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">تعديل</span>
                    </button>
                    <button onClick={() => remove(item.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3 h-3 text-red-500" />
                      <span className="text-[10px] text-red-500">حذف</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
