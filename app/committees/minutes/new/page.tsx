'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Save } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit'
import { COMMITTEES, MEETINGS } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'

export default function NewMinutesPage() {
  const router = useRouter()
  const { showToast } = useApp()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    titleAr: '',
    meetingId: MEETINGS[0]?.id ?? '',
    committeeId: COMMITTEES[0]?.id ?? '',
    date: '',
    authorAr: 'أمانة اللجنة',
    bodyAr: '',
  })

  const canSubmit =
    form.titleAr.trim() && form.meetingId && form.committeeId && form.date && form.bodyAr.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 700))
    showToast('تم إنشاء المحضر بنجاح')
    router.push(`/committees/minutes/${form.meetingId}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="إنشاء محضر جديد"
        subtitle="أدخل بيانات المحضر ومحتواه الأولي ثم احفظ كمسودة"
        actions={
          <Link href="/committees/minutes" className="btn border-border text-sm no-underline">
            العودة للقائمة
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="card space-y-5 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="عنوان المحضر *">
            <input
              className="input-base"
              value={form.titleAr}
              placeholder="مثال: محضر الجلسة الثانية — لجنة التعدين"
              onChange={(e) => setForm((f) => ({ ...f, titleAr: e.target.value }))}
            />
          </Field>

          <Field label="الاجتماع المرتبط *">
            <select
              className="input-base"
              value={form.meetingId}
              onChange={(e) => {
                const meetingId = e.target.value
                const meeting = MEETINGS.find((m) => m.id === meetingId)
                setForm((f) => ({
                  ...f,
                  meetingId,
                  committeeId: meeting?.committeeId ?? f.committeeId,
                  titleAr: f.titleAr || (meeting ? `محضر — ${meeting.titleAr}` : f.titleAr),
                  date: f.date || meeting?.date || '',
                }))
              }}
            >
              {MEETINGS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.titleAr} ({m.date})
                </option>
              ))}
            </select>
          </Field>

          <Field label="اللجنة *">
            <select
              className="input-base"
              value={form.committeeId}
              onChange={(e) => setForm((f) => ({ ...f, committeeId: e.target.value }))}
            >
              {COMMITTEES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameAr}
                </option>
              ))}
            </select>
          </Field>

          <Field label="تاريخ الجلسة *">
            <input
              className="input-base"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </Field>

          <Field label="معدّ المحضر" className="sm:col-span-2">
            <input
              className="input-base"
              value={form.authorAr}
              onChange={(e) => setForm((f) => ({ ...f, authorAr: e.target.value }))}
            />
          </Field>
        </div>

        <Field label="نص المحضر *">
          <textarea
            className="input-base min-h-[220px] resize-y font-mono text-sm leading-relaxed"
            value={form.bodyAr}
            placeholder={`محضر الجلسة\n\nأولاً: افتتاح الجلسة\nثانياً: اعتماد جدول الأعمال\nثالثاً: المناقشات والقرارات\n...`}
            onChange={(e) => setForm((f) => ({ ...f, bodyAr: e.target.value }))}
          />
        </Field>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
          <Link href="/committees/minutes" className="btn text-sm no-underline">
            إلغاء
          </Link>
          <button type="submit" disabled={!canSubmit || submitting} className="btn btn-primary gap-2 text-sm">
            {submitting ? (
              'جارٍ الحفظ…'
            ) : (
              <>
                <Save size={14} /> إنشاء المحضر <ArrowRight size={14} />
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
