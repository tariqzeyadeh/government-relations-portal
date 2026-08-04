'use client'

import { useState } from 'react'
import {
  Vote, CheckCircle2, Clock, AlertTriangle, Plus, Search,
  Users2, Calendar, FileText, ChevronDown, ChevronUp,
  ThumbsUp, ThumbsDown, Minus, BarChart2, Gavel, Link2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useApp } from '@/lib/app-context'

const DECISIONS = [
  {
    id: 1,
    title: 'Approve Joint AI Research Center Establishment',
    titleAr: 'الموافقة على إنشاء مركز بحوث الذكاء الاصطناعي المشترك',
    committee: 'TIAP-2026', meeting: 'TIAP Technical Workshop — Aug 20',
    date: 'Aug 20, 2026', status: 'pending_vote', priority: 'high',
    description: 'Establish a joint AI research center between the Ministry and Morocco\'s MoHESR, with an initial 3-year budget of $45M and a focus on generative AI and robotics.',
    descAr: 'إنشاء مركز بحوث ذكاء اصطناعي مشترك بين الوزارة ووزارة التعليم العالي المغربية، بميزانية أولية لمدة 3 سنوات بقيمة 45 مليون دولار مع التركيز على الذكاء الاصطناعي التوليدي والروبوتات.',
    votes: { for: 8, against: 2, abstain: 1, total: 15 },
    votingDeadline: 'Aug 22, 2026',
    linkedTask: 'AI Research Center feasibility study',
    linkedTaskAr: 'دراسة جدوى مركز بحوث الذكاء الاصطناعي',
    executiveAction: 'Proceed to budget approval after vote',
    execActionAr: 'المضي قدماً في اعتماد الميزانية بعد التصويت',
    members: [
      { name: 'K. Ibrahim', vote: 'for' },
      { name: 'K. Belhaj', vote: 'for' },
      { name: 'H. Al-Idrissi', vote: 'against' },
      { name: 'Y. Benali', vote: 'for' },
      { name: 'S. Amrani', vote: 'pending' },
    ],
  },
  {
    id: 2,
    title: 'Ratify Green Hydrogen MoU Framework with Jordan',
    titleAr: 'التصديق على إطار مذكرة التفاهم للهيدروجين الأخضر مع الأردن',
    committee: 'JEC-2026', meeting: 'JEC 3rd Session 2026 — Aug 8',
    date: 'Aug 8, 2026', status: 'approved', priority: 'high',
    description: 'Formally ratify the text of the bilateral MoU on Green Hydrogen production and export, committing to 2 GW capacity by 2030 and $2.4B joint investment.',
    descAr: 'التصديق الرسمي على نص مذكرة التفاهم الثنائية لإنتاج الهيدروجين الأخضر وتصديره، بالتزام بطاقة 2 غيغاوات بحلول 2030 واستثمار مشترك بقيمة 2.4 مليار دولار.',
    votes: { for: 11, against: 0, abstain: 1, total: 12 },
    votingDeadline: 'Aug 10, 2026',
    linkedTask: 'Draft MoU on Green Hydrogen — Jordan',
    linkedTaskAr: 'إعداد مسودة مذكرة التفاهم حول الهيدروجين الأخضر — الأردن',
    executiveAction: 'Forward to legal review and signature ceremony scheduling',
    execActionAr: 'إحالة إلى المراجعة القانونية وجدولة حفل التوقيع',
    members: [
      { name: 'A. Al-Mansouri', vote: 'for' },
      { name: 'S. Al-Rashidi', vote: 'for' },
      { name: 'K. Ibrahim', vote: 'for' },
      { name: 'N. Hassan', vote: 'for' },
      { name: 'F. Al-Shami', vote: 'abstain' },
    ],
  },
  {
    id: 3,
    title: 'Extend Defense Cooperation Agreement — Iraq by 10 Years',
    titleAr: 'تمديد اتفاقية التعاون الدفاعي مع العراق لمدة 10 سنوات',
    committee: 'SCWG-2026', meeting: 'SCWG Quarterly Review — Aug 28',
    date: 'Aug 28, 2026', status: 'pending_vote', priority: 'high',
    description: 'Extend the existing defense cooperation framework agreement for 10 additional years, including updated intelligence-sharing protocols and joint exercise schedules.',
    descAr: 'تمديد إطار اتفاقية التعاون الدفاعي الحالية لـ 10 سنوات إضافية، بما يشمل بروتوكولات تبادل المعلومات الاستخباراتية المحدثة وجداول التدريبات المشتركة.',
    votes: { for: 0, against: 0, abstain: 0, total: 6 },
    votingDeadline: 'Aug 30, 2026',
    linkedTask: 'Joint exercise framework review',
    linkedTaskAr: 'مراجعة إطار التدريبات المشتركة',
    executiveAction: 'Submit to senior defense advisory board',
    execActionAr: 'إحالة إلى مجلس الاستشارة الدفاعية العليا',
    members: [
      { name: 'O. Nasser', vote: 'pending' },
      { name: 'H. Al-Jubouri', vote: 'pending' },
      { name: 'S. Al-Tamimi', vote: 'pending' },
      { name: 'R. Al-Bayati', vote: 'pending' },
    ],
  },
  {
    id: 4,
    title: 'Reject Climate MoU Draft — Insufficient Targets',
    titleAr: 'رفض مسودة مذكرة التفاهم المناخية — أهداف غير كافية',
    committee: 'JEC-2026', meeting: 'JEC Emergency Session — Jul 28',
    date: 'Jul 28, 2026', status: 'rejected', priority: 'medium',
    description: 'The committee voted to reject the initial draft of the Climate Change Cooperation Protocol due to insufficient NDC alignment and missing financing provisions.',
    descAr: 'صوتت اللجنة برفض المسودة الأولية لبروتوكول التعاون في تغير المناخ بسبب عدم كفاية توافق المساهمات المحددة وطنياً وغياب أحكام التمويل.',
    votes: { for: 2, against: 8, abstain: 2, total: 12 },
    votingDeadline: 'Jul 28, 2026',
    linkedTask: 'Finalize Climate MoU Negotiation Positions',
    linkedTaskAr: 'إنهاء مواقف التفاوض حول مذكرة التفاهم المناخية',
    executiveAction: 'Return to negotiation team for revision',
    execActionAr: 'إعادة إلى فريق التفاوض للمراجعة',
    members: [
      { name: 'A. Al-Mansouri', vote: 'against' },
      { name: 'S. Al-Rashidi', vote: 'against' },
      { name: 'K. Ibrahim', vote: 'for' },
      { name: 'N. Hassan', vote: 'against' },
      { name: 'F. Al-Shami', vote: 'abstain' },
    ],
  },
  {
    id: 5,
    title: 'Approve Scholarship Program Renewal — Jordan',
    titleAr: 'الموافقة على تجديد برنامج المنح الدراسية — الأردن',
    committee: 'CEC-2026', meeting: 'CEC Mid-Year Review — Jul 15',
    date: 'Jul 15, 2026', status: 'implemented', priority: 'low',
    description: 'Renew the bilateral scholarship program for 3 additional years with an increased annual budget of $3.2M and expansion to include STEM fields.',
    descAr: 'تجديد برنامج المنح الدراسية الثنائي لـ 3 سنوات إضافية مع زيادة الميزانية السنوية إلى 3.2 مليون دولار وتوسيعه ليشمل مجالات العلوم والتكنولوجيا والهندسة والرياضيات.',
    votes: { for: 8, against: 0, abstain: 0, total: 8 },
    votingDeadline: 'Jul 15, 2026',
    linkedTask: 'Scholarship program renewal',
    linkedTaskAr: 'تجديد برنامج المنح الدراسية',
    executiveAction: 'Issue official scholarship circular to universities',
    execActionAr: 'إصدار التعميم الرسمي للمنح الدراسية إلى الجامعات',
    members: [
      { name: 'S. Al-Rashidi', vote: 'for' },
      { name: 'R. Al-Dabbas', vote: 'for' },
      { name: 'L. Nassar', vote: 'for' },
      { name: 'A. Awad', vote: 'for' },
    ],
  },
]

const STATUS_CONFIG = {
  pending_vote: { labelEn: 'Pending Vote', labelAr: 'في انتظار التصويت', bg: 'bg-amber-500/10',   text: 'text-amber-700 dark:text-amber-400',   icon: Vote       },
  approved:     { labelEn: 'Approved',     labelAr: 'موافق عليه',        bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', icon: CheckCircle2 },
  rejected:     { labelEn: 'Rejected',     labelAr: 'مرفوض',             bg: 'bg-red-500/10',     text: 'text-red-600 dark:text-red-400',         icon: AlertTriangle },
  implemented:  { labelEn: 'Implemented',  labelAr: 'منفَّذ',             bg: 'bg-blue-500/10',    text: 'text-blue-700 dark:text-blue-400',        icon: BarChart2  },
}

const VOTE_ICONS = {
  for: { icon: ThumbsUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  against: { icon: ThumbsDown, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
  abstain: { icon: Minus, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  pending: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' },
}

export function DecisionsView() {
  const { language } = useApp()
  const isRtl = language === 'ar'

  const T = {
    // KPI
    totalDecisions:     isRtl ? 'إجمالي القرارات'              : 'Total Decisions',
    pendingVote:        isRtl ? 'في انتظار التصويت'            : 'Pending Vote',
    approved:           isRtl ? 'موافق عليها'                  : 'Approved',
    overdue:            isRtl ? 'متأخرة'                       : 'Overdue',
    thisMonth:          isRtl ? '+6 هذا الشهر'                 : '+6 this month',
    closingToday:       isRtl ? '2 تُغلق اليوم'                : '2 closing today',
    approvalRate:       isRtl ? 'معدل الموافقة 61%'            : '61% approval rate',
    actionNeeded:       isRtl ? 'إجراء مطلوب'                  : 'Action needed',
    // Tabs
    allDecisions:       isRtl ? 'جميع القرارات'                : 'All Decisions',
    votingCenter:       isRtl ? 'مركز التصويت'                 : 'Voting Center',
    implTracker:        isRtl ? 'متابعة التنفيذ'               : 'Implementation Tracker',
    newDecision:        isRtl ? 'قرار جديد'                    : 'New Decision',
    // Filters
    searchDecisions:    isRtl ? 'البحث في القرارات...'         : 'Search decisions...',
    allStatus:          isRtl ? 'جميع الحالات'                 : 'All Status',
    rejected:           isRtl ? 'مرفوض'                       : 'Rejected',
    implemented:        isRtl ? 'منفَّذ'                       : 'Implemented',
    decisions:          isRtl ? 'قرار'                         : 'decisions',
    // Expanded labels
    decisionSummary:    isRtl ? 'ملخص القرار'                  : 'Decision Summary',
    linkedTask:         isRtl ? 'المهمة المرتبطة'              : 'Linked Task',
    executiveAction:    isRtl ? 'الإجراء التنفيذي'             : 'Executive Action',
    voteTally:          isRtl ? 'نتيجة التصويت'                : 'Vote Tally',
    memberVotes:        isRtl ? 'أصوات الأعضاء'                : 'Member Votes',
    forLabel:           isRtl ? 'موافق'                        : 'For',
    againstLabel:       isRtl ? 'رافض'                        : 'Against',
    abstainLabel:       isRtl ? 'ممتنع'                       : 'Abstain',
    forShort:           isRtl ? 'م'                            : 'F',
    againstShort:       isRtl ? 'ر'                            : 'A',
    abstainShort:       isRtl ? 'ع'                            : 'Ab',
    forPctLabel:        isRtl ? '% موافقة'                     : '% for',
    // Voting panel
    pendingVotesMsg:    isRtl ? 'لديك أصوات معلقة. القرارات تُغلق قريباً — يرجى الإدلاء بصوتك.' : 'You have pending votes. Decisions close soon — please cast your vote.',
    pendingVotesCount:  isRtl ? 'أصوات معلقة'                  : 'pending votes',
    deadline:           isRtl ? 'الموعد النهائي:'              : 'Deadline:',
    voteFor:            isRtl ? 'التصويت بالموافقة'            : 'Vote For',
    voteAgainst:        isRtl ? 'التصويت بالرفض'               : 'Vote Against',
    voteAbstain:        isRtl ? 'الامتناع'                     : 'Abstain',
    voteRecorded:       isRtl ? 'تم تسجيل تصويتك:'            : 'Your vote has been recorded:',
    changeVote:         isRtl ? 'تغيير الصوت'                  : 'Change vote',
    voted:              isRtl ? 'صوّت:'                        : 'Voted:',
    // Implementation
    implSubtitle:       isRtl ? 'متابعة القرارات المُعتمدة حتى التنفيذ الكامل.' : 'Tracking approved decisions through to full implementation.',
    implProgress:       isRtl ? 'نسبة التنفيذ'                 : 'Implementation progress',
    action:             isRtl ? 'الإجراء: '                    : 'Action: ',
    linkedTaskLabel:    isRtl ? 'المهمة المرتبطة: '            : 'Linked task: ',
    decided:            isRtl ? 'قُرر في'                      : 'Decided',
  }

  const STATS = [
    { label: T.totalDecisions, value: '31', icon: Gavel,        color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-500/10',    change: T.thisMonth    },
    { label: T.pendingVote,    value: '4',  icon: Vote,         color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-500/10',   change: T.closingToday },
    { label: T.approved,       value: '19', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', change: T.approvalRate },
    { label: T.overdue,        value: '2',  icon: AlertTriangle, color: 'text-red-600 dark:text-red-400',     bg: 'bg-red-500/10',     change: T.actionNeeded },
  ]

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [myVotes, setMyVotes] = useState<Record<number, 'for' | 'against' | 'abstain'>>({})

  const filtered = DECISIONS.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.committee.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || d.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleVote = (decisionId: number, vote: 'for' | 'against' | 'abstain') => {
    setMyVotes((prev) => ({ ...prev, [decisionId]: vote }))
  }

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

      <Tabs defaultValue="decisions">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList className="rounded-xl bg-muted/60 p-1 gap-1">
            <TabsTrigger value="decisions" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.allDecisions}</TabsTrigger>
            <TabsTrigger value="voting" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
              {T.votingCenter}
              <span className="ml-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {DECISIONS.filter((d) => d.status === 'pending_vote').length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="implementation" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.implTracker}</TabsTrigger>
          </TabsList>
          <button className="flex items-center gap-1.5 text-[12px] bg-primary text-primary-foreground px-3.5 py-2 rounded-xl hover:brightness-105 transition-all font-medium shadow-sm shadow-primary/20">
            <Plus className="w-3.5 h-3.5" />
            {T.newDecision}
          </button>
        </div>

        {/* ── ALL DECISIONS TAB ── */}
        <TabsContent value="decisions" className="mt-5 space-y-3">
          {/* Filters */}
          <Card className="border-border/50 rounded-2xl shadow-sm">
            <CardContent className="p-4 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={T.searchDecisions}
                  className="w-full pl-9 pr-3 h-9 rounded-xl bg-muted/50 border border-border/60 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] text-foreground outline-none focus:border-primary/40"
              >
                <option value="all">{T.allStatus}</option>
                <option value="pending_vote">{T.pendingVote}</option>
                <option value="approved">{T.approved}</option>
                <option value="rejected">{T.rejected}</option>
                <option value="implemented">{T.implemented}</option>
              </select>
              <span className="text-[11px] text-muted-foreground ml-auto">{filtered.length} {T.decisions}</span>
            </CardContent>
          </Card>

          {filtered.map((decision) => {
            const cfg = STATUS_CONFIG[decision.status as keyof typeof STATUS_CONFIG]
            const CfgIcon = cfg.icon
            const forPct = decision.votes.total > 0 ? Math.round((decision.votes.for / decision.votes.total) * 100) : 0
            const isExpanded = expanded === decision.id
            return (
              <Card key={decision.id} className={`border-border/50 shadow-sm rounded-2xl transition-all duration-150 ${decision.status === 'pending_vote' ? 'border-amber-200/60 dark:border-amber-800/30' : ''}`}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : decision.id)}
                  className="w-full p-5 flex items-center gap-4 text-left hover:bg-muted/20 transition-colors rounded-2xl"
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${cfg.bg}`}>
                    <CfgIcon className={`w-4 h-4 ${cfg.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[14px] font-bold text-foreground leading-snug">{isRtl ? decision.titleAr : decision.title}</h3>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Users2 className="w-3 h-3" /> {decision.committee}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Calendar className="w-3 h-3" /> {decision.date}
                          </span>
                          {decision.status !== 'pending_vote' && (
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                    <Vote className="w-3 h-3" /> {decision.votes.for}{T.forShort} · {decision.votes.against}{T.againstShort} · {decision.votes.abstain}{T.abstainShort}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>{isRtl ? cfg.labelAr : cfg.labelEn}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </div>
                    {/* Vote bar for decided items */}
                    {decision.votes.total > 0 && decision.status !== 'pending_vote' && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${forPct}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">{forPct}{T.forPctLabel}</span>
                      </div>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border/50 p-5 bg-muted/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{T.decisionSummary}</p>
                          <p className="text-[13px] text-foreground leading-relaxed">{isRtl ? decision.descAr : decision.description}</p>
                        </div>
                        {decision.linkedTask && (
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{T.linkedTask}</p>
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 border border-border/50">
                              <Link2 className="w-3.5 h-3.5 text-primary" />
                              <span className="text-[12px] text-foreground">{isRtl ? decision.linkedTaskAr : decision.linkedTask}</span>
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{T.executiveAction}</p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed p-2.5 rounded-xl bg-primary/5 border border-primary/20">{isRtl ? decision.execActionAr : decision.executiveAction}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Vote tally */}
                        {decision.votes.total > 0 && (
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{T.voteTally} ({decision.votes.total})</p>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { key: 'for',     label: T.forLabel,     count: decision.votes.for,     icon: ThumbsUp,   color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
                                { key: 'against', label: T.againstLabel, count: decision.votes.against, icon: ThumbsDown, color: 'text-red-600',     bg: 'bg-red-500/10'     },
                                { key: 'abstain', label: T.abstainLabel, count: decision.votes.abstain, icon: Minus,      color: 'text-amber-600',   bg: 'bg-amber-500/10'   },
                              ].map((v) => (
                                <div key={v.key} className={`p-3 rounded-xl ${v.bg} text-center`}>
                                  <v.icon className={`w-4 h-4 ${v.color} mx-auto mb-1`} />
                                  <p className={`text-xl font-extrabold ${v.color}`}>{v.count}</p>
                                  <p className="text-[10px] text-muted-foreground font-semibold">{v.label}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Member votes */}
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{T.memberVotes}</p>
                          <div className="space-y-1.5">
                            {decision.members.map((m, i) => {
                              const vc = VOTE_ICONS[m.vote as keyof typeof VOTE_ICONS]
                              const VcIcon = vc.icon
                              return (
                                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-card border border-border/50">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">
                                      {m.name.split('. ')[0]}
                                    </div>
                                    <span className="text-[12px] font-medium text-foreground">{m.name}</span>
                                  </div>
                                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${vc.bg} ${vc.color}`}>
                                    <VcIcon className="w-2.5 h-2.5" />
                                    <span className="capitalize">
                                      {m.vote === 'for' ? T.forLabel : m.vote === 'against' ? T.againstLabel : m.vote === 'abstain' ? T.abstainLabel : (isRtl ? 'معلق' : 'Pending')}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </TabsContent>

        {/* ── VOTING CENTER TAB ── */}
        <TabsContent value="voting" className="mt-5 space-y-4">
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 mb-2">
            <Vote className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-[13px] font-semibold text-foreground">
              {isRtl ? 'لديك' : 'You have'}{' '}
              <span className="text-amber-600">{DECISIONS.filter((d) => d.status === 'pending_vote' && !myVotes[d.id]).length} {T.pendingVotesCount}</span>.{' '}
              {T.pendingVotesMsg.split('. ').slice(1).join('. ')}
            </p>
          </div>
          {DECISIONS.filter((d) => d.status === 'pending_vote').map((decision) => {
            const myVote = myVotes[decision.id]
            return (
              <Card key={decision.id} className="border-amber-200/60 dark:border-amber-800/30 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-bold text-foreground">{isRtl ? decision.titleAr : decision.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Users2 className="w-3 h-3" /> {decision.committee}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {T.deadline} {decision.votingDeadline}
                        </span>
                      </div>
                    </div>
                    {myVote && (
                      <Badge className={`border-0 text-[10px] capitalize font-semibold rounded-lg ${VOTE_ICONS[myVote].bg} ${VOTE_ICONS[myVote].color}`}>
                        {T.voted} {myVote === 'for' ? T.forLabel : myVote === 'against' ? T.againstLabel : T.abstainLabel}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">{isRtl ? decision.descAr : decision.description}</p>
                  {!myVote ? (
                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        onClick={() => handleVote(decision.id, 'for')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-[13px] font-semibold"
                      >
                        <ThumbsUp className="w-4 h-4" /> {T.voteFor}
                      </button>
                      <button
                        onClick={() => handleVote(decision.id, 'against')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20 transition-all text-[13px] font-semibold"
                      >
                        <ThumbsDown className="w-4 h-4" /> {T.voteAgainst}
                      </button>
                      <button
                        onClick={() => handleVote(decision.id, 'abstain')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border hover:bg-muted/70 transition-all text-[13px] font-semibold text-muted-foreground"
                      >
                        <Minus className="w-4 h-4" /> {T.voteAbstain}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[13px] font-semibold ${VOTE_ICONS[myVote].bg} ${VOTE_ICONS[myVote].color} border-current/20`}>
                        <CheckCircle2 className="w-4 h-4" />
                        {T.voteRecorded} <span className="capitalize font-bold">{myVote === 'for' ? T.forLabel : myVote === 'against' ? T.againstLabel : T.abstainLabel}</span>
                      </div>
                      <button
                        onClick={() => setMyVotes((prev) => { const n = { ...prev }; delete n[decision.id]; return n })}
                        className="text-[11px] text-muted-foreground underline hover:text-foreground"
                      >
                        {T.changeVote}
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* ── IMPLEMENTATION TRACKER TAB ── */}
        <TabsContent value="implementation" className="mt-5 space-y-3">
          <p className="text-[13px] text-muted-foreground">{T.implSubtitle}</p>
          {DECISIONS.filter((d) => d.status === 'approved' || d.status === 'implemented').map((decision) => {
            const implementationPct = decision.status === 'implemented' ? 100 : Math.round((decision.votes.for / decision.votes.total) * 60 + 20)
            const cfg = STATUS_CONFIG[decision.status as keyof typeof STATUS_CONFIG]
            return (
              <Card key={decision.id} className="border-border/50 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-bold text-foreground">{isRtl ? decision.titleAr : decision.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Users2 className="w-3 h-3" /> {decision.committee}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Gavel className="w-3 h-3" /> {T.decided} {decision.date}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>{isRtl ? cfg.labelAr : cfg.labelEn}</span>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-muted-foreground">{T.implProgress}</span>
                      <span className="text-[11px] font-bold text-foreground">{implementationPct}%</span>
                    </div>
                    <Progress value={implementationPct} className="h-2 rounded-full" />
                  </div>
                  <div className="mt-3 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">{T.action}</span>{isRtl ? decision.execActionAr : decision.executiveAction}
                    </p>
                  </div>
                  {decision.linkedTask && (
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Link2 className="w-3 h-3 text-primary" />
                      <span>{T.linkedTaskLabel}</span>
                      <span className="text-primary font-medium">{isRtl ? decision.linkedTaskAr : decision.linkedTask}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
