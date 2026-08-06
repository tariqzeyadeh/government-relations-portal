'use client'

import { useMemo, useState, Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { LayoutGrid, List, Plus, Search } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit'
import { COMPANIES, COMPANY_SECTORS, type InvestmentStatus } from '@/lib/companies-mock'
import { useApp } from '@/lib/app-context'

const INVESTMENT_STATUSES: (InvestmentStatus | 'الكل')[] = ['الكل', 'نشط', 'قيد التفاوض', 'مخطط', 'متوقف']

function CompaniesListInner() {
  const { isRtl } = useApp()
  const searchParams = useSearchParams()
  const countryFilterParam = searchParams.get('country') ?? ''

  const [search, setSearch] = useState('')
  const [country, setCountry] = useState(countryFilterParam || 'الكل')
  const [sector, setSector] = useState('الكل')
  const [investment, setInvestment] = useState<InvestmentStatus | 'الكل'>('الكل')
  const [view, setView] = useState<'table' | 'grid'>('table')

  useEffect(() => {
    const c = searchParams.get('country')
    if (c) setCountry(c)
  }, [searchParams])

  const countries = useMemo(() => {
    const map = new Map<string, string>()
    COMPANIES.forEach((c) => map.set(c.countryId, c.countryNameAr))
    return Array.from(map.entries())
  }, [])

  const filtered = COMPANIES.filter((c) => {
    const matchSearch =
      !search ||
      c.nameAr.includes(search) ||
      c.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      c.sectorAr.includes(search)
    const matchCountry = country === 'الكل' || c.countryId === country
    const matchSector = sector === 'الكل' || c.sectorAr === sector
    const matchInv = investment === 'الكل' || c.investmentStatus === investment
    return matchSearch && matchCountry && matchSector && matchInv
  })

  return (
    <div className="space-y-5" dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        title="دليل الشركات"
        subtitle="إدارة الشركات المسجّلة في منظومة العلاقات الدولية"
        actions={
          <Link href="/ir/companies/new" className="btn btn-primary no-underline text-sm gap-1.5">
            <Plus size={15} /> إضافة شركة جديدة
          </Link>
        }
      />

      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[180px] flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم الشركة أو القطاع…"
            className="input-base ps-9 text-sm"
          />
        </div>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="input-base w-auto text-sm">
          <option value="الكل">كل الدول</option>
          {countries.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <select value={sector} onChange={(e) => setSector(e.target.value)} className="input-base w-auto text-sm">
          <option value="الكل">كل القطاعات</option>
          {COMPANY_SECTORS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={investment}
          onChange={(e) => setInvestment(e.target.value as InvestmentStatus | 'الكل')}
          className="input-base w-auto text-sm"
        >
          {INVESTMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === 'الكل' ? 'حالة الاستثمار' : s}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          <button
            type="button"
            onClick={() => setView('table')}
            className={`rounded-md p-1.5 ${view === 'table' ? 'bg-primary/10 text-primary' : 'text-text-muted'}`}
            aria-label="جدول"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => setView('grid')}
            className={`rounded-md p-1.5 ${view === 'grid' ? 'bg-primary/10 text-primary' : 'text-text-muted'}`}
            aria-label="شبكة"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
        <span className="text-xs text-text-muted">{filtered.length} شركة</span>
      </div>

      {view === 'table' ? (
        <div className="card overflow-hidden">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-xs text-text-muted">
                <th className="p-3 text-start font-medium">اسم الشركة</th>
                <th className="p-3 text-start font-medium">الدولة</th>
                <th className="p-3 text-start font-medium">القطاع</th>
                <th className="p-3 text-start font-medium">حالة التعاون</th>
                <th className="p-3 text-start font-medium">مؤشر الاستثمارات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border transition-colors hover:bg-surface">
                  <td className="p-3">
                    <Link href={`/ir/companies/${c.id}`} className="font-semibold text-foreground no-underline hover:text-primary">
                      {c.nameAr}
                    </Link>
                  </td>
                  <td className="p-3 text-text-muted">
                    <Link href={`/ir/companies/${c.id}`} className="no-underline text-inherit">
                      {c.countryFlag} {c.countryNameAr}
                    </Link>
                  </td>
                  <td className="p-3">
                    <Link href={`/ir/companies/${c.id}`} className="no-underline text-inherit">
                      {c.sectorAr}
                    </Link>
                  </td>
                  <td className="p-3">
                    <Link href={`/ir/companies/${c.id}`} className="no-underline text-inherit">
                      {c.cooperationStatusAr}
                    </Link>
                  </td>
                  <td className="p-3 font-semibold text-brand">
                    <Link href={`/ir/companies/${c.id}`} className="no-underline text-inherit">
                      {c.investmentsKpi}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-text-muted">لا توجد شركات مطابقة</div>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link key={c.id} href={`/ir/companies/${c.id}`} className="no-underline">
              <div className="card card-hover h-full cursor-pointer p-5">
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-extrabold text-primary">
                    {c.logoInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground line-clamp-2">{c.nameAr}</p>
                    <p className="mt-1 text-xs text-text-muted">
                      {c.countryFlag} {c.countryNameAr}
                    </p>
                  </div>
                </div>
                <span className="inline-flex rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  رحلة المستثمر: {c.journeyStatus}
                </span>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full card p-10 text-center text-sm text-text-muted">لا توجد شركات مطابقة</div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-text-muted">جاري التحميل…</div>}>
      <CompaniesListInner />
    </Suspense>
  )
}
