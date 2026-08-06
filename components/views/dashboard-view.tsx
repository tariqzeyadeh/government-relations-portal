'use client'

import React from 'react'
import {
  Globe2, FileText, Users2, TrendingUp, Calendar, ArrowUpRight,
  Plane, Building2, ChevronRight, Activity, Sparkles,
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { useApp } from '@/lib/app-context'

const BAR_DATA = [
  { country: 'KSA',     trade: 98, diplomatic: 96, cultural: 91, technical: 88 },
  { country: 'UAE',     trade: 95, diplomatic: 94, cultural: 89, technical: 96 },
  { country: 'Kuwait',  trade: 82, diplomatic: 88, cultural: 78, technical: 74 },
  { country: 'Qatar',   trade: 87, diplomatic: 90, cultural: 83, technical: 85 },
  { country: 'Bahrain', trade: 79, diplomatic: 84, cultural: 77, technical: 80 },
  { country: 'Oman',    trade: 81, diplomatic: 86, cultural: 80, technical: 76 },
]

const LINE_DATA = [
  { month: 'Jan', visits: 4,  agreements: 2, events: 8  },
  { month: 'Feb', visits: 6,  agreements: 1, events: 11 },
  { month: 'Mar', visits: 9,  agreements: 4, events: 14 },
  { month: 'Apr', visits: 7,  agreements: 3, events: 10 },
  { month: 'May', visits: 12, agreements: 5, events: 18 },
  { month: 'Jun', visits: 15, agreements: 6, events: 22 },
  { month: 'Jul', visits: 11, agreements: 4, events: 16 },
  { month: 'Aug', visits: 14, agreements: 7, events: 20 },
]

const COUNTRY_SUMMARIES = [
  { name: 'Saudi Arabia',         nameAr: 'المملكة العربية السعودية', flag: '🇸🇦', sector: 'Energy & Vision 2030',   sectorAr: 'الطاقة ورؤية 2030',       visit: 'Jul 2026', visitAr: 'يوليو 2026',  companies: 31, score: 98 },
  { name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', flag: '🇦🇪', sector: 'Trade & Technology',     sectorAr: 'التجارة والتكنولوجيا',    visit: 'Aug 2026', visitAr: 'أغسطس 2026', companies: 44, score: 96 },
  { name: 'Kuwait',               nameAr: 'الكويت',                   flag: '🇰🇼', sector: 'Oil & Finance',          sectorAr: 'النفط والمال',             visit: 'Jun 2026', visitAr: 'يونيو 2026',  companies: 18, score: 89 },
  { name: 'Qatar',                nameAr: 'قطر',                      flag: '🇶🇦', sector: 'LNG & Diplomacy',        sectorAr: 'الغاز والدبلوماسية',      visit: 'Jul 2026', visitAr: 'يوليو 2026',  companies: 27, score: 91 },
  { name: 'Bahrain',              nameAr: 'البحرين',                  flag: '🇧🇭', sector: 'Fintech & Defence',      sectorAr: 'التقنية المالية والدفاع', visit: 'May 2026', visitAr: 'مايو 2026',   companies: 15, score: 85 },
  { name: 'Oman',                 nameAr: 'عُمان',                    flag: '🇴🇲', sector: 'Logistics & Tourism',    sectorAr: 'اللوجستيات والسياحة',    visit: 'Apr 2026', visitAr: 'أبريل 2026',  companies: 21, score: 87 },
]

const CALENDAR_EVENTS = [
  { date: 'Aug 8',  title: 'Economic Committee Session',    titleAr: 'جلسة اللجنة الاقتصادية',        type: 'committee'  },
  { date: 'Aug 10', title: 'Jordanian Delegation Reception', titleAr: 'استقبال الوفد الأردني',          type: 'reception'  },
  { date: 'Aug 15', title: 'Joint MoU Signing — Egypt',     titleAr: 'توقيع مذكرة تفاهم مع مصر',      type: 'mou'        },
  { date: 'Aug 18', title: 'Arab World Economic Forum',     titleAr: 'منتدى العالم العربي الاقتصادي', type: 'conference' },
  { date: 'Aug 20', title: 'Libyan Trade Mission Arrival',  titleAr: 'وصول الوفد التجاري الليبي',      type: 'visit'      },
  { date: 'Aug 25', title: 'Cultural Exchange Program',     titleAr: 'برنامج التبادل الثقافي',         type: 'cultural'   },
  { date: 'Aug 28', title: 'Security Advisory Meeting',     titleAr: 'اجتماع المستشارين الأمنيين',    type: 'committee'  },
]

const EVENT_COLORS: Record<string, { bg: string; text: string }> = {
  committee:  { bg: 'bg-blue-500/10',    text: 'text-blue-600' },
  reception:  { bg: 'bg-violet-500/10',  text: 'text-violet-600' },
  mou:        { bg: 'bg-amber-500/10',   text: 'text-amber-600' },
  conference: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  visit:      { bg: 'bg-cyan-500/10',    text: 'text-cyan-600' },
  cultural:   { bg: 'bg-rose-500/10',    text: 'text-rose-600' },
}

const EVENT_TYPE_LABELS: Record<string, { en: string; ar: string }> = {
  committee:  { en: 'Committee',   ar: 'لجنة' },
  reception:  { en: 'Reception',   ar: 'استقبال' },
  mou:        { en: 'MoU Signing', ar: 'توقيع مذكرة' },
  conference: { en: 'Conference',  ar: 'مؤتمر' },
  visit:      { en: 'Visit',       ar: 'زيارة' },
  cultural:   { en: 'Cultural',    ar: 'ثقافي' },
}

export function DashboardView() {
  const { language } = useApp()
  const isRtl = language === 'ar'

  const KPI_DATA = [
    { label: isRtl ? 'الدول الأعضاء في مجلس التعاون' : 'GCC Member States',    value: '6',   change: isRtl ? 'تكامل كامل'    : 'Full integration', icon: Globe2,    color: 'text-brand',         bg: 'bg-brand/10' },
    { label: isRtl ? 'مذكرات التفاهم النشطة'           : 'Active MoUs',          value: '87',  change: isRtl ? '+12 هذا العام'  : '+12 this year',    icon: FileText,  color: 'text-amber-600',     bg: 'bg-amber-500/10' },
    { label: isRtl ? 'اللجان النشطة'                   : 'Active Committees',    value: '23',  change: isRtl ? '+2 هذا الربع'   : '+2 this quarter',  icon: Users2,    color: 'text-blue-600',      bg: 'bg-blue-500/10' },
    { label: isRtl ? 'الاتفاقيات الثنائية'             : 'Bilateral Agreements', value: '314', change: isRtl ? '+19 هذا العام'  : '+19 this year',    icon: TrendingUp, color: 'text-violet-600',   bg: 'bg-violet-500/10' },
  ]

  const T = {
    welcomeBack:      isRtl ? 'مرحباً بعودتك' : 'Welcome back',
    overview:         isRtl ? 'إليك نظرة عامة على النشاط الدبلوماسي لشهر أغسطس 2026' : 'Here is your diplomatic activity overview for August 2026.',
    allSystemsOk:     isRtl ? 'جميع الأنظمة تعمل بشكل طبيعي' : 'All systems operational',
    barChartTitle:    isRtl ? 'درجات الانخراط الثنائي مع دول مجلس التعاون' : 'GCC Bilateral Engagement Scores',
    barChartSubtitle: isRtl ? 'مقارنة التعاون التجاري والدبلوماسي والثقافي والتقني' : 'Comparing trade, diplomatic, cultural & technical cooperation',
    trade:            isRtl ? 'تجاري'    : 'Trade',
    diplomatic:       isRtl ? 'دبلوماسي' : 'Diplomatic',
    cultural:         isRtl ? 'ثقافي'    : 'Cultural',
    technical:        isRtl ? 'تقني'     : 'Technical',
    lineChartTitle:   isRtl ? 'مؤشرات النشاط (2026)' : 'Activity Trends (2026)',
    lineChartSubtitle:isRtl ? 'الزيارات والاتفاقيات والفعاليات' : 'Visits, agreements & events',
    visits:           isRtl ? 'زيارات'   : 'Visits',
    agreements:       isRtl ? 'اتفاقيات' : 'Agreements',
    events:           isRtl ? 'فعاليات'  : 'Events',
    gccTitle:         isRtl ? 'الدول الأعضاء في مجلس التعاون الخليجي' : 'GCC Member States',
    viewAll:          isRtl ? 'عرض الكل' : 'View all',
    engagementScore:  isRtl ? 'درجة التعاون' : 'Engagement Score',
    lastVisit:        isRtl ? 'آخر زيارة:' : 'Last visit:',
    activeCompanies:  isRtl ? 'شركة نشطة'  : 'active cos.',
    upcomingEvents:   isRtl ? 'الفعاليات القادمة' : 'Upcoming Events',
    august2026:       isRtl ? 'أغسطس 2026' : 'August 2026',
  }

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)] tracking-tight">{T.welcomeBack}</h2>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-1 leading-relaxed">{T.overview}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/8 text-emerald-700 font-medium">
          <Activity className="w-3 h-3" />
          {T.allSystemsOk}
        </span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm overflow-hidden p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest truncate">{kpi.label}</p>
                  <p className="text-4xl font-extrabold text-[var(--color-text)] mt-2 leading-none">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="text-[11px] text-emerald-600 font-medium">{kpi.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${kpi.bg} shrink-0`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5">
        {/* Bar chart */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm">
          <div className="px-6 pt-6 pb-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[14px] font-bold text-[var(--color-text)]">{T.barChartTitle}</h3>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-1">{T.barChartSubtitle}</p>
              </div>
              <Sparkles className="w-4 h-4 text-[var(--color-brand)]/60 shrink-0 mt-0.5" />
            </div>
          </div>
          <div className="px-6 pb-6">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={BAR_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="country" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--color-border)' }} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
                <Bar dataKey="trade"      name={T.trade}      fill="#42a15c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="diplomatic" name={T.diplomatic} fill="#c4973e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cultural"   name={T.cultural}   fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="technical"  name={T.technical}  fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line chart */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm">
          <div className="px-6 pt-6 pb-2">
            <h3 className="text-[14px] font-bold text-[var(--color-text)]">{T.lineChartTitle}</h3>
            <p className="text-[12px] text-[var(--color-text-muted)] mt-1">{T.lineChartSubtitle}</p>
          </div>
          <div className="px-6 pb-6">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={LINE_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid var(--color-border)' }} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
                <Line type="monotone" dataKey="visits"     name={T.visits}     stroke="#42a15c" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="agreements" name={T.agreements} stroke="#c4973e" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="events"     name={T.events}     stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Country summaries + Calendar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* GCC country cards */}
        <div className="xl:col-span-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm">
          <div className="px-6 pt-6 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-[var(--color-text)]">{T.gccTitle}</h3>
              <button className="text-[12px] text-[var(--color-brand)] flex items-center gap-1 hover:underline font-medium">
                {T.viewAll} <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COUNTRY_SUMMARIES.map((c) => (
                <div
                  key={c.name}
                  className="flex items-start gap-3 p-4 rounded-xl border border-[var(--color-border)]/50 hover:border-[var(--color-brand)]/30 hover:bg-[var(--color-brand)]/[0.02] transition-all duration-150 cursor-pointer"
                >
                  <span className="text-2xl leading-none mt-0.5 shrink-0">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-[var(--color-text)] truncate">
                        {isRtl ? c.nameAr : c.name}
                      </span>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <span className="text-[14px] font-extrabold text-[var(--color-brand)] leading-none">{c.score}</span>
                        <span className="text-[9px] text-[var(--color-text-muted)] leading-none">/100</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{isRtl ? c.sectorAr : c.sector}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                        <Plane className="w-2.5 h-2.5" />
                        {T.lastVisit} {isRtl ? c.visitAr : c.visit}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                        <Building2 className="w-2.5 h-2.5" />
                        {c.companies} {T.activeCompanies}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wide">{T.engagementScore}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--color-brand)] transition-all" style={{ width: `${c.score}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar events */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm">
          <div className="px-6 pt-6 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-[var(--color-text)] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--color-brand)]" />
                {T.upcomingEvents}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-gray-100 text-[10px] font-semibold text-[var(--color-text-muted)]">
                {CALENDAR_EVENTS.length}
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1">{T.august2026}</p>
          </div>
          <div className="px-4 pb-4 space-y-1">
            {CALENDAR_EVENTS.map((event, i) => {
              const evColor = EVENT_COLORS[event.type] ?? { bg: 'bg-gray-100', text: 'text-[var(--color-text-muted)]' }
              const typeLabel = EVENT_TYPE_LABELS[event.type] ?? { en: event.type, ar: event.type }
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100/50 transition-colors cursor-pointer"
                >
                  <div className="text-center shrink-0 w-10 bg-gray-100/50 rounded-lg py-1.5">
                    <div className="text-[9px] font-bold text-[var(--color-text-muted)] leading-none uppercase">
                      {event.date.split(' ')[0]}
                    </div>
                    <div className="text-[18px] font-extrabold text-[var(--color-text)] leading-tight">
                      {event.date.split(' ')[1]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[var(--color-text)] leading-snug truncate">
                      {isRtl ? event.titleAr : event.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${evColor.bg} ${evColor.text}`}>
                        {isRtl ? typeLabel.ar : typeLabel.en}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
