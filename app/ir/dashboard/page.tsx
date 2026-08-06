'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Filter, TrendingUp, Globe, Users, FileSignature, MapPin } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { AGREEMENTS, MEETINGS, TASKS } from '@/lib/mock-data'
import { WORLD_COUNTRIES, REGION_LABELS, type WorldRegion } from '@/lib/countries-world'
import { KpiCard, SectionTitle, SlaBadge, PageHeader, ViewAllLink } from '@/components/ui-kit'

const SECTORS = ['الكل', 'الطاقة', 'الصناعة والتكنولوجيا', 'المدن الذكية وتقنية المعلومات', 'التعليم والتدريب', 'الثقافة']

const BAR_DATA = [
  { month: 'يناير', مذكرات: 4, اتفاقيات: 2 },
  { month: 'فبراير', مذكرات: 3, اتفاقيات: 1 },
  { month: 'مارس', مذكرات: 5, اتفاقيات: 3 },
  { month: 'أبريل', مذكرات: 2, اتفاقيات: 2 },
  { month: 'مايو', مذكرات: 6, اتفاقيات: 4 },
  { month: 'يونيو', مذكرات: 4, اتفاقيات: 2 },
  { month: 'يوليو', مذكرات: 7, اتفاقيات: 3 },
  { month: 'أغسطس', مذكرات: 3, اتفاقيات: 1 },
]

const LINE_DATA = [
  { month: 'يناير', زيارات: 8 },
  { month: 'فبراير', زيارات: 12 },
  { month: 'مارس', زيارات: 9 },
  { month: 'أبريل', زيارات: 15 },
  { month: 'مايو', زيارات: 11 },
  { month: 'يونيو', زيارات: 18 },
  { month: 'يوليو', زيارات: 14 },
  { month: 'أغسطس', زيارات: 7 },
]

const REGIONS: WorldRegion[] = ['Asia', 'Europe', 'Africa', 'Americas', 'Middle East', 'Oceania']

const REGION_ICONS: Record<WorldRegion, string> = {
  Asia: '🌏',
  Europe: '🌍',
  Africa: '🌍',
  Americas: '🌎',
  'Middle East': '🕌',
  Oceania: '🌊',
}

export default function IRDashboardPage() {
  const { language } = useApp()
  const isAr = language === 'ar'
  const [sector, setSector] = useState('الكل')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const filteredAgreements =
    sector === 'الكل'
      ? AGREEMENTS
      : AGREEMENTS.filter((a) => a.sectorAr === sector)

  const activeCount = filteredAgreements.filter((a) => a.status === 'active').length
  const countryCount = [...new Set(filteredAgreements.map((a) => a.countryId))].length
  const upcomingMeetings = MEETINGS.filter((m) => m.status === 'upcoming').length
  const redSla = filteredAgreements.filter((a) => a.slaStatus === 'red').length

  const regionSummary = REGIONS.map((r) => ({
    region: r,
    labelAr: REGION_LABELS[r].ar,
    labelEn: REGION_LABELS[r].en,
    count: WORLD_COUNTRIES.filter((c) => c.region === r).length,
    icon: REGION_ICONS[r],
    topCountries: WORLD_COUNTRIES.filter((c) => c.region === r).slice(0, 3),
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAr ? 'لوحة العلاقات الدولية' : 'International Relations Dashboard'}
        subtitle={isAr ? 'نظرة شاملة على الاتفاقيات والشراكات الدولية' : 'Overview of agreements and international partnerships'}
        actions={
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[var(--color-text-muted)]" />
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="input-base h-9 w-auto text-sm"
            >
              {SECTORS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label={isAr ? 'الاتفاقيات النشطة' : 'Active Agreements'}
          value={activeCount}
          href="/ir/agreements"
          hint={isAr ? `${filteredAgreements.length} إجمالي` : `${filteredAgreements.length} total`}
        />
        <KpiCard
          label={isAr ? 'الدول الشريكة' : 'Partner Countries'}
          value={countryCount}
          href="/ir/countries"
          hint={isAr ? 'من 193 دولة' : 'of 193 countries'}
        />
        <KpiCard
          label={isAr ? 'اجتماعات قادمة' : 'Upcoming Meetings'}
          value={upcomingMeetings}
          href="/committees/meetings/new"
          hint={isAr ? 'خلال 14 يوماً' : 'next 14 days'}
        />
        <KpiCard
          label={isAr ? 'تنبيهات SLA' : 'SLA Alerts'}
          value={redSla}
          hint={isAr ? 'تحتاج إجراء عاجل' : 'require urgent action'}
        />
      </div>

      {/* Charts */}
      {loading ? (
        <div className="card flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-brand)] border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card p-4">
            <SectionTitle title={isAr ? 'نشاط الاتفاقيات (2026)' : 'Agreement Activity (2026)'} />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={BAR_DATA} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="مذكرات" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="اتفاقيات" fill="var(--color-gold)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-4">
            <SectionTitle title={isAr ? 'الزيارات الدبلوماسية (2026)' : 'Diplomatic Visits (2026)'} />
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={LINE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="زيارات"
                  stroke="var(--color-brand)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-brand)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Regional summary */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle title={isAr ? 'الملف الإقليمي للعالم' : 'World Regional Overview'} />
          <ViewAllLink href="/ir/countries" label={isAr ? 'كل الدول' : 'All Countries'} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {regionSummary.map(({ region, labelAr, labelEn, count, icon, topCountries }) => (
            <Link key={region} href={`/ir/countries?region=${region}`} className="no-underline">
              <div className="card card-hover cursor-pointer p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {isAr ? labelAr : labelEn}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--color-brand)]/10 px-2 py-0.5 text-xs font-bold text-[var(--color-brand)]">
                    {count}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {topCountries.map((c) => (
                    <span
                      key={c.id}
                      className="rounded bg-[var(--color-bg)] px-1.5 py-0.5 text-[11px] text-[var(--color-text-muted)]"
                    >
                      {c.flag} {isAr ? c.nameAr : c.nameEn}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent agreements */}
      <div>
        <SectionTitle
          title={isAr ? 'الاتفاقيات الأخيرة' : 'Recent Agreements'}
          viewAllHref="/ir/agreements"
        />
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                <th className="p-3 text-start font-medium">رقم الوثيقة</th>
                <th className="p-3 text-start font-medium">النوع</th>
                <th className="p-3 text-start font-medium">الطرف الثاني</th>
                <th className="p-3 text-start font-medium">المرحلة</th>
                <th className="p-3 text-start font-medium">تاريخ الانتهاء</th>
                <th className="p-3 text-start font-medium">SLA</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgreements.map((agr) => (
                <tr
                  key={agr.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)] cursor-pointer transition-colors"
                >
                  <td className="p-3 font-mono text-xs text-[var(--color-text-muted)]">{agr.documentNumber}</td>
                  <td className="p-3">
                    <span className="rounded bg-[var(--color-brand)]/10 px-1.5 py-0.5 text-[11px] font-semibold text-[var(--color-brand)]">
                      {agr.type}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-[var(--color-text)]">{isAr ? agr.countryNameAr : agr.countryNameEn}</td>
                  <td className="p-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      agr.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      agr.status === 'draft' ? 'bg-blue-100 text-blue-700' :
                      agr.status === 'expired' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {agr.status === 'active' ? 'نشط' : agr.status === 'draft' ? 'مسودة' :
                       agr.status === 'expired' ? 'منتهٍ' : 'قيد المراجعة'}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-[var(--color-text-muted)]">{agr.expiryDate}</td>
                  <td className="p-3"><SlaBadge status={agr.slaStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tasks */}
      <div>
        <SectionTitle title={isAr ? 'مهام العلاقات الدولية' : 'IR Tasks'} viewAllHref="/tasks" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {TASKS.slice(0, 6).map((task) => (
            <div
              key={task.id}
              className="card p-3 cursor-pointer hover:bg-[var(--color-bg)] transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-[var(--color-text)] leading-snug">
                  {isAr ? task.titleAr : task.titleEn}
                </p>
                <SlaBadge status={task.slaStatus} />
              </div>
              <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)]">
                {isAr ? task.assigneeAr : task.assigneeEn} · {task.dueDate}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
