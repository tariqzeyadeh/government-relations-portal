'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Send, MessageSquare, Paperclip, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { SUPPORT_TICKETS } from '@/lib/ops-mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Ticket = typeof SUPPORT_TICKETS[number]

const CATEGORIES = ['مشكلة تقنية', 'استفسار', 'طلب صلاحية', 'طلب ميزة', 'تقرير خطأ']
const PRIORITIES = ['منخفضة', 'متوسطة', 'عالية', 'حرجة']

const STATUS_CFG = {
  'مفتوحة': { bg: 'bg-blue-500/10',    text: 'text-blue-700'   },
  'مغلقة':  { bg: 'bg-muted/60',       text: 'text-muted-foreground' },
}

const PRI_CFG = {
  'عالية':   { bg: 'bg-red-500/10',    text: 'text-red-700'    },
  'متوسطة':  { bg: 'bg-amber-500/10',  text: 'text-amber-700'  },
  'منخفضة':  { bg: 'bg-muted/60',      text: 'text-muted-foreground' },
  'حرجة':    { bg: 'bg-red-500/20',    text: 'text-red-800'    },
}

const emptyForm = { title: '', category: CATEGORIES[0], priority: PRIORITIES[1], description: '' }

export default function SupportPage() {
  const { isRtl, showToast } = useApp()
  const [tickets, setTickets] = useState<Ticket[]>(SUPPORT_TICKETS)
  const [view, setView] = useState<'list' | 'create'>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [reply, setReply] = useState('')

  const selected = tickets.find((t) => t.id === selectedId) ?? null

  const submitTicket = () => {
    if (!form.title.trim()) { showToast('يرجى إدخال عنوان التذكرة', 'error'); return }
    if (!form.description.trim()) { showToast('يرجى إدخال وصف المشكلة', 'error'); return }
    const id = `TKT-${109 + tickets.length}`
    const newTicket: Ticket = {
      id,
      title: form.title,
      category: form.category,
      priority: form.priority,
      status: 'مفتوحة',
      created: new Date().toISOString().replace('T', ' ').slice(0, 16),
      creator: 'أحمد المنصوري',
      description: form.description,
      attachments: [],
      replies: [],
    }
    setTickets((prev) => [newTicket, ...prev])
    showToast(`تم رفع التذكرة ${id} بنجاح`, 'success')
    setForm(emptyForm)
    setView('list')
    setSelectedId(id)
  }

  const addReply = (ticketId: string) => {
    if (!reply.trim()) return
    setTickets((prev) => prev.map((t) => {
      if (t.id !== ticketId) return t
      return {
        ...t,
        replies: [...t.replies, {
          author: 'أحمد المنصوري',
          time: new Date().toISOString().replace('T', ' ').slice(0, 16),
          body: reply,
        }],
      }
    }))
    setReply('')
  }

  const closeTicket = (id: string) => {
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: 'مغلقة' } : t))
    showToast('تم إغلاق التذكرة', 'info')
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-5" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">الدعم الفني</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {tickets.filter((t) => t.status === 'مفتوحة').length} تذكرة مفتوحة
          </p>
        </div>
        {view === 'list' ? (
          <button onClick={() => setView('create')}
            className="ms-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[12px] font-bold hover:brightness-105 transition-all shadow-sm shadow-primary/20">
            <Plus className="w-3.5 h-3.5" /> تذكرة جديدة
          </button>
        ) : (
          <button onClick={() => setView('list')}
            className="ms-auto flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-[12px] text-muted-foreground hover:bg-muted transition-colors">
            <X className="w-3.5 h-3.5" /> إلغاء
          </button>
        )}
      </div>

      {/* Create form */}
      <AnimatePresence>
        {view === 'create' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="border-primary/20 rounded-2xl shadow-md">
              <CardHeader className="px-5 pt-4 pb-2">
                <CardTitle className="text-[14px] font-bold">رفع تذكرة دعم جديدة</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">العنوان *</label>
                  <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="وصف مختصر للمشكلة أو الاستفسار"
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">التصنيف</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] outline-none focus:border-primary/40">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">الأهمية</label>
                  <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] outline-none focus:border-primary/40">
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">وصف المشكلة / الاستفسار *</label>
                  <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={4} placeholder="اشرح المشكلة بتفصيل…"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40 resize-none leading-relaxed" />
                </div>
                <div className="md:col-span-2">
                  <div className="border-2 border-dashed border-border/50 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors">
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                    <p className="text-[12px] text-muted-foreground">إضافة مرفقات — صور، لقطات شاشة، ملفات</p>
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button onClick={submitTicket}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:brightness-105 transition-all shadow-sm shadow-primary/20">
                    <Send className="w-3.5 h-3.5" /> رفع التذكرة
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tickets list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: ticket list */}
        <div className="space-y-2">
          {tickets.map((t) => {
            const stCfg = STATUS_CFG[t.status as keyof typeof STATUS_CFG] ?? STATUS_CFG['مفتوحة']
            const priCfg = PRI_CFG[t.priority as keyof typeof PRI_CFG] ?? PRI_CFG['متوسطة']
            return (
              <motion.div key={t.id} layout>
                <Card
                  onClick={() => setSelectedId(selectedId === t.id ? null : t.id)}
                  className={`border rounded-2xl shadow-sm cursor-pointer transition-all ${selectedId === t.id ? 'border-primary/30 ring-1 ring-primary/20' : 'border-border/50 hover:border-primary/20'}`}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-mono text-muted-foreground">{t.id}</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${priCfg.bg} ${priCfg.text}`}>{t.priority}</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${stCfg.bg} ${stCfg.text}`}>{t.status}</span>
                        </div>
                        <p className="text-[13px] font-bold text-foreground leading-snug">{t.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="secondary" className="text-[9px]">{t.category}</Badge>
                          <span className="text-[10px] text-muted-foreground">{t.created}</span>
                          {t.replies.length > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                              <MessageSquare className="w-2.5 h-2.5" /> {t.replies.length}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${selectedId === t.id ? (isRtl ? '-rotate-180' : 'rotate-180') : ''}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Right: Thread view */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:sticky lg:top-6 h-fit"
            >
              <Card className="border-border/50 rounded-2xl shadow-md">
                <CardHeader className="px-5 pt-4 pb-3 border-b border-border/50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-muted-foreground">{selected.id}</span>
                      <CardTitle className="text-[14px] font-bold mt-0.5">{selected.title}</CardTitle>
                      <p className="text-[11px] text-muted-foreground mt-1">{selected.creator} · {selected.created}</p>
                    </div>
                    {selected.status === 'مفتوحة' && (
                      <button onClick={() => closeTicket(selected.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold hover:bg-emerald-500/20 transition-colors shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> إغلاق
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Original description */}
                  <div className="bg-muted/30 rounded-xl p-3">
                    <p className="text-[12px] text-foreground leading-relaxed">{selected.description}</p>
                  </div>

                  {/* Replies thread */}
                  {selected.replies.length > 0 && (
                    <div className="space-y-3">
                      {selected.replies.map((r, i) => (
                        <div key={i} className={`flex gap-2 ${r.author === 'فريق الدعم' ? '' : 'flex-row-reverse'}`}>
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-primary/10 text-primary">
                            {r.author[0]}
                          </div>
                          <div className={`flex-1 min-w-0 rounded-xl p-3 text-[12px] ${r.author === 'فريق الدعم' ? 'bg-muted/40' : 'bg-primary/5'}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-foreground text-[11px]">{r.author}</span>
                              <span className="text-[10px] text-muted-foreground">{r.time}</span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{r.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add reply */}
                  {selected.status === 'مفتوحة' && (
                    <div className="flex gap-2">
                      <input
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addReply(selected.id)}
                        placeholder="إضافة رد…"
                        className="flex-1 h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] outline-none focus:border-primary/40"
                      />
                      <button onClick={() => addReply(selected.id)}
                        className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:brightness-105 transition-all">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
