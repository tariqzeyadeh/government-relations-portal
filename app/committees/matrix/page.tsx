'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, CheckCircle2, RotateCcw, Info, X } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit'
import { COMMITTEES } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'

// ── Lifecycle stages ──────────────────────────────────────────────────────────
const STAGES = [
  { id: 'formation', labelAr: 'التأسيس', desc: 'إصدار قرار التشكيل وتحديد الأعضاء' },
  { id: 'activation', labelAr: 'التفعيل', desc: 'توزيع الأدوار واعتماد لائحة العمل' },
  { id: 'meetings', labelAr: 'الاجتماعات', desc: 'انعقاد الجلسات الدورية والطارئة' },
  { id: 'decisions', labelAr: 'القرارات', desc: 'التصويت واعتماد القرارات الرسمية' },
  { id: 'documentation', labelAr: 'التوثيق', desc: 'إعداد المحاضر ونشر القرارات' },
  { id: 'review', labelAr: 'المراجعة', desc: 'تقييم الأداء وإعداد تقرير الأثر' },
  { id: 'closure', labelAr: 'الإغلاق', desc: 'أرشفة الملفات أو تجديد التفويض' },
]

type CellStatus = 'none' | 'in_progress' | 'done'

const STATUS_CYCLE: CellStatus[] = ['none', 'in_progress', 'done']

const STATUS_STYLE: Record<CellStatus, string> = {
  none: 'bg-[var(--color-gray-100)] text-[var(--color-text-muted)] hover:bg-[var(--color-gray-200)]',
  in_progress: 'bg-[var(--color-gold)]/20 text-[var(--color-gold)] border border-[var(--color-gold)]/40 hover:bg-[var(--color-gold)]/30',
  done: 'bg-[var(--color-brand)]/15 text-[var(--color-brand)] border border-[var(--color-brand)]/30 hover:bg-[var(--color-brand)]/25',
}

const STATUS_LABEL: Record<CellStatus, string> = {
  none: '–',
  in_progress: 'جارٍ',
  done: 'مكتمل',
}

// Seed initial state based on committee id and stage
function buildInitial() {
  const init: Record<string, Record<string, CellStatus>> = {}
  COMMITTEES.forEach((c) => {
    init[c.id] = {}
    STAGES.forEach((s, idx) => {
      if (c.status === 'concluded') {
        init[c.id][s.id] = 'done'
      } else if (c.status === 'active') {
        if (idx <= 3) init[c.id][s.id] = 'done'
        else if (idx === 4) init[c.id][s.id] = 'in_progress'
        else init[c.id][s.id] = 'none'
      } else {
        // scheduled
        if (idx <= 1) init[c.id][s.id] = 'done'
        else if (idx === 2) init[c.id][s.id] = 'in_progress'
        else init[c.id][s.id] = 'none'
      }
    })
  })
  return init
}

export default function MatrixPage() {
  const { showToast } = useApp()
  const saveBarRef = useRef<HTMLDivElement>(null)

  const [matrix, setMatrix] = useState(buildInitial)
  const [saved, setSaved] = useState(buildInitial)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [tooltip, setTooltip] = useState<{ stageId: string; x: number; y: number } | null>(null)

  useEffect(() => {
    const changed = JSON.stringify(matrix) !== JSON.stringify(saved)
    setDirty(changed)
  }, [matrix, saved])

  const toggleCell = (committeeId: string, stageId: string) => {
    setMatrix((prev) => {
      const current: CellStatus = prev[committeeId]?.[stageId] ?? 'none'
      const nextIdx = (STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length
      return {
        ...prev,
        [committeeId]: { ...prev[committeeId], [stageId]: STATUS_CYCLE[nextIdx] },
      }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaved(matrix)
    setSaving(false)
    setDirty(false)
    showToast('تم حفظ مصفوفة المتابعة بنجاح')
  }

  const handleReset = () => {
    setMatrix(saved)
    setDirty(false)
    showToast('تم التراجع عن التغييرات')
  }

  // Completion stats per committee
  const getStats = (committeeId: string) => {
    const cells = Object.values(matrix[committeeId] ?? {})
    const done = cells.filter((v) => v === 'done').length
    const inP = cells.filter((v) => v === 'in_progress').length
    return { done, inP, total: cells.length }
  }

  return (
    <div className="relative space-y-5">
      <PageHeader
        title="مصفوفة متابعة دورة حياة اللجان"
        subtitle="انقر على الخلايا للتبديل بين الحالات: لم يبدأ ← جارٍ ← مكتمل"
      />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)]">
        {Object.entries(STATUS_LABEL).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <div className={`h-4 w-8 rounded text-center text-[10px] leading-4 ${STATUS_STYLE[k as CellStatus].split(' ').slice(0, 2).join(' ')}`}>
              {v}
            </div>
            <span>{k === 'none' ? 'لم يبدأ' : k === 'in_progress' ? 'جارٍ' : 'مكتمل'}</span>
          </div>
        ))}
        <span className="ms-auto text-[10px]">انقر للتبديل — اضغط حفظ لتثبيت التغييرات</span>
      </div>

      {/* Matrix table */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-elev)]">
              <th className="sticky start-0 z-10 bg-[var(--color-bg-elev)] px-4 py-3 text-right text-xs font-bold text-[var(--color-text-muted)] min-w-[200px]">
                اللجنة
              </th>
              {STAGES.map((s) => (
                <th
                  key={s.id}
                  className="px-3 py-3 text-center text-[11px] font-bold text-[var(--color-text-muted)] min-w-[90px] cursor-help"
                  onMouseEnter={(e) =>
                    setTooltip({ stageId: s.id, x: e.clientX, y: e.clientY })
                  }
                  onMouseLeave={() => setTooltip(null)}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span>{s.labelAr}</span>
                    <Info size={10} className="text-[var(--color-text-muted)]/50" />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-[11px] font-bold text-[var(--color-text-muted)]">
                الإنجاز
              </th>
            </tr>
          </thead>
          <tbody>
            {COMMITTEES.map((c, cIdx) => {
              const stats = getStats(c.id)
              const pct = Math.round((stats.done / stats.total) * 100)

              return (
                <tr
                  key={c.id}
                  className={`border-b border-[var(--color-border)] transition-colors ${cIdx % 2 === 0 ? '' : 'bg-[var(--color-gray-100)]/30'}`}
                >
                  {/* Committee name */}
                  <td className="sticky start-0 z-10 bg-[var(--color-bg-elev)] px-4 py-3">
                    <p className="text-sm font-semibold text-[var(--color-text)]">{c.nameAr}</p>
                    <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{c.chairAr}</p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                        c.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-700'
                          : c.status === 'scheduled'
                            ? 'bg-amber-500/15 text-amber-700'
                            : 'bg-gray-500/15 text-gray-600'
                      }`}
                    >
                      {c.status === 'active' ? 'نشط' : c.status === 'scheduled' ? 'مجدوَل' : 'منتهٍ'}
                    </span>
                  </td>

                  {/* Stage cells */}
                  {STAGES.map((s) => {
                    const status: CellStatus = matrix[c.id]?.[s.id] ?? 'none'
                    return (
                      <td key={s.id} className="px-2 py-3 text-center">
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => toggleCell(c.id, s.id)}
                          className={`mx-auto flex h-8 w-16 items-center justify-center rounded-lg text-[11px] font-semibold transition-colors ${STATUS_STYLE[status]}`}
                          title={`${c.nameAr} — ${s.labelAr}: ${status === 'none' ? 'لم يبدأ' : status === 'in_progress' ? 'جارٍ' : 'مكتمل'}`}
                        >
                          {status === 'done' ? <CheckCircle2 size={13} /> : STATUS_LABEL[status]}
                        </motion.button>
                      </td>
                    )
                  })}

                  {/* Progress */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-bold text-[var(--color-text)]">{pct}%</span>
                      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[var(--color-gray-200)]">
                        <motion.div
                          className="h-1.5 rounded-full bg-[var(--color-brand)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: 0.1 * cIdx }}
                        />
                      </div>
                      <span className="text-[9px] text-[var(--color-text-muted)]">{stats.done}/{stats.total}</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Stage completion summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {STAGES.map((s) => {
          const doneCount = COMMITTEES.filter((c) => matrix[c.id]?.[s.id] === 'done').length
          const inPCount = COMMITTEES.filter((c) => matrix[c.id]?.[s.id] === 'in_progress').length
          return (
            <div key={s.id} className="card p-3 text-center">
              <p className="text-[11px] font-bold text-[var(--color-text)]">{s.labelAr}</p>
              <p className="mt-1 text-lg font-bold text-[var(--color-brand)]">{doneCount}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">مكتمل</p>
              {inPCount > 0 && (
                <p className="text-[10px] font-semibold text-[var(--color-gold)]">{inPCount} جارٍ</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Sticky save bar */}
      <div
        ref={saveBarRef}
        className={`sticky bottom-4 z-30 mx-auto max-w-sm transition-all duration-300 ${dirty ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <div className="flex items-center gap-3 rounded-xl border border-[var(--color-brand)]/30 bg-[var(--color-bg-elev)] px-4 py-3 shadow-lg">
          <span className="flex-1 text-xs text-[var(--color-text-muted)]">
            لديك تغييرات غير محفوظة
          </span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            <RotateCcw size={12} /> تراجع
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary text-xs px-4 disabled:opacity-60"
          >
            <Save size={13} /> {saving ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>

      {/* Stage tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed z-50 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-3 py-2 shadow-md text-xs max-w-[200px]"
            style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
          >
            <p className="font-bold text-[var(--color-text)]">
              {STAGES.find((s) => s.id === tooltip.stageId)?.labelAr}
            </p>
            <p className="mt-0.5 text-[var(--color-text-muted)]">
              {STAGES.find((s) => s.id === tooltip.stageId)?.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
