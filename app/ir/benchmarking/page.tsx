'use client'

import { useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { WORLD_COUNTRIES, REGION_LABELS, type WorldRegion } from '@/lib/countries-world'
import { BENCHMARKING } from '@/lib/mock-data'
import { PageHeader, SectionTitle } from '@/components/ui-kit'

const SECTORS_AR = ['الكل', 'الطاقة', 'التعدين', 'الصناعة', 'التجارة', 'التعليم', 'التكنولوجيا']

// Saudi Arabia comparison data per country pair
const COUNTRY_BENCHMARKS: Record<string, {
  labelAr: string
  labelEn: string
  dimensions: { ar: string; en: string; saudi: number; other: number }[]
}> = {
  korea: {
    labelAr: 'كوريا الجنوبية',
    labelEn: 'South Korea',
    dimensions: [
      { ar: 'الاتفاقيات', en: 'Agreements', saudi: 80, other: 90 },
      { ar: 'الزيارات', en: 'Visits', saudi: 75, other: 85 },
      { ar: 'التجارة', en: 'Trade', saudi: 70, other: 95 },
      { ar: 'الاستثمار', en: 'Investment', saudi: 85, other: 80 },
      { ar: 'التعاون التقني', en: 'Tech Cooperation', saudi: 60, other: 92 },
      { ar: 'اللجان', en: 'Committees', saudi: 90, other: 75 },
    ],
  },
  japan: {
    labelAr: 'اليابان',
    labelEn: 'Japan',
    dimensions: [
      { ar: 'الاتفاقيات', en: 'Agreements', saudi: 85, other: 88 },
      { ar: 'الزيارات', en: 'Visits', saudi: 80, other: 90 },
      { ar: 'التجارة', en: 'Trade', saudi: 90, other: 95 },
      { ar: 'الاستثمار', en: 'Investment', saudi: 75, other: 85 },
      { ar: 'التعاون التقني', en: 'Tech Cooperation', saudi: 65, other: 90 },
      { ar: 'اللجان', en: 'Committees', saudi: 85, other: 70 },
    ],
  },
  china: {
    labelAr: 'الصين',
    labelEn: 'China',
    dimensions: [
      { ar: 'الاتفاقيات', en: 'Agreements', saudi: 70, other: 95 },
      { ar: 'الزيارات', en: 'Visits', saudi: 85, other: 90 },
      { ar: 'التجارة', en: 'Trade', saudi: 95, other: 100 },
      { ar: 'الاستثمار', en: 'Investment', saudi: 80, other: 92 },
      { ar: 'التعاون التقني', en: 'Tech Cooperation', saudi: 55, other: 88 },
      { ar: 'اللجان', en: 'Committees', saudi: 75, other: 80 },
    ],
  },
  germany: {
    labelAr: 'ألمانيا',
    labelEn: 'Germany',
    dimensions: [
      { ar: 'الاتفاقيات', en: 'Agreements', saudi: 75, other: 85 },
      { ar: 'الزيارات', en: 'Visits', saudi: 70, other: 80 },
      { ar: 'التجارة', en: 'Trade', saudi: 80, other: 90 },
      { ar: 'الاستثمار', en: 'Investment', saudi: 72, other: 88 },
      { ar: 'التعاون التقني', en: 'Tech Cooperation', saudi: 78, other: 95 },
      { ar: 'اللجان', en: 'Committees', saudi: 80, other: 72 },
    ],
  },
  france: {
    labelAr: 'فرنسا',
    labelEn: 'France',
    dimensions: [
      { ar: 'الاتفاقيات', en: 'Agreements', saudi: 60, other: 78 },
      { ar: 'الزيارات', en: 'Visits', saudi: 72, other: 80 },
      { ar: 'التجارة', en: 'Trade', saudi: 75, other: 82 },
      { ar: 'الاستثمار', en: 'Investment', saudi: 65, other: 80 },
      { ar: 'التعاون التقني', en: 'Tech Cooperation', saudi: 70, other: 85 },
      { ar: 'اللجان', en: 'Committees', saudi: 65, other: 70 },
    ],
  },
}

const DEFAULT_BENCHMARK = {
  labelAr: 'الدولة المحددة',
  labelEn: 'Selected Country',
  dimensions: [
    { ar: 'الاتفاقيات', en: 'Agreements', saudi: 70, other: 65 },
    { ar: 'الزيارات', en: 'Visits', saudi: 65, other: 60 },
    { ar: 'التجارة', en: 'Trade', saudi: 60, other: 55 },
    { ar: 'الاستثمار', en: 'Investment', saudi: 75, other: 70 },
    { ar: 'التعاون التقني', en: 'Tech Cooperation', saudi: 55, other: 50 },
    { ar: 'اللجان', en: 'Committees', saudi: 80, other: 65 },
  ],
}

const TREND_ICONS = { up: TrendingUp, down: TrendingDown, stable: Minus }
const TREND_STYLES = { up: 'text-emerald-600', down: 'text-red-500', stable: 'text-amber-500' }
const TREND_AR = { up: 'صاعد', down: 'هابط', stable: 'مستقر' }

const GCC_COUNTRIES = WORLD_COUNTRIES.filter((c) =>
  ['saudi-arabia', 'uae', 'qatar', 'kuwait', 'bahrain', 'oman'].includes(c.id) ||
  c.region === 'Middle East',
)

export default function BenchmarkingPage() {
  const { language } = useApp()
  const isAr = language === 'ar'

  const [country1, setCountry1] = useState('korea')
  const [sector, setSector] = useState('الكل')

  const benchmark = COUNTRY_BENCHMARK_FOR(country1)
  const radarData = benchmark.dimensions.map((d) => ({
    subject: isAr ? d.ar : d.en,
    'المملكة العربية السعودية': d.saudi,
    [isAr ? benchmark.labelAr : benchmark.labelEn]: d.other,
  }))

  const barData = benchmark.dimensions.map((d) => ({
    name: isAr ? d.ar : d.en,
    'المملكة': d.saudi,
    [isAr ? benchmark.labelAr : benchmark.labelEn]: d.other,
  }))

  const comparisonCountry = WORLD_COUNTRIES.find((c) => c.id === country1)

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAr ? 'المقارنة المعيارية' : 'Benchmarking'}
        subtitle={isAr ? 'مقارنة مؤشرات التعاون الدولي مع الدول الشريكة' : 'Compare international cooperation KPIs with partner countries'}
      />

      {/* Filters */}
      <div className="card p-4">
        <p className="mb-3 text-sm font-semibold text-[var(--color-text)]">
          {isAr ? 'اختيار معايير المقارنة' : 'Comparison Parameters'}
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
              {isAr ? 'الدولة الأولى (المملكة)' : 'Country 1 (Saudi Arabia)'}
            </label>
            <input
              readOnly
              value={isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
              className="input-base opacity-60 cursor-not-allowed text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
              {isAr ? 'الدولة الثانية' : 'Country 2'}
            </label>
            <select
              value={country1}
              onChange={(e) => setCountry1(e.target.value)}
              className="input-base text-sm"
            >
              {WORLD_COUNTRIES.slice(0, 40).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {isAr ? c.nameAr : c.nameEn}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
              {isAr ? 'القطاع' : 'Sector'}
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="input-base text-sm"
            >
              {SECTORS_AR.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison header */}
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand)] text-xl font-bold text-white shadow">🇸🇦</div>
          <p className="text-sm font-bold text-[var(--color-text)]">{isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</p>
        </div>
        <div className="text-2xl text-[var(--color-text-muted)] font-light">vs</div>
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-gold)]/20 text-3xl shadow">
            {comparisonCountry?.flag ?? '🏳️'}
          </div>
          <p className="text-sm font-bold text-[var(--color-text)]">
            {comparisonCountry ? (isAr ? comparisonCountry.nameAr : comparisonCountry.nameEn) : benchmark.labelAr}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Radar */}
        <div className="card p-4">
          <SectionTitle title={isAr ? 'مخطط الشبكة' : 'Radar Chart'} />
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar
                name={isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
                dataKey="المملكة العربية السعودية"
                stroke="var(--color-brand)"
                fill="var(--color-brand)"
                fillOpacity={0.2}
              />
              <Radar
                name={isAr ? benchmark.labelAr : benchmark.labelEn}
                dataKey={isAr ? benchmark.labelAr : benchmark.labelEn}
                stroke="var(--color-gold)"
                fill="var(--color-gold)"
                fillOpacity={0.2}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div className="card p-4">
          <SectionTitle title={isAr ? 'المقارنة التفصيلية' : 'Detailed Comparison'} />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="var(--color-text-muted)" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="var(--color-text-muted)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="المملكة" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey={isAr ? benchmark.labelAr : benchmark.labelEn}
                fill="var(--color-gold)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed comparison table */}
      <div>
        <SectionTitle title={isAr ? 'جدول المقارنة التفصيلي' : 'Detailed Comparison Table'} />
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                <th className="p-3 text-start font-medium">{isAr ? 'المحور' : 'Dimension'}</th>
                <th className="p-3 text-start font-medium">{isAr ? 'المملكة' : 'Saudi Arabia'}</th>
                <th className="p-3 text-start font-medium">{isAr ? benchmark.labelAr : benchmark.labelEn}</th>
                <th className="p-3 text-start font-medium">{isAr ? 'الفجوة' : 'Gap'}</th>
                <th className="p-3 text-start font-medium">{isAr ? 'التوجه' : 'Direction'}</th>
              </tr>
            </thead>
            <tbody>
              {benchmark.dimensions.map((d) => {
                const gap = d.saudi - d.other
                return (
                  <tr
                    key={d.ar}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)] transition-colors"
                  >
                    <td className="p-3 font-medium text-[var(--color-text)]">{isAr ? d.ar : d.en}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-[var(--color-bg)] overflow-hidden border border-[var(--color-border)]">
                          <div className="h-full rounded-full bg-[var(--color-brand)]" style={{ width: `${d.saudi}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-[var(--color-brand)]">{d.saudi}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-[var(--color-bg)] overflow-hidden border border-[var(--color-border)]">
                          <div className="h-full rounded-full bg-[var(--color-gold)]" style={{ width: `${d.other}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-amber-600">{d.other}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs font-semibold ${gap > 0 ? 'text-emerald-600' : gap < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        {gap > 0 ? `+${gap}` : gap}
                      </span>
                    </td>
                    <td className="p-3">
                      {gap > 0 ? (
                        <TrendingUp size={14} className="text-emerald-600" />
                      ) : gap < 0 ? (
                        <TrendingDown size={14} className="text-red-500" />
                      ) : (
                        <Minus size={14} className="text-gray-400" />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global KPIs from BENCHMARKING */}
      <div>
        <SectionTitle title={isAr ? 'المؤشرات الاستراتيجية العامة' : 'Global Strategic KPIs'} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BENCHMARKING.map((bm) => {
            const TrendIcon = TREND_ICONS[bm.trend]
            const pct = Math.round((bm.value / bm.target) * 100)
            return (
              <div key={bm.id} className="card p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-[var(--color-text)] leading-snug">
                    {isAr ? bm.labelAr : bm.labelEn}
                  </p>
                  <TrendIcon size={14} className={TREND_STYLES[bm.trend]} />
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-2xl font-bold text-[var(--color-brand)]">
                    {bm.value}{bm.unit}
                  </span>
                  <span className="mb-0.5 text-xs text-[var(--color-text-muted)]">
                    / {bm.target}{bm.unit} {isAr ? 'الهدف' : 'target'}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--color-bg)] overflow-hidden border border-[var(--color-border)]">
                  <div
                    className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : pct >= 80 ? 'bg-[var(--color-brand)]' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                  <span>{bm.period}</span>
                  <span className={`font-semibold ${pct >= 100 ? 'text-emerald-600' : 'text-[var(--color-brand)]'}`}>
                    {pct}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function COUNTRY_BENCHMARK_FOR(id: string) {
  return COUNTRY_BENCHMARKS[id] ?? {
    ...DEFAULT_BENCHMARK,
    labelAr: WORLD_COUNTRIES.find((c) => c.id === id)?.nameAr ?? 'الدولة المحددة',
    labelEn: WORLD_COUNTRIES.find((c) => c.id === id)?.nameEn ?? 'Selected Country',
  }
}
