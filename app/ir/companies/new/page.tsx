'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit'
import { COMPANY_SECTORS } from '@/lib/companies-mock'
import { useApp } from '@/lib/app-context'

const COUNTRIES = [
  { id: 'korea', nameAr: 'كوريا الجنوبية' },
  { id: 'japan', nameAr: 'اليابان' },
  { id: 'china', nameAr: 'الصين' },
  { id: 'germany', nameAr: 'ألمانيا' },
  { id: 'france', nameAr: 'فرنسا' },
  { id: 'australia', nameAr: 'أستراليا' },
]

export default function NewCompanyPage() {
  const router = useRouter()
  const { showToast, isRtl } = useApp()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    nameAr: '',
    nameEn: '',
    sector: COMPANY_SECTORS[0],
    countryId: COUNTRIES[0].id,
    hqAr: '',
    linkedJourney: true,
  })
  const [stakeholders, setStakeholders] = useState([{ name: '', position: '' }])

  const canSubmit = form.nameAr.trim() && form.nameEn.trim() && form.hqAr.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 700))
    showToast('تم إضافة الشركة بنجاح')
    router.push('/ir/companies/1')
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        title="إضافة شركة جديدة"
        subtitle="تسجيل شركة في منظومة العلاقات الدولية"
        actions={
          <Link href="/ir/companies" className="btn border-border text-sm no-underline">
            إلغاء
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-4 p-5 sm:p-6">
          <h2 className="text-sm font-bold text-foreground">المعلومات الأساسية</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="اسم الشركة (عربي) *">
              <input
                className="input-base"
                value={form.nameAr}
                onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
                placeholder="مثال: سيمنز للطاقة"
              />
            </Field>
            <Field label="اسم الشركة (إنجليزي) *">
              <input
                className="input-base"
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                placeholder="e.g. Siemens Energy"
              />
            </Field>
            <Field label="القطاع *">
              <select
                className="input-base"
                value={form.sector}
                onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
              >
                {COMPANY_SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="الدولة *">
              <select
                className="input-base"
                value={form.countryId}
                onChange={(e) => setForm((f) => ({ ...f, countryId: e.target.value }))}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameAr}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="عنوان المقر الرئيسي *" className="sm:col-span-2">
              <input
                className="input-base"
                value={form.hqAr}
                onChange={(e) => setForm((f) => ({ ...f, hqAr: e.target.value }))}
                placeholder="المدينة، الدولة"
              />
            </Field>
          </div>
        </div>

        <div className="card space-y-3 p-5 sm:p-6">
          <h2 className="text-sm font-bold text-foreground">الربط مع المنظومة</h2>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3">
            <span className="text-sm text-foreground">ربط مع منصة رحلة المستثمر</span>
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--color-brand)]"
              checked={form.linkedJourney}
              onChange={(e) => setForm((f) => ({ ...f, linkedJourney: e.target.checked }))}
            />
          </label>
        </div>

        <div className="card space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">أصحاب المصلحة</h2>
            <button
              type="button"
              onClick={() => setStakeholders((prev) => [...prev, { name: '', position: '' }])}
              className="btn gap-1.5 text-xs"
            >
              <Plus size={13} /> إضافة
            </button>
          </div>
          {stakeholders.map((st, idx) => (
            <div key={idx} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input
                className="input-base"
                placeholder="الاسم"
                value={st.name}
                onChange={(e) =>
                  setStakeholders((prev) => prev.map((p, i) => (i === idx ? { ...p, name: e.target.value } : p)))
                }
              />
              <input
                className="input-base"
                placeholder="المنصب"
                value={st.position}
                onChange={(e) =>
                  setStakeholders((prev) =>
                    prev.map((p, i) => (i === idx ? { ...p, position: e.target.value } : p)),
                  )
                }
              />
              <button
                type="button"
                disabled={stakeholders.length === 1}
                onClick={() => setStakeholders((prev) => prev.filter((_, i) => i !== idx))}
                className="btn border-border px-3 disabled:opacity-40"
                aria-label="حذف"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Link href="/ir/companies" className="btn text-sm no-underline">
            إلغاء
          </Link>
          <button type="submit" disabled={!canSubmit || submitting} className="btn btn-primary text-sm">
            {submitting ? 'جارٍ الحفظ…' : 'حفظ وإضافة'}
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
      <label className="mb-1.5 block text-xs font-semibold text-text-muted">{label}</label>
      {children}
    </div>
  )
}
