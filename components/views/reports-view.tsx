'use client'

import { useState } from 'react'
import {
  BarChart2, TrendingUp, TrendingDown, Globe2, Users2, FileText,
  Download, Filter, Calendar, CheckCircle2, Clock, AlertTriangle,
  ArrowUpRight, Star, Layers,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useApp } from '@/lib/app-context'

/* ─── Strategy KPIs ─── */
const STRATEGY_KPIS = [
  { label: 'Bilateral Agreements Signed', target: 25, actual: 19, unit: 'MoUs', trend: 'up' },
  { label: 'Active Committees', target: 30, actual: 23, unit: 'committees', trend: 'up' },
  { label: 'Diplomatic Visits', target: 40, actual: 34, unit: 'visits', trend: 'up' },
  { label: 'Tasks Completed On-Time', target: 90, actual: 78, unit: '%', trend: 'down' },
  { label: 'Decisions Implemented', target: 85, actual: 81, unit: '%', trend: 'up' },
  { label: 'MoU Renewal Rate', target: 95, actual: 88, unit: '%', trend: 'down' },
]

/* ─── Country Performance ─── */
const COUNTRY_PERFORMANCE = [
  { country: 'Egypt',   flag: '🇪🇬', engagementScore: 92, openMoUs: 4, committees: 2, visits: 6, tasks: 8, overdueTasks: 0, trend: 'up' },
  { country: 'Jordan',  flag: '🇯🇴', engagementScore: 87, openMoUs: 5, committees: 2, visits: 5, tasks: 6, overdueTasks: 1, trend: 'up' },
  { country: 'Morocco', flag: '🇲🇦', engagementScore: 84, openMoUs: 3, committees: 1, visits: 4, tasks: 5, overdueTasks: 0, trend: 'up' },
  { country: 'Iraq',    flag: '🇮🇶', engagementScore: 79, openMoUs: 2, committees: 1, visits: 3, tasks: 4, overdueTasks: 1, trend: 'stable' },
  { country: 'Algeria', flag: '🇩🇿', engagementScore: 71, openMoUs: 3, committees: 0, visits: 2, tasks: 3, overdueTasks: 0, trend: 'up' },
  { country: 'Tunisia', flag: '🇹🇳', engagementScore: 65, openMoUs: 1, committees: 0, visits: 2, tasks: 2, overdueTasks: 0, trend: 'down' },
  { country: 'Libya',   flag: '🇱🇾', engagementScore: 61, openMoUs: 2, committees: 0, visits: 2, tasks: 2, overdueTasks: 0, trend: 'up' },
  { country: 'Lebanon', flag: '🇱🇧', engagementScore: 58, openMoUs: 1, committees: 0, visits: 1, tasks: 1, overdueTasks: 0, trend: 'stable' },
]

/* ─── Committee Performance ─── */
const COMMITTEE_PERFORMANCE = [
  { name: 'Joint Economic Committee', code: 'JEC-2026', meetings: 5, decisionsTotal: 12, decisionsApproved: 10, tasksTotal: 15, tasksCompleted: 11, onTimeRate: 85, score: 88 },
  { name: 'Cultural & Educational Exchange', code: 'CEC-2026', meetings: 3, decisionsTotal: 7, decisionsApproved: 7, tasksTotal: 9, tasksCompleted: 7, onTimeRate: 92, score: 91 },
  { name: 'Technology & Innovation Advisory Panel', code: 'TIAP-2026', meetings: 2, decisionsTotal: 5, decisionsApproved: 3, tasksTotal: 10, tasksCompleted: 6, onTimeRate: 70, score: 74 },
  { name: 'Security Cooperation Working Group', code: 'SCWG-2026', meetings: 2, decisionsTotal: 4, decisionsApproved: 3, tasksTotal: 8, tasksCompleted: 5, onTimeRate: 62, score: 65 },
]

/* ─── MoU Status ─── */
const MOU_REPORT = [
  { sector: 'Energy', total: 12, active: 8, pending: 2, expiring: 1, expired: 1, totalValue: '$14.2B' },
  { sector: 'Technology', total: 9, active: 6, pending: 2, expiring: 0, expired: 1, totalValue: '$4.1B' },
  { sector: 'Defense', total: 7, active: 6, pending: 1, expiring: 0, expired: 0, totalValue: 'Classified' },
  { sector: 'Culture & Education', total: 11, active: 7, pending: 1, expiring: 2, expired: 1, totalValue: '$1.8B' },
  { sector: 'Infrastructure', total: 8, active: 5, pending: 2, expiring: 0, expired: 1, totalValue: '$22.4B' },
  { sector: 'Environment', total: 6, active: 3, pending: 2, expiring: 1, expired: 0, totalValue: '$3.2B' },
  { sector: 'Trade', total: 14, active: 11, pending: 2, expiring: 0, expired: 1, totalValue: '$31.7B' },
]

const STRATEGY_KPIS_LABELS: Record<string, string> = {
  'Bilateral Agreements Signed': 'الاتفاقيات الثنائية الموقعة',
  'Active Committees':           'اللجان النشطة',
  'Diplomatic Visits':           'الزيارات الدبلوماسية',
  'Tasks Completed On-Time':     'المهام المنجزة في الوقت المحدد',
  'Decisions Implemented':       'القرارات المنفَّذة',
  'MoU Renewal Rate':            'معدل تجديد مذكرات التفاهم',
}
const MOU_SECTOR_LABELS: Record<string, string> = {
  'Energy':            'الطاقة',
  'Technology':        'التكنولوجيا',
  'Defense':           'الدفاع',
  'Culture & Education':'الثقافة والتعليم',
  'Infrastructure':    'البنية التحتية',
  'Environment':       'البيئة',
  'Trade':             'التجارة',
}

const SECTOR_COLORS: Record<string, string> = {
  Energy: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  Technology: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  Defense: 'bg-slate-500/10 text-slate-700 dark:text-slate-300',
  'Culture & Education': 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  Infrastructure: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  Environment: 'bg-green-500/10 text-green-700 dark:text-green-400',
  Trade: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
}

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.round((value / max) * 100)
  const color = pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-bold text-foreground w-6 text-right">{value}</span>
    </div>
  )
}

export function ReportsView() {
  const { language } = useApp()
  const isRtl = language === 'ar'

  const T = {
    // KPI stats
    reportsGenerated:  isRtl ? 'التقارير المُنتجة'                : 'Reports Generated',
    avgScore:          isRtl ? 'متوسط درجة التعاون'              : 'Avg. Engagement Score',
    kpisOnTrack:       isRtl ? 'مؤشرات في المسار الصحيح'         : 'KPIs On-Track',
    pendingReviews:    isRtl ? 'مراجعات معلقة'                   : 'Pending Reviews',
    thisQtr:           isRtl ? 'هذا الربع'                       : 'This quarter',
    vsQ2:              isRtl ? '+3.2 مقارنة بالربع الثاني'        : '+3.2 vs Q2',
    hitRate:           isRtl ? 'معدل تحقق 66%'                   : '66% hit rate',
    overdue2:          isRtl ? '2 متأخرة'                        : '2 overdue',
    // Tabs
    strategyKPIs:      isRtl ? 'مؤشرات الأداء الاستراتيجية'      : 'Strategy KPIs',
    countryPerf:       isRtl ? 'أداء الدول'                      : 'Country Performance',
    committeePerf:     isRtl ? 'أداء اللجان'                     : 'Committee Performance',
    mouStatus:         isRtl ? 'حالة مذكرات التفاهم'             : 'MoU Status',
    export:            isRtl ? 'تصدير'                           : 'Export',
    // Status badges
    onTrack:           isRtl ? 'في المسار'                       : 'On Track',
    atRisk:            isRtl ? 'في خطر'                          : 'At Risk',
    behind:            isRtl ? 'متأخر'                           : 'Behind',
    // Summary widget
    stratHealthTitle:  isRtl ? 'الصحة العامة للاستراتيجية — الربع الثالث 2026' : 'Overall Strategy Health — Q3 2026',
    kpisOnTrackDesc:   isRtl ? '4 من 6 مؤشرات أداء في المسار الصحيح (67%)' : '4 of 6 KPIs are on-track (67%)',
    // KPI card
    target:            isRtl ? 'الهدف:'                          : 'Target:',
    ofTarget:          isRtl ? '% من الهدف'                      : '% of target',
    // Country table headers
    country:           isRtl ? 'الدولة'                          : 'Country',
    engagement:        isRtl ? 'التعاون'                         : 'Engagement',
    moUs:              isRtl ? 'مذكرات'                          : 'MoUs',
    committees:        isRtl ? 'لجان'                            : 'Committees',
    visits:            isRtl ? 'زيارات'                          : 'Visits',
    tasks:             isRtl ? 'مهام'                            : 'Tasks',
    overdueLabel:      isRtl ? 'متأخرة'                          : 'Overdue',
    score:             isRtl ? 'الدرجة'                          : 'Score',
    countryScorecard:  isRtl ? 'بطاقة تقييم الدول — الربع الثالث 2026' : 'Country Engagement Scorecard — Q3 2026',
    // Committee headers
    decisionRate:      isRtl ? 'معدل القرارات'                   : 'Decision Rate',
    taskCompletion:    isRtl ? 'إنجاز المهام'                    : 'Task Completion',
    onTimeRate:        isRtl ? 'معدل الالتزام بالوقت'            : 'On-Time Rate',
    perfScore:         isRtl ? 'درجة الأداء'                     : 'Perf. Score',
    meetingsHeld:      isRtl ? 'اجتماع عُقد'                     : 'meetings held',
    excellent:         isRtl ? 'ممتاز'                           : 'Excellent',
    good:              isRtl ? 'جيد'                             : 'Good',
    needsImprove:      isRtl ? 'يحتاج تحسين'                     : 'Needs Improvement',
    // MoU table
    mouPortfolio:      isRtl ? 'محفظة مذكرات التفاهم حسب القطاع' : 'MoU Portfolio by Sector',
    sector:            isRtl ? 'القطاع'                          : 'Sector',
    total:             isRtl ? 'الإجمالي'                        : 'Total',
    active:            isRtl ? 'نشط'                             : 'Active',
    pending:           isRtl ? 'معلق'                            : 'Pending',
    expiring:          isRtl ? 'ينتهي قريباً'                    : 'Expiring',
    expired:           isRtl ? 'منتهي'                           : 'Expired',
    portfolioValue:    isRtl ? 'قيمة المحفظة'                    : 'Portfolio Value',
    distribution:      isRtl ? 'التوزيع'                         : 'Distribution',
    totalRow:          isRtl ? 'الإجمالي'                        : 'Total',
  }

  const REPORT_STATS = [
    { label: T.reportsGenerated, value: '24',  icon: FileText,   color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-500/10',    change: T.thisQtr      },
    { label: T.avgScore,         value: '74.6', icon: Star,       color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-500/10',   change: T.vsQ2         },
    { label: T.kpisOnTrack,      value: '4/6',  icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', change: T.hitRate  },
    { label: T.pendingReviews,   value: '3',    icon: Clock,      color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10',  change: T.overdue2     },
  ]

  const [period, setPeriod] = useState('q3_2026')

  return (
    <div className="p-6 space-y-6">

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="kpi-card border-border/50 shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-2.5 rounded-xl shrink-0 ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-foreground mt-0.5">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="strategy">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList className="rounded-xl bg-muted/60 p-1 gap-1">
            <TabsTrigger value="strategy" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.strategyKPIs}</TabsTrigger>
            <TabsTrigger value="countries" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.countryPerf}</TabsTrigger>
            <TabsTrigger value="committees" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.committeePerf}</TabsTrigger>
            <TabsTrigger value="mous" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.mouStatus}</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] text-foreground outline-none focus:border-primary/40"
            >
              <option value="q3_2026">Q3 2026</option>
              <option value="q2_2026">Q2 2026</option>
              <option value="q1_2026">Q1 2026</option>
              <option value="fy_2026">FY 2026 YTD</option>
            </select>
            <button className="flex items-center gap-1.5 text-[12px] bg-primary text-primary-foreground px-3.5 py-2 rounded-xl hover:brightness-105 transition-all font-medium shadow-sm shadow-primary/20">
              <Download className="w-3.5 h-3.5" />
              {T.export}
            </button>
          </div>
        </div>

        {/* ── STRATEGY KPIS TAB ── */}
        <TabsContent value="strategy" className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STRATEGY_KPIS.map((kpi) => {
              const pct = Math.round((kpi.actual / kpi.target) * 100)
              const onTrack = pct >= 85
              const atRisk = pct >= 70 && pct < 85
              const barColor = onTrack ? 'bg-emerald-500' : atRisk ? 'bg-amber-500' : 'bg-red-500'
              const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown
              const trendColor = kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
              return (
                <Card key={kpi.label} className="border-border/50 shadow-sm rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-[13px] font-bold text-foreground">{isRtl ? (STRATEGY_KPIS_LABELS[kpi.label] ?? kpi.label) : kpi.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{T.target} {kpi.target} {kpi.unit}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl font-extrabold text-foreground">{kpi.actual}</p>
                        <div className={`flex items-center gap-0.5 justify-end mt-0.5 ${trendColor}`}>
                          <TrendIcon className="w-3 h-3" />
                          <span className="text-[10px] font-semibold">{pct}{T.ofTarget}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                      <Badge className={`border-0 text-[9px] font-semibold rounded-lg shrink-0 ${onTrack ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : atRisk ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'bg-red-500/10 text-red-600'}`}>
                        {onTrack ? T.onTrack : atRisk ? T.atRisk : T.behind}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Summary donut-style widget */}
          <Card className="border-border/50 shadow-sm rounded-2xl mt-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-[14px] font-bold text-foreground">{T.stratHealthTitle}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{T.kpisOnTrackDesc}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-emerald-600">4</p>
                    <p className="text-[10px] text-muted-foreground font-semibold">{T.onTrack}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-amber-600">1</p>
                    <p className="text-[10px] text-muted-foreground font-semibold">{T.atRisk}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-red-500">1</p>
                    <p className="text-[10px] text-muted-foreground font-semibold">{T.behind}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 h-2.5 rounded-full bg-muted overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: '67%' }} />
                <div className="bg-amber-500 h-full" style={{ width: '16%' }} />
                <div className="bg-red-500 h-full" style={{ width: '17%' }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── COUNTRY PERFORMANCE TAB ── */}
        <TabsContent value="countries" className="mt-5">
          <Card className="border-border/50 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="px-6 pt-5 pb-4 border-b border-border/50">
              <CardTitle className="text-[14px] font-bold">{T.countryScorecard}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left px-5 py-3 font-semibold text-muted-foreground w-36">{T.country}</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">{T.engagement}</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">{T.moUs}</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">{T.committees}</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">{T.visits}</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">{T.tasks}</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">{T.overdueLabel}</th>
                      <th className="text-left px-5 py-3 font-semibold text-muted-foreground">{T.score}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COUNTRY_PERFORMANCE.map((cp, i) => {
                      const TrendIcon = cp.trend === 'up' ? TrendingUp : cp.trend === 'down' ? TrendingDown : ArrowUpRight
                      const trendColor = cp.trend === 'up' ? 'text-emerald-500' : cp.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                      return (
                        <tr key={cp.country} className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{cp.flag}</span>
                              <span className="font-semibold text-foreground">{cp.country}</span>
                            </div>
                          </td>
                          <td className="text-center px-4 py-3.5">
                            <div className="flex items-center gap-1 justify-center">
                              <TrendIcon className={`w-3 h-3 ${trendColor}`} />
                            </div>
                          </td>
                          <td className="text-center px-4 py-3.5 font-semibold text-foreground">{cp.openMoUs}</td>
                          <td className="text-center px-4 py-3.5 font-semibold text-foreground">{cp.committees}</td>
                          <td className="text-center px-4 py-3.5 font-semibold text-foreground">{cp.visits}</td>
                          <td className="text-center px-4 py-3.5 font-semibold text-foreground">{cp.tasks}</td>
                          <td className="text-center px-4 py-3.5">
                            <span className={`font-bold ${cp.overdueTasks > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                              {cp.overdueTasks > 0 ? cp.overdueTasks : '–'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 w-40">
                            <ScoreBar value={cp.engagementScore} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Top performers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {COUNTRY_PERFORMANCE.slice(0, 3).map((cp, i) => (
              <Card key={cp.country} className="border-border/50 shadow-sm rounded-2xl">
                <CardContent className="p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">{cp.flag}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-muted-foreground">#{i + 1}</span>
                      <h3 className="text-[13px] font-bold text-foreground">{cp.country}</h3>
                    </div>
                    <div className="mt-1.5">
                      <ScoreBar value={cp.engagementScore} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── COMMITTEE PERFORMANCE TAB ── */}
        <TabsContent value="committees" className="mt-5 space-y-3">
          {COMMITTEE_PERFORMANCE.map((cp) => {
            const decisionRate = Math.round((cp.decisionsApproved / cp.decisionsTotal) * 100)
            const taskRate = Math.round((cp.tasksCompleted / cp.tasksTotal) * 100)
            return (
              <Card key={cp.code} className="border-border/50 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[14px] font-bold text-foreground">{cp.name}</h3>
                        <Badge variant="secondary" className="text-[10px] rounded-lg">{cp.code}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{cp.meetings} {T.meetingsHeld}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-extrabold text-foreground">{cp.score}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold">{T.perfScore}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{T.decisionRate}</p>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[15px] font-extrabold text-foreground">{cp.decisionsApproved}</span>
                        <span className="text-[11px] text-muted-foreground">/ {cp.decisionsTotal}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${decisionRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${decisionRate}%` }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{T.taskCompletion}</p>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[15px] font-extrabold text-foreground">{cp.tasksCompleted}</span>
                        <span className="text-[11px] text-muted-foreground">/ {cp.tasksTotal}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${taskRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${taskRate}%` }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{T.onTimeRate}</p>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[15px] font-extrabold text-foreground">{cp.onTimeRate}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${cp.onTimeRate >= 80 ? 'bg-emerald-500' : cp.onTimeRate >= 65 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${cp.onTimeRate}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 flex items-center gap-1.5">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${cp.score >= 85 ? 'bg-emerald-500' : cp.score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${cp.score}%` }} />
                    </div>
                    <Badge className={`border-0 text-[9px] font-semibold rounded-lg shrink-0 ${cp.score >= 85 ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : cp.score >= 70 ? 'bg-amber-500/10 text-amber-700' : 'bg-red-500/10 text-red-600'}`}>
                      {cp.score >= 85 ? T.excellent : cp.score >= 70 ? T.good : T.needsImprove}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* ── MOU STATUS TAB ── */}
        <TabsContent value="mous" className="mt-5">
          <Card className="border-border/50 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="px-6 pt-5 pb-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[14px] font-bold">{T.mouPortfolio}</CardTitle>
                <div className="flex items-center gap-4 text-[11px]">
                  {[
                    { color: 'bg-emerald-500', label: T.active   },
                    { color: 'bg-amber-500',   label: T.pending  },
                    { color: 'bg-orange-500',  label: T.expiring },
                    { color: 'bg-slate-400',   label: T.expired  },
                  ].map((l) => (
                    <span key={l.label} className="flex items-center gap-1.5 text-muted-foreground">
                      <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                      {l.label}
                    </span>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left px-5 py-3 font-semibold text-muted-foreground">{T.sector}</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">{T.total}</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">{T.active}</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">{T.pending}</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">{T.expiring}</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">{T.expired}</th>
                      <th className="text-left px-5 py-3 font-semibold text-muted-foreground">{T.portfolioValue}</th>
                      <th className="text-left px-5 py-3 font-semibold text-muted-foreground">{T.distribution}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOU_REPORT.map((row, i) => {
                      const activePct = Math.round((row.active / row.total) * 100)
                      return (
                        <tr key={row.sector} className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                              <Badge className={`border-0 text-[10px] font-semibold rounded-lg ${SECTOR_COLORS[row.sector] ?? ''}`}>{isRtl ? (MOU_SECTOR_LABELS[row.sector] ?? row.sector) : row.sector}</Badge>
                            </div>
                          </td>
                          <td className="text-center px-4 py-3.5 font-bold text-foreground">{row.total}</td>
                          <td className="text-center px-4 py-3.5">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">{row.active}</span>
                          </td>
                          <td className="text-center px-4 py-3.5">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 font-bold text-[11px]">{row.pending}</span>
                          </td>
                          <td className="text-center px-4 py-3.5">
                            {row.expiring > 0
                              ? <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-700 font-bold text-[11px]">{row.expiring}</span>
                              : <span className="text-muted-foreground">–</span>
                            }
                          </td>
                          <td className="text-center px-4 py-3.5">
                            {row.expired > 0
                              ? <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[11px]">{row.expired}</span>
                              : <span className="text-muted-foreground">–</span>
                            }
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-foreground">{row.totalValue}</td>
                          <td className="px-5 py-3.5 w-36">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden flex">
                                <div className="bg-emerald-500 h-full" style={{ width: `${activePct}%` }} />
                                <div className="bg-amber-500 h-full" style={{ width: `${Math.round((row.pending / row.total) * 100)}%` }} />
                                <div className="bg-orange-500 h-full" style={{ width: `${Math.round((row.expiring / row.total) * 100)}%` }} />
                              </div>
                              <span className="text-[10px] text-muted-foreground">{activePct}%</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border bg-muted/20">
                      <td className="px-5 py-3 font-bold text-foreground">{T.totalRow}</td>
                      <td className="text-center px-4 py-3 font-bold text-foreground">{MOU_REPORT.reduce((s, r) => s + r.total, 0)}</td>
                      <td className="text-center px-4 py-3 font-bold text-emerald-600">{MOU_REPORT.reduce((s, r) => s + r.active, 0)}</td>
                      <td className="text-center px-4 py-3 font-bold text-amber-600">{MOU_REPORT.reduce((s, r) => s + r.pending, 0)}</td>
                      <td className="text-center px-4 py-3 font-bold text-orange-600">{MOU_REPORT.reduce((s, r) => s + r.expiring, 0)}</td>
                      <td className="text-center px-4 py-3 font-bold text-slate-500">{MOU_REPORT.reduce((s, r) => s + r.expired, 0)}</td>
                      <td className="px-5 py-3" />
                      <td className="px-5 py-3" />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
