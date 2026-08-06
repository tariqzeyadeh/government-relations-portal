'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, Circle, MessageSquare, Send, Highlighter,
  FileText, Users, Calendar, MapPin, Clock, ChevronLeft,
  Paperclip, Pin, Vote, MoreHorizontal, PenTool, BookOpen,
  Plus, X,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit'
import { MEETINGS, COMMITTEES, TOPICS, ACTION_ITEMS } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'

// ── ID resolution: "mining-2026" and "1" both map to the main mining meeting
const ID_MAP: Record<string, string> = {
  '1': 'mtg-mining-2026-02',
  'mining-2026': 'mtg-mining-2026-02',
}

const MOCK_THREADS = [
  {
    id: 't1',
    agendaRef: 'ag1',
    authorAr: 'م. فهد القحطاني',
    avatar: 'FK',
    bodyAr: 'يجب أن نضمن استيفاء النصاب القانوني قبل بدء التصويت على إطار الليثيوم. تأكيد الحضور من وزارة الطاقة معلّق.',
    timestamp: 'منذ 35 دقيقة',
    replies: [
      { id: 'r1', authorAr: 'د. نورة الحربي', avatar: 'NH', bodyAr: 'تواصلنا مع الوزارة للتأكيد قبل الساعة 9 صباحاً غداً.', timestamp: 'منذ 20 دقيقة' },
      { id: 'r2', authorAr: 'م. أحمد المحمد', avatar: 'AM', bodyAr: 'شكراً، سأتابع شخصياً مع صندوق الاستثمارات العامة.', timestamp: 'منذ 10 دقائق' },
    ],
  },
  {
    id: 't2',
    agendaRef: 'ag2',
    authorAr: 'أمانة التعدين',
    avatar: 'AT',
    bodyAr: 'مرفق بحزمة الإحاطة: مسودة الإطار المحدّثة (v3.2) مع تعليقات الفريق القانوني. يُرجى مراجعتها قبل الاجتماع.',
    timestamp: 'منذ ساعتين',
    replies: [],
  },
  {
    id: 't3',
    agendaRef: 'ag3',
    authorAr: 'م. سلطان الدوسري',
    avatar: 'SD',
    bodyAr: 'خط أنابيب الاستثمار في الربع الثالث يتضمن 4 مشاريع جديدة بقيمة إجمالية 1.2 مليار ريال. سأقدم العرض التفصيلي في البند الثالث.',
    timestamp: 'منذ 3 ساعات',
    replies: [
      { id: 'r3', authorAr: 'د. خالد الغامدي', avatar: 'KG', bodyAr: 'هل تشمل مشاريع التعدين في المنطقة الشمالية؟', timestamp: 'منذ 2.5 ساعة' },
    ],
  },
]

const MOCK_ANNOTATIONS = [
  { id: 'an1', authorAr: 'م. فهد القحطاني', pageRef: 'ص. 4', textAr: 'المادة 7 من الاتفاقية تتطلب موافقة مجلس الوزراء قبل التوقيع.', color: '#1691d0' },
  { id: 'an2', authorAr: 'أمانة اللجنة', pageRef: 'ص. 12', textAr: 'أرقام الاستثمار بحاجة إلى تحقق مع MISA قبل إدراجها في المحضر.', color: '#2fa9e0' },
  { id: 'an3', authorAr: 'د. نورة الحربي', pageRef: 'ص. 8', textAr: 'مسار توريد الليثيوم من أستراليا يتطلب مراجعة هيئة الجيولوجية.', color: '#ef4444' },
]

// ── Agenda items mapped from TOPICS ──────────────────────────────────────────
const BASE_AGENDA = [
  { id: 'ag1', titleAr: 'افتتاح الجلسة والتحقق من النصاب', done: false, duration: 10, docRef: null },
  { id: 'ag2', titleAr: 'اعتماد جدول الأعمال ومحضر الجلسة السابقة', done: false, duration: 15, docRef: 'محضر الجلسة الافتتاحية' },
  { id: 'ag3', titleAr: 'إطار استكشاف الليثيوم مع أستراليا', done: false, duration: 25, docRef: 'مسودة إطار الليثيوم v3.2' },
  { id: 'ag4', titleAr: 'حالة مذكرة التفاهم لسلسلة توريد المعادن النادرة', done: false, duration: 20, docRef: 'مذكرة التفاهم — المعادن النادرة' },
  { id: 'ag5', titleAr: 'خط أنابيب الاستثمار للربع الثالث', done: false, duration: 20, docRef: 'تقرير الاستثمار Q3' },
]

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>()
  const resolvedId = ID_MAP[id] || id
  const meeting = MEETINGS.find((m) => m.id === resolvedId) ?? MEETINGS[0]
  const committee = COMMITTEES.find((c) => c.id === meeting.committeeId)
  const { showToast } = useApp()

  const [agenda, setAgenda] = useState(BASE_AGENDA)
  const [threads, setThreads] = useState(MOCK_THREADS)
  const [newMsg, setNewMsg] = useState('')
  const [activeThread, setActiveThread] = useState<string | null>(null)
  const [replyMsg, setReplyMsg] = useState<Record<string, string>>({})
  const [annotations, setAnnotations] = useState(MOCK_ANNOTATIONS)
  const [showAnnotationForm, setShowAnnotationForm] = useState(false)
  const [newAnnotation, setNewAnnotation] = useState({ textAr: '', pageRef: '' })
  const [activeTab, setActiveTab] = useState<'discussion' | 'annotations'>('discussion')

  const toggleDone = (id: string) =>
    setAgenda((prev) => prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a)))

  const sendMessage = () => {
    if (!newMsg.trim()) return
    setThreads((prev) => [
      {
        id: `t${Date.now()}`,
        agendaRef: 'ag1',
        authorAr: 'م. أحمد المحمد',
        avatar: 'AM',
        bodyAr: newMsg,
        timestamp: 'الآن',
        replies: [],
      },
      ...prev,
    ])
    setNewMsg('')
  }

  const sendReply = (threadId: string) => {
    const txt = replyMsg[threadId]?.trim()
    if (!txt) return
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              replies: [
                ...t.replies,
                { id: `r${Date.now()}`, authorAr: 'م. أحمد المحمد', avatar: 'AM', bodyAr: txt, timestamp: 'الآن' },
              ],
            }
          : t,
      ),
    )
    setReplyMsg((r) => ({ ...r, [threadId]: '' }))
  }

  const addAnnotation = () => {
    if (!newAnnotation.textAr.trim()) return
    setAnnotations((prev) => [
      ...prev,
      { id: `an${Date.now()}`, authorAr: 'م. أحمد المحمد', pageRef: newAnnotation.pageRef || 'ص. 1', textAr: newAnnotation.textAr, color: '#2fa9e0' },
    ])
    setNewAnnotation({ textAr: '', pageRef: '' })
    setShowAnnotationForm(false)
    showToast('تمت إضافة التعليق التوضيحي')
  }

  const doneCount = agenda.filter((a) => a.done).length

  return (
    <div className="space-y-4">
      <PageHeader
        title={meeting.titleAr}
        subtitle={committee?.nameAr ?? meeting.committeeId}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/committees/minutes/${id}`}
              className="btn btn-ghost border border-[var(--color-border)] text-xs no-underline"
            >
              <FileText size={14} /> المحضر
            </Link>
            <Link
              href={`/committees/voting/${id}`}
              className="btn btn-ghost border border-[var(--color-border)] text-xs no-underline"
            >
              <Vote size={14} /> التصويت
            </Link>
            <Link
              href={`/committees/meetings/${id}/read`}
              className="btn btn-primary text-xs no-underline"
            >
              <BookOpen size={14} /> قراءة الوثائق
            </Link>
          </div>
        }
      />

      {/* Meeting meta strip */}
      <div className="flex flex-wrap gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-4 py-3 text-xs text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[var(--color-brand)]" />{meeting.date}</span>
        <span className="flex items-center gap-1.5"><Clock size={13} className="text-[var(--color-brand)]" />{meeting.time}</span>
        <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[var(--color-brand)]" />{meeting.locationAr}</span>
        <span className="flex items-center gap-1.5"><Users size={13} className="text-[var(--color-brand)]" />{meeting.attendees} حاضر</span>
        <span className="flex items-center gap-1.5 ms-auto font-medium text-[var(--color-brand)]">
          {doneCount}/{agenda.length} بنود مكتملة
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-[var(--color-gray-200)]">
        <motion.div
          className="h-1.5 rounded-full bg-[var(--color-brand)]"
          initial={{ width: 0 }}
          animate={{ width: `${(doneCount / agenda.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main 3-column grid */}
      <div className="grid gap-4 lg:grid-cols-[240px_1fr_280px]">

        {/* LEFT — Agenda */}
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--color-text)]">جدول الأعمال</h3>
            <span className="text-[11px] text-[var(--color-text-muted)]">{meeting.agendaItems} بنود</span>
          </div>
          <div className="space-y-2">
            {agenda.map((item, idx) => (
              <motion.div
                key={item.id}
                whileHover={{ x: -2 }}
                className={`flex cursor-pointer items-start gap-2 rounded-lg p-2.5 transition-colors hover:bg-[var(--color-gray-100)] ${item.done ? 'opacity-60' : ''}`}
                onClick={() => toggleDone(item.id)}
              >
                {item.done ? (
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[var(--color-brand)]" />
                ) : (
                  <Circle size={15} className="mt-0.5 shrink-0 text-[var(--color-text-muted)]" />
                )}
                <div className="min-w-0">
                  <p className={`text-xs font-medium leading-snug ${item.done ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text)]'}`}>
                    <span className="me-1 text-[var(--color-brand)]">{idx + 1}.</span>
                    {item.titleAr}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                    <Clock size={9} /> {item.duration} دقيقة
                  </p>
                  {item.docRef && (
                    <Link
                      href={`/committees/meetings/${id}/read`}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5 flex items-center gap-1 text-[10px] text-[var(--color-brand)] no-underline hover:underline"
                    >
                      <Paperclip size={9} /> {item.docRef}
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CENTER — Discussion threads */}
        <div className="card flex flex-col p-4" style={{ minHeight: '520px' }}>
          {/* Tabs */}
          <div className="mb-4 flex border-b border-[var(--color-border)]">
            {(['discussion', 'annotations'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 border-b-2 pb-2 pe-4 text-xs font-semibold transition-colors ${
                  activeTab === tab
                    ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
                    : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {tab === 'discussion' ? <><MessageSquare size={13} /> نقاشات ({threads.length})</> : <><Highlighter size={13} /> تعليقات ({annotations.length})</>}
              </button>
            ))}
          </div>

          {activeTab === 'discussion' && (
            <>
              <div className="flex-1 space-y-4 overflow-y-auto">
                {threads.map((thread) => (
                  <div key={thread.id} className="rounded-lg border border-[var(--color-border)] p-3">
                    <div className="mb-2 flex items-start gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-[10px] font-bold text-white">
                        {thread.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[var(--color-text)]">{thread.authorAr}</span>
                          <span className="text-[10px] text-[var(--color-text-muted)]">{thread.timestamp}</span>
                        </div>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)] leading-relaxed">{thread.bodyAr}</p>
                      </div>
                    </div>
                    {/* Replies */}
                    {thread.replies.length > 0 && (
                      <div className="ms-9 space-y-2 border-s-2 border-[var(--color-border)] ps-3">
                        {thread.replies.map((r) => (
                          <div key={r.id} className="flex items-start gap-2">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold)]/30 text-[9px] font-bold text-[var(--color-gold)]">
                              {r.avatar}
                            </div>
                            <div>
                              <span className="text-[11px] font-semibold text-[var(--color-text)]">{r.authorAr}</span>
                              <span className="ms-2 text-[10px] text-[var(--color-text-muted)]">{r.timestamp}</span>
                              <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{r.bodyAr}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Reply input */}
                    <div className="mt-2 ms-9 flex gap-2">
                      <input
                        className="input-base h-7 flex-1 text-xs"
                        placeholder="ردّ…"
                        value={replyMsg[thread.id] ?? ''}
                        onChange={(e) => setReplyMsg((r) => ({ ...r, [thread.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && sendReply(thread.id)}
                      />
                      <button
                        onClick={() => sendReply(thread.id)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-brand)] text-white"
                      >
                        <Send size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* New message */}
              <div className="mt-4 flex gap-2">
                <input
                  className="input-base flex-1 text-sm"
                  placeholder="أضف تعليقاً أو سؤالاً للنقاش…"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand2)]"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}

          {activeTab === 'annotations' && (
            <div className="flex-1 space-y-3 overflow-y-auto">
              {annotations.map((an) => (
                <div key={an.id} className="rounded-lg border border-[var(--color-border)] p-3">
                  <div className="mb-1.5 flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: an.color }}
                    />
                    <span className="text-[11px] font-semibold text-[var(--color-text)]">{an.authorAr}</span>
                    <span className="ms-auto rounded bg-[var(--color-gray-100)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)]">
                      {an.pageRef}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{an.textAr}</p>
                </div>
              ))}
              {showAnnotationForm ? (
                <div className="rounded-lg border border-[var(--color-brand)] p-3">
                  <div className="mb-2 flex gap-2">
                    <input
                      className="input-base h-7 flex-1 text-xs"
                      placeholder="رقم الصفحة (مثال: ص. 5)"
                      value={newAnnotation.pageRef}
                      onChange={(e) => setNewAnnotation((a) => ({ ...a, pageRef: e.target.value }))}
                    />
                    <button onClick={() => setShowAnnotationForm(false)} className="text-[var(--color-text-muted)]"><X size={14} /></button>
                  </div>
                  <textarea
                    className="input-base h-16 resize-none py-2 text-xs"
                    placeholder="نص التعليق التوضيحي…"
                    value={newAnnotation.textAr}
                    onChange={(e) => setNewAnnotation((a) => ({ ...a, textAr: e.target.value }))}
                  />
                  <button onClick={addAnnotation} className="mt-2 btn btn-primary text-xs w-full">حفظ التعليق</button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnnotationForm(true)}
                  className="btn btn-ghost border border-dashed border-[var(--color-border)] w-full text-xs text-[var(--color-text-muted)]"
                >
                  <Plus size={13} /> إضافة تعليق توضيحي
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Action items / pins */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="mb-3 text-sm font-bold text-[var(--color-text)] flex items-center gap-1.5">
              <Pin size={14} className="text-[var(--color-gold)]" /> بنود العمل
            </h3>
            <div className="space-y-2">
              {ACTION_ITEMS.filter((a) => a.meetingId === resolvedId || a.meetingId === meeting.id).map((item) => (
                <div key={item.id} className="rounded-lg bg-[var(--color-gray-100)] p-2.5 text-xs">
                  <p className="font-medium text-[var(--color-text)] leading-snug">{item.titleAr}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
                    <span>{item.ownerAr}</span>
                    <span className={`rounded-full px-1.5 py-0.5 font-semibold ${item.status === 'done' ? 'bg-emerald-500/15 text-emerald-700' : item.status === 'in_progress' ? 'bg-blue-500/15 text-blue-700' : 'bg-amber-500/15 text-amber-700'}`}>
                      {item.status === 'done' ? 'مكتمل' : item.status === 'in_progress' ? 'جارٍ' : 'معلّق'}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">الموعد: {item.dueDate}</p>
                </div>
              ))}
              {ACTION_ITEMS.filter((a) => a.meetingId === resolvedId || a.meetingId === meeting.id).length === 0 && (
                <div className="space-y-2">
                  {ACTION_ITEMS.slice(0, 3).map((item) => (
                    <div key={item.id} className="rounded-lg bg-[var(--color-gray-100)] p-2.5 text-xs">
                      <p className="font-medium text-[var(--color-text)] leading-snug">{item.titleAr}</p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
                        <span>{item.ownerAr}</span>
                        <span className={`rounded-full px-1.5 py-0.5 font-semibold ${item.status === 'done' ? 'bg-emerald-500/15 text-emerald-700' : item.status === 'in_progress' ? 'bg-blue-500/15 text-blue-700' : 'bg-amber-500/15 text-amber-700'}`}>
                          {item.status === 'done' ? 'مكتمل' : item.status === 'in_progress' ? 'جارٍ' : 'معلّق'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick nav */}
          <div className="card p-4">
            <h3 className="mb-3 text-sm font-bold text-[var(--color-text)]">التنقل السريع</h3>
            <div className="space-y-1.5">
              {[
                { href: `/committees/meetings/${id}/read`, icon: BookOpen, label: 'قراءة الوثائق' },
                { href: `/committees/minutes/${id}`, icon: FileText, label: 'تحرير المحضر' },
                { href: `/committees/voting/${id}`, icon: Vote, label: 'التصويت على القرارات' },
                { href: '/committees/decisions', icon: PenTool, label: 'لوحة القرارات' },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[var(--color-text)] no-underline transition-colors hover:bg-[var(--color-gray-100)] hover:text-[var(--color-brand)]"
                >
                  <Icon size={13} className="text-[var(--color-brand)]" /> {label}
                  <ChevronLeft size={11} className="ms-auto text-[var(--color-text-muted)]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
