'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Save, Trash2, Settings2, Bell, CalendarDays } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { COMMITTEE_TYPES, MEETING_TYPES, NOTIFICATION_TEMPLATES } from '@/lib/ops-mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Tab = 'committees' | 'notifications' | 'meetings'

export default function SettingsPage() {
  const { isRtl, showToast } = useApp()
  const [tab, setTab] = useState<Tab>('committees')

  // Committee types state
  const [ctypes, setCtypes] = useState(COMMITTEE_TYPES)
  const [newCt, setNewCt] = useState({ name: '', nameEn: '', description: '' })
  const [showCtForm, setShowCtForm] = useState(false)

  // Notification templates state
  const [templates, setTemplates] = useState(NOTIFICATION_TEMPLATES)
  const [editingNt, setEditingNt] = useState<string | null>(null)
  const [ntBodies, setNtBodies] = useState<Record<string, string>>(Object.fromEntries(NOTIFICATION_TEMPLATES.map((t) => [t.id, t.body])))

  // Meeting types state
  const [mtypes, setMtypes] = useState(MEETING_TYPES)
  const [newMt, setNewMt] = useState({ name: '', nameEn: '', duration: '90' })
  const [showMtForm, setShowMtForm] = useState(false)

  const TABS = [
    { id: 'committees'    as Tab, label: 'أنواع اللجان',     icon: Settings2   },
    { id: 'notifications' as Tab, label: 'قوالب التنبيهات',  icon: Bell        },
    { id: 'meetings'      as Tab, label: 'أنواع الاجتماعات', icon: CalendarDays },
  ]

  const addCtype = () => {
    if (!newCt.name.trim()) { showToast('يرجى إدخال اسم نوع اللجنة', 'error'); return }
    const id = `CT-${String(ctypes.length + 1).padStart(2, '0')}`
    setCtypes((prev) => [...prev, { id, ...newCt }])
    setNewCt({ name: '', nameEn: '', description: '' })
    setShowCtForm(false)
    showToast(`تم إضافة نوع اللجنة "${newCt.name}"`, 'success')
  }

  const removeCtype = (id: string) => {
    setCtypes((prev) => prev.filter((c) => c.id !== id))
    showToast('تم حذف نوع اللجنة', 'info')
  }

  const saveNt = (id: string) => {
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, body: ntBodies[id] } : t))
    setEditingNt(null)
    showToast('تم حفظ قالب التنبيه', 'success')
  }

  const addMtype = () => {
    if (!newMt.name.trim()) { showToast('يرجى إدخال اسم نوع الاجتماع', 'error'); return }
    const id = `MT-${String(mtypes.length + 1).padStart(2, '0')}`
    setMtypes((prev) => [...prev, { id, name: newMt.name, nameEn: newMt.nameEn, duration: parseInt(newMt.duration) }])
    setNewMt({ name: '', nameEn: '', duration: '90' })
    setShowMtForm(false)
    showToast(`تم إضافة نوع الاجتماع "${newMt.name}"`, 'success')
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-xl font-extrabold text-foreground">الإعدادات</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">إعدادات اللجان والتنبيهات والاجتماعات</p>
      </div>

      <div className="flex gap-6">
        {/* Vertical tab list */}
        <div className="w-52 shrink-0 space-y-1">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-start text-[13px] font-semibold transition-all ${tab === t.id ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 space-y-4">
          <AnimatePresence mode="wait">
            {tab === 'committees' && (
              <motion.div key="committees" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                <Card className="border-border/50 rounded-2xl shadow-sm overflow-hidden">
                  <CardHeader className="px-5 pt-4 pb-3 border-b border-border/50 flex flex-row items-center gap-2">
                    <CardTitle className="text-[14px] font-bold">أنواع اللجان ({ctypes.length})</CardTitle>
                    <button onClick={() => setShowCtForm(!showCtForm)}
                      className="ms-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold hover:brightness-105 transition-all">
                      <Plus className="w-3 h-3" /> إضافة
                    </button>
                  </CardHeader>
                  <AnimatePresence>
                    {showCtForm && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                        <div className="px-5 py-4 border-b border-border/40 grid grid-cols-1 md:grid-cols-3 gap-3 bg-muted/20">
                          <input value={newCt.name} onChange={(e) => setNewCt((f) => ({ ...f, name: e.target.value }))}
                            placeholder="الاسم بالعربية *"
                            className="h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40" />
                          <input value={newCt.nameEn} onChange={(e) => setNewCt((f) => ({ ...f, nameEn: e.target.value }))}
                            placeholder="Name in English" dir="ltr"
                            className="h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40" />
                          <input value={newCt.description} onChange={(e) => setNewCt((f) => ({ ...f, description: e.target.value }))}
                            placeholder="وصف مختصر"
                            className="h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40" />
                          <div className="md:col-span-3 flex justify-end gap-2">
                            <button onClick={() => setShowCtForm(false)} className="px-3 py-1.5 rounded-lg border border-border text-[11px] text-muted-foreground hover:bg-muted transition-colors">إلغاء</button>
                            <button onClick={addCtype} className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold hover:brightness-105 transition-all">حفظ</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <CardContent className="p-0">
                    {ctypes.map((ct, i) => (
                      <div key={ct.id} className={`flex items-center gap-3 px-5 py-3.5 ${i < ctypes.length - 1 ? 'border-b border-border/30' : ''} hover:bg-muted/10 transition-colors`}>
                        <div className="flex-1">
                          <p className="text-[13px] font-bold text-foreground">{ct.name}</p>
                          <p className="text-[11px] text-muted-foreground">{ct.description}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{ct.nameEn}</Badge>
                        <button onClick={() => removeCtype(ct.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {tab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                {templates.map((nt) => (
                  <Card key={nt.id} className="border-border/50 rounded-2xl shadow-sm">
                    <CardHeader className="px-5 pt-4 pb-3 border-b border-border/50 flex flex-row items-center gap-2">
                      <div>
                        <CardTitle className="text-[13px] font-bold">{nt.name}</CardTitle>
                        <p className="text-[10px] text-muted-foreground mt-0.5">القناة: {nt.channel}</p>
                      </div>
                      {editingNt !== nt.id ? (
                        <button onClick={() => setEditingNt(nt.id)} className="ms-auto text-[11px] text-primary hover:underline font-semibold">تعديل</button>
                      ) : (
                        <button onClick={() => saveNt(nt.id)}
                          className="ms-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold hover:brightness-105 transition-all">
                          <Save className="w-3 h-3" /> حفظ
                        </button>
                      )}
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-[10px] text-muted-foreground mb-2">المتغيرات المتاحة:</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(ntBodies[nt.id].match(/\[[^\]]+\]/g) ?? []).map((v) => (
                          <span key={v} className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">{v}</span>
                        ))}
                      </div>
                      {editingNt === nt.id ? (
                        <textarea
                          value={ntBodies[nt.id]}
                          onChange={(e) => setNtBodies((prev) => ({ ...prev, [nt.id]: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40 resize-none leading-relaxed"
                        />
                      ) : (
                        <p className="text-[12px] text-muted-foreground leading-relaxed bg-muted/30 rounded-xl p-3">{nt.body}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {tab === 'meetings' && (
              <motion.div key="meetings" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                <Card className="border-border/50 rounded-2xl shadow-sm overflow-hidden">
                  <CardHeader className="px-5 pt-4 pb-3 border-b border-border/50 flex flex-row items-center gap-2">
                    <CardTitle className="text-[14px] font-bold">أنواع الاجتماعات ({mtypes.length})</CardTitle>
                    <button onClick={() => setShowMtForm(!showMtForm)}
                      className="ms-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold hover:brightness-105 transition-all">
                      <Plus className="w-3 h-3" /> إضافة
                    </button>
                  </CardHeader>
                  <AnimatePresence>
                    {showMtForm && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                        <div className="px-5 py-4 border-b border-border/40 grid grid-cols-1 md:grid-cols-3 gap-3 bg-muted/20">
                          <input value={newMt.name} onChange={(e) => setNewMt((f) => ({ ...f, name: e.target.value }))}
                            placeholder="الاسم بالعربية *"
                            className="h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40" />
                          <input value={newMt.nameEn} onChange={(e) => setNewMt((f) => ({ ...f, nameEn: e.target.value }))}
                            placeholder="Name in English" dir="ltr"
                            className="h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40" />
                          <input type="number" min="15" value={newMt.duration} onChange={(e) => setNewMt((f) => ({ ...f, duration: e.target.value }))}
                            placeholder="المدة (دقائق)"
                            className="h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] outline-none focus:border-primary/40" dir="ltr" />
                          <div className="md:col-span-3 flex justify-end gap-2">
                            <button onClick={() => setShowMtForm(false)} className="px-3 py-1.5 rounded-lg border border-border text-[11px] text-muted-foreground hover:bg-muted transition-colors">إلغاء</button>
                            <button onClick={addMtype} className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold hover:brightness-105 transition-all">حفظ</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <CardContent className="p-0">
                    {mtypes.map((mt, i) => (
                      <div key={mt.id} className={`flex items-center gap-3 px-5 py-3.5 ${i < mtypes.length - 1 ? 'border-b border-border/30' : ''} hover:bg-muted/10 transition-colors`}>
                        <div className="flex-1">
                          <p className="text-[13px] font-bold text-foreground">{mt.name}</p>
                          <p className="text-[11px] text-muted-foreground">{mt.nameEn}</p>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">{mt.duration} دقيقة</Badge>
                        <button onClick={() => { setMtypes((prev) => prev.filter((m) => m.id !== mt.id)); showToast('تم حذف نوع الاجتماع', 'info') }}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
