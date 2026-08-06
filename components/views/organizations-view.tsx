'use client'

import React, { useState } from 'react'
import { Building2, FileText, Calendar, CheckCircle2, Clock, AlertCircle, Globe2, Filter, Plus, Download, Eye } from 'lucide-react'
import { useApp } from '@/lib/app-context'

const ORGANIZATIONS = [
  { id: 1, name: 'United Nations',                      nameAr: 'الأمم المتحدة',                      abbr: 'UN',   type: 'International',     typeAr: 'دولية',            memberSince: '1971', role: 'Full Member',     roleAr: 'عضو كامل',    agreements: 42 },
  { id: 2, name: 'World Trade Organization',             nameAr: 'منظمة التجارة العالمية',             abbr: 'WTO',  type: 'Trade',             typeAr: 'تجارية',           memberSince: '1995', role: 'Full Member',     roleAr: 'عضو كامل',    agreements: 18 },
  { id: 3, name: 'Arab League',                         nameAr: 'جامعة الدول العربية',                 abbr: 'AL',   type: 'Regional',          typeAr: 'إقليمية',          memberSince: '1945', role: 'Founding Member', roleAr: 'عضو مؤسس',    agreements: 61 },
  { id: 4, name: 'Organization of Islamic Cooperation', nameAr: 'منظمة التعاون الإسلامي',             abbr: 'OIC',  type: 'Religious-Political', typeAr: 'ديني-سياسي',      memberSince: '1969', role: 'Founding Member', roleAr: 'عضو مؤسس',    agreements: 38 },
  { id: 5, name: 'G20',                                 nameAr: 'مجموعة العشرين',                     abbr: 'G20',  type: 'Economic',          typeAr: 'اقتصادية',         memberSince: '2009', role: 'Observer',        roleAr: 'مراقب',       agreements: 7  },
  { id: 6, name: 'INTERPOL',                            nameAr: 'الإنتربول',                          abbr: 'IPOL', type: 'Security',          typeAr: 'أمنية',            memberSince: '1972', role: 'Full Member',     roleAr: 'عضو كامل',    agreements: 12 },
]

const MOUS = [
  { id: 1, status: 'pending_signature', sector: 'Energy',         sectorAr: 'الطاقة',          title: 'MoU on Energy Cooperation',             titleAr: 'مذكرة تفاهم حول التعاون في مجال الطاقة',    counterparty: 'Egypt',   counterpartyAr: 'مصر',     date: 'Aug 15, 2026', duration: '5 years', durationAr: '5 سنوات', description: 'Bilateral agreement on renewable energy development, green hydrogen production and exchange, and joint R&D on solar technologies.', descAr: 'اتفاقية ثنائية بشأن تطوير الطاقة المتجددة وإنتاج الهيدروجين الأخضر.', value: '$2.4B', progress: 85 },
  { id: 2, status: 'active',            sector: 'Culture',        sectorAr: 'الثقافة',         title: 'Cultural Exchange Framework Agreement', titleAr: 'إطار اتفاقية التبادل الثقافي',               counterparty: 'Jordan',  counterpartyAr: 'الأردن',  date: 'Apr 22, 2026', duration: '3 years', durationAr: '3 سنوات', description: 'Framework for cultural exchange programs including student scholarships, museum partnerships, and language programs.',               descAr: 'إطار لبرامج التبادل الثقافي يشمل المنح الدراسية وشراكات المتاحف.',     value: '$120M', progress: 60 },
  { id: 3, status: 'active',            sector: 'Technology',     sectorAr: 'التكنولوجيا',     title: 'Digital Economy Partnership',           titleAr: 'شراكة الاقتصاد الرقمي',                     counterparty: 'Morocco', counterpartyAr: 'المغرب',  date: 'Mar 15, 2026', duration: '4 years', durationAr: '4 سنوات', description: 'Comprehensive partnership covering AI research, smart city development, data governance, and tech startup ecosystems.',              descAr: 'شراكة شاملة تغطي البحث في الذكاء الاصطناعي وتطوير المدن الذكية.',     value: '$890M', progress: 72 },
  { id: 4, status: 'active',            sector: 'Defense',        sectorAr: 'الدفاع',          title: 'Defense Cooperation Agreement',         titleAr: 'اتفاقية التعاون الدفاعي',                    counterparty: 'Iraq',    counterpartyAr: 'العراق',  date: 'Jan 10, 2026', duration: '10 years', durationAr: '10 سنوات', description: 'Strategic defense cooperation including joint exercises, intelligence sharing, and arms procurement framework.',                   descAr: 'تعاون دفاعي استراتيجي يشمل التدريبات المشتركة وتبادل المعلومات.',     value: 'Classified', progress: 90 },
  { id: 5, status: 'expired',           sector: 'Education',      sectorAr: 'التعليم',         title: 'Higher Education MoU',                  titleAr: 'مذكرة تفاهم للتعليم العالي',                 counterparty: 'Tunisia', counterpartyAr: 'تونس',    date: 'Feb 5, 2026',  duration: '3 years', durationAr: '3 سنوات', description: 'Joint university partnerships, research collaboration, and mutual recognition of academic degrees.',                               descAr: 'شراكات جامعية مشتركة واعتراف متبادل بالشهادات الأكاديمية.',           value: '$340M', progress: 100 },
  { id: 6, status: 'active',            sector: 'Infrastructure', sectorAr: 'البنية التحتية',  title: 'Infrastructure Investment MoU',         titleAr: 'مذكرة تفاهم للاستثمار في البنية التحتية',   counterparty: 'Algeria', counterpartyAr: 'الجزائر', date: 'Nov 1, 2025',  duration: '8 years', durationAr: '8 سنوات', description: 'Belt and Road Initiative framework for port, rail, and logistics infrastructure development.',                                   descAr: 'إطار مبادرة الحزام والطريق لتطوير البنية التحتية.',                   value: '$8.2B', progress: 45 },
  { id: 7, status: 'under_review',      sector: 'Environment',    sectorAr: 'البيئة',          title: 'Climate Change Cooperation Protocol',   titleAr: 'بروتوكول التعاون في تغير المناخ',            counterparty: 'Jordan',  counterpartyAr: 'الأردن',  date: 'Jun 1, 2026',  duration: '5 years', durationAr: '5 سنوات', description: 'Joint commitments to Paris Agreement targets, nature conservation, and decarbonization roadmaps.',                                 descAr: 'التزامات مشتركة بأهداف اتفاقية باريس وصون الطبيعة.',                 value: '$560M', progress: 25 },
]

const STATUS_CONFIG: Record<string, { labelEn: string; labelAr: string; bg: string; text: string; icon: React.ElementType }> = {
  active:            { labelEn: 'Active',            labelAr: 'نشط',               bg: 'bg-emerald-500/10', text: 'text-emerald-700', icon: CheckCircle2 },
  pending_signature: { labelEn: 'Pending Signature', labelAr: 'في انتظار التوقيع', bg: 'bg-amber-500/10',   text: 'text-amber-700',   icon: Clock        },
  under_review:      { labelEn: 'Under Review',      labelAr: 'قيد المراجعة',      bg: 'bg-blue-500/10',    text: 'text-blue-700',    icon: AlertCircle  },
  expired:           { labelEn: 'Expired',           labelAr: 'منتهي الصلاحية',    bg: 'bg-gray-100',       text: 'text-gray-600',    icon: AlertCircle  },
}

const SECTOR_COLORS: Record<string, string> = {
  Energy: 'bg-amber-500/10 text-amber-700', Culture: 'bg-violet-500/10 text-violet-700',
  Technology: 'bg-blue-500/10 text-blue-700', Defense: 'bg-gray-200 text-gray-700',
  Education: 'bg-emerald-500/10 text-emerald-700', Infrastructure: 'bg-orange-500/10 text-orange-700',
  Environment: 'bg-green-500/10 text-green-700',
}

const FILTER_OPTIONS = [
  { value: 'all',               labelEn: 'All',               labelAr: 'الكل'              },
  { value: 'active',            labelEn: 'Active',            labelAr: 'نشط'               },
  { value: 'pending_signature', labelEn: 'Pending Signature', labelAr: 'في انتظار التوقيع' },
  { value: 'under_review',      labelEn: 'Under Review',      labelAr: 'قيد المراجعة'      },
  { value: 'expired',           labelEn: 'Expired',           labelAr: 'منتهي الصلاحية'    },
]

export function OrganizationsView() {
  const { language } = useApp()
  const isRtl = language === 'ar'
  const [activeTab, setActiveTab] = useState('mous')
  const [filter, setFilter] = useState('all')

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
    { label: T.intlOrgs,   value: '42', icon: Globe2,      color: 'text-blue-600',    bg: 'bg-blue-500/10'    },
    { label: T.activeMous, value: '87', icon: FileText,    color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: T.pendingSig, value: '12', icon: Clock,       color: 'text-amber-600',   bg: 'bg-amber-500/10'   },
    { label: T.expiring,   value: '5',  icon: AlertCircle, color: 'text-red-600',     bg: 'bg-red-500/10'     },
  ]

  const filteredMous = filter === 'all' ? MOUS : MOUS.filter((m) => m.status === filter)
  const TABS = [
    { key: 'mous', label: T.tabMous },
    { key: 'orgs', label: T.tabOrgs },
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
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100/60 w-fit mb-5">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${activeTab === tab.key ? 'bg-[var(--color-surface-elevated)] shadow-sm text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'mous' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                {FILTER_OPTIONS.map((f) => (
                  <button key={f.value} onClick={() => setFilter(f.value)}
                    className={`text-[12px] px-3 py-1.5 rounded-lg transition-all duration-150 font-medium ${filter === f.value ? 'bg-[var(--color-brand)] text-white shadow-sm' : 'bg-gray-100/60 text-[var(--color-text-muted)] hover:bg-gray-100 hover:text-[var(--color-text)]'}`}>
                    {isRtl ? f.labelAr : f.labelEn}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 text-[12px] bg-[var(--color-brand)] text-white px-3.5 py-2 rounded-xl hover:bg-[var(--color-brand2)] transition-all font-medium shadow-sm">
                <Plus className="w-3.5 h-3.5" />{T.newMou}
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMous.map((mou) => {
                const status = STATUS_CONFIG[mou.status]
                const StatusIcon = status.icon
                return (
                  <div key={mou.id} className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm hover:border-[var(--color-brand)]/30 hover:shadow-md transition-all duration-150">
                    <div className="px-5 pt-5 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[14px] font-bold text-[var(--color-text)] leading-snug">{isRtl ? mou.titleAr : mou.title}</h4>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-[11px] font-medium text-[var(--color-text-muted)]">{isRtl ? mou.counterpartyAr : mou.counterparty}</span>
                            <span className="text-[var(--color-text-muted)]/30">·</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${SECTOR_COLORS[mou.sector] ?? 'bg-gray-100 text-gray-600'}`}>{isRtl ? mou.sectorAr : mou.sector}</span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 ${status.bg} ${status.text} text-[10px] px-2.5 py-1 rounded-lg font-semibold shrink-0`}>
                          <StatusIcon className="w-2.5 h-2.5" />{isRtl ? status.labelAr : status.labelEn}
                        </span>
                      </div>
                    </div>
                    <div className="px-5 pb-5 space-y-3">
                      <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">{isRtl ? mou.descAr : mou.description}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[{ label: T.value, value: mou.value }, { label: T.duration, value: isRtl ? mou.durationAr : mou.duration }, { label: T.date, value: mou.date }].map((item) => (
                          <div key={item.label} className="bg-gray-100/50 rounded-xl p-2.5">
                            <p className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest">{item.label}</p>
                            <p className="text-[12px] font-bold text-[var(--color-text)] mt-0.5">{item.value}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[var(--color-text-muted)] mb-1.5">
                          <span className="font-medium">{T.implProgress}</span>
                          <span className="font-bold text-[var(--color-text)]">{mou.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full rounded-full bg-[var(--color-brand)]" style={{ width: `${mou.progress}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-1">
                        <button className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors font-medium"><Eye className="w-3.5 h-3.5" />{T.viewFull}</button>
                        <button className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors font-medium"><Download className="w-3.5 h-3.5" />{T.download}</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'orgs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ORGANIZATIONS.map((org) => (
              <div key={org.id} className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm hover:border-[var(--color-brand)]/30 hover:shadow-md hover:-translate-y-px transition-all duration-150 cursor-pointer p-5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-[var(--color-brand)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[13px] font-bold text-[var(--color-text)] leading-snug">{org.name}</h3>
                      <span className="inline-flex items-center text-[9px] bg-gray-100 text-[var(--color-text-muted)] rounded-lg font-bold px-2 py-0.5 shrink-0">{org.abbr}</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{isRtl ? org.typeAr : org.type}</p>
                    <div className="grid grid-cols-2 gap-x-3 mt-2.5">
                      <div>
                        <p className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase tracking-wide">{T.memberSince}</p>
                        <p className="text-[12px] font-bold text-[var(--color-text)] mt-0.5">{org.memberSince}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase tracking-wide">{T.role}</p>
                        <p className="text-[12px] font-bold text-[var(--color-text)] mt-0.5">{isRtl ? org.roleAr : org.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <Calendar className="w-3 h-3 text-[var(--color-text-muted)]" />
                      <span className="text-[11px] text-[var(--color-text-muted)]">{org.agreements} {T.agreements}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
