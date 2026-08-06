'use client'

import React, { useState } from 'react'
import {
  Plane, Calendar, MapPin, Users, Clock, Globe2, Filter,
  Plus, Search, ArrowUpRight, ArrowDownLeft, FileText, ChevronRight, User,
} from 'lucide-react'
import { useApp } from '@/lib/app-context'

const VISITS = [
  { id: 1, type: 'incoming', country: 'Jordan',  flag: '🇯🇴', date: 'Aug 20, 2026', duration: '3 days',  status: 'upcoming',  head: 'Min. Tariq Al-Masri',       size: 12, title: 'Jordanian Ministerial Delegation',      titleAr: 'الوفد الوزاري الأردني',                   purpose: 'Defense & Technology MoU Signing',          purposeAr: 'توقيع مذكرة التفاهم في الدفاع والتكنولوجيا', location: 'State Hall & Diplomatic Center', agenda: ['Bilateral defense briefing', 'Technology MoU signing ceremony', 'Ministerial dinner', 'Cultural tour'], agendaAr: ['إحاطة الدفاع الثنائي', 'حفل توقيع مذكرة التفاهم التكنولوجية', 'عشاء وزاري', 'جولة ثقافية'], outcome: null, outcomeAr: null, committee: 'CEC-2026' },
  { id: 2, type: 'outgoing', country: 'Morocco', flag: '🇲🇦', date: 'Sep 3, 2026',  duration: '4 days',  status: 'upcoming',  head: 'H.E. Ahmed Al-Mansouri',    size: 8,  title: 'Official Visit to Rabat',               titleAr: 'الزيارة الرسمية للرباط',                  purpose: 'AI Research Center Launch & TIAP Session',  purposeAr: 'إطلاق مركز بحوث الذكاء الاصطناعي والجلسة السنوية', location: 'Rabat — Ministry of Foreign Affairs', agenda: ['TIAP annual session', 'AI research center signing', 'Digital economy forum', 'Business delegation meetings'], agendaAr: ['الجلسة السنوية لـ TIAP', 'توقيع مركز بحوث الذكاء الاصطناعي', 'منتدى الاقتصاد الرقمي', 'اجتماعات وفد الأعمال'], outcome: null, outcomeAr: null, committee: 'TIAP-2026' },
  { id: 3, type: 'incoming', country: 'Libya',   flag: '🇱🇾', date: 'Aug 25, 2026', duration: '2 days',  status: 'upcoming',  head: 'Min. Omar Al-Shahidi',      size: 18, title: 'Libyan Trade Mission',                  titleAr: 'البعثة التجارية الليبية',                 purpose: 'Investment Corridor & Trade Facilitation',  purposeAr: 'ممر الاستثمار وتيسير التجارة',              location: 'VIP Terminal & Trade Center', agenda: ['Investment roundtable', 'Trade facilitation workshop', 'B2B matching sessions'], agendaAr: ['طاولة مستديرة للاستثمار', 'ورشة تيسير التجارة', 'جلسات التوفيق بين الشركات'], outcome: null, outcomeAr: null, committee: null },
  { id: 4, type: 'outgoing', country: 'Kuwait',  flag: '🇰🇼', date: 'Jul 15, 2026', duration: '2 days',  status: 'completed', head: 'Dr. Sara Al-Rashidi',       size: 5,  title: 'GCC Summit Preparatory Visit',          titleAr: 'الزيارة التحضيرية لقمة مجلس التعاون الخليجي', purpose: 'GCC Summit Agenda Coordination', purposeAr: 'تنسيق جدول أعمال قمة مجلس التعاون الخليجي', location: 'Kuwait City — GCC Secretariat', agenda: ['Agenda finalisation', 'Joint communiqué drafting', 'Security protocol review'], agendaAr: ['إنهاء جدول الأعمال', 'صياغة البيان المشترك', 'مراجعة بروتوكول الأمن'], outcome: 'Summit agenda finalised; joint communiqué signed. 3 bilateral follow-up tasks created.', outcomeAr: 'تم إنهاء جدول أعمال القمة وتوقيع البيان المشترك.', committee: null },
  { id: 5, type: 'incoming', country: 'Lebanon', flag: '🇱🇧', date: 'Jul 28, 2026', duration: '1 day',   status: 'completed', head: 'Dep. Min. Firas Al-Haddad', size: 9,  title: 'Lebanese Economic Delegation',          titleAr: 'الوفد الاقتصادي اللبناني',                purpose: 'MoU Renewal — Digital Economy',             purposeAr: 'تجديد مذكرة التفاهم — الاقتصاد الرقمي',     location: 'Diplomatic Center', agenda: ['MoU review session', 'Signing ceremony', 'Business networking dinner'], agendaAr: ['جلسة مراجعة مذكرة التفاهم', 'حفل التوقيع', 'عشاء التواصل التجاري'], outcome: 'MoU renewed for 3 additional years with expanded scope including fintech.', outcomeAr: 'تم تجديد مذكرة التفاهم لـ 3 سنوات إضافية.', committee: null },
  { id: 6, type: 'outgoing', country: 'UAE',     flag: '🇦🇪', date: 'Jun 10, 2026', duration: '5 days',  status: 'completed', head: 'H.E. Ahmed Al-Mansouri',    size: 14, title: 'Climate COP31 Delegation',              titleAr: 'وفد مؤتمر COP31 للمناخ',                  purpose: 'COP31 Participation & Bilateral Meetings',  purposeAr: 'المشاركة في COP31 والاجتماعات الثنائية',    location: 'Dubai — Expo City', agenda: ['COP31 plenary sessions', 'Bilateral meetings: Tunisia, Egypt, Jordan', 'Green energy pavilion'], agendaAr: ['جلسات COP31 العامة', 'اجتماعات ثنائية: تونس ومصر والأردن', 'جناح الطاقة الخضراء'], outcome: 'Climate MoU with Jordan initiated. 4 bilateral meetings held.', outcomeAr: 'تم بدء مذكرة التفاهم المناخية مع الأردن.', committee: null },
]

const EVENTS = [
  { id: 1, title: 'GCC Summit 2026',                          titleAr: 'قمة مجلس التعاون الخليجي 2026',                           type: 'summit',     date: 'Sep 15–17, 2026', location: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦', participants: 60  },
  { id: 2, title: 'MENA Trade & Investment Forum',             titleAr: 'منتدى التجارة والاستثمار في الشرق الأوسط وشمال أفريقيا', type: 'conference', date: 'Aug 28, 2026',    location: 'Dubai',  country: 'UAE',          flag: '🇦🇪', participants: 420 },
  { id: 3, title: 'Doha Forum — Diplomacy in the Digital Age', titleAr: 'منتدى الدوحة — الدبلوماسية في العصر الرقمي',             type: 'conference', date: 'Sep 5, 2026',     location: 'Doha',   country: 'Qatar',        flag: '🇶🇦', participants: 200 },
  { id: 4, title: 'Asia–GCC Business Council',                 titleAr: 'مجلس الأعمال الآسيوي الخليجي',                         type: 'roundtable', date: 'Aug 10, 2026',    location: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦', participants: 35  },
  { id: 5, title: 'Arab League Foreign Ministers Session',     titleAr: 'جلسة وزراء خارجية جامعة الدول العربية',                 type: 'session',    date: 'Sep 22, 2026',    location: 'Cairo',  country: 'Egypt',        flag: '🇪🇬', participants: 22  },
]

const EVENT_TYPE_COLORS: Record<string, string> = {
  summit: 'bg-red-500/10 text-red-700', conference: 'bg-blue-500/10 text-blue-700',
  roundtable: 'bg-violet-500/10 text-violet-700', session: 'bg-amber-500/10 text-amber-700',
}

const EVENT_TYPE_LABELS: Record<string, { en: string; ar: string }> = {
  summit: { en: 'Summit', ar: 'قمة' }, conference: { en: 'Conference', ar: 'مؤتمر' },
  roundtable: { en: 'Roundtable', ar: 'طاولة مستديرة' }, session: { en: 'Session', ar: 'جلسة' },
}

type VisitType = typeof VISITS[0]

export function VisitsView() {
  const { language } = useApp()
  const isRtl = language === 'ar'
  const [activeTab, setActiveTab] = useState('visits')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<VisitType | null>(null)

  const T = {
    visitsThisYear: isRtl ? 'الزيارات هذا العام' : 'Visits This Year',
    upcomingVisits: isRtl ? 'الزيارات القادمة' : 'Upcoming Visits',
    delegationsHosted: isRtl ? 'الوفود المستضافة' : 'Delegations Hosted',
    countriesVisited: isRtl ? 'الدول التي تمت زيارتها' : 'Countries Visited',
    diplomaticVisits: isRtl ? 'الزيارات الدبلوماسية' : 'Diplomatic Visits',
    intlEvents: isRtl ? 'الفعاليات الدولية' : 'International Events',
    calendar: isRtl ? 'التقويم' : 'Calendar',
    logVisit: isRtl ? 'تسجيل زيارة' : 'Log Visit',
    addEvent: isRtl ? 'إضافة فعالية' : 'Add Event',
    searchVisits: isRtl ? 'البحث في الزيارات...' : 'Search visits...',
    all: isRtl ? 'الكل' : 'All',
    incoming: isRtl ? 'واردة' : 'Incoming',
    outgoing: isRtl ? 'صادرة' : 'Outgoing',
    allStatus: isRtl ? 'جميع الحالات' : 'All Status',
    upcoming: isRtl ? 'قادمة' : 'Upcoming',
    completed: isRtl ? 'مكتملة' : 'Completed',
    visits: isRtl ? 'زيارة' : 'visits',
    members: isRtl ? 'أعضاء' : 'members',
    participants: isRtl ? 'مشارك' : 'participants',
    agendaItems: isRtl ? 'بنود الأجندة' : 'Agenda Items',
    linkedCommittee: isRtl ? 'اللجنة المرتبطة' : 'Linked Committee',
    outcome: isRtl ? 'النتيجة' : 'Outcome',
    viewBrief: isRtl ? 'عرض الملخص' : 'View Brief',
    edit: isRtl ? 'تعديل' : 'Edit',
    calendarTitle: isRtl ? 'أغسطس — سبتمبر 2026' : 'August — September 2026',
    today: isRtl ? 'اليوم' : 'Today',
    eventsThisQtr: isRtl ? 'فعالية دولية هذا الربع' : 'international events this quarter',
    visitLabel: isRtl ? 'زيارة' : 'Visit',
    eventLabel: isRtl ? 'فعالية' : 'Event',
  }

  const STATS = [
    { label: T.visitsThisYear,    value: '34', icon: Plane,         color: 'text-blue-600',    bg: 'bg-blue-500/10',    change: '+8 vs 2025' },
    { label: T.upcomingVisits,    value: '7',  icon: Calendar,      color: 'text-amber-600',   bg: 'bg-amber-500/10',   change: isRtl ? 'التالية: ٢٠ أغسطس' : 'Next: Aug 20' },
    { label: T.delegationsHosted, value: '19', icon: ArrowDownLeft, color: 'text-violet-600',  bg: 'bg-violet-500/10',  change: isRtl ? 'هذا العام' : 'this year' },
    { label: T.countriesVisited,  value: '15', icon: Globe2,        color: 'text-emerald-600', bg: 'bg-emerald-500/10', change: isRtl ? '+3 جديدة' : '+3 new' },
  ]

  const TABS = [
    { key: 'visits',   label: T.diplomaticVisits },
    { key: 'events',   label: T.intlEvents       },
    { key: 'calendar', label: T.calendar         },
  ]

  const filtered = VISITS.filter((v) => {
    const s = search.toLowerCase()
    const matchSearch = v.title.toLowerCase().includes(s) || v.titleAr.includes(search) || v.country.toLowerCase().includes(s)
    const matchType   = typeFilter === 'all'   || v.type   === typeFilter
    const matchStatus = statusFilter === 'all' || v.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
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
          <div className="flex gap-1 p-1 rounded-xl bg-gray-100/60">
            {TABS.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${activeTab === tab.key ? 'bg-[var(--color-surface-elevated)] shadow-sm text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 text-[12px] bg-[var(--color-brand)] text-white px-3.5 py-2 rounded-xl hover:bg-[var(--color-brand2)] transition-all font-medium shadow-sm">
            <Plus className="w-3.5 h-3.5" />{activeTab === 'events' ? T.addEvent : T.logVisit}
          </button>
        </div>

        {activeTab === 'visits' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm p-4 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={T.searchVisits}
                  className="w-full pl-9 pr-3 h-9 rounded-xl bg-gray-100/50 border border-[var(--color-border)]/60 text-[13px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-brand)]/40" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <div className="flex rounded-xl border border-[var(--color-border)]/60 overflow-hidden">
                  {([['all', T.all], ['incoming', T.incoming], ['outgoing', T.outgoing]] as [string, string][]).map(([val, label]) => (
                    <button key={val} onClick={() => setTypeFilter(val)}
                      className={`px-3 py-1.5 text-[12px] font-medium transition-colors ${typeFilter === val ? 'bg-[var(--color-brand)] text-white' : 'text-[var(--color-text-muted)] hover:bg-gray-100/50'}`}>
                      {label}
                    </button>
                  ))}
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-gray-100/50 border border-[var(--color-border)]/60 text-[12px] text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]/40">
                  <option value="all">{T.allStatus}</option>
                  <option value="upcoming">{T.upcoming}</option>
                  <option value="completed">{T.completed}</option>
                </select>
              </div>
              <span className="text-[11px] text-[var(--color-text-muted)] ml-auto">{filtered.length} {T.visits}</span>
            </div>

            <div className="space-y-3">
              {filtered.map((visit) => {
                const isExpanded = selected?.id === visit.id
                return (
                  <div key={visit.id} onClick={() => setSelected(isExpanded ? null : visit)}
                    className={`rounded-2xl border bg-[var(--color-surface-elevated)] shadow-sm cursor-pointer transition-all duration-150 hover:border-[var(--color-brand)]/20 ${isExpanded ? 'border-[var(--color-brand)]/30 ring-1 ring-[var(--color-brand)]/20' : 'border-[var(--color-border)]/50'}`}>
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-xl shrink-0 ${visit.type === 'incoming' ? 'bg-violet-500/10' : 'bg-blue-500/10'}`}>
                          {visit.type === 'incoming'
                            ? <ArrowDownLeft className="w-4 h-4 text-violet-600" />
                            : <ArrowUpRight  className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-lg leading-none">{visit.flag}</span>
                                <h3 className="text-[14px] font-bold text-[var(--color-text)]">{isRtl ? visit.titleAr : visit.title}</h3>
                                <span className={`inline-flex items-center text-[10px] rounded-lg font-semibold px-2 py-0.5 ${visit.type === 'incoming' ? 'bg-violet-500/10 text-violet-700' : 'bg-blue-500/10 text-blue-700'}`}>
                                  {visit.type === 'incoming' ? T.incoming : T.outgoing}
                                </span>
                              </div>
                              <p className="text-[12px] text-[var(--color-text-muted)] mt-1">{isRtl ? visit.purposeAr : visit.purpose}</p>
                            </div>
                            <span className={`inline-flex items-center text-[10px] rounded-lg font-semibold px-2.5 py-1 shrink-0 ${visit.status === 'completed' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'}`}>
                              {visit.status === 'completed' ? T.completed : T.upcoming}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                            {[{ Icon: Calendar, text: visit.date }, { Icon: Clock, text: visit.duration }, { Icon: User, text: visit.head }, { Icon: Users, text: `${visit.size} ${T.members}` }, { Icon: MapPin, text: visit.location }].map(({ Icon, text }) => (
                              <span key={text} className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
                                <Icon className="w-3 h-3" />{text}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-[var(--color-border)]/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">{T.agendaItems}</p>
                            <ul className="space-y-1.5">
                              {(isRtl ? visit.agendaAr : visit.agenda).map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-[12px] text-[var(--color-text)]">
                                  <ChevronRight className="w-3.5 h-3.5 text-[var(--color-brand)] shrink-0 mt-0.5" />{item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-4">
                            {visit.committee && (
                              <div>
                                <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">{T.linkedCommittee}</p>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-100/50 border border-[var(--color-border)]/50">
                                  <Users className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                                  <span className="text-[12px] font-semibold text-[var(--color-text)]">{visit.committee}</span>
                                </div>
                              </div>
                            )}
                            {visit.outcome && (
                              <div>
                                <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">{T.outcome}</p>
                                <p className="text-[12px] text-[var(--color-text)] leading-relaxed p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">{isRtl ? visit.outcomeAr : visit.outcome}</p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button className="flex items-center gap-1.5 text-[12px] bg-[var(--color-brand)] text-white px-3 py-1.5 rounded-lg hover:bg-[var(--color-brand2)] transition-all font-medium">
                                <FileText className="w-3 h-3" />{T.viewBrief}
                              </button>
                              <button className="flex items-center gap-1.5 text-[12px] border border-[var(--color-border)] px-3 py-1.5 rounded-lg hover:bg-gray-100/50 transition-all font-medium text-[var(--color-text)]">
                                {T.edit}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-3">
            <p className="text-[13px] text-[var(--color-text-muted)] mb-1">{EVENTS.length} {T.eventsThisQtr}</p>
            {EVENTS.map((event) => (
              <div key={event.id} className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm hover:border-[var(--color-brand)]/20 transition-all duration-150 cursor-pointer p-5 flex items-center gap-4">
                <span className="text-2xl leading-none shrink-0">{event.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="text-[14px] font-bold text-[var(--color-text)]">{isRtl ? event.titleAr : event.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]"><Calendar className="w-3 h-3" />{event.date}</span>
                        <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]"><MapPin className="w-3 h-3" />{event.location}, {event.country}</span>
                        <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]"><Users className="w-3 h-3" />{event.participants} {T.participants}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center text-[10px] rounded-lg font-semibold px-2.5 py-1 ${EVENT_TYPE_COLORS[event.type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {isRtl ? (EVENT_TYPE_LABELS[event.type]?.ar ?? event.type) : (EVENT_TYPE_LABELS[event.type]?.en ?? event.type)}
                    </span>
                  </div>
                </div>
                <button className="p-2 rounded-xl hover:bg-gray-100/50 transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm">
            <div className="px-6 pt-5 pb-4 border-b border-[var(--color-border)]/50 flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-[var(--color-text)]">{T.calendarTitle}</h3>
              <div className="flex items-center gap-2">
                {['←', T.today, '→'].map((label) => (
                  <button key={label} className="px-3 py-1.5 text-[12px] border border-[var(--color-border)] rounded-lg hover:bg-gray-100/50 transition-colors text-[var(--color-text-muted)]">{label}</button>
                ))}
              </div>
            </div>
            <div className="p-6 space-y-2">
              {[...VISITS.filter((v) => v.status === 'upcoming'), ...EVENTS].map((item, i) => {
                const isVisit = 'purpose' in item
                const title = isRtl ? item.titleAr : item.title
                const date = item.date
                return (
                  <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:border-[var(--color-brand)]/20 cursor-pointer ${isVisit ? 'border-violet-200 bg-violet-500/5' : 'border-blue-200 bg-blue-500/5'}`}>
                    <div className={`p-2 rounded-lg shrink-0 ${isVisit ? 'bg-violet-500/10' : 'bg-blue-500/10'}`}>
                      {isVisit ? <Plane className="w-3.5 h-3.5 text-violet-600" /> : <Globe2 className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[var(--color-text)] truncate">{title}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">{date}</p>
                    </div>
                    <span className={`inline-flex items-center text-[10px] rounded-lg font-semibold px-2.5 py-1 ${isVisit ? 'bg-violet-500/10 text-violet-700' : 'bg-blue-500/10 text-blue-700'}`}>
                      {isVisit ? T.visitLabel : T.eventLabel}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
