'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, FileSpreadsheet, BarChart2, Globe2, Users2, FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit'
import { useApp } from '@/lib/app-context'

const REPORT_TYPES = [
  { id: 'bilateral', label: 'التجارة الثنائية', icon: Globe2 },
  { id: 'committee', label: 'أداء اللجان', icon: Users2 },
  { id: 'kpi', label: 'مؤشرات الأداء', icon: BarChart2 },
  { id: 'mou', label: 'مذكرات التفاهم', icon: FileText },
  { id: 'custom', label: 'تقرير مخصص', icon: FileSpreadsheet },
]

const PERIODS = [
  'الربع الثالث 2026',
  'الربع الثاني 2026',
  'الربع الأول 2026',
  'الربع الرابع 2025',
  'سنوي 2025',
  'فترة مخصصة',
]

const FORMATS = ['PDF', 'Excel', 'Word'] as const

export default function NewReportPage() {
  const router = useRouter()
  const { showToast } = useApp()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    titleAr: '',
    typeId: 'bilateral',
    period: PERIODS[0],
    dateFrom: '',
    dateTo: '',
    audienceAr: 'القيادة التنفيذية',
    notes: '',
    format: 'PDF' as (typeof FORMATS)[number],
  })

  const needsCustomDates = form.period === 'فترة مخصصة'
  const canSubmit =
    form.titleAr.trim() &&
    form.typeId &&
    form.period &&
    (!needsCustomDates || (form.dateFrom && form.dateTo))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    showToast('تم إنشاء التقرير بنجاح')
    router.push('/reports')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="إنشاء تقرير جديد"
        subtitle="حدّد نوع التقرير والفترة والجمهور المستهدف ثم أنشئ المسودة"
        actions={
          <Link href="/reports" className="btn border-border text-sm no-underline">
            العودة للتقارير
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="card space-y-5 p-5 sm:p-6">
        <Field label="عنوان التقرير *">
          <input
            className="input-base"
            value={form.titleAr}
            placeholder="مثال: تقرير أداء اللجان — الربع الثالث 2026"
            onChange={(e) => setForm((f) => ({ ...f, titleAr: e.target.value }))}
          />
        </Field>

        <Field label="نوع التقرير *">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {REPORT_TYPES.map((rt) => {
              const Icon = rt.icon
              const selected = form.typeId === rt.id
              return (
                <button
                  key={rt.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, typeId: rt.id }))}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors ${
                    selected
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/8'
                      : 'border-border hover:border-[var(--color-brand)]/40'
                  }`}
                >
                  <Icon
                    size={18}
                    className={selected ? 'text-[var(--color-brand)]' : 'text-text-muted'}
                  />
                  <span className="text-[11px] font-semibold text-[var(--color-text)]">{rt.label}</span>
                </button>
              )
            })}
          </div>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="الفترة الزمنية *">
            <select
              className="input-base"
              value={form.period}
              onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
            >
              {PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <Field label="الجمهور المستهدف">
            <input
              className="input-base"
              value={form.audienceAr}
              onChange={(e) => setForm((f) => ({ ...f, audienceAr: e.target.value }))}
            />
          </Field>

          {needsCustomDates && (
            <>
              <Field label="من تاريخ *">
                <input
                  className="input-base"
                  type="date"
                  value={form.dateFrom}
                  onChange={(e) => setForm((f) => ({ ...f, dateFrom: e.target.value }))}
                />
              </Field>
              <Field label="إلى تاريخ *">
                <input
                  className="input-base"
                  type="date"
                  value={form.dateTo}
                  onChange={(e) => setForm((f) => ({ ...f, dateTo: e.target.value }))}
                />
              </Field>
            </>
          )}
        </div>

        <Field label="صيغة التصدير الافتراضية">
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setForm((f) => ({ ...f, format: fmt }))}
                className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-colors ${
                  form.format === fmt
                    ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white'
                    : 'border-border text-text-muted hover:border-[var(--color-brand)]/40'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </Field>

        <Field label="ملاحظات / نطاق التقرير">
          <textarea
            className="input-base min-h-[120px] resize-y text-sm leading-relaxed"
            value={form.notes}
            placeholder="حدد الأقسام المطلوبة، الدول، اللجان، أو أي نطاق خاص…"
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </Field>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
          <Link href="/reports" className="btn text-sm no-underline">
            إلغاء
          </Link>
          <button type="submit" disabled={!canSubmit || submitting} className="btn btn-primary gap-2 text-sm">
            {submitting ? (
              'جارٍ الإنشاء…'
            ) : (
              <>
                إنشاء التقرير <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-[var(--color-text-muted)]">{label}</label>
      {children}
    </div>
  )
}
