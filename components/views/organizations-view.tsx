'use client'

import { useState } from 'react'
import { Building2, FileText, Calendar, CheckCircle2, Clock, AlertCircle, Globe2, Filter, Plus, Download, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useApp } from '@/lib/app-context'

const ORGANIZATIONS = [
  { id: 1, name: 'United Nations', abbr: 'UN',   type: 'International',     typeAr: 'دولية',          memberSince: '1971', role: 'Full Member',     roleAr: 'عضو كامل',    agreements: 42 },
  { id: 2, name: 'World Trade Organization', abbr: 'WTO', type: 'Trade',    typeAr: 'تجارية',         memberSince: '1995', role: 'Full Member',     roleAr: 'عضو كامل',    agreements: 18 },
  { id: 3, name: 'Arab League', abbr: 'AL',       type: 'Regional',         typeAr: 'إقليمية',        memberSince: '1945', role: 'Founding Member', roleAr: 'عضو مؤسس',    agreements: 61 },
  { id: 4, name: 'Organization of Islamic Cooperation', abbr: 'OIC', type: 'Religious-Political', typeAr: 'ديني-سياسي', memberSince: '1969', role: 'Founding Member', roleAr: 'عضو مؤسس', agreements: 38 },
  { id: 5, name: 'G20', abbr: 'G20',             type: 'Economic',          typeAr: 'اقتصادية',       memberSince: '2009', role: 'Observer',        roleAr: 'مراقب',       agreements: 7  },
  { id: 6, name: 'INTERPOL', abbr: 'IPOL',        type: 'Security',         typeAr: 'أمنية',          memberSince: '1972', role: 'Full Member',     roleAr: 'عضو كامل',    agreements: 12 },
]

const MOUS = [
  {
    id: 1, status: 'pending_signature', sector: 'Energy',
    title: 'MoU on Energy Cooperation', titleAr: 'مذكرة تفاهم حول التعاون في مجال الطاقة',
    counterparty: 'Egypt', counterpartyAr: 'مصر', date: 'Aug 15, 2026',
    duration: '5 years', durationAr: '5 سنوات',
    description: 'Bilateral agreement on renewable energy development, green hydrogen production and exchange, and joint R&D on solar technologies.',
    descAr: 'اتفاقية ثنائية بشأن تطوير الطاقة المتجددة وإنتاج الهيدروجين الأخضر وتبادله والبحث والتطوير المشترك في تقنيات الطاقة الشمسية.',
    value: '$2.4B', progress: 85,
  },
  {
    id: 2, status: 'active', sector: 'Culture',
    title: 'Cultural Exchange Framework Agreement', titleAr: 'إطار اتفاقية التبادل الثقافي',
    counterparty: 'Jordan', counterpartyAr: 'الأردن', date: 'Apr 22, 2026',
    duration: '3 years', durationAr: '3 سنوات',
    description: 'Framework for cultural exchange programs including student scholarships, museum partnerships, and language programs.',
    descAr: 'إطار لبرامج التبادل الثقافي يشمل المنح الدراسية وشراكات المتاحف والبرامج اللغوية.',
    value: '$120M', progress: 60,
  },
  {
    id: 3, status: 'active', sector: 'Technology',
    title: 'Digital Economy Partnership', titleAr: 'شراكة الاقتصاد الرقمي',
    counterparty: 'Morocco', counterpartyAr: 'المغرب', date: 'Mar 15, 2026',
    duration: '4 years', durationAr: '4 سنوات',
    description: 'Comprehensive partnership covering AI research, smart city development, data governance, and tech startup ecosystems.',
    descAr: 'شراكة شاملة تغطي البحث في الذكاء الاصطناعي وتطوير المدن الذكية وحوكمة البيانات وبيئة شركات التكنولوجيا الناشئة.',
    value: '$890M', progress: 72,
  },
  {
    id: 4, status: 'active', sector: 'Defense',
    title: 'Defense Cooperation Agreement', titleAr: 'اتفاقية التعاون الدفاعي',
    counterparty: 'Iraq', counterpartyAr: 'العراق', date: 'Jan 10, 2026',
    duration: '10 years', durationAr: '10 سنوات',
    description: 'Strategic defense cooperation including joint exercises, intelligence sharing, and arms procurement framework.',
    descAr: 'تعاون دفاعي استراتيجي يشمل التدريبات المشتركة وتبادل المعلومات الاستخباراتية وإطار شراء الأسلحة.',
    value: 'Classified', progress: 90,
  },
  {
    id: 5, status: 'expired', sector: 'Education',
    title: 'Higher Education MoU', titleAr: 'مذكرة تفاهم للتعليم العالي',
    counterparty: 'Tunisia', counterpartyAr: 'تونس', date: 'Feb 5, 2026',
    duration: '3 years', durationAr: '3 سنوات',
    description: 'Joint university partnerships, research collaboration, and mutual recognition of academic degrees.',
    descAr: 'شراكات جامعية مشتركة وتعاون بحثي واعتراف متبادل بالشهادات الأكاديمية.',
    value: '$340M', progress: 100,
  },
  {
    id: 6, status: 'active', sector: 'Infrastructure',
    title: 'Infrastructure Investment MoU', titleAr: 'مذكرة تفاهم للاستثمار في البنية التحتية',
    counterparty: 'Algeria', counterpartyAr: 'الجزائر', date: 'Nov 1, 2025',
    duration: '8 years', durationAr: '8 سنوات',
    description: 'Belt and Road Initiative framework for port, rail, and logistics infrastructure development.',
    descAr: 'إطار مبادرة الحزام والطريق لتطوير البنية التحتية للموانئ والسكك الحديدية والخدمات اللوجستية.',
    value: '$8.2B', progress: 45,
  },
  {
    id: 7, status: 'under_review', sector: 'Environment',
    title: 'Climate Change Cooperation Protocol', titleAr: 'بروتوكول التعاون في تغير المناخ',
    counterparty: 'Jordan', counterpartyAr: 'الأردن', date: 'Jun 1, 2026',
    duration: '5 years', durationAr: '5 سنوات',
    description: 'Joint commitments to Paris Agreement targets, nature conservation, and decarbonization roadmaps.',
    descAr: 'التزامات مشتركة بأهداف اتفاقية باريس وصون الطبيعة وخارطة طريق إزالة الكربون.',
    value: '$560M', progress: 25,
  },
]

const STATUS_CONFIG: Record<string, { labelEn: string; labelAr: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
  active:            { labelEn: 'Active',            labelAr: 'نشط',               bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', icon: CheckCircle2 },
  pending_signature: { labelEn: 'Pending Signature', labelAr: 'في انتظار التوقيع', bg: 'bg-amber-500/10',   text: 'text-amber-700 dark:text-amber-400',     icon: Clock        },
  under_review:      { labelEn: 'Under Review',      labelAr: 'قيد المراجعة',      bg: 'bg-blue-500/10',    text: 'text-blue-700 dark:text-blue-400',        icon: AlertCircle  },
  expired:           { labelEn: 'Expired',           labelAr: 'منتهي الصلاحية',    bg: 'bg-slate-100 dark:bg-slate-800/60', text: 'text-slate-600 dark:text-slate-400', icon: AlertCircle },
}

const SECTOR_COLORS: Record<string, string> = {
  Energy: 'bg-amber-500/10 text-amber-700 dark:text-amber-400', Culture: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  Technology: 'bg-blue-500/10 text-blue-700 dark:text-blue-400', Defense: 'bg-slate-500/10 text-slate-700 dark:text-slate-300',
  Education: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', Infrastructure: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  Environment: 'bg-green-500/10 text-green-700 dark:text-green-400',
}

const SECTOR_AR: Record<string, string> = {
  Energy: 'الطاقة', Culture: 'الثقافة', Technology: 'التكنولوجيا', Defense: 'الدفاع',
  Education: 'التعليم', Infrastructure: 'البنية التحتية', Environment: 'البيئة',
}

const FILTER_OPTIONS = [
  { value: 'all',               labelEn: 'All',               labelAr: 'الكل'             },
  { value: 'active',            labelEn: 'Active',            labelAr: 'نشط'              },
  { value: 'pending_signature', labelEn: 'Pending Signature', labelAr: 'في انتظار التوقيع'},
  { value: 'under_review',      labelEn: 'Under Review',      labelAr: 'قيد المراجعة'     },
  { value: 'expired',           labelEn: 'Expired',           labelAr: 'منتهي الصلاحية'   },
]

export function OrganizationsView() {
  const { language } = useApp()
  const isRtl = language === 'ar'

  const T = {
    intlOrgs:     isRtl ? 'المنظمات الدولية'    : "Int'l Organizations",
    activeMous:   isRtl ? 'مذكرات تفاهم نشطة'   : 'Active MoUs',
    pendingSig:   isRtl ? 'في انتظار التوقيع'    : 'Pending Signature',
    expiring:     isRtl ? 'تنتهي خلال 90 يوماً' : 'Expiring (90 days)',
    tabMous:      isRtl ? 'مذكرات التفاهم'       : 'Memoranda of Understanding',
    tabOrgs:      isRtl ? 'المنظمات العضو'        : 'Member Organizations',
    newMou:       isRtl ? 'مذكرة تفاهم جديدة'    : 'New MoU',
    value:        isRtl ? 'القيمة'               : 'Value',
    duration:     isRtl ? 'المدة'                : 'Duration',
    date:         isRtl ? 'التاريخ'              : 'Date',
    implProgress: isRtl ? 'تقدم التنفيذ'         : 'Implementation Progress',
    viewFull:     isRtl ? 'عرض كامل'             : 'View Full',
    download:     isRtl ? 'تحميل'                : 'Download',
    memberSince:  isRtl ? 'عضو منذ'              : 'Member Since',
    role:         isRtl ? 'الدور'                : 'Role',
    agreements:   isRtl ? 'اتفاقية'              : 'agreements',
  }

  const STATS = [
    { label: T.intlOrgs,   value: '42', icon: Globe2,      color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-500/10'    },
    { label: T.activeMous, value: '87', icon: FileText,    color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: T.pendingSig, value: '12', icon: Clock,       color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-500/10'   },
    { label: T.expiring,   value: '5',  icon: AlertCircle, color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-500/10'     },
  ]

  const [filter, setFilter] = useState<string>('all')
  const filteredMous = filter === 'all' ? MOUS : MOUS.filter((m) => m.status === filter)

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="kpi-card border-border/50 shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-2.5 rounded-xl shrink-0 ${stat.bg}`}><Icon className={`w-5 h-5 ${stat.color}`} /></div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-foreground mt-0.5">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="mous">
        <TabsList className="rounded-xl bg-muted/60 p-1 gap-1">
          <TabsTrigger value="mous" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.tabMous}</TabsTrigger>
          <TabsTrigger value="orgs" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.tabOrgs}</TabsTrigger>
        </TabsList>

        {/* ── MoUs TAB ── */}
        <TabsContent value="mous" className="mt-5 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              {FILTER_OPTIONS.map((f) => (
                <button key={f.value} onClick={() => setFilter(f.value)}
                  className={`text-[12px] px-3 py-1.5 rounded-lg transition-all duration-150 font-medium ${filter === f.value ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20' : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  {isRtl ? f.labelAr : f.labelEn}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-[12px] bg-primary text-primary-foreground px-3.5 py-2 rounded-xl hover:brightness-105 transition-all font-medium shadow-sm shadow-primary/20">
              <Plus className="w-3.5 h-3.5" />{T.newMou}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredMous.map((mou) => {
              const status = STATUS_CONFIG[mou.status]
              const StatusIcon = status.icon
              return (
                <Card key={mou.id} className="border-border/50 shadow-sm rounded-2xl hover:border-primary/30 hover:shadow-md transition-all duration-150">
                  <CardHeader className="pb-3 px-5 pt-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-[14px] font-bold text-foreground leading-snug">
                          {isRtl ? mou.titleAr : mou.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[11px] font-medium text-muted-foreground">{isRtl ? mou.counterpartyAr : mou.counterparty}</span>
                          <span className="text-muted-foreground/30">·</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${SECTOR_COLORS[mou.sector] ?? 'bg-muted text-muted-foreground'}`}>
                            {isRtl ? (SECTOR_AR[mou.sector] ?? mou.sector) : mou.sector}
                          </span>
                        </div>
                      </div>
                      <Badge className={`${status.bg} ${status.text} border-0 text-[10px] px-2.5 py-1 shrink-0 gap-1 rounded-lg font-semibold`}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {isRtl ? status.labelAr : status.labelEn}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 px-5 pb-5 space-y-3">
                    <p className="text-[12px] text-muted-foreground leading-relaxed">{isRtl ? mou.descAr : mou.description}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: T.value,    value: mou.value                               },
                        { label: T.duration, value: isRtl ? mou.durationAr : mou.duration   },
                        { label: T.date,     value: mou.date                                },
                      ].map((item) => (
                        <div key={item.label} className="bg-muted/50 rounded-xl p-2.5">
                          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{item.label}</p>
                          <p className="text-[12px] font-bold text-foreground mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                        <span className="font-medium">{T.implProgress}</span>
                        <span className="font-bold text-foreground">{mou.progress}%</span>
                      </div>
                      <Progress value={mou.progress} className="h-2 rounded-full" />
                    </div>
                    <div className="flex items-center gap-4 pt-1">
                      <button className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors font-medium">
                        <Eye className="w-3.5 h-3.5" />{T.viewFull}
                      </button>
                      <button className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors font-medium">
                        <Download className="w-3.5 h-3.5" />{T.download}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ── Organizations TAB ── */}
        <TabsContent value="orgs" className="mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ORGANIZATIONS.map((org) => (
              <Card key={org.id} className="border-border/50 shadow-sm rounded-2xl hover:border-primary/30 hover:shadow-md hover:-translate-y-px transition-all duration-150 cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[13px] font-bold text-foreground leading-snug">{org.name}</h3>
                        <Badge variant="secondary" className="text-[9px] shrink-0 rounded-lg font-bold">{org.abbr}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{isRtl ? org.typeAr : org.type}</p>
                      <div className="grid grid-cols-2 gap-x-3 mt-2.5">
                        <div>
                          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wide">{T.memberSince}</p>
                          <p className="text-[12px] font-bold text-foreground mt-0.5">{org.memberSince}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wide">{T.role}</p>
                          <p className="text-[12px] font-bold text-foreground mt-0.5">{isRtl ? org.roleAr : org.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground">{org.agreements} {T.agreements}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
