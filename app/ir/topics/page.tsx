'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Edit3, Save, Tag, Search } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { TOPICS, COMMITTEES, type Topic } from '@/lib/mock-data'
import { PageHeader, SectionTitle } from '@/components/ui-kit'

const STATUS_STYLES: Record<Topic['status'], string> = {
  open: 'bg-blue-100 text-blue-700',
  discussed: 'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
}

const STATUS_AR: Record<Topic['status'], string> = {
  open: 'مفتوح',
  discussed: 'نوقش',
  resolved: 'محسوم',
}

const PRIORITY_STYLES: Record<Topic['priority'], string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-gray-100 text-gray-600',
}

const PRIORITY_AR: Record<Topic['priority'], string> = {
  high: 'عالية',
  medium: 'متوسطة',
  low: 'منخفضة',
}

const EXTRA_TOPICS: Topic[] = [
  { id: 'topic-005', titleEn: 'Digital transformation roadmap alignment', titleAr: 'محاذاة خارطة طريق التحول الرقمي', committeeId: 'tiap-2026', status: 'open', priority: 'high' },
  { id: 'topic-006', titleEn: 'Cybersecurity cooperation framework', titleAr: 'إطار تعاون الأمن السيبراني', committeeId: 'tiap-2026', status: 'discussed', priority: 'medium' },
  { id: 'topic-007', titleEn: 'Trade volume target review Q3', titleAr: 'مراجعة أهداف حجم التجارة للربع الثالث', committeeId: 'jec-2026', status: 'open', priority: 'medium' },
  { id: 'topic-008', titleEn: 'Phosphate mining cooperation — Morocco', titleAr: 'تعاون تعدين الفوسفات — المغرب', committeeId: 'mining-2026', status: 'open', priority: 'high' },
]

export default function TopicsPage() {
  const { language, showToast } = useApp()
  const isAr = language === 'ar'

  const [topics, setTopics] = useState<Topic[]>([...TOPICS, ...EXTRA_TOPICS])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<Topic['status'] | 'all'>('all')
  const [filterCommittee, setFilterCommittee] = useState<string>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newCommittee, setNewCommittee] = useState(COMMITTEES[0].id)
  const [newPriority, setNewPriority] = useState<Topic['priority']>('medium')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  const TAGS = [
    { id: 'energy', ar: 'طاقة', en: 'Energy' },
    { id: 'mining', ar: 'تعدين', en: 'Mining' },
    { id: 'tech', ar: 'تكنولوجيا', en: 'Tech' },
    { id: 'trade', ar: 'تجارة', en: 'Trade' },
    { id: 'culture', ar: 'ثقافة', en: 'Culture' },
    { id: 'investment', ar: 'استثمار', en: 'Investment' },
    { id: 'security', ar: 'أمن', en: 'Security' },
    { id: 'education', ar: 'تعليم', en: 'Education' },
  ]

  const toggleTag = (id: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = topics.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (filterCommittee !== 'all' && t.committeeId !== filterCommittee) return false
    if (search && !t.titleAr.includes(search) && !t.titleEn.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const createTopic = () => {
    if (!newTitle.trim()) return
    setTopics((prev) => [
      {
        id: `topic-${Date.now()}`,
        titleAr: newTitle,
        titleEn: newTitle,
        committeeId: newCommittee,
        status: 'open',
        priority: newPriority,
      },
      ...prev,
    ])
    setNewTitle('')
    setShowCreate(false)
    showToast(isAr ? 'تم إضافة الموضوع' : 'Topic added')
  }

  const startEdit = (topic: Topic) => {
    setEditId(topic.id)
    setEditText(isAr ? topic.titleAr : topic.titleEn)
  }

  const saveEdit = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, titleAr: editText, titleEn: editText } : t)),
    )
    setEditId(null)
    showToast(isAr ? 'تم التحديث' : 'Updated')
  }

  const cycleStatus = (id: string) => {
    const ORDER: Topic['status'][] = ['open', 'discussed', 'resolved']
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const next = ORDER[(ORDER.indexOf(t.status) + 1) % ORDER.length]
        return { ...t, status: next }
      }),
    )
  }

  const getCommitteeName = (id: string) => {
    const c = COMMITTEES.find((c) => c.id === id)
    return c ? (isAr ? c.nameAr : c.nameEn) : id
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={isAr ? 'المواضيع الاستراتيجية' : 'Strategic Topics'}
        subtitle={isAr ? `${topics.length} موضوع مسجّل` : `${topics.length} topics on record`}
        actions={
          <button
            onClick={() => setShowCreate(true)}
            className="btn btn-primary gap-2 text-sm"
          >
            <Plus size={15} />
            {isAr ? 'موضوع جديد' : 'New Topic'}
          </button>
        }
      />

      {/* Tags filter */}
      <div>
        <p className="mb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          {isAr ? 'تصفية بالوسوم' : 'Filter by Tags'}
        </p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(({ id, ar, en }) => (
            <button
              key={id}
              onClick={() => toggleTag(id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedTags.has(id)
                  ? 'bg-[var(--color-brand)] text-white'
                  : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Tag size={10} />
              {isAr ? ar : en}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث في المواضيع...' : 'Search topics...'}
            className="input-base ps-9 text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Topic['status'] | 'all')}
          className="input-base h-11 w-auto text-sm"
        >
          <option value="all">{isAr ? 'كل الحالات' : 'All Statuses'}</option>
          {(Object.keys(STATUS_AR) as Topic['status'][]).map((s) => (
            <option key={s} value={s}>{STATUS_AR[s]}</option>
          ))}
        </select>
        <select
          value={filterCommittee}
          onChange={(e) => setFilterCommittee(e.target.value)}
          className="input-base h-11 w-auto text-sm"
        >
          <option value="all">{isAr ? 'كل اللجان' : 'All Committees'}</option>
          {COMMITTEES.map((c) => (
            <option key={c.id} value={c.id}>{isAr ? c.nameAr : c.nameEn}</option>
          ))}
        </select>
      </div>

      {/* Status chips */}
      <div className="flex gap-2">
        {[['all', 'الكل'], ...Object.entries(STATUS_AR)].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilterStatus(val as Topic['status'] | 'all')}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filterStatus === val
                ? 'bg-[var(--color-brand)] text-white'
                : 'bg-[var(--color-bg-elev)] border border-[var(--color-border)] text-[var(--color-text-muted)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Topics cards */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((topic) => (
          <motion.div
            key={topic.id}
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-4 group cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              {editId === topic.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="input-base h-8 flex-1 text-xs"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(topic.id)}
                  />
                  <button onClick={() => saveEdit(topic.id)} className="text-[var(--color-brand)]">
                    <Save size={14} />
                  </button>
                  <button onClick={() => setEditId(null)} className="text-[var(--color-text-muted)]">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-[var(--color-text)] leading-snug flex-1">
                    {isAr ? topic.titleAr : topic.titleEn}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); startEdit(topic) }}
                    className="hidden group-hover:flex h-6 w-6 items-center justify-center rounded text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors"
                  >
                    <Edit3 size={12} />
                  </button>
                </>
              )}
            </div>
            <p className="mb-3 text-xs text-[var(--color-text-muted)] truncate">
              {getCommitteeName(topic.committeeId)}
            </p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => cycleStatus(topic.id)}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold cursor-pointer hover:opacity-80 transition-opacity ${STATUS_STYLES[topic.status]}`}
                  title={isAr ? 'اضغط لتغيير الحالة' : 'Click to cycle status'}
                >
                  {STATUS_AR[topic.status]}
                </button>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_STYLES[topic.priority]}`}>
                  {PRIORITY_AR[topic.priority]}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-10 text-center">
          <Tag size={32} className="mx-auto mb-2 opacity-20 text-[var(--color-text-muted)]" />
          <p className="text-sm text-[var(--color-text-muted)]">لا توجد مواضيع مطابقة</p>
        </div>
      )}

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCreate(true)}
        className="fixed bottom-8 end-8 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand)] text-white shadow-xl hover:shadow-2xl transition-shadow"
      >
        <Plus size={24} />
      </motion.button>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="card w-full max-w-md p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-[var(--color-text)]">
                  {isAr ? 'إضافة موضوع جديد' : 'Add New Topic'}
                </h3>
                <button onClick={() => setShowCreate(false)}><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isAr ? 'عنوان الموضوع...' : 'Topic title...'}
                  className="input-base text-sm"
                  autoFocus
                />
                <select
                  value={newCommittee}
                  onChange={(e) => setNewCommittee(e.target.value)}
                  className="input-base text-sm"
                >
                  {COMMITTEES.map((c) => (
                    <option key={c.id} value={c.id}>{isAr ? c.nameAr : c.nameEn}</option>
                  ))}
                </select>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as Topic['priority'])}
                  className="input-base text-sm"
                >
                  {(Object.entries(PRIORITY_AR) as [Topic['priority'], string][]).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowCreate(false)} className="btn btn-ghost border-[var(--color-border)] text-sm">
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button onClick={createTopic} className="btn btn-primary text-sm gap-2">
                  <Plus size={14} />
                  {isAr ? 'إضافة' : 'Add'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
