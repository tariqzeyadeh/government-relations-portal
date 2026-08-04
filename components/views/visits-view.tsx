'use client'

import { useState } from 'react'
import {
  Plane, Calendar, MapPin, Users, Clock, CheckCircle2,
  Plus, Search, ArrowUpRight, ArrowDownLeft, Filter,
  Building2, Globe2, User, FileText, ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useApp } from '@/lib/app-context'

const VISITS = [
  {
    id: 1, type: 'incoming', country: 'Jordan', flag: '🇯🇴',
    date: 'Aug 20, 2026', duration: '3 days', status: 'upcoming',
    head: 'Min. Tariq Al-Masri', size: 12,
    title: 'Jordanian Ministerial Delegation',
    titleAr: 'الوفد الوزاري الأردني',
    purpose: 'Defense & Technology MoU Signing',
    purposeAr: 'توقيع مذكرة التفاهم في الدفاع والتكنولوجيا',
    location: 'State Hall & Diplomatic Center',
    agenda: ['Bilateral defense briefing', 'Technology MoU signing ceremony', 'Ministerial dinner', 'Cultural tour'],
    agendaAr: ['إحاطة الدفاع الثنائي', 'حفل توقيع مذكرة التفاهم التكنولوجية', 'عشاء وزاري', 'جولة ثقافية'],
    outcome: null, outcomeAr: null, committee: 'CEC-2026',
  },
  {
    id: 2, type: 'outgoing', country: 'Morocco', flag: '🇲🇦',
    date: 'Sep 3, 2026', duration: '4 days', status: 'upcoming',
    head: 'H.E. Ahmed Al-Mansouri', size: 8,
    title: 'Official Visit to Rabat',
    titleAr: 'الزيارة الرسمية للرباط',
    purpose: 'AI Research Center Launch & TIAP Annual Session',
    purposeAr: 'إطلاق مركز بحوث الذكاء الاصطناعي والجلسة السنوية لـ TIAP',
    location: 'Rabat — Ministry of Foreign Affairs',
    agenda: ['TIAP annual session', 'AI research center signing', 'Digital economy forum', 'Business delegation meetings'],
    agendaAr: ['الجلسة السنوية لـ TIAP', 'توقيع مركز بحوث الذكاء الاصطناعي', 'منتدى الاقتصاد الرقمي', 'اجتماعات وفد الأعمال'],
    outcome: null, outcomeAr: null, committee: 'TIAP-2026',
  },
  {
    id: 3, type: 'incoming', country: 'Libya', flag: '🇱🇾',
    date: 'Aug 25, 2026', duration: '2 days', status: 'upcoming',
    head: 'Min. Omar Al-Shahidi', size: 18,
    title: 'Libyan Trade Mission',
    titleAr: 'البعثة التجارية الليبية',
    purpose: 'Investment Corridor & Trade Facilitation',
    purposeAr: 'ممر الاستثمار وتيسير التجارة',
    location: 'VIP Terminal & Trade Center',
    agenda: ['Investment roundtable', 'Trade facilitation workshop', 'B2B matching sessions'],
    agendaAr: ['طاولة مستديرة للاستثمار', 'ورشة تيسير التجارة', 'جلسات التوفيق بين الشركات'],
    outcome: null, outcomeAr: null, committee: null,
  },
  {
    id: 4, type: 'outgoing', country: 'Kuwait', flag: '🇰🇼',
    date: 'Jul 15, 2026', duration: '2 days', status: 'completed',
    head: 'Dr. Sara Al-Rashidi', size: 5,
    title: 'GCC Summit Preparatory Visit',
    titleAr: 'الزيارة التحضيرية لقمة مجلس التعاون الخليجي',
    purpose: 'GCC Summit Agenda Coordination',
    purposeAr: 'تنسيق جدول أعمال قمة مجلس التعاون الخليجي',
    location: 'Kuwait City — GCC Secretariat',
    agenda: ['Agenda finalisation', 'Joint communiqué drafting', 'Security protocol review'],
    agendaAr: ['إنهاء جدول الأعمال', 'صياغة البيان المشترك', 'مراجعة بروتوكول الأمن'],
    outcome: 'Summit agenda finalised; joint communiqué signed. 3 bilateral follow-up tasks created.',
    outcomeAr: 'تم إنهاء جدول أعمال القمة؛ وتوقيع البيان المشترك. تم إنشاء 3 مهام متابعة ثنائية.',
    committee: null,
  },
  {
    id: 5, type: 'incoming', country: 'Lebanon', flag: '🇱🇧',
    date: 'Jul 28, 2026', duration: '1 day', status: 'completed',
    head: 'Dep. Min. Firas Al-Haddad', size: 9,
    title: 'Lebanese Economic Delegation',
    titleAr: 'الوفد الاقتصادي اللبناني',
    purpose: 'MoU Renewal — Digital Economy',
    purposeAr: 'تجديد مذكرة التفاهم — الاقتصاد الرقمي',
    location: 'Diplomatic Center',
    agenda: ['MoU review session', 'Signing ceremony', 'Business networking dinner'],
    agendaAr: ['جلسة مراجعة مذكرة التفاهم', 'حفل التوقيع', 'عشاء التواصل التجاري'],
    outcome: 'MoU renewed for 3 additional years with expanded scope including fintech. KPI tracking initiated.',
    outcomeAr: 'تم تجديد مذكرة التفاهم لـ 3 سنوات إضافية مع توسيع النطاق ليشمل التكنولوجيا المالية. تم بدء تتبع مؤشرات الأداء.',
    committee: null,
  },
  {
    id: 6, type: 'outgoing', country: 'UAE', flag: '🇦🇪',
    date: 'Jun 10, 2026', duration: '5 days', status: 'completed',
    head: 'H.E. Ahmed Al-Mansouri', size: 14,
    title: 'Climate COP31 Delegation',
    titleAr: 'وفد مؤتمر COP31 للمناخ',
    purpose: 'COP31 Participation & Bilateral Meetings',
    purposeAr: 'المشاركة في COP31 والاجتماعات الثنائية',
    location: 'Dubai — Expo City',
    agenda: ['COP31 plenary sessions', 'Bilateral meetings: Tunisia, Egypt, Jordan', 'Green energy pavilion', 'Joint statement signing'],
    agendaAr: ['جلسات COP31 العامة', 'اجتماعات ثنائية: تونس ومصر والأردن', 'جناح الطاقة الخضراء', 'توقيع البيان المشترك'],
    outcome: 'Climate MoU with Jordan initiated. 4 bilateral meetings held. Green energy partnership expanded.',
    outcomeAr: 'تم بدء مذكرة التفاهم المناخية مع الأردن. عُقدت 4 اجتماعات ثنائية. توسعت شراكة الطاقة الخضراء.',
    committee: null,
  },
]

const EVENTS = [
  { id: 1, title: 'GCC Summit 2026',                          titleAr: 'قمة مجلس التعاون الخليجي 2026',                       type: 'summit',     date: 'Sep 15–17, 2026', location: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦', participants: 60  },
  { id: 2, title: 'MENA Trade & Investment Forum',             titleAr: 'منتدى التجارة والاستثمار في الشرق الأوسط وشمال أفريقيا', type: 'conference', date: 'Aug 28, 2026',    location: 'Dubai',  country: 'UAE',          flag: '🇦🇪', participants: 420 },
  { id: 3, title: 'Doha Forum — Diplomacy in the Digital Age', titleAr: 'منتدى الدوحة — الدبلوماسية في العصر الرقمي',           type: 'conference', date: 'Sep 5, 2026',     location: 'Doha',   country: 'Qatar',        flag: '🇶🇦', participants: 200 },
  { id: 4, title: 'Asia–GCC Business Council',                 titleAr: 'مجلس الأعمال الآسيوي الخليجي',                       type: 'roundtable', date: 'Aug 10, 2026',    location: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦', participants: 35  },
  { id: 5, title: 'Arab League Foreign Ministers Session',     titleAr: 'جلسة وزراء خارجية جامعة الدول العربية',               type: 'session',    date: 'Sep 22, 2026',    location: 'Cairo',  country: 'Egypt',        flag: '🇪🇬', participants: 22  },
]

const EVENT_TYPE_COLORS: Record<string, string> = {
  summit:     'bg-red-500/10 text-red-700 dark:text-red-400',
  conference: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  roundtable: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  session:    'bg-amber-500/10 text-amber-700 dark:text-amber-400',
}

const EVENT_TYPE_LABELS: Record<string, { en: string; ar: string }> = {
  summit:     { en: 'Summit',     ar: 'قمة' },
  conference: { en: 'Conference', ar: 'مؤتمر' },
  roundtable: { en: 'Roundtable', ar: 'طاولة مستديرة' },
  session:    { en: 'Session',    ar: 'جلسة' },
}

export function VisitsView() {
  const { language } = useApp()
  const isRtl = language === 'ar'

  const T = {
    // KPI labels
    visitsThisYear:      isRtl ? 'الزيارات هذا العام'          : 'Visits This Year',
    upcomingVisits:      isRtl ? 'الزيارات القادمة'             : 'Upcoming Visits',
    delegationsHosted:   isRtl ? 'الوفود المستضافة'             : 'Delegations Hosted',
    countriesVisited:    isRtl ? 'الدول التي تمت زيارتها'       : 'Countries Visited',
    nextAug20:           isRtl ? 'التالية: ٢٠ أغسطس'           : 'Next: Aug 20',
    thisYear:            isRtl ? 'هذا العام'                    : 'this year',
    vsYear:              isRtl ? '+8 مقارنة بـ 2025'            : '+8 vs 2025',
    newCountries:        isRtl ? '+3 جديدة'                     : '+3 new',
    // Tabs
    diplomaticVisits:    isRtl ? 'الزيارات الدبلوماسية'         : 'Diplomatic Visits',
    intlEvents:          isRtl ? 'الفعاليات الدولية'            : 'International Events',
    calendar:            isRtl ? 'التقويم'                      : 'Calendar',
    logVisit:            isRtl ? 'تسجيل زيارة'                  : 'Log Visit',
    addEvent:            isRtl ? 'إضافة فعالية'                 : 'Add Event',
    // Filters
    searchVisits:        isRtl ? 'البحث في الزيارات...'         : 'Search visits...',
    all:                 isRtl ? 'الكل'                         : 'All',
    incoming:            isRtl ? 'واردة'                        : 'Incoming',
    outgoing:            isRtl ? 'صادرة'                        : 'Outgoing',
    allStatus:           isRtl ? 'جميع الحالات'                 : 'All Status',
    upcoming:            isRtl ? 'قادمة'                        : 'Upcoming',
    completed:           isRtl ? 'مكتملة'                       : 'Completed',
    visits:              isRtl ? 'زيارة'                        : 'visits',
    // Card labels
    members:             isRtl ? 'أعضاء'                        : 'members',
    participants:        isRtl ? 'مشارك'                        : 'participants',
    // Expanded section labels
    agendaItems:         isRtl ? 'بنود الأجندة'                 : 'Agenda Items',
    linkedCommittee:     isRtl ? 'اللجنة المرتبطة'              : 'Linked Committee',
    outcome:             isRtl ? 'النتيجة'                      : 'Outcome',
    viewBrief:           isRtl ? 'عرض الملخص'                   : 'View Brief',
    edit:                isRtl ? 'تعديل'                        : 'Edit',
    // Calendar
    calendarTitle:       isRtl ? 'أغسطس — سبتمبر 2026'         : 'August — September 2026',
    today:               isRtl ? 'اليوم'                        : 'Today',
    eventsThisQtr:       isRtl ? 'فعالية دولية هذا الربع'       : 'international events this quarter',
    visitLabel:          isRtl ? 'زيارة'                        : 'Visit',
    eventLabel:          isRtl ? 'فعالية'                       : 'Event',
  }

  const STATS = [
    { label: T.visitsThisYear,    value: '34', icon: Plane,        color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-500/10',    change: T.vsYear         },
    { label: T.upcomingVisits,    value: '7',  icon: Calendar,     color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-500/10',   change: T.nextAug20      },
    { label: T.delegationsHosted, value: '19', icon: ArrowDownLeft, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10', change: T.thisYear      },
    { label: T.countriesVisited,  value: '15', icon: Globe2,       color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', change: T.newCountries },
  ]

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'incoming' | 'outgoing'>('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<typeof VISITS[0] | null>(null)

  const filtered = VISITS.filter((v) => {
    const searchLower = search.toLowerCase()
    const matchSearch = v.title.toLowerCase().includes(searchLower) ||
      v.titleAr.includes(search) ||
      v.country.toLowerCase().includes(searchLower) ||
      v.head.toLowerCase().includes(searchLower)
    const matchType = typeFilter === 'all' || v.type === typeFilter
    const matchStatus = statusFilter === 'all' || v.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  return (
    <div className="p-6 space-y-6">

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
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

      <Tabs defaultValue="visits">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList className="rounded-xl bg-muted/60 p-1 gap-1">
            <TabsTrigger value="visits" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.diplomaticVisits}</TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.intlEvents}</TabsTrigger>
            <TabsTrigger value="calendar" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.calendar}</TabsTrigger>
          </TabsList>
          <button className="flex items-center gap-1.5 text-[12px] bg-primary text-primary-foreground px-3.5 py-2 rounded-xl hover:brightness-105 transition-all font-medium shadow-sm shadow-primary/20">
            <Plus className="w-3.5 h-3.5" />
            {T.logVisit}
          </button>
        </div>

        {/* ── VISITS TAB ── */}
        <TabsContent value="visits" className="mt-5 space-y-4">
          {/* Filters */}
          <Card className="border-border/50 rounded-2xl shadow-sm">
            <CardContent className="p-4 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={T.searchVisits}
                  className="w-full pl-9 pr-3 h-9 rounded-xl bg-muted/50 border border-border/60 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <div className="flex rounded-xl border border-border/60 overflow-hidden">
                  {(['all', 'incoming', 'outgoing'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${typeFilter === t ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted/50'}`}
                    >
                      {t === 'all' ? T.all : t === 'incoming' ? T.incoming : T.outgoing}
                    </button>
                  ))}
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] text-foreground outline-none focus:border-primary/40"
                >
                  <option value="all">{T.allStatus}</option>
                  <option value="upcoming">{T.upcoming}</option>
                  <option value="completed">{T.completed}</option>
                </select>
              </div>
              <span className="text-[11px] text-muted-foreground ml-auto">{filtered.length} {T.visits}</span>
            </CardContent>
          </Card>

          {/* Visit cards */}
          <div className="space-y-3">
            {filtered.map((visit) => (
              <Card
                key={visit.id}
                onClick={() => setSelected(selected?.id === visit.id ? null : visit)}
                className={`border-border/50 shadow-sm rounded-2xl cursor-pointer transition-all duration-150 hover:border-primary/20 ${selected?.id === visit.id ? 'border-primary/30 ring-1 ring-primary/20' : ''}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Direction icon */}
                    <div className={`p-2.5 rounded-xl shrink-0 ${visit.type === 'incoming' ? 'bg-violet-500/10' : 'bg-blue-500/10'}`}>
                      {visit.type === 'incoming'
                        ? <ArrowDownLeft className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        : <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-lg leading-none">{visit.flag}</span>
                            <h3 className="text-[14px] font-bold text-foreground">{isRtl ? visit.titleAr : visit.title}</h3>
                            <Badge
                              className={`border-0 text-[10px] rounded-lg capitalize font-semibold ${visit.type === 'incoming' ? 'bg-violet-500/10 text-violet-700 dark:text-violet-400' : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'}`}
                            >
                              {visit.type === 'incoming' ? T.incoming : T.outgoing}
                            </Badge>
                          </div>
                          <p className="text-[12px] text-muted-foreground mt-1">{isRtl ? visit.purposeAr : visit.purpose}</p>
                        </div>
                        <Badge
                          className={`border-0 text-[10px] rounded-lg font-semibold shrink-0 ${visit.status === 'completed' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}
                        >
                          {visit.status === 'completed' ? T.completed : T.upcoming}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar className="w-3 h-3" /> {visit.date}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="w-3 h-3" /> {visit.duration}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <User className="w-3 h-3" /> {visit.head}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Users className="w-3 h-3" /> {visit.size} {T.members}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <MapPin className="w-3 h-3" /> {visit.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded */}
                  {selected?.id === visit.id && (
                    <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{T.agendaItems}</p>
                        <ul className="space-y-1.5">
                          {(isRtl ? visit.agendaAr : visit.agenda).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-[12px] text-foreground">
                              <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        {visit.committee && (
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{T.linkedCommittee}</p>
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 border border-border/50">
                              <Users className="w-3.5 h-3.5 text-primary" />
                              <span className="text-[12px] font-semibold text-foreground">{visit.committee}</span>
                            </div>
                          </div>
                        )}
                        {visit.outcome && (
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{T.outcome}</p>
                            <p className="text-[12px] text-foreground leading-relaxed p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">{isRtl ? visit.outcomeAr : visit.outcome}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1.5 text-[12px] bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:brightness-105 transition-all font-medium">
                            <FileText className="w-3 h-3" /> {T.viewBrief}
                          </button>
                          <button className="flex items-center gap-1.5 text-[12px] border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-all font-medium text-foreground">
                            {T.edit}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── EVENTS TAB ── */}
        <TabsContent value="events" className="mt-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[13px] text-muted-foreground">{EVENTS.length} {T.eventsThisQtr}</p>
            <button className="flex items-center gap-1.5 text-[12px] bg-primary text-primary-foreground px-3.5 py-2 rounded-xl hover:brightness-105 transition-all font-medium shadow-sm shadow-primary/20">
              <Plus className="w-3.5 h-3.5" /> {T.addEvent}
            </button>
          </div>
          {EVENTS.map((event) => (
            <Card key={event.id} className="border-border/50 shadow-sm rounded-2xl hover:border-primary/20 transition-all duration-150 cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <span className="text-2xl leading-none shrink-0">{event.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="text-[14px] font-bold text-foreground">{isRtl ? event.titleAr : event.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar className="w-3 h-3" /> {event.date}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <MapPin className="w-3 h-3" /> {event.location}, {event.country}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Users className="w-3 h-3" /> {event.participants} {T.participants}
                        </span>
                      </div>
                    </div>
                    <Badge className={`border-0 text-[10px] rounded-lg capitalize font-semibold ${EVENT_TYPE_COLORS[event.type] ?? ''}`}>
                      {isRtl ? (EVENT_TYPE_LABELS[event.type]?.ar ?? event.type) : (EVENT_TYPE_LABELS[event.type]?.en ?? event.type)}
                    </Badge>
                  </div>
                </div>
                <button className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ── CALENDAR TAB ── */}
        <TabsContent value="calendar" className="mt-5">
          <Card className="border-border/50 rounded-2xl shadow-sm">
            <CardHeader className="px-6 pt-5 pb-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[14px] font-bold">{T.calendarTitle}</CardTitle>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-[12px] border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground">&larr;</button>
                  <button className="px-3 py-1.5 text-[12px] border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground">{T.today}</button>
                  <button className="px-3 py-1.5 text-[12px] border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground">&rarr;</button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                {[...VISITS.filter((v) => v.status === 'upcoming'), ...EVENTS].map((item, i) => {
                  const isVisit = 'purpose' in item
                  const date = isVisit ? (item as typeof VISITS[0]).date : (item as typeof EVENTS[0]).date
                  const title = isRtl
                    ? (isVisit ? (item as typeof VISITS[0]).titleAr : (item as typeof EVENTS[0]).titleAr)
                    : item.title
                  return (
                    <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:border-primary/20 cursor-pointer ${isVisit ? 'border-violet-200 bg-violet-500/5 dark:border-violet-800/40' : 'border-blue-200 bg-blue-500/5 dark:border-blue-800/40'}`}>
                      <div className={`p-2 rounded-lg shrink-0 ${isVisit ? 'bg-violet-500/10' : 'bg-blue-500/10'}`}>
                        {isVisit ? <Plane className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" /> : <Globe2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-foreground truncate">{title}</p>
                        <p className="text-[11px] text-muted-foreground">{date}</p>
                      </div>
                      <Badge className={`border-0 text-[10px] rounded-lg ${isVisit ? 'bg-violet-500/10 text-violet-700 dark:text-violet-400' : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'}`}>
                        {isVisit ? T.visitLabel : T.eventLabel}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
