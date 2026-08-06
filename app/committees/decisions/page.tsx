'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Link2, Calendar, Users, ThumbsUp, ThumbsDown,
  GripVertical, Filter, Search, X, ChevronDown,
} from 'lucide-react'
import { PageHeader, SlaBadge } from '@/components/ui-kit'
import { DECISIONS, COMMITTEES } from '@/lib/mock-data'
import type { DecisionColumn } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'

const COLUMNS: { id: DecisionColumn; label: string; color: string; dotColor: string }[] = [
  { id: 'pending', label: 'معلّق', color: 'bg-amber-500/10 border-amber-400/40', dotColor: 'bg-amber-400' },
  { id: 'approved', label: 'موافق عليه', color: 'bg-emerald-500/10 border-emerald-400/40', dotColor: 'bg-emerald-500' },
  { id: 'rejected', label: 'مرفوض', color: 'bg-red-500/10 border-red-400/40', dotColor: 'bg-red-500' },
  { id: 'implemented', label: 'منفّذ', color: 'bg-blue-500/10 border-blue-400/40', dotColor: 'bg-blue-500' },
]

const PRIORITY_COLOR = {
  high: 'bg-red-500/15 text-red-700 dark:text-red-300',
  medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  low: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
}
const PRIORITY_LABEL = { high: 'عالية', medium: 'متوسطة', low: 'منخفضة' }

// Seed with extra decisions per column so we have ≥2 per column
const EXTRA_DECISIONS = [
  {
    id: 'dec-ex1', titleEn: 'Approve Technical Exchange Protocol', titleAr: 'اعتماد بروتوكول التبادل الفني مع كوريا',
    column: 'pending' as DecisionColumn, committeeId: 'tiap-2026', date: '2026-08-22', votesFor: 5, votesAgainst: 1, priority: 'medium' as const,
  },
  {
    id: 'dec-ex2', titleEn: 'Approve Investment Framework Review', titleAr: 'اعتماد مراجعة إطار الاستثمار للمرحلة الثانية',
    column: 'approved' as DecisionColumn, committeeId: 'mining-2026', date: '2026-07-20', votesFor: 14, votesAgainst: 0, priority: 'high' as const,
  },
  {
    id: 'dec-ex3', titleEn: 'Reject Tourism Cooperation MoU', titleAr: 'رفض مذكرة التفاهم حول التعاون السياحي',
    column: 'rejected' as DecisionColumn, committeeId: 'jec-2026', date: '2026-07-10', votesFor: 1, votesAgainst: 9, priority: 'low' as const,
  },
  {
    id: 'dec-ex4', titleEn: 'Complete Vocational Training Partnership', titleAr: 'إتمام شراكة التدريب المهني مع ألمانيا',
    column: 'implemented' as DecisionColumn, committeeId: 'jec-2026', date: '2026-06-01', votesFor: 8, votesAgainst: 0, priority: 'medium' as const,
  },
]

const INITIAL_DECISIONS = [...DECISIONS, ...EXTRA_DECISIONS]

export default function DecisionsPage() {
  const { showToast } = useApp()
  const [decisions, setDecisions] = useState(INITIAL_DECISIONS)
  const [search, setSearch] = useState('')
  const [filterCommittee, setFilterCommittee] = useState('')
  const [dragging, setDragging] = useState<string | null>(null)
  const [draggingOver, setDraggingOver] = useState<DecisionColumn | null>(null)
  const [showLinkModal, setShowLinkModal] = useState<string | null>(null)
  const [taskInput, setTaskInput] = useState('')

  const filtered = decisions.filter((d) => {
    if (search && !d.titleAr.includes(search)) return false
    if (filterCommittee && d.committeeId !== filterCommittee) return false
    return true
  })

  const getColumn = (col: DecisionColumn) => filtered.filter((d) => d.column === col)

  // DnD handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move'
    setDragging(id)
  }

  const handleDragOver = (e: React.DragEvent, col: DecisionColumn) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDraggingOver(col)
  }

  const handleDrop = (e: React.DragEvent, col: DecisionColumn) => {
    e.preventDefault()
    if (!dragging) return
    setDecisions((prev) =>
      prev.map((d) => (d.id === dragging ? { ...d, column: col } : d)),
    )
    showToast(`نُقل القرار إلى: ${COLUMNS.find((c) => c.id === col)?.label}`)
    setDragging(null)
    setDraggingOver(null)
  }

  const handleDragEnd = () => {
    setDragging(null)
    setDraggingOver(null)
  }

  const linkTask = (decisionId: string) => {
    if (!taskInput.trim()) return
    showToast(`تم ربط المهمة «${taskInput}» بالقرار`)
    setTaskInput('')
    setShowLinkModal(null)
  }

  const getCommitteeName = (id: string) => COMMITTEES.find((c) => c.id === id)?.nameAr ?? id

  return (
    <div className="space-y-5">
      <PageHeader
        title="لوحة القرارات"
        subtitle="إدارة وتتبع القرارات عبر مراحل اعتمادها بنظام السحب والإفلات"
        actions={
          <button
            onClick={() => showToast('يمكن إضافة قرار جديد من صفحة التصويت')}
            className="btn btn-primary text-xs"
          >
            <Plus size={14} /> قرار جديد
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={13} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            className="input-base h-8 ps-8 text-xs w-48"
            placeholder="بحث في القرارات…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-base h-8 text-xs w-44"
          value={filterCommittee}
          onChange={(e) => setFilterCommittee(e.target.value)}
        >
          <option value="">جميع اللجان</option>
          {COMMITTEES.map((c) => (
            <option key={c.id} value={c.id}>{c.nameAr}</option>
          ))}
        </select>
        {(search || filterCommittee) && (
          <button
            onClick={() => { setSearch(''); setFilterCommittee('') }}
            className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            <X size={13} /> إعادة ضبط
          </button>
        )}
        <span className="ms-auto text-xs text-[var(--color-text-muted)]">
          {filtered.length} قرار
        </span>
      </div>

      {/* Kanban board */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const cards = getColumn(col.id)
          const isOver = draggingOver === col.id

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              onDragLeave={() => setDraggingOver(null)}
              className={`flex flex-col gap-3 rounded-xl border-2 p-3 transition-colors ${col.color} ${isOver ? 'ring-2 ring-[var(--color-brand)] ring-offset-2' : ''}`}
            >
              {/* Column header */}
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
                <span className="text-xs font-bold text-[var(--color-text)]">{col.label}</span>
                <span className="ms-auto rounded-full bg-[var(--color-bg-elev)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]">
                  {cards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2.5 min-h-[120px]">
                <AnimatePresence>
                  {cards.map((dec) => (
                    <motion.div
                      key={dec.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, dec.id)}
                      onDragEnd={handleDragEnd}
                      className={`cursor-grab rounded-lg bg-[var(--color-bg-elev)] p-3 shadow-sm transition-shadow active:cursor-grabbing hover:shadow-md border border-[var(--color-border)] ${dragging === dec.id ? 'opacity-50' : ''}`}
                    >
                      <div className="mb-2 flex items-start gap-1.5">
                        <GripVertical size={13} className="mt-0.5 shrink-0 text-[var(--color-text-muted)]" />
                        <p className="text-xs font-semibold leading-snug text-[var(--color-text)]">
                          {dec.titleAr}
                        </p>
                      </div>
                      <p className="mb-2 text-[10px] text-[var(--color-text-muted)]">
                        {getCommitteeName(dec.committeeId)}
                      </p>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${PRIORITY_COLOR[dec.priority]}`}>
                          {PRIORITY_LABEL[dec.priority]}
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px] text-[var(--color-text-muted)]">
                          <Calendar size={9} /> {dec.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-0.5 text-emerald-600">
                          <ThumbsUp size={10} /> {dec.votesFor}
                        </span>
                        <span className="flex items-center gap-0.5 text-red-500">
                          <ThumbsDown size={10} /> {dec.votesAgainst}
                        </span>
                        <button
                          onClick={() => { setShowLinkModal(dec.id); setTaskInput('') }}
                          className="ms-auto flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[var(--color-brand)] hover:bg-[var(--color-brand)]/10"
                        >
                          <Link2 size={10} /> ربط مهمة
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {cards.length === 0 && (
                  <div className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-border)]">
                    <span className="text-[11px] text-[var(--color-text-muted)]">أفلت هنا</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Stats strip */}
      <div className="flex flex-wrap gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-5 py-3 text-xs text-[var(--color-text-muted)]">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${col.dotColor}`} />
            <span>{col.label}:</span>
            <span className="font-bold text-[var(--color-text)]">{getColumn(col.id).length}</span>
          </div>
        ))}
        <div className="ms-auto flex items-center gap-1.5">
          <span>الإجمالي:</span>
          <span className="font-bold text-[var(--color-text)]">{filtered.length}</span>
        </div>
      </div>

      {/* Link task modal */}
      <AnimatePresence>
        {showLinkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setShowLinkModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card w-full max-w-sm p-5 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-1.5">
                  <Link2 size={15} className="text-[var(--color-brand)]" /> ربط مهمة بالقرار
                </h3>
                <button onClick={() => setShowLinkModal(null)} className="text-[var(--color-text-muted)]">
                  <X size={16} />
                </button>
              </div>
              <p className="mb-3 text-xs text-[var(--color-text-muted)]">
                {decisions.find((d) => d.id === showLinkModal)?.titleAr}
              </p>
              <input
                className="input-base text-sm"
                placeholder="اسم المهمة أو رقمها…"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && linkTask(showLinkModal!)}
                autoFocus
              />
              <div className="mt-4 flex gap-2">
                <button onClick={() => linkTask(showLinkModal!)} className="flex-1 btn btn-primary text-xs">
                  ربط المهمة
                </button>
                <button onClick={() => setShowLinkModal(null)} className="btn btn-ghost border border-[var(--color-border)] text-xs">
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
