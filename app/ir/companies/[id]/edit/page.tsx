'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/ui-kit'
import { getCompanyById, COMPANY_SECTORS } from '@/lib/companies-mock'
import { useApp } from '@/lib/app-context'

export default function EditCompanyPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { showToast, isRtl } = useApp()
  const company = getCompanyById(id) ?? getCompanyById('1')

  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    nameAr: company?.nameAr ?? '',
    nameEn: company?.nameEn ?? '',
    sector: company?.sectorAr ?? COMPANY_SECTORS[0],
    hqAr: company?.hqAr ?? '',
    website: company?.website ?? '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    showToast('تم حفظ تعديلات الشركة')
    router.push(`/ir/companies/${id}`)
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        title="تعديل بيانات الشركة"
        subtitle={company?.nameAr}
        actions={
          <Link href={`/ir/companies/${id}`} className="btn border-border text-sm no-underline">
            إلغاء
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="card space-y-4 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم الشركة (عربي)">
            <input
              className="input-base"
              value={form.nameAr}
              onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
            />
          </Field>
          <Field label="اسم الشركة (إنجليزي)">
            <input
              className="input-base"
              value={form.nameEn}
              onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
            />
          </Field>
          <Field label="القطاع">
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
          <Field label="الموقع الإلكتروني">
            <input
              className="input-base"
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            />
          </Field>
          <Field label="المقر الرئيسي" className="sm:col-span-2">
            <input
              className="input-base"
              value={form.hqAr}
              onChange={(e) => setForm((f) => ({ ...f, hqAr: e.target.value }))}
            />
          </Field>
        </div>
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Link href={`/ir/companies/${id}`} className="btn text-sm no-underline">
            إلغاء
          </Link>
          <button type="submit" disabled={submitting} className="btn btn-primary text-sm">
            {submitting ? 'جارٍ الحفظ…' : 'حفظ التعديلات'}
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
