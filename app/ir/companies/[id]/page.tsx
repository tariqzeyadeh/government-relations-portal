'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Building2, ExternalLink, Globe, MapPin, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit'
import { getCompanyById } from '@/lib/companies-mock'
import { useApp } from '@/lib/app-context'

type TabId = 'cooperation' | 'investments' | 'stakeholders'

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isRtl } = useApp()
  const company = getCompanyById(id) ?? getCompanyById('1')
  const [tab, setTab] = useState<TabId>('cooperation')

  if (!company) {
    return (
      <div className="card p-12 text-center">
        <p className="text-sm">لم يتم العثور على الشركة</p>
        <Link href="/ir/companies" className="mt-3 inline-block text-sm text-[#2fa9e0]">
          ← العودة إلى دليل الشركات
        </Link>
      </div>
    )
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'cooperation', label: 'مجالات التعاون' },
    { id: 'investments', label: 'الاستثمارات' },
    { id: 'stakeholders', label: 'أصحاب المصلحة' },
  ]

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        title={company.nameAr}
        subtitle={company.nameEn}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/ir/companies"
              className="inline-flex items-center rounded-lg border border-[#2fa9e0]/40 bg-[#e8f6fc] px-4 py-2 text-sm font-semibold text-[#2fa9e0] no-underline transition-colors hover:bg-[#d7f0fa]"
            >
              دليل الشركات
            </Link>
            <Link
              href={`/ir/companies/${company.id}/edit`}
              className="inline-flex items-center rounded-lg bg-[#2fa9e0] px-4 py-2 text-sm font-semibold text-white no-underline shadow-sm transition-colors hover:bg-[#2896c9]"
            >
              تعديل بيانات الشركة
            </Link>
          </div>
        }
      />

      {/* Profile header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-lg font-extrabold text-slate-700">
            {company.logoInitials}
          </div>
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{company.nameAr}</h2>
              <span className="rounded-full bg-slate-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                {company.sectorAr}
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                {company.journeyStatus}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" /> {company.hqAr}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" /> تأسست {company.established}
              </span>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-500 no-underline hover:text-[#2fa9e0]"
              >
                <Globe size={13} className="text-slate-400" /> الموقع <ExternalLink size={11} />
              </a>
              <span className="inline-flex items-center gap-1.5">
                {company.countryFlag} {company.countryNameAr}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-10">
        {/* Main ~70% */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  tab === t.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            {tab === 'cooperation' && (
              <ul className="space-y-2">
                {company.cooperationAreasAr.map((area) => (
                  <li
                    key={area}
                    className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    <Building2 size={15} className="shrink-0 text-[#2fa9e0]" />
                    {area}
                  </li>
                ))}
              </ul>
            )}

            {tab === 'investments' && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-900">منصة رحلة المستثمر</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-semibold text-slate-500">الاستثمارات الحالية</p>
                    <p className="mt-1 text-xl font-extrabold text-slate-900">{company.currentInvestment}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-semibold text-slate-500">الاستثمارات المخططة</p>
                    <p className="mt-1 text-xl font-extrabold text-[#2fa9e0]">{company.plannedInvestment}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-500">
                  حالة الربط:{' '}
                  <span className="font-semibold text-slate-800">
                    {company.linkedToInvestorJourney ? 'مربوط بمنصة رحلة المستثمر' : 'غير مربوط'}
                  </span>
                  {' · '}حالة الاستثمار:{' '}
                  <span className="font-semibold text-slate-800">{company.investmentStatus}</span>
                </div>
              </div>
            )}

            {tab === 'stakeholders' && (
              <ul className="space-y-3">
                {company.stakeholders.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                      {s.nameAr.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{s.nameAr}</p>
                      <p className="text-xs text-slate-500">{s.roleAr}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar ~30% */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-slate-900">تغذية الأخبار الحية</h3>
            <ul className="space-y-0">
              {company.news.map((n, i) => (
                <li
                  key={i}
                  className={`py-3 ${i < company.news.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <p className="text-[10px] text-slate-400" dir="ltr">
                    {n.date}
                  </p>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-slate-800">{n.titleAr}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
