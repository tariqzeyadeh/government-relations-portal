'use client'

import React, { useState } from 'react'
import {
  CheckCircle2, Clock, AlertTriangle, Plus, Filter, Search,
  Calendar, Globe2, Building2, Users2, MoreHorizontal,
  TrendingUp, Flag, User, Circle,
} from 'lucide-react'
import { useApp } from '@/lib/app-context'

const TASKS = [
  { id: 1, priority: 'high', status: 'in_progress', due: 'Aug 10, 2026', assignee: 'A. Al-Mansouri', module: 'country', moduleRef: 'Egypt', progress: 65, tags: ['Report', 'Trade'], daysLeft: 6, title: 'Prepare Q3 Bilateral Trade Report — Egypt', titleAr: 'إعداد تقرير التجارة الثنائية للربع الثالث — مصر', description: 'Compile Q3 trade statistics and prepare bilateral trade review document for JEC committee.', descAr: 'تجميع إحصاءات التجارة للربع الثالث وإعداد وثيقة مراجعة التجارة الثنائية للجنة JEC.' },
  { id: 2, priority: 'high', status: 'in_progress', due: 'Aug 14, 2026', assignee: 'S. Al-Rashidi', module: 'mou', moduleRef: 'MoU #JO-2026-04', progress: 40, tags: ['MoU', 'Energy'], daysLeft: 10, title: 'Draft MoU on Green Hydrogen — Jordan', titleAr: 'إعداد مسودة مذكرة التفاهم حول الهيدروجين الأخضر — الأردن', description: 'Finalize text of MoU covering green hydrogen production targets and joint R&D terms.', descAr: 'إنهاء نص مذكرة التفاهم المتعلقة بأهداف إنتاج الهيدروجين الأخضر وشروط البحث والتطوير المشترك.' },
  { id: 3, priority: 'medium', status: 'pending', due: 'Aug 18, 2026', assignee: 'K. Ibrahim', module: 'country', moduleRef: 'Morocco', progress: 0, tags: ['Profile', 'Update'], daysLeft: 14, title: 'Update Country Profile — Morocco', titleAr: 'تحديث ملف الدولة — المغرب', description: 'Refresh Morocco country profile with latest economic data and update counterpart contacts.', descAr: 'تحديث ملف المغرب بأحدث البيانات الاقتصادية وتحديث جهات الاتصال المقابلة.' },
  { id: 4, priority: 'high', status: 'in_progress', due: 'Aug 15, 2026', assignee: 'K. Ibrahim', module: 'committee', moduleRef: 'TIAP-2026', progress: 55, tags: ['Feasibility', 'Technology'], daysLeft: 11, title: 'Prepare AI Research Center Feasibility Study', titleAr: 'إعداد دراسة جدوى مركز بحوث الذكاء الاصطناعي', description: 'Conduct feasibility assessment for joint AI research center proposal with Moroccan counterparts.', descAr: 'إجراء تقييم الجدوى لمقترح مركز بحوث الذكاء الاصطناعي المشترك مع الشركاء المغاربة.' },
  { id: 5, priority: 'low', status: 'completed', due: 'Jul 30, 2026', assignee: 'A. Al-Mansouri', module: 'committee', moduleRef: 'JEC-2026', progress: 100, tags: ['Minutes', 'Committee'], daysLeft: 0, title: 'Prepare Joint Committee Minutes — JEC 2nd Session', titleAr: 'إعداد محاضر اللجنة المشتركة — الجلسة الثانية لـ JEC', description: 'Compile and distribute official minutes of JEC 2nd session 2026.', descAr: 'تجميع وتوزيع المحاضر الرسمية للجلسة الثانية لـ JEC لعام 2026.' },
  { id: 6, priority: 'medium', status: 'pending', due: 'Aug 20, 2026', assignee: 'S. Al-Rashidi', module: 'organization', moduleRef: 'GCC Secretariat', progress: 10, tags: ['Investment', 'GCC'], daysLeft: 16, title: 'Investment Roadmap — GCC Infrastructure', titleAr: 'خارطة طريق الاستثمار — البنية التحتية لدول الخليج', description: 'Map current and planned GCC infrastructure investment portfolio for ministerial briefing.', descAr: 'رسم محفظة استثمارات البنية التحتية الحالية والمخططة لدول الخليج للإحاطة الوزارية.' },
  { id: 7, priority: 'high', status: 'overdue', due: 'Aug 1, 2026', assignee: 'K. Ibrahim', module: 'committee', moduleRef: 'SCWG-2026', progress: 20, tags: ['Security', 'Protocol'], daysLeft: -3, title: 'Cybersecurity Protocol Update — Iraq Cooperation', titleAr: 'تحديث بروتوكول الأمن السيبراني — التعاون مع العراق', description: 'Update bilateral cybersecurity cooperation protocol in line with new national standards.', descAr: 'تحديث بروتوكول التعاون الثنائي في الأمن السيبراني وفقاً للمعايير الوطنية الجديدة.' },
  { id: 8, priority: 'low', status: 'pending', due: 'Sep 1, 2026', assignee: 'S. Al-Rashidi', module: 'committee', moduleRef: 'CEC-2026', progress: 0, tags: ['Education', 'Culture'], daysLeft: 28, title: 'Language Program Evaluation — Jordan', titleAr: 'تقييم برنامج اللغة — الأردن', description: 'Evaluate outcomes and renewal terms of bilateral language exchange program.', descAr: 'تقييم نتائج وشروط تجديد برنامج التبادل اللغوي الثنائي.' },
  { id: 9, priority: 'high', status: 'pending', due: 'Sep 15, 2026', assignee: 'O. Nasser', module: 'committee', moduleRef: 'SCWG-2026', progress: 5, tags: ['Security', 'Report'], daysLeft: 42, title: 'Annual Threat Assessment Report', titleAr: 'تقرير تقييم التهديدات السنوي', description: 'Compile and validate annual bilateral threat assessment with security counterparts.', descAr: 'تجميع والتحقق من تقييم التهديدات الثنائية السنوي مع نظراء الأمن.' },
  { id: 10, priority: 'medium', status: 'in_progress', due: 'Aug 25, 2026', assignee: 'A. Al-Mansouri', module: 'mou', moduleRef: 'MoU #JO-2026-07', progress: 30, tags: ['MoU', 'Environment'], daysLeft: 21, title: 'Finalize Climate MoU Negotiation Positions', titleAr: 'إنهاء مواقف التفاوض حول مذكرة التفاهم المناخية', description: 'Align negotiation positions for Climate Change Cooperation Protocol with Jordanian counterparts.', descAr: 'توحيد مواقف التفاوض لبروتوكول التعاون في تغير المناخ مع الشركاء الأردنيين.' },
]

const PRIORITY_CONFIG: Record<string, { labelEn: string; labelAr: string; bg: string; text: string; dot: string }> = {
  high:   { labelEn: 'High',   labelAr: 'عالية',  bg: 'bg-red-500/10',     text: 'text-red-700',     dot: 'bg-red-500'     },
  medium: { labelEn: 'Medium', labelAr: 'متوسطة', bg: 'bg-amber-500/10',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  low:    { labelEn: 'Low',    labelAr: 'منخفضة', bg: 'bg-emerald-500/10', text: 'text-emerald-700', dot: 'bg-emerald-500' },
}

const STATUS_CONFIG: Record<string, { labelEn: string; labelAr: string; bg: string; text: string; icon: React.ElementType }> = {
  in_progress: { labelEn: 'In Progress', labelAr: 'قيد التنفيذ', bg: 'bg-blue-500/10',    text: 'text-blue-700',    icon: Clock         },
  pending:     { labelEn: 'Pending',     labelAr: 'معلقة',       bg: 'bg-amber-500/10',   text: 'text-amber-700',   icon: Circle        },
  completed:   { labelEn: 'Completed',   labelAr: 'مكتملة',      bg: 'bg-emerald-500/10', text: 'text-emerald-700', icon: CheckCircle2  },
  overdue:     { labelEn: 'Overdue',     labelAr: 'متأخرة',      bg: 'bg-red-500/10',     text: 'text-red-700',     icon: AlertTriangle },
}

const MODULE_ICONS: Record<string, React.ElementType> = {
  country: Globe2, committee: Users2, organization: Building2, mou: TrendingUp,
}

const ASSIGNEES = ['All', 'A. Al-Mansouri', 'S. Al-Rashidi', 'K. Ibrahim', 'O. Nasser']

type TaskType = typeof TASKS[0]

function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 rounded-full bg-gray-200 overflow-hidden ${className}`}>
      <div className="h-full rounded-full bg-[var(--color-brand)] transition-all" style={{ width: `${value}%` }} />
    </div>
  )
}

export function TasksView() {
  const { language } = useApp()
  const isRtl = language === 'ar'
  const [activeTab, setActiveTab] = useState('list')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('All')
  const [selected, setSelected] = useState<TaskType | null>(null)

  const T = {
    totalTasks:     isRtl ? 'إجمالي المهام'          : 'Total Tasks',
    inProgress:     isRtl ? 'قيد التنفيذ'             : 'In Progress',
    overdue:        isRtl ? 'متأخرة'                  : 'Overdue',
    completedAug:   isRtl ? 'مكتملة (أغسطس)'          : 'Completed (Aug)',
    thisWeek:       isRtl ? '+5 هذا الأسبوع'           : '+5 this week',
    dueToday:       isRtl ? '4 مستحقة اليوم'           : '4 due today',
    actionNeeded:   isRtl ? 'إجراء مطلوب'              : 'Action needed',
    vsJul:          isRtl ? '+8 مقارنة بيوليو'          : '+8 vs Jul',
    taskList:       isRtl ? 'قائمة المهام'             : 'Task List',
    kanban:         isRtl ? 'لوحة كانبان'               : 'Kanban Board',
    timeline:       isRtl ? 'الجدول الزمني'             : 'Timeline',
    matrix:         isRtl ? 'مصفوفة المسؤوليات'         : 'Responsibility Matrix',
    newTask:        isRtl ? 'مهمة جديدة'                : 'New Task',
    searchTasks:    isRtl ? 'البحث في المهام...'        : 'Search tasks...',
    allStatus:      isRtl ? 'جميع الحالات'              : 'All Status',
    allPriority:    isRtl ? 'جميع الأولويات'            : 'All Priority',
    all:            isRtl ? 'الكل'                      : 'All',
    tasks:          isRtl ? 'مهمة'                      : 'tasks',
    sInProgress:    isRtl ? 'قيد التنفيذ'               : 'In Progress',
    sPending:       isRtl ? 'معلقة'                     : 'Pending',
    sCompleted:     isRtl ? 'مكتملة'                    : 'Completed',
    sOverdue:       isRtl ? 'متأخرة'                    : 'Overdue',
    pHigh:          isRtl ? 'عالية'                     : 'High',
    pMedium:        isRtl ? 'متوسطة'                    : 'Medium',
    pLow:           isRtl ? 'منخفضة'                    : 'Low',
    due:            isRtl ? 'الاستحقاق'                 : 'Due',
    dLeft:          isRtl ? 'أيام متبقية'               : 'd left',
    dOverdue:       isRtl ? 'أيام تأخير'                : 'd overdue',
    markComplete:   isRtl ? 'تحديد كمكتمل'              : 'Mark Complete',
    editTask:       isRtl ? 'تعديل المهمة'              : 'Edit Task',
    addComment:     isRtl ? 'إضافة تعليق'               : 'Add Comment',
    timelineTitle:  isRtl ? 'الجدول الزمني — أغسطس 2026' : 'Task Timeline — August 2026',
    priority:       isRtl ? 'الأولوية:'                 : 'Priority:',
    matrixTitle:    isRtl ? 'مصفوفة المسؤوليات'         : 'Responsibility Matrix',
    matrixSubtitle: isRtl ? 'توزيع ملكية المهام والمساءلة حسب المسؤول' : 'Task ownership and accountability by assignee',
    assignee:       isRtl ? 'المسؤول'                   : 'Assignee',
    total:          isRtl ? 'الإجمالي'                  : 'Total',
    workload:       isRtl ? 'عبء العمل'                 : 'Workload',
  }

  const STATS = [
    { label: T.totalTasks,   value: '47', icon: Circle,        color: 'text-blue-600',    bg: 'bg-blue-500/10',    change: T.thisWeek     },
    { label: T.inProgress,   value: '18', icon: Clock,         color: 'text-amber-600',   bg: 'bg-amber-500/10',   change: T.dueToday     },
    { label: T.overdue,      value: '3',  icon: AlertTriangle, color: 'text-red-600',     bg: 'bg-red-500/10',     change: T.actionNeeded },
    { label: T.completedAug, value: '26', icon: CheckCircle2,  color: 'text-emerald-600', bg: 'bg-emerald-500/10', change: T.vsJul         },
  ]

  const TABS = [
    { key: 'list',     label: T.taskList },
    { key: 'kanban',   label: T.kanban   },
    { key: 'timeline', label: T.timeline },
    { key: 'matrix',   label: T.matrix   },
  ]

  const filtered = TASKS.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.moduleRef.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || t.status === filterStatus
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority
    const matchAssignee = filterAssignee === 'All' || t.assignee === filterAssignee
    return matchSearch && matchStatus && matchPriority && matchAssignee
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
          <div className="flex gap-1 p-1 rounded-xl bg-gray-100/60 flex-wrap">
            {TABS.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${activeTab === tab.key ? 'bg-[var(--color-surface-elevated)] shadow-sm text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 text-[12px] bg-[var(--color-brand)] text-white px-3.5 py-2 rounded-xl hover:bg-[var(--color-brand2)] transition-all font-medium shadow-sm">
            <Plus className="w-3.5 h-3.5" />{T.newTask}
          </button>
        </div>

        {activeTab === 'list' && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm p-4 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={T.searchTasks}
                  className="w-full pl-9 pr-3 h-9 rounded-xl bg-gray-100/50 border border-[var(--color-border)]/60 text-[13px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-brand)]/40" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-gray-100/50 border border-[var(--color-border)]/60 text-[12px] text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]/40">
                  <option value="all">{T.allStatus}</option>
                  <option value="in_progress">{T.sInProgress}</option>
                  <option value="pending">{T.sPending}</option>
                  <option value="overdue">{T.sOverdue}</option>
                  <option value="completed">{T.sCompleted}</option>
                </select>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-gray-100/50 border border-[var(--color-border)]/60 text-[12px] text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]/40">
                  <option value="all">{T.allPriority}</option>
                  <option value="high">{T.pHigh}</option>
                  <option value="medium">{T.pMedium}</option>
                  <option value="low">{T.pLow}</option>
                </select>
                <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-gray-100/50 border border-[var(--color-border)]/60 text-[12px] text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]/40">
                  {ASSIGNEES.map((a) => <option key={a} value={a}>{a === 'All' ? T.all : a}</option>)}
                </select>
              </div>
              <span className="text-[11px] text-[var(--color-text-muted)] ml-auto">{filtered.length} {T.tasks}</span>
            </div>

            {filtered.map((task) => {
              const ModIcon = MODULE_ICONS[task.module] ?? Globe2
              const st = STATUS_CONFIG[task.status]
              const pr = PRIORITY_CONFIG[task.priority]
              const StIcon = st.icon
              const isExpanded = selected?.id === task.id
              return (
                <div key={task.id} onClick={() => setSelected(isExpanded ? null : task)}
                  className={`rounded-2xl border bg-[var(--color-surface-elevated)] shadow-sm cursor-pointer transition-all duration-150 hover:border-[var(--color-brand)]/20 ${isExpanded ? 'border-[var(--color-brand)]/30 ring-1 ring-[var(--color-brand)]/20' : 'border-[var(--color-border)]/50'}`}>
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${st.bg}`}><StIcon className={`w-4 h-4 ${st.text}`} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[14px] font-bold text-[var(--color-text)] leading-snug">{isRtl ? task.titleAr : task.title}</h3>
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                              <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]"><ModIcon className="w-3 h-3" />{task.moduleRef}</span>
                              <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]"><User className="w-3 h-3" />{task.assignee}</span>
                              <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]"><Calendar className="w-3 h-3" />{T.due} {task.due}</span>
                              {task.status !== 'completed' && (
                                <span className={`text-[11px] font-semibold ${task.daysLeft < 0 ? 'text-red-500' : task.daysLeft <= 7 ? 'text-amber-600' : 'text-[var(--color-text-muted)]'}`}>
                                  {task.daysLeft < 0 ? `${Math.abs(task.daysLeft)} ${T.dOverdue}` : `${task.daysLeft} ${T.dLeft}`}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap shrink-0">
                            {task.tags.map((tag) => (
                              <span key={tag} className="text-[10px] rounded-lg bg-gray-100 text-[var(--color-text-muted)] font-medium px-2 py-0.5">{tag}</span>
                            ))}
                            <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${pr.bg} ${pr.text}`}>
                              <Flag className="w-2.5 h-2.5" />{isRtl ? pr.labelAr : pr.labelEn}
                            </span>
                            <button className="p-1 rounded-lg hover:bg-gray-100/50 transition-colors" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="w-4 h-4 text-[var(--color-text-muted)]" />
                            </button>
                          </div>
                        </div>
                        {task.status !== 'pending' && task.status !== 'overdue' && (
                          <div className="mt-3 flex items-center gap-3">
                            <ProgressBar value={task.progress} className="flex-1" />
                            <span className="text-[11px] text-[var(--color-text-muted)] font-semibold shrink-0">{task.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[var(--color-border)]/50">
                        <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">{isRtl ? task.descAr : task.description}</p>
                        <div className="flex gap-2 mt-4">
                          <button className="flex items-center gap-1.5 text-[12px] bg-[var(--color-brand)] text-white px-3 py-1.5 rounded-lg hover:bg-[var(--color-brand2)] transition-all font-medium">
                            <CheckCircle2 className="w-3 h-3" />{T.markComplete}
                          </button>
                          <button className="flex items-center gap-1.5 text-[12px] border border-[var(--color-border)] px-3 py-1.5 rounded-lg hover:bg-gray-100/50 transition-all font-medium text-[var(--color-text)]">{T.editTask}</button>
                          <button className="flex items-center gap-1.5 text-[12px] border border-[var(--color-border)] px-3 py-1.5 rounded-lg hover:bg-gray-100/50 transition-all font-medium text-[var(--color-text-muted)]">{T.addComment}</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'kanban' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(['pending', 'in_progress', 'overdue', 'completed'] as const).map((col) => {
              const colTasks = TASKS.filter((t) => t.status === col)
              const cfg = STATUS_CONFIG[col]
              const ColIcon = cfg.icon
              return (
                <div key={col} className="flex flex-col gap-3">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${cfg.bg}`}>
                    <ColIcon className={`w-3.5 h-3.5 ${cfg.text}`} />
                    <span className={`text-[12px] font-bold ${cfg.text}`}>{isRtl ? cfg.labelAr : cfg.labelEn}</span>
                    <span className={`ml-auto text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-white/60 ${cfg.text}`}>{colTasks.length}</span>
                  </div>
                  {colTasks.map((task) => {
                    const ModIcon = MODULE_ICONS[task.module] ?? Globe2
                    const pr = PRIORITY_CONFIG[task.priority]
                    return (
                      <div key={task.id} className="rounded-xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm p-4 cursor-pointer hover:border-[var(--color-brand)]/20 transition-all duration-150">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-[12px] font-bold text-[var(--color-text)] leading-snug flex-1">{isRtl ? task.titleAr : task.title}</p>
                          <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${pr.dot}`} />
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
                          <ModIcon className="w-3 h-3" /><span className="truncate">{task.moduleRef}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{task.due.split(',')[0]}</span>
                          <div className="w-5 h-5 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-[var(--color-brand)]">{task.assignee.split('. ')[0]}</span>
                          </div>
                        </div>
                        {task.progress > 0 && <ProgressBar value={task.progress} className="mt-2 h-1" />}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[var(--color-border)]/50">
              <h3 className="text-[14px] font-bold text-[var(--color-text)]">{T.timelineTitle}</h3>
            </div>
            <div className="p-6 overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="flex mb-2">
                  <div className="w-48 shrink-0" />
                  <div className="flex-1 grid" style={{ gridTemplateColumns: 'repeat(31, 1fr)' }}>
                    {Array.from({ length: 31 }, (_, i) => (
                      <div key={i} className={`text-center text-[9px] font-bold pb-1 ${i + 1 === 4 ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-muted)]'}`}>{i + 1}</div>
                    ))}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-48 shrink-0" />
                  <div className="flex-1 relative">
                    <div className="grid absolute inset-0" style={{ gridTemplateColumns: 'repeat(31, 1fr)' }}>
                      {Array.from({ length: 31 }, (_, i) => (
                        <div key={i} className={`border-l border-[var(--color-border)]/30 h-full ${i + 1 === 4 ? 'bg-[var(--color-brand)]/5' : ''}`} />
                      ))}
                    </div>
                    <div className="space-y-1.5 relative z-10">
                      {TASKS.slice(0, 8).map((task) => {
                        const dueDay = parseInt(task.due.split(' ')[1]) || 15
                        const startDay = Math.max(1, dueDay - Math.round(task.progress > 0 ? (dueDay * task.progress / 100) : 5))
                        const width = Math.max(5, ((dueDay - startDay) / 31) * 100)
                        const left = ((startDay - 1) / 31) * 100
                        const barColors: Record<string, string> = { high: 'bg-red-400', medium: 'bg-amber-400', low: 'bg-emerald-400' }
                        return (
                          <div key={task.id} className="flex items-center h-8">
                            <div className="w-48 shrink-0 pr-3">
                              <p className="text-[11px] font-semibold text-[var(--color-text)] truncate">{(isRtl ? task.titleAr : task.title).split('—')[0].trim()}</p>
                            </div>
                            <div className="flex-1 relative h-full flex items-center">
                              <div className={`h-5 rounded-full ${barColors[task.priority]} opacity-80 flex items-center px-2 absolute`}
                                style={{ left: `${left}%`, width: `${width}%`, minWidth: '2rem' }}>
                                <span className="text-[9px] text-white font-bold truncate">{task.assignee.split('. ')[1] ?? task.assignee}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--color-border)]/50">
                <span className="text-[11px] text-[var(--color-text-muted)] font-semibold">{T.priority}</span>
                {([['high', T.pHigh], ['medium', T.pMedium], ['low', T.pLow]] as const).map(([p, lbl]) => (
                  <span key={p} className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)]">
                    <span className={`w-3 h-3 rounded-full ${PRIORITY_CONFIG[p].dot}`} />{lbl}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[var(--color-border)]/50">
              <h3 className="text-[14px] font-bold text-[var(--color-text)]">{T.matrixTitle}</h3>
              <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">{T.matrixSubtitle}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-[var(--color-border)]/50 bg-gray-100/30">
                    <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-muted)] w-64">{T.assignee}</th>
                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-text-muted)]">{T.sInProgress}</th>
                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-text-muted)]">{T.sPending}</th>
                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-text-muted)]">{T.sOverdue}</th>
                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-text-muted)]">{T.sCompleted}</th>
                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-text-muted)]">{T.total}</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-muted)]">{T.workload}</th>
                  </tr>
                </thead>
                <tbody>
                  {ASSIGNEES.filter((a) => a !== 'All').map((assignee, i) => {
                    const assigneeTasks = TASKS.filter((t) => t.assignee === assignee)
                    const inProgress = assigneeTasks.filter((t) => t.status === 'in_progress').length
                    const pending = assigneeTasks.filter((t) => t.status === 'pending').length
                    const overdue = assigneeTasks.filter((t) => t.status === 'overdue').length
                    const completed = assigneeTasks.filter((t) => t.status === 'completed').length
                    const total = assigneeTasks.length
                    const loadPct = Math.min(100, Math.round((total / 5) * 100))
                    return (
                      <tr key={assignee} className={`border-b border-[var(--color-border)]/30 hover:bg-gray-100/20 transition-colors ${i % 2 !== 0 ? 'bg-gray-100/10' : ''}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-[var(--color-brand)]">{assignee.split('. ')[0]}</span>
                            </div>
                            <span className="font-semibold text-[var(--color-text)]">{assignee}</span>
                          </div>
                        </td>
                        <td className="text-center px-4 py-3.5"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-700 font-bold text-[11px]">{inProgress}</span></td>
                        <td className="text-center px-4 py-3.5"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-700 font-bold text-[11px]">{pending}</span></td>
                        <td className="text-center px-4 py-3.5"><span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-[11px] ${overdue > 0 ? 'bg-red-500/10 text-red-600' : 'text-[var(--color-text-muted)]'}`}>{overdue}</span></td>
                        <td className="text-center px-4 py-3.5"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-[11px]">{completed}</span></td>
                        <td className="text-center px-4 py-3.5"><span className="font-bold text-[var(--color-text)]">{total}</span></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <ProgressBar value={loadPct} className="w-24" />
                            <span className="text-[10px] text-[var(--color-text-muted)]">{loadPct}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
