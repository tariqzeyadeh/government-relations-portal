'use client'

import Link from 'next/link'
import { Vote, Calendar, Users, ChevronLeft, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/ui-kit'
import { DECISIONS, COMMITTEES, type DecisionColumn } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'

const COLUMN_AR: Record<DecisionColumn, string> = {
  pending: 'بانتظار التصويت',
  approved: 'موافق عليه',
  rejected: 'مرفوض',
  implemented: 'منفَّذ',
}

const COLUMN_STYLE: Record<DecisionColumn, string> = {
  pending: 'bg-amber-500/15 text-amber-700',
  approved: 'bg-emerald-500/15 text-emerald-700',
  rejected: 'bg-red-500/15 text-red-700',
  implemented: 'bg-blue-500/15 text-blue-700',
}

const PRIORITY_AR = { high: 'عالية', medium: 'متوسطة', low: 'منخفضة' } as const

export default function DecisionsVotingListPage() {
  const { isRtl } = useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<DecisionColumn | 'الكل'>('الكل')

  const rows = useMemo(() => {
    return DECISIONS.filter((d) => {
      const matchSearch =
        !search ||
        d.titleAr.includes(search) ||
        d.titleEn.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'الكل' || d.column === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  return (
    <div className="space-y-5">
      <PageHeader
        title={isRtl ? 'قرارات' : 'Decisions'}
        subtitle={
          isRtl
            ? 'قائمة قرارات اللجان — اضغط على قرار لفتح صفحة التصويت والتفاصيل'
            : 'Click a decision to open voting & details'
        }
      />

      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isRtl ? 'بحث في القرارات…' : 'Search decisions…'}
            className="input-base ps-9 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as DecisionColumn | 'الكل')}
          className="input-base w-auto text-sm"
        >
          <option value="الكل">كل الحالات</option>
          {(Object.keys(COLUMN_AR) as DecisionColumn[]).map((k) => (
            <option key={k} value={k}>
              {COLUMN_AR[k]}
            </option>
          ))}
        </select>
        <span className="text-xs text-text-muted">{rows.length} قرار</span>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-xs text-text-muted">
              <th className="p-3 text-start font-medium">عنوان القرار</th>
              <th className="p-3 text-start font-medium">اللجنة</th>
              <th className="p-3 text-start font-medium">التاريخ</th>
              <th className="p-3 text-start font-medium">الحالة</th>
              <th className="p-3 text-start font-medium">الأولوية</th>
              <th className="p-3 text-start font-medium">التصويت</th>
              <th className="p-3 text-start font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const committee = COMMITTEES.find((c) => c.id === d.committeeId)
              return (
                <tr key={d.id} className="border-b border-border transition-colors hover:bg-surface">
                  <td className="p-3">
                    <Link href={`/committees/voting/${d.id}`} className="group flex items-start gap-2 no-underline">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <Vote size={16} />
                      </span>
                      <span className="font-medium text-text group-hover:text-brand">
                        {isRtl ? d.titleAr : d.titleEn}
                      </span>
                    </Link>
                  </td>
                  <td className="p-3 text-xs text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <Users size={13} className="text-brand" />
                      {committee?.nameAr ?? '—'}
                    </div>
                  </td>
                  <td className="p-3 text-xs text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {d.date}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${COLUMN_STYLE[d.column]}`}>
                      {COLUMN_AR[d.column]}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-text-muted">{PRIORITY_AR[d.priority]}</td>
                  <td className="p-3 text-xs text-text-muted">
                    موافق {d.votesFor} · رافض {d.votesAgainst}
                  </td>
                  <td className="p-3 text-end">
                    <Link
                      href={`/committees/voting/${d.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand no-underline hover:underline"
                    >
                      التفاصيل والتصويت
                      <ChevronLeft size={14} />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="p-10 text-center text-sm text-text-muted">لا توجد قرارات مطابقة</div>
        )}
      </div>
    </div>
  )
}
