'use client'

import React, { useState } from 'react'
import { Users2, Calendar, MapPin, Clock, CheckCircle2, FileText, Plus, ChevronDown, ChevronUp, Video, Mic } from 'lucide-react'
import { useApp } from '@/lib/app-context'

const COMMITTEES = [
  {
    id: 1, name: 'Joint Economic Committee', code: 'JEC-2026', chair: 'H.E. Ahmed Al-Mansouri', status: 'active',
    members: 12, nextMeeting: 'Aug 8, 2026', counterparty: 'Egypt',
    description: 'Oversees bilateral trade, investment policy, and economic cooperation frameworks.',
    descAr: 'تشرف على التجارة الثنائية وسياسة الاستثمار وأطر التعاون الاقتصادي.',
    members_list: ['A. Al-Mansouri', 'S. Al-Rashidi', 'K. Ibrahim', 'N. Hassan', 'F. Al-Shami'],
    tasks: [
      { title: 'Review Q2 Trade Statistics',  titleAr: 'مراجعة إحصاءات التجارة للربع الثاني',             status: 'completed',   due: 'Jul 30' },
      { title: 'Draft MoU on Green Hydrogen', titleAr: 'إعداد مسودة مذكرة التفاهم حول الهيدروجين الأخضر', status: 'in_progress', due: 'Aug 10' },
      { title: 'Prepare investment roadmap',  titleAr: 'إعداد خارطة طريق الاستثمار',                      status: 'pending',     due: 'Aug 20' },
    ],
  },
  {
    id: 2, name: 'Cultural & Educational Exchange Committee', code: 'CEC-2026', chair: 'Dr. Sara Al-Rashidi', status: 'active',
    members: 8, nextMeeting: 'Aug 14, 2026', counterparty: 'Jordan',
    description: 'Manages cultural exchange programs, academic partnerships, and heritage projects.',
    descAr: 'تدير برامج التبادل الثقافي والشراكات الأكاديمية ومشاريع التراث.',
    members_list: ['S. Al-Rashidi', 'R. Al-Dabbas', 'L. Nassar', 'A. Awad'],
    tasks: [
      { title: 'Scholarship program renewal', titleAr: 'تجديد برنامج المنح الدراسية', status: 'completed',   due: 'Jul 15' },
      { title: 'Museum partnership MoU',      titleAr: 'مذكرة تفاهم شراكة المتاحف',   status: 'in_progress', due: 'Aug 14' },
      { title: 'Language program evaluation', titleAr: 'تقييم برنامج اللغة',          status: 'pending',     due: 'Sep 1'  },
    ],
  },
  {
    id: 3, name: 'Technology & Innovation Advisory Panel', code: 'TIAP-2026', chair: 'Eng. Khalid Ibrahim', status: 'active',
    members: 15, nextMeeting: 'Aug 20, 2026', counterparty: 'Morocco',
    description: 'Advises on AI, smart city, cybersecurity, and digital infrastructure cooperation.',
    descAr: 'تقدم المشورة في مجالات الذكاء الاصطناعي والمدن الذكية والأمن السيبراني والبنية التحتية الرقمية.',
    members_list: ['K. Ibrahim', 'K. Belhaj', 'H. Al-Idrissi', 'Y. Benali', 'S. Amrani'],
    tasks: [
      { title: 'AI Research Center feasibility study', titleAr: 'دراسة جدوى مركز بحوث الذكاء الاصطناعي', status: 'in_progress', due: 'Aug 15' },
      { title: 'Smart city pilot evaluation',          titleAr: 'تقييم التجربة الأولية للمدينة الذكية',  status: 'in_progress', due: 'Aug 22' },
      { title: 'Cybersecurity protocol update',        titleAr: 'تحديث بروتوكول الأمن السيبراني',        status: 'pending',     due: 'Sep 10' },
    ],
  },
  {
    id: 4, name: 'Security Cooperation Working Group', code: 'SCWG-2026', chair: 'Maj. Gen. Omar Nasser', status: 'active',
    members: 6, nextMeeting: 'Aug 28, 2026', counterparty: 'Iraq',
    description: 'Coordinates joint security frameworks, intelligence cooperation, and defense planning.',
    descAr: 'تنسق أطر الأمن المشترك والتعاون الاستخباراتي وتخطيط الدفاع.',
    members_list: ['O. Nasser', 'H. Al-Jubouri', 'S. Al-Tamimi', 'R. Al-Bayati'],
    tasks: [
      { title: 'Joint exercise framework review', titleAr: 'مراجعة إطار التدريبات المشتركة',         status: 'completed',   due: 'Jul 20' },
      { title: 'Intelligence sharing protocol',   titleAr: 'بروتوكول تبادل المعلومات الاستخباراتية', status: 'in_progress', due: 'Aug 28' },
      { title: 'Annual threat assessment',        titleAr: 'تقييم التهديدات السنوي',                 status: 'pending',     due: 'Sep 15' },
    ],
  },
]

const MEETINGS = [
  { id: 1, title: 'JEC 3rd Session 2026', committee: 'Joint Economic Committee', date: 'Aug 8, 2026', time: '10:00 AM', duration: '3h', location: 'Conference Hall B', mode: 'in-person', status: 'upcoming', agenda: 4 },
  { id: 2, title: 'CEC Annual Review', committee: 'Cultural & Educational Exchange', date: 'Aug 14, 2026', time: '2:00 PM', duration: '2h', location: 'Virtual (Teams)', mode: 'virtual', status: 'upcoming', agenda: 3 },
  { id: 3, title: 'TIAP Technical Workshop', committee: 'Technology & Innovation', date: 'Aug 20, 2026', time: '9:00 AM', duration: '4h', location: 'Innovation Hub', mode: 'hybrid', status: 'upcoming', agenda: 6 },
  { id: 4, title: 'JEC Emergency Session', committee: 'Joint Economic Committee', date: 'Jul 28, 2026', time: '11:00 AM', duration: '1.5h', location: 'Virtual (Zoom)', mode: 'virtual', status: 'completed', agenda: 2 },
  { id: 5, title: 'SCWG Quarterly Review', committee: 'Security Working Group', date: 'Aug 28, 2026', time: '8:00 AM', duration: '2h', location: 'Secure Room A', mode: 'in-person', status: 'upcoming', agenda: 3 },
]

const TASK_STATUS: Record<string, { labelEn: string; labelAr: string; bg: string; text: string; icon: React.ElementType }> = {
  completed:   { labelEn: 'Completed',   labelAr: 'مكتمل',      bg: 'bg-emerald-500/10', text: 'text-emerald-700', icon: CheckCircle2 },
  in_progress: { labelEn: 'In Progress', labelAr: 'قيد التنفيذ', bg: 'bg-blue-500/10',    text: 'text-blue-700',    icon: Clock        },
  pending:     { labelEn: 'Pending',     labelAr: 'معلقة',       bg: 'bg-amber-500/10',   text: 'text-amber-700',   icon: FileText     },
}

const MODE_ICONS: Record<string, React.ElementType> = {
  'in-person': MapPin,
  virtual: Video,
  hybrid: Mic,
}

export function CommitteesView() {
  const { language } = useApp()
  const isRtl = language === 'ar'
  const [activeTab, setActiveTab] = useState('committees')
  const [expanded, setExpanded] = useState<number | null>(1)

  const T = {
    activeCommittees: isRtl ? 'اللجان النشطة'        : 'Active Committees',
    upcomingMeetings: isRtl ? 'الاجتماعات القادمة'    : 'Upcoming Meetings',
    openTasks:        isRtl ? 'المهام المفتوحة'        : 'Open Tasks',
    completedMonth:   isRtl ? 'مكتملة هذا الشهر'      : 'Completed This Month',
    tabCommittees:    isRtl ? 'اللجان'                : 'Committees',
    tabMeetings:      isRtl ? 'الاجتماعات والجدول'     : 'Meetings & Agenda',
    committeesShown:  isRtl ? 'لجنة معروضة'           : 'committees shown',
    newCommittee:     isRtl ? 'لجنة جديدة'             : 'New Committee',
    members:          isRtl ? 'عضو'                   : 'members',
    vs:               isRtl ? 'مقابل'                 : 'vs.',
    active:           isRtl ? 'نشط'                   : 'Active',
    descriptionLabel: isRtl ? 'الوصف'                 : 'Description',
    chairLabel:       isRtl ? 'الرئيس'                : 'Chair',
    membersLabel:     isRtl ? 'الأعضاء'               : 'Members',
    taskTracker:      isRtl ? 'متابعة المهام'          : 'Task Tracker',
    dueLabel:         isRtl ? 'الاستحقاق:'            : 'Due:',
    meetingsMonth:    isRtl ? 'اجتماعات هذا الشهر'    : 'meetings this month',
    scheduleMeeting:  isRtl ? 'جدولة اجتماع'           : 'Schedule Meeting',
    meetCompleted:    isRtl ? 'مكتمل'                 : 'Completed',
    meetUpcoming:     isRtl ? 'قادم'                  : 'Upcoming',
    agendaItems:      isRtl ? 'بنود جدول الأعمال'      : 'agenda items',
  }

  const STATS = [
    { label: T.activeCommittees, value: '23', icon: Users2,       color: 'text-blue-600',    bg: 'bg-blue-500/10'    },
    { label: T.upcomingMeetings, value: '8',  icon: Calendar,     color: 'text-amber-600',   bg: 'bg-amber-500/10'   },
    { label: T.openTasks,        value: '34', icon: Clock,        color: 'text-violet-600',  bg: 'bg-violet-500/10'  },
    { label: T.completedMonth,   value: '19', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  ]

  const TABS = [
    { key: 'committees', label: T.tabCommittees },
    { key: 'meetings',   label: T.tabMeetings   },
  ]

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
            <Plus className="w-3.5 h-3.5" />{activeTab === 'meetings' ? T.scheduleMeeting : T.newCommittee}
          </button>
        </div>

        {activeTab === 'committees' && (
          <div className="space-y-3">
            <p className="text-[13px] text-[var(--color-text-muted)]">{COMMITTEES.length} {T.committeesShown}</p>
            {COMMITTEES.map((committee) => {
              const isExpanded = expanded === committee.id
              return (
                <div key={committee.id}
                  className={`rounded-2xl border bg-[var(--color-surface-elevated)] shadow-sm overflow-hidden transition-all duration-150 ${isExpanded ? 'border-[var(--color-brand)]/30 ring-1 ring-[var(--color-brand)]/20' : 'border-[var(--color-border)]/50'}`}>
                  <button onClick={() => setExpanded(isExpanded ? null : committee.id)}
                    className="w-full p-5 flex items-center gap-4 text-left hover:bg-gray-100/30 transition-colors duration-150">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center shrink-0">
                      <Users2 className="w-5 h-5 text-[var(--color-brand)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[14px] font-bold text-[var(--color-text)]">{committee.name}</h3>
                        <span className="text-[10px] rounded-lg bg-gray-100 text-[var(--color-text-muted)] font-medium px-2 py-0.5">{committee.code}</span>
                        <span className="text-[10px] rounded-lg bg-emerald-500/10 text-emerald-700 font-semibold px-2 py-0.5">{T.active}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                        <span className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1"><Calendar className="w-3 h-3" />{committee.nextMeeting}</span>
                        <span className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1"><Users2 className="w-3 h-3" />{committee.members} {T.members}</span>
                        <span className="text-[11px] text-[var(--color-text-muted)]">{T.vs} {committee.counterparty}</span>
                      </div>
                    </div>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[var(--color-border)]/50 p-5 bg-gray-100/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">{T.descriptionLabel}</p>
                            <p className="text-[13px] text-[var(--color-text)] leading-relaxed">{isRtl ? committee.descAr : committee.description}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">{T.chairLabel}</p>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center text-[10px] font-bold text-[var(--color-brand)]">
                                {committee.chair.split(' ').slice(-1)[0][0]}
                              </div>
                              <span className="text-[13px] font-semibold text-[var(--color-text)]">{committee.chair}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">{T.membersLabel}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {committee.members_list.map((m) => (
                                <span key={m} className="text-[10px] font-medium rounded-lg bg-gray-100 text-[var(--color-text-muted)] px-2.5 py-1">{m}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2.5">{T.taskTracker}</p>
                          <div className="space-y-2">
                            {committee.tasks.map((task, i) => {
                              const ts = TASK_STATUS[task.status]
                              const TsIcon = ts.icon
                              return (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]/50">
                                  <div className={`p-1.5 rounded-lg shrink-0 ${ts.bg}`}><TsIcon className={`w-3.5 h-3.5 ${ts.text}`} /></div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-semibold text-[var(--color-text)] truncate">{isRtl ? task.titleAr : task.title}</p>
                                    <p className="text-[10px] text-[var(--color-text-muted)]">{T.dueLabel} {task.due}</p>
                                  </div>
                                  <span className={`text-[10px] font-bold shrink-0 px-2 py-0.5 rounded-full ${ts.bg} ${ts.text}`}>
                                    {isRtl ? ts.labelAr : ts.labelEn}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="space-y-3">
            <p className="text-[13px] text-[var(--color-text-muted)] mb-1">{MEETINGS.length} {T.meetingsMonth}</p>
            {MEETINGS.map((meeting) => {
              const ModeIcon = MODE_ICONS[meeting.mode] ?? MapPin
              return (
                <div key={meeting.id}
                  className={`rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm p-5 flex items-start gap-5 transition-all duration-150 hover:border-[var(--color-brand)]/20 ${meeting.status === 'completed' ? 'opacity-65' : ''}`}>
                  <div className="text-center shrink-0 w-12 bg-gray-100/60 rounded-xl py-2.5">
                    <div className="text-[9px] font-bold text-[var(--color-text-muted)] leading-none uppercase tracking-wide">{meeting.date.split(' ')[0]}</div>
                    <div className="text-2xl font-extrabold text-[var(--color-text)] leading-tight mt-0.5">{meeting.date.split(' ')[1].replace(',', '')}</div>
                    <div className="text-[9px] text-[var(--color-text-muted)]">{meeting.date.split(' ')[2]}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="text-[14px] font-bold text-[var(--color-text)]">{meeting.title}</h3>
                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{meeting.committee}</p>
                      </div>
                      <span className={`inline-flex items-center text-[10px] rounded-lg font-semibold px-2.5 py-1 shrink-0 ${meeting.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-blue-500/10 text-blue-700'}`}>
                        {meeting.status === 'completed' ? T.meetCompleted : T.meetUpcoming}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                      <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]"><Clock className="w-3 h-3" />{meeting.time} · {meeting.duration}</span>
                      <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]"><ModeIcon className="w-3 h-3" />{meeting.location}</span>
                      <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]"><FileText className="w-3 h-3" />{meeting.agenda} {T.agendaItems}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
