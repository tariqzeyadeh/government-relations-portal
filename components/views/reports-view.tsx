'use client'

import React, { useState } from 'react'
import {
  FileText, TrendingUp, TrendingDown, CheckCircle2, Clock,
  Download, ArrowUpRight, Star, Layers,
} from 'lucide-react'
import { useApp } from '@/lib/app-context'

const STRATEGY_KPIS = [
  { label: 'Bilateral Agreements Signed', labelAr: 'الاتفاقيات الثنائية الموقعة',      target: 25, actual: 19, unit: 'MoUs',        trend: 'up'   },
  { label: 'Active Committees',           labelAr: 'اللجان النشطة',                     target: 30, actual: 23, unit: 'committees',  trend: 'up'   },
  { label: 'Diplomatic Visits',           labelAr: 'الزيارات الدبلوماسية',              target: 40, actual: 34, unit: 'visits',      trend: 'up'   },
  { label: 'Tasks Completed On-Time',     labelAr: 'المهام المنجزة في الوقت المحدد',   target: 90, actual: 78, unit: '%',           trend: 'down' },
  { label: 'Decisions Implemented',       labelAr: 'القرارات المنفَّذة',               target: 85, actual: 81, unit: '%',           trend: 'up'   },
  { label: 'MoU Renewal Rate',            labelAr: 'معدل تجديد مذكرات التفاهم',       target: 95, actual: 88, unit: '%',           trend: 'down' },
]

const COUNTRY_PERFORMANCE = [
  { country: 'Egypt',   flag: '🇪🇬', engagementScore: 92, openMoUs: 4, committees: 2, visits: 6, tasks: 8,  overdueTasks: 0, trend: 'up'     },
  { country: 'Jordan',  flag: '🇯🇴', engagementScore: 87, openMoUs: 5, committees: 2, visits: 5, tasks: 6,  overdueTasks: 1, trend: 'up'     },
  { country: 'Morocco', flag: '🇲🇦', engagementScore: 84, openMoUs: 3, committees: 1, visits: 4, tasks: 5,  overdueTasks: 0, trend: 'up'     },
  { country: 'Iraq',    flag: '🇮🇶', engagementScore: 79, openMoUs: 2, committees: 1, visits: 3, tasks: 4,  overdueTasks: 1, trend: 'stable' },
  { country: 'Algeria', flag: '🇩🇿', engagementScore: 71, openMoUs: 3, committees: 0, visits: 2, tasks: 3,  overdueTasks: 0, trend: 'up'     },
  { country: 'Tunisia', flag: '🇹🇳', engagementScore: 65, openMoUs: 1, committees: 0, visits: 2, tasks: 2,  overdueTasks: 0, trend: 'down'   },
  { country: 'Libya',   flag: '🇱🇾', engagementScore: 61, openMoUs: 2, committees: 0, visits: 2, tasks: 2,  overdueTasks: 0, trend: 'up'     },
  { country: 'Lebanon', flag: '🇱🇧', engagementScore: 58, openMoUs: 1, committees: 0, visits: 1, tasks: 1,  overdueTasks: 0, trend: 'stable' },
]

const COMMITTEE_PERFORMANCE = [
  { name: 'Joint Economic Committee',               code: 'JEC-2026',  meetings: 5, decisionsTotal: 12, decisionsApproved: 10, tasksTotal: 15, tasksCompleted: 11, onTimeRate: 85, score: 88 },
  { name: 'Cultural & Educational Exchange',        code: 'CEC-2026',  meetings: 3, decisionsTotal: 7,  decisionsApproved: 7,  tasksTotal: 9,  tasksCompleted: 7,  onTimeRate: 92, score: 91 },
  { name: 'Technology & Innovation Advisory Panel', code: 'TIAP-2026', meetings: 2, decisionsTotal: 5,  decisionsApproved: 3,  tasksTotal: 10, tasksCompleted: 6,  onTimeRate: 70, score: 74 },
  { name: 'Security Cooperation Working Group',     code: 'SCWG-2026', meetings: 2, decisionsTotal: 4,  decisionsApproved: 3,  tasksTotal: 8,  tasksCompleted: 5,  onTimeRate: 62, score: 65 },
]

const MOU_REPORT = [
  { sector: 'Energy',              sectorAr: 'الطاقة',           total: 12, active: 8,  pending: 2, expiring: 1, expired: 1, totalValue: '$14.2B',     css: 'bg-amber-500/10 text-amber-700'   },
  { sector: 'Technology',          sectorAr: 'التكنولوجيا',      total: 9,  active: 6,  pending: 2, expiring: 0, expired: 1, totalValue: '$4.1B',      css: 'bg-blue-500/10 text-blue-700'     },
  { sector: 'Defense',             sectorAr: 'الدفاع',           total: 7,  active: 6,  pending: 1, expiring: 0, expired: 0, totalValue: 'Classified', css: 'bg-gray-200 text-gray-700'        },
  { sector: 'Culture & Education', sectorAr: 'الثقافة والتعليم', total: 11, active: 7,  pending: 1, expiring: 2, expired: 1, totalValue: '$1.8B',      css: 'bg-violet-500/10 text-violet-700' },
  { sector: 'Infrastructure',      sectorAr: 'البنية التحتية',   total: 8,  active: 5,  pending: 2, expiring: 0, expired: 1, totalValue: '$22.4B',     css: 'bg-orange-500/10 text-orange-700' },
  { sector: 'Environment',         sectorAr: 'البيئة',           total: 6,  active: 3,  pending: 2, expiring: 1, expired: 0, totalValue: '$3.2B',      css: 'bg-green-500/10 text-green-700'   },
  { sector: 'Trade',               sectorAr: 'التجارة',          total: 14, active: 11, pending: 2, expiring: 0, expired: 1, totalValue: '$31.7B',     css: 'bg-cyan-500/10 text-cyan-700'     },
]

function ScoreBar({ value }: { value: number }) {
  const color = value >= 85 ? 'bg-emerald-500' : value >= 70 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] font-bold text-[var(--color-text)] w-6 text-right">{value}</span>
    </div>
  )
}

export function ReportsView() {
  const { language } = useApp()
  const isRtl = language === 'ar'
  const [activeTab, setActiveTab] = useState('strategy')
  const [period, setPeriod] = useState('q3_2026')

  const T = {
    reportsGenerated: isRtl ? 'التقارير المُنتجة'                  : 'Reports Generated',
    avgScore:         isRtl ? 'متوسط درجة التعاون'                 : 'Avg. Engagement Score',
    kpisOnTrack:      isRtl ? 'مؤشرات في المسار الصحيح'            : 'KPIs On-Track',
    pendingReviews:   isRtl ? 'مراجعات معلقة'                      : 'Pending Reviews',
    thisQtr:          isRtl ? 'هذا الربع'                          : 'This quarter',
    vsQ2:             isRtl ? '+3.2 مقارنة بالربع الثاني'           : '+3.2 vs Q2',
    hitRate:          isRtl ? 'معدل تحقق 66%'                      : '66% hit rate',
    overdue2:         isRtl ? '2 متأخرة'                           : '2 overdue',
    strategyKPIs:     isRtl ? 'مؤشرات الأداء الاستراتيجية'         : 'Strategy KPIs',
    countryPerf:      isRtl ? 'أداء الدول'                         : 'Country Performance',
    committeePerf:    isRtl ? 'أداء اللجان'                        : 'Committee Performance',
    mouStatus:        isRtl ? 'حالة مذكرات التفاهم'                : 'MoU Status',
    export:           isRtl ? 'تصدير'                              : 'Export',
    onTrack:          isRtl ? 'في المسار'                          : 'On Track',
    atRisk:           isRtl ? 'في خطر'                             : 'At Risk',
    behind:           isRtl ? 'متأخر'                              : 'Behind',
    stratHealthTitle: isRtl ? 'الصحة العامة للاستراتيجية — الربع الثالث 2026' : 'Overall Strategy Health — Q3 2026',
    kpisOnTrackDesc:  isRtl ? '4 من 6 مؤشرات أداء في المسار الصحيح (67%)' : '4 of 6 KPIs are on-track (67%)',
    target:           isRtl ? 'الهدف:'                             : 'Target:',
    ofTarget:         isRtl ? '% من الهدف'                         : '% of target',
    country:          isRtl ? 'الدولة'                             : 'Country',
    engagement:       isRtl ? 'التعاون'                            : 'Engagement',
    moUs:             isRtl ? 'مذكرات'                             : 'MoUs',
    committees:       isRtl ? 'لجان'                               : 'Committees',
    visits:           isRtl ? 'زيارات'                             : 'Visits',
    tasks:            isRtl ? 'مهام'                               : 'Tasks',
    overdueLabel:     isRtl ? 'متأخرة'                             : 'Overdue',
    score:            isRtl ? 'الدرجة'                             : 'Score',
    countryScorecard: isRtl ? 'بطاقة تقييم الدول — الربع الثالث 2026' : 'Country Engagement Scorecard — Q3 2026',
    decisionRate:     isRtl ? 'معدل القرارات'                      : 'Decision Rate',
    taskCompletion:   isRtl ? 'إنجاز المهام'                       : 'Task Completion',
    onTimeRate:       isRtl ? 'معدل الالتزام بالوقت'               : 'On-Time Rate',
    perfScore:        isRtl ? 'درجة الأداء'                        : 'Perf. Score',
    meetingsHeld:     isRtl ? 'اجتماع عُقد'                        : 'meetings held',
    excellent:        isRtl ? 'ممتاز'                              : 'Excellent',
    good:             isRtl ? 'جيد'                                : 'Good',
    needsImprove:     isRtl ? 'يحتاج تحسين'                        : 'Needs Improvement',
    mouPortfolio:     isRtl ? 'محفظة مذكرات التفاهم حسب القطاع'    : 'MoU Portfolio by Sector',
    sector:           isRtl ? 'القطاع'                             : 'Sector',
    total:            isRtl ? 'الإجمالي'                           : 'Total',
    active:           isRtl ? 'نشط'                                : 'Active',
    pending:          isRtl ? 'معلق'                               : 'Pending',
    expiring:         isRtl ? 'ينتهي قريباً'                       : 'Expiring',
    expired:          isRtl ? 'منتهي'                              : 'Expired',
    portfolioValue:   isRtl ? 'قيمة المحفظة'                       : 'Portfolio Value',
    distribution:     isRtl ? 'التوزيع'                            : 'Distribution',
    totalRow:         isRtl ? 'الإجمالي'                           : 'Total',
  }

  const REPORT_STATS = [
    { label: T.reportsGenerated, value: '24',  icon: FileText,     color: 'text-blue-600',    bg: 'bg-blue-500/10',    change: T.thisQtr  },
    { label: T.avgScore,         value: '74.6', icon: Star,         color: 'text-amber-600',   bg: 'bg-amber-500/10',   change: T.vsQ2     },
    { label: T.kpisOnTrack,      value: '4/6',  icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10', change: T.hitRate  },
    { label: T.pendingReviews,   value: '3',    icon: Clock,        color: 'text-violet-600',  bg: 'bg-violet-500/10',  change: T.overdue2 },
  ]

  const TABS = [
    { key: 'strategy',   label: T.strategyKPIs  },
    { key: 'countries',  label: T.countryPerf   },
    { key: 'committees', label: T.committeePerf },
    { key: 'mous',       label: T.mouStatus     },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm p-5 flex items-center gap-4">
              <div className={`p-2.5 rounded-xl shrink-0 ${stat.bg}`}><Icon className={`w-5 h-5 ${stat.color}`} /></div>
              <div>
                <p className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-extrabold text-[var(--color-text)] mt-0.5">{stat.value}</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{stat.change}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div>
        <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
          <div className="flex gap-1 p-1 rounded-xl bg-gray-100/60 flex-wrap">
            {TABS.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${activeTab === tab.key ? 'bg-[var(--color-surface-elevated)] shadow-sm text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select value={period} onChange={(e) => setPeriod(e.target.value)}
              className="h-9 px-3 rounded-xl bg-gray-100/50 border border-[var(--color-border)]/60 text-[12px] text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]/40">
              <option value="q3_2026">Q3 2026</option>
              <option value="q2_2026">Q2 2026</option>
              <option value="q1_2026">Q1 2026</option>
              <option value="fy_2026">FY 2026 YTD</option>
            </select>
            <button className="flex items-center gap-1.5 text-[12px] bg-[var(--color-brand)] text-white px-3.5 py-2 rounded-xl hover:bg-[var(--color-brand2)] transition-all font-medium shadow-sm">
              <Download className="w-3.5 h-3.5" />{T.export}
            </button>
          </div>
        </div>

        {activeTab === 'strategy' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STRATEGY_KPIS.map((kpi) => {
                const pct = Math.round((kpi.actual / kpi.target) * 100)
                const onTrack = pct >= 85
                const atRisk  = pct >= 70 && pct < 85
                const barColor = onTrack ? 'bg-emerald-500' : atRisk ? 'bg-amber-500' : 'bg-red-500'
                const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown
                const trendColor = kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                return (
                  <div key={kpi.label} className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-[13px] font-bold text-[var(--color-text)]">{isRtl ? kpi.labelAr : kpi.label}</p>
                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{T.target} {kpi.target} {kpi.unit}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl font-extrabold text-[var(--color-text)]">{kpi.actual}</p>
                        <div className={`flex items-center gap-0.5 justify-end mt-0.5 ${trendColor}`}>
                          <TrendIcon className="w-3 h-3" />
                          <span className="text-[10px] font-semibold">{pct}{T.ofTarget}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                      <span className={`inline-flex items-center text-[9px] font-semibold rounded-lg px-2 py-0.5 shrink-0 ${onTrack ? 'bg-emerald-500/10 text-emerald-700' : atRisk ? 'bg-amber-500/10 text-amber-700' : 'bg-red-500/10 text-red-600'}`}>
                        {onTrack ? T.onTrack : atRisk ? T.atRisk : T.behind}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-[14px] font-bold text-[var(--color-text)]">{T.stratHealthTitle}</p>
                  <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">{T.kpisOnTrackDesc}</p>
                </div>
                <div className="flex items-center gap-6">
                  {[{ v: 4, label: T.onTrack, c: 'text-emerald-600' }, { v: 1, label: T.atRisk, c: 'text-amber-600' }, { v: 1, label: T.behind, c: 'text-red-500' }].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className={`text-2xl font-extrabold ${s.c}`}>{s.v}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] font-semibold">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 h-2.5 rounded-full bg-gray-200 overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: '67%' }} />
                <div className="bg-amber-500 h-full"  style={{ width: '16%' }} />
                <div className="bg-red-500 h-full"    style={{ width: '17%' }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'countries' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm overflow-hidden">
              <div className="px-6 pt-5 pb-4 border-b border-[var(--color-border)]/50">
                <h3 className="text-[14px] font-bold text-[var(--color-text)]">{T.countryScorecard}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]/50 bg-gray-100/30">
                      {[T.country, T.engagement, T.moUs, T.committees, T.visits, T.tasks, T.overdueLabel, T.score].map((h) => (
                        <th key={h} className={`py-3 font-semibold text-[var(--color-text-muted)] ${h === T.country || h === T.score ? 'text-left px-5' : 'text-center px-4'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COUNTRY_PERFORMANCE.map((cp, i) => {
                      const TrendIcon = cp.trend === 'up' ? TrendingUp : cp.trend === 'down' ? TrendingDown : ArrowUpRight
                      const trendColor = cp.trend === 'up' ? 'text-emerald-500' : cp.trend === 'down' ? 'text-red-500' : 'text-[var(--color-text-muted)]'
                      return (
                        <tr key={cp.country} className={`border-b border-[var(--color-border)]/30 hover:bg-gray-100/20 transition-colors ${i % 2 !== 0 ? 'bg-gray-100/10' : ''}`}>
                          <td className="px-5 py-3.5"><div className="flex items-center gap-2"><span className="text-lg">{cp.flag}</span><span className="font-semibold text-[var(--color-text)]">{cp.country}</span></div></td>
                          <td className="text-center px-4 py-3.5"><TrendIcon className={`w-3 h-3 ${trendColor} mx-auto`} /></td>
                          <td className="text-center px-4 py-3.5 font-semibold text-[var(--color-text)]">{cp.openMoUs}</td>
                          <td className="text-center px-4 py-3.5 font-semibold text-[var(--color-text)]">{cp.committees}</td>
                          <td className="text-center px-4 py-3.5 font-semibold text-[var(--color-text)]">{cp.visits}</td>
                          <td className="text-center px-4 py-3.5 font-semibold text-[var(--color-text)]">{cp.tasks}</td>
                          <td className="text-center px-4 py-3.5">
                            <span className={`font-bold ${cp.overdueTasks > 0 ? 'text-red-500' : 'text-emerald-600'}`}>{cp.overdueTasks > 0 ? cp.overdueTasks : '–'}</span>
                          </td>
                          <td className="px-5 py-3.5 w-40"><ScoreBar value={cp.engagementScore} /></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COUNTRY_PERFORMANCE.slice(0, 3).map((cp, i) => (
                <div key={cp.country} className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center text-xl shrink-0">{cp.flag}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-[var(--color-text-muted)]">#{i + 1}</span>
                      <h3 className="text-[13px] font-bold text-[var(--color-text)]">{cp.country}</h3>
                    </div>
                    <div className="mt-1.5"><ScoreBar value={cp.engagementScore} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'committees' && (
          <div className="space-y-3">
            {COMMITTEE_PERFORMANCE.map((cp) => {
              const decisionRate = Math.round((cp.decisionsApproved / cp.decisionsTotal) * 100)
              const taskRate     = Math.round((cp.tasksCompleted    / cp.tasksTotal)     * 100)
              return (
                <div key={cp.code} className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[14px] font-bold text-[var(--color-text)]">{cp.name}</h3>
                        <span className="inline-flex items-center text-[10px] bg-gray-100 text-[var(--color-text-muted)] rounded-lg font-medium px-2 py-0.5">{cp.code}</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-muted)]">{cp.meetings} {T.meetingsHeld}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-extrabold text-[var(--color-text)]">{cp.score}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] font-semibold">{T.perfScore}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: T.decisionRate,   val: cp.decisionsApproved, max: cp.decisionsTotal, pct: decisionRate   },
                      { label: T.taskCompletion, val: cp.tasksCompleted,    max: cp.tasksTotal,     pct: taskRate       },
                      { label: T.onTimeRate,     val: `${cp.onTimeRate}%`,  max: null,              pct: cp.onTimeRate  },
                    ].map(({ label, val, max, pct }) => (
                      <div key={label}>
                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">{label}</p>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[15px] font-extrabold text-[var(--color-text)]">{val}</span>
                          {max && <span className="text-[11px] text-[var(--color-text-muted)]">/ {max}</span>}
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 65 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3.5 flex items-center gap-1.5">
                    <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div className={`h-full rounded-full ${cp.score >= 85 ? 'bg-emerald-500' : cp.score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${cp.score}%` }} />
                    </div>
                    <span className={`inline-flex items-center text-[9px] font-semibold rounded-lg px-2 py-0.5 shrink-0 ${cp.score >= 85 ? 'bg-emerald-500/10 text-emerald-700' : cp.score >= 70 ? 'bg-amber-500/10 text-amber-700' : 'bg-red-500/10 text-red-600'}`}>
                      {cp.score >= 85 ? T.excellent : cp.score >= 70 ? T.good : T.needsImprove}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'mous' && (
          <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[var(--color-border)]/50 flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-[14px] font-bold text-[var(--color-text)]">{T.mouPortfolio}</h3>
              <div className="flex items-center gap-4 text-[11px]">
                {[{ color: 'bg-emerald-500', label: T.active }, { color: 'bg-amber-500', label: T.pending }, { color: 'bg-orange-500', label: T.expiring }, { color: 'bg-gray-400', label: T.expired }].map((l) => (
                  <span key={l.label} className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                    <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />{l.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-[var(--color-border)]/50 bg-gray-100/30">
                    {[T.sector, T.total, T.active, T.pending, T.expiring, T.expired, T.portfolioValue, T.distribution].map((h, i) => (
                      <th key={h} className={`py-3 font-semibold text-[var(--color-text-muted)] ${i === 0 || i === 6 || i === 7 ? 'text-left px-5' : 'text-center px-4'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOU_REPORT.map((row, i) => {
                    const activePct = Math.round((row.active / row.total) * 100)
                    return (
                      <tr key={row.sector} className={`border-b border-[var(--color-border)]/30 hover:bg-gray-100/20 transition-colors ${i % 2 !== 0 ? 'bg-gray-100/10' : ''}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                            <span className={`text-[10px] font-semibold rounded-lg px-2.5 py-0.5 ${row.css}`}>{isRtl ? row.sectorAr : row.sector}</span>
                          </div>
                        </td>
                        <td className="text-center px-4 py-3.5 font-bold text-[var(--color-text)]">{row.total}</td>
                        <td className="text-center px-4 py-3.5"><span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-[11px]">{row.active}</span></td>
                        <td className="text-center px-4 py-3.5"><span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 font-bold text-[11px]">{row.pending}</span></td>
                        <td className="text-center px-4 py-3.5">{row.expiring > 0 ? <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-700 font-bold text-[11px]">{row.expiring}</span> : <span className="text-[var(--color-text-muted)]">–</span>}</td>
                        <td className="text-center px-4 py-3.5">{row.expired > 0 ? <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-bold text-[11px]">{row.expired}</span> : <span className="text-[var(--color-text-muted)]">–</span>}</td>
                        <td className="px-5 py-3.5 font-semibold text-[var(--color-text)]">{row.totalValue}</td>
                        <td className="px-5 py-3.5 w-36">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden flex">
                              <div className="bg-emerald-500 h-full" style={{ width: `${activePct}%` }} />
                              <div className="bg-amber-500 h-full"  style={{ width: `${Math.round((row.pending  / row.total) * 100)}%` }} />
                              <div className="bg-orange-500 h-full" style={{ width: `${Math.round((row.expiring / row.total) * 100)}%` }} />
                            </div>
                            <span className="text-[10px] text-[var(--color-text-muted)]">{activePct}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[var(--color-border)] bg-gray-100/20">
                    <td className="px-5 py-3 font-bold text-[var(--color-text)]">{T.totalRow}</td>
                    <td className="text-center px-4 py-3 font-bold text-[var(--color-text)]">{MOU_REPORT.reduce((s, r) => s + r.total, 0)}</td>
                    <td className="text-center px-4 py-3 font-bold text-emerald-600">{MOU_REPORT.reduce((s, r) => s + r.active, 0)}</td>
                    <td className="text-center px-4 py-3 font-bold text-amber-600">{MOU_REPORT.reduce((s, r) => s + r.pending, 0)}</td>
                    <td className="text-center px-4 py-3 font-bold text-orange-600">{MOU_REPORT.reduce((s, r) => s + r.expiring, 0)}</td>
                    <td className="text-center px-4 py-3 font-bold text-gray-500">{MOU_REPORT.reduce((s, r) => s + r.expired, 0)}</td>
                    <td className="px-5 py-3" />
                    <td className="px-5 py-3" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
