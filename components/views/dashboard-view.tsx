'use client'

import {
  Globe2, FileText, Users2, TrendingUp, Calendar, ArrowUpRight,
  Plane, Building2, ChevronRight, Activity, Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, LineChart, Line,
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
  { name: 'Saudi Arabia',       nameAr: 'المملكة العربية السعودية', flag: '🇸🇦', sector: 'Energy & Vision 2030',   sectorAr: 'الطاقة ورؤية 2030',       visit: 'Jul 2026', visitAr: 'يوليو 2026',   companies: 31, score: 98 },
  { name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', flag: '🇦🇪', sector: 'Trade & Technology',     sectorAr: 'التجارة والتكنولوجيا',     visit: 'Aug 2026', visitAr: 'أغسطس 2026', companies: 44, score: 96 },
  { name: 'Kuwait',             nameAr: 'الكويت',                    flag: '🇰🇼', sector: 'Oil & Finance',          sectorAr: 'النفط والمال',              visit: 'Jun 2026', visitAr: 'يونيو 2026',   companies: 18, score: 89 },
  { name: 'Qatar',              nameAr: 'قطر',                       flag: '🇶🇦', sector: 'LNG & Diplomacy',        sectorAr: 'الغاز الطبيعي والدبلوماسية', visit: 'Jul 2026', visitAr: 'يوليو 2026',  companies: 27, score: 91 },
  { name: 'Bahrain',            nameAr: 'البحرين',                   flag: '🇧🇭', sector: 'Fintech & Defence',      sectorAr: 'التقنية المالية والدفاع',   visit: 'May 2026', visitAr: 'مايو 2026',    companies: 15, score: 85 },
  { name: 'Oman',               nameAr: 'عُمان',                     flag: '🇴🇲', sector: 'Logistics & Tourism',    sectorAr: 'اللوجستيات والسياحة',      visit: 'Apr 2026', visitAr: 'أبريل 2026',  companies: 21, score: 87 },
]

const CALENDAR_EVENTS = [
  { date: 'Aug 8',  title: 'Economic Committee Session',    titleAr: 'جلسة اللجنة الاقتصادية',         type: 'committee', location: 'Conference Hall B',    locationAr: 'قاعة الاجتماعات ب' },
  { date: 'Aug 10', title: 'Jordanian Delegation Reception', titleAr: 'استقبال الوفد الأردني',           type: 'reception', location: 'State Hall',           locationAr: 'قاعة الدولة' },
  { date: 'Aug 15', title: 'Joint MoU Signing — Egypt',     titleAr: 'توقيع مذكرة تفاهم مع مصر',       type: 'mou',       location: 'Diplomatic Center',    locationAr: 'المركز الدبلوماسي' },
  { date: 'Aug 18', title: 'Arab World Economic Forum',     titleAr: 'منتدى العالم العربي الاقتصادي',  type: 'conference', location: 'Grand Ballroom',      locationAr: 'القاعة الكبرى' },
  { date: 'Aug 20', title: 'Libyan Trade Mission Arrival',  titleAr: 'وصول الوفد التجاري الليبي',       type: 'visit',     location: 'VIP Terminal',         locationAr: 'صالة كبار الزوار' },
  { date: 'Aug 25', title: 'Cultural Exchange Program',     titleAr: 'برنامج التبادل الثقافي',          type: 'cultural',  location: 'Arts Center',          locationAr: 'مركز الفنون' },
  { date: 'Aug 28', title: 'Security Advisory Meeting',     titleAr: 'اجتماع المستشارين الأمنيين',     type: 'committee', location: 'Secure Room A',        locationAr: 'الغرفة الأمنية أ' },
]

const EVENT_COLORS: Record<string, { bg: string; text: string }> = {
  committee:  { bg: 'bg-blue-500/10',    text: 'text-blue-600 dark:text-blue-400' },
  reception:  { bg: 'bg-violet-500/10',  text: 'text-violet-600 dark:text-violet-400' },
  mou:        { bg: 'bg-amber-500/10',   text: 'text-amber-600 dark:text-amber-400' },
  conference: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  visit:      { bg: 'bg-cyan-500/10',    text: 'text-cyan-600 dark:text-cyan-400' },
  cultural:   { bg: 'bg-rose-500/10',    text: 'text-rose-600 dark:text-rose-400' },
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
  const { language, user } = useApp()
  const isRtl = language === 'ar'

  const KPI_DATA = [
    { label: isRtl ? 'الدول الأعضاء في مجلس التعاون' : 'GCC Member States',     value: '6',   change: isRtl ? 'تكامل كامل'          : 'Full integration', icon: Globe2,    color: 'text-primary',                              bg: 'bg-primary/10',     ring: 'ring-primary/20' },
    { label: isRtl ? 'مذكرات التفاهم النشطة'           : 'Active MoUs',           value: '87',  change: isRtl ? '+12 هذا العام'        : '+12 this year',    icon: FileText,  color: 'text-amber-600 dark:text-amber-400',        bg: 'bg-amber-500/10',   ring: 'ring-amber-500/15' },
    { label: isRtl ? 'اللجان النشطة'                   : 'Active Committees',     value: '23',  change: isRtl ? '+2 هذا الربع'         : '+2 this quarter',  icon: Users2,    color: 'text-blue-600 dark:text-blue-400',          bg: 'bg-blue-500/10',    ring: 'ring-blue-500/15' },
    { label: isRtl ? 'الاتفاقيات الثنائية'             : 'Bilateral Agreements',  value: '314', change: isRtl ? '+19 هذا العام'        : '+19 this year',    icon: TrendingUp, color: 'text-violet-600 dark:text-violet-400',     bg: 'bg-violet-500/10',  ring: 'ring-violet-500/15' },
  ]

  const T = {
    welcomeBack:      isRtl ? 'مرحباً بعودتك،'   : 'Welcome back,',
    overview:         isRtl ? 'إليك نظرة عامة على النشاط الدبلوماسي لشهر أغسطس 2026' : 'Here is your diplomatic activity overview for August 2026.',
    allSystemsOk:     isRtl ? 'جميع الأنظمة تعمل بشكل طبيعي' : 'All systems operational',
    barChartTitle:    isRtl ? 'درجات الانخراط الثنائي مع دول مجلس التعاون' : 'GCC Bilateral Engagement Scores',
    barChartSubtitle: isRtl ? 'مقارنة التعاون التجاري والدبلوماسي والثقافي والتقني' : 'Comparing trade, diplomatic, cultural & technical cooperation',
    trade:            isRtl ? 'تجاري'     : 'Trade',
    diplomatic:       isRtl ? 'دبلوماسي'  : 'Diplomatic',
    cultural:         isRtl ? 'ثقافي'     : 'Cultural',
    technical:        isRtl ? 'تقني'      : 'Technical',
    lineChartTitle:   isRtl ? 'مؤشرات النشاط (2026)' : 'Activity Trends (2026)',
    lineChartSubtitle:isRtl ? 'الزيارات والاتفاقيات والفعاليات' : 'Visits, agreements & events',
    visits:           isRtl ? 'زيارات'    : 'Visits',
    agreements:       isRtl ? 'اتفاقيات'  : 'Agreements',
    events:           isRtl ? 'فعاليات'   : 'Events',
    gccTitle:         isRtl ? 'الدول الأعضاء في مجلس التعاون الخليجي' : 'GCC Member States',
    viewAll:          isRtl ? 'عرض الكل'  : 'View all',
    engagementScore:  isRtl ? 'درجة التعاون' : 'Engagement Score',
    lastVisit:        isRtl ? 'آخر زيارة:' : 'Last visit:',
    activeCompanies:  isRtl ? 'شركة نشطة'  : 'active cos.',
    upcomingEvents:   isRtl ? 'الفعاليات القادمة' : 'Upcoming Events',
    august2026:       isRtl ? 'أغسطس 2026' : 'August 2026',
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">

      {/* Welcome banner */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            {T.welcomeBack}{' '}
            <span className="text-primary">{user?.name.split(' ').slice(-1)[0]}</span>
          </h2>
          <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{T.overview}</p>
        </div>
        <Badge variant="secondary" className="gap-1.5 text-[12px] px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/8 text-emerald-700 dark:text-emerald-400">
          <Activity className="w-3 h-3" />
          {T.allSystemsOk}
        </Badge>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} className="kpi-card border-border/50 shadow-sm overflow-hidden rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest truncate">{kpi.label}</p>
                    <p className="text-4xl font-extrabold text-foreground mt-2 leading-none">{kpi.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{kpi.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${kpi.bg} ring-1 ${kpi.ring} shrink-0`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5">
        {/* Bar chart */}
        <Card className="border-border/50 shadow-sm rounded-2xl">
          <CardHeader className="pb-2 px-6 pt-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-[14px] font-bold">{T.barChartTitle}</CardTitle>
                <p className="text-[12px] text-muted-foreground mt-1">{T.barChartSubtitle}</p>
              </div>
              <Sparkles className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={BAR_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="country" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px', color: 'var(--popover-foreground)', boxShadow: '0 8px 24px oklch(0 0 0 / 10%)' }}
                  cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="trade"      name={T.trade}      fill="oklch(0.42 0.14 152)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="diplomatic" name={T.diplomatic} fill="oklch(0.72 0.15 75)"  radius={[4, 4, 0, 0]} />
                <Bar dataKey="cultural"   name={T.cultural}   fill="oklch(0.56 0.18 220)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="technical"  name={T.technical}  fill="oklch(0.62 0.18 300)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line chart */}
        <Card className="border-border/50 shadow-sm rounded-2xl">
          <CardHeader className="pb-2 px-6 pt-6">
            <CardTitle className="text-[14px] font-bold">{T.lineChartTitle}</CardTitle>
            <p className="text-[12px] text-muted-foreground mt-1">{T.lineChartSubtitle}</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={LINE_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px', color: 'var(--popover-foreground)', boxShadow: '0 8px 24px oklch(0 0 0 / 10%)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="visits"     name={T.visits}     stroke="oklch(0.42 0.14 152)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="agreements" name={T.agreements} stroke="oklch(0.72 0.15 75)"  strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="events"     name={T.events}     stroke="oklch(0.56 0.18 220)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Country summaries + Calendar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* GCC country cards */}
        <Card className="xl:col-span-2 border-border/50 shadow-sm rounded-2xl">
          <CardHeader className="pb-3 px-6 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[14px] font-bold">{T.gccTitle}</CardTitle>
              <button className="text-[12px] text-primary flex items-center gap-1 hover:underline font-medium">
                {T.viewAll} <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COUNTRY_SUMMARIES.map((c) => (
                <div
                  key={c.name}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-150 cursor-pointer group"
                >
                  <span className="text-2xl leading-none mt-0.5 shrink-0" role="img" aria-label={c.name}>{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    {/* Name + Score */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-foreground truncate">
                        {isRtl ? c.nameAr : c.name}
                      </span>
                      <div className="flex items-center gap-0.5 shrink-0" title={T.engagementScore}>
                        <span className="text-[14px] font-extrabold text-primary leading-none">{c.score}</span>
                        <span className="text-[9px] text-muted-foreground leading-none">/100</span>
                      </div>
                    </div>
                    {/* Sector */}
                    <p className="text-[11px] text-muted-foreground mt-0.5">{isRtl ? c.sectorAr : c.sector}</p>
                    {/* Sub-stats */}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground" title={isRtl ? 'آخر زيارة دبلوماسية' : 'Latest diplomatic visit'}>
                        <Plane className="w-2.5 h-2.5" />
                        {T.lastVisit} {isRtl ? c.visitAr : c.visit}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground" title={isRtl ? 'عدد الشركات الشريكة النشطة' : 'Active bilateral partner companies'}>
                        <Building2 className="w-2.5 h-2.5" />
                        {c.companies} {T.activeCompanies}
                      </span>
                    </div>
                    {/* Score bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wide">{T.engagementScore}</span>
                      </div>
                      <Progress value={c.score} className="h-1.5 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendar events */}
        <Card className="border-border/50 shadow-sm rounded-2xl">
          <CardHeader className="pb-3 px-6 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[14px] font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {T.upcomingEvents}
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] rounded-lg">{CALENDAR_EVENTS.length}</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{T.august2026}</p>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-1">
            {CALENDAR_EVENTS.map((event, i) => {
              const evColor = EVENT_COLORS[event.type] ?? { bg: 'bg-muted', text: 'text-muted-foreground' }
              const typeLabel = EVENT_TYPE_LABELS[event.type] ?? { en: event.type, ar: event.type }
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="text-center shrink-0 w-10 bg-muted/50 rounded-lg py-1.5">
                    <div className="text-[9px] font-bold text-muted-foreground leading-none uppercase">
                      {event.date.split(' ')[0]}
                    </div>
                    <div className="text-[18px] font-extrabold text-foreground leading-tight">
                      {event.date.split(' ')[1]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground leading-snug truncate">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
