'use client'

import Link from 'next/link'
import { FileText, Calendar, Users, ChevronLeft, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/ui-kit'
import { MEETINGS, COMMITTEES } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'

type MinuteStatus = 'مسودة' | 'قيد المراجعة' | 'معتمد' | 'منشور'

const STATUS_STYLE: Record<MinuteStatus, string> = {
  مسودة: 'bg-gray-100 text-gray-700',
  'قيد المراجعة': 'bg-amber-500/15 text-amber-700',
  معتمد: 'bg-blue-500/15 text-blue-700',
  منشور: 'bg-emerald-500/15 text-emerald-700',
}

/** Canonical list of minutes — detail lives at /committees/minutes/[id] */
const MINUTES_LIST = [
  {
    id: 'mining-2026',
    meetingId: 'mtg-mining-2026-02',
    titleAr: 'محضر الجلسة الثانية — لجنة التعدين',
    titleEn: 'Minutes — Mining Committee 2nd Session',
    date: '2026-08-07',
    status: 'قيد المراجعة' as MinuteStatus,
    authorAr: 'أمانة اللجنة',
    pages: 8,
  },
  {
    id: 'mtg-mining-2026-01',
    meetingId: 'mtg-mining-2026-01',
    titleAr: 'محضر الجلسة الافتتاحية — لجنة التعدين',
    titleEn: 'Minutes — Mining Committee Inaugural Session',
    date: '2026-05-15',
    status: 'منشور' as MinuteStatus,
    authorAr: 'أمانة اللجنة',
    pages: 6,
  },
  {
    id: 'mtg-jec-2026-03',
    meetingId: 'mtg-jec-2026-03',
    titleAr: 'محضر الجلسة الثالثة — اللجنة الاقتصادية المشتركة',
    titleEn: 'Minutes — JEC 3rd Session',
    date: '2026-08-08',
    status: 'مسودة' as MinuteStatus,
    authorAr: 'د. خالد الغامدي',
    pages: 5,
  },
  {
    id: '1',
    meetingId: 'mtg-mining-2026-02',
    titleAr: 'محضر الجلسة الثانية (نسخة مختصرة)',
    titleEn: 'Minutes — Session 2 (short)',
    date: '2026-08-07',
    status: 'معتمد' as MinuteStatus,
    authorAr: 'م. أحمد المحمد',
    pages: 4,
  },
  {
    id: 'tiap-2026-01',
    meetingId: 'mtg-mining-2026-01',
    titleAr: 'محضر اللجنة الاستشارية للتكنولوجيا — يوليو 2026',
    titleEn: 'TIAP Minutes — July 2026',
    date: '2026-07-22',
    status: 'منشور' as MinuteStatus,
    authorAr: 'د. سارة الرشيدي',
    pages: 7,
  },
]

export default function MinutesListPage() {
  const { isRtl } = useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<MinuteStatus | 'الكل'>('الكل')

  const rows = useMemo(() => {
    return MINUTES_LIST.filter((m) => {
      const matchSearch =
        !search ||
        m.titleAr.includes(search) ||
        m.titleEn.toLowerCase().includes(search.toLowerCase()) ||
        m.authorAr.includes(search)
      const matchStatus = statusFilter === 'الكل' || m.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  return (
    <div className="space-y-5">
      <PageHeader
        title={isRtl ? 'المحاضر' : 'Meeting Minutes'}
        subtitle={isRtl ? 'قائمة محاضر جلسات اللجان — اضغط على محضر لعرض التفاصيل' : 'Click a minute to open details'}
      />

      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isRtl ? 'بحث في المحاضر…' : 'Search minutes…'}
            className="input-base ps-9 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as MinuteStatus | 'الكل')}
          className="input-base w-auto text-sm"
        >
          <option value="الكل">كل الحالات</option>
          <option value="مسودة">مسودة</option>
          <option value="قيد المراجعة">قيد المراجعة</option>
          <option value="معتمد">معتمد</option>
          <option value="منشور">منشور</option>
        </select>
        <span className="text-xs text-text-muted">{rows.length} محضر</span>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-xs text-text-muted">
              <th className="p-3 text-start font-medium">عنوان المحضر</th>
              <th className="p-3 text-start font-medium">اللجنة / الجلسة</th>
              <th className="p-3 text-start font-medium">التاريخ</th>
              <th className="p-3 text-start font-medium">الحالة</th>
              <th className="p-3 text-start font-medium">المُعدّ</th>
              <th className="p-3 text-start font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const meeting = MEETINGS.find((x) => x.id === m.meetingId)
              const committee = COMMITTEES.find((c) => c.id === meeting?.committeeId)
              return (
                <tr key={m.id} className="border-b border-border transition-colors hover:bg-surface">
                  <td className="p-3">
                    <Link
                      href={`/committees/minutes/${m.id}`}
                      className="group flex items-start gap-2 no-underline"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <FileText size={16} />
                      </span>
                      <span>
                        <span className="block font-medium text-text group-hover:text-brand">
                          {isRtl ? m.titleAr : m.titleEn}
                        </span>
                        <span className="text-[11px] text-text-muted">{m.pages} صفحات</span>
                      </span>
                    </Link>
                  </td>
                  <td className="p-3 text-text-muted">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Users size={13} className="text-brand" />
                      {committee?.nameAr ?? meeting?.titleAr ?? '—'}
                    </div>
                  </td>
                  <td className="p-3 text-xs text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {m.date}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[m.status]}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-text-muted">{m.authorAr}</td>
                  <td className="p-3 text-end">
                    <Link
                      href={`/committees/minutes/${m.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand no-underline hover:underline"
                    >
                      التفاصيل
                      <ChevronLeft size={14} />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="p-10 text-center text-sm text-text-muted">لا توجد محاضر مطابقة</div>
        )}
      </div>
    </div>
  )
}
