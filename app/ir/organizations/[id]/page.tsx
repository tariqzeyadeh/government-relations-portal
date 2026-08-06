'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Plus, Edit3, Globe, Users, Building2, X, Save } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { ORGANIZATIONS } from '@/lib/mock-data'
import { SectionTitle, PageHeader } from '@/components/ui-kit'

interface Stakeholder {
  id: string
  nameAr: string
  nameEn: string
  roleAr: string
  roleEn: string
  email: string
  phone: string
  org: string
}

interface RoadmapPhase {
  id: string
  labelAr: string
  labelEn: string
  period: string
  status: 'completed' | 'in_progress' | 'upcoming'
  descAr: string
  descEn: string
}

const STAKEHOLDERS: Record<string, Stakeholder[]> = {
  unido: [
    { id: 'st-1', nameAr: 'غيرد مولر', nameEn: 'Gerd Müller', roleAr: 'المدير العام لليونيدو', roleEn: 'Director General, UNIDO', email: 'dg@unido.org', phone: '+43 1 26026 0', org: 'UNIDO HQ' },
    { id: 'st-2', nameAr: 'بريندا كيل', nameEn: 'Brenda Keel', roleAr: 'ممثلة إقليمية — الخليج', roleEn: 'Regional Representative — Gulf', email: 'b.keel@unido.org', phone: '+966 11 460 3000', org: 'UNIDO Riyadh' },
    { id: 'st-3', nameAr: 'محمد السيد', nameEn: 'Mohamed El-Sayed', roleAr: 'مدير مشاريع الشراكة الصناعية', roleEn: 'Industrial Partnership Projects Manager', email: 'm.elsayed@unido.org', phone: '+966 11 460 3010', org: 'UNIDO Riyadh' },
  ],
  wto: [
    { id: 'st-w1', nameAr: 'نغوزي أوكونجو إيويالا', nameEn: 'Ngozi Okonjo-Iweala', roleAr: 'المديرة العامة لمنظمة التجارة العالمية', roleEn: 'Director-General, WTO', email: 'dg@wto.org', phone: '+41 22 739 5111', org: 'WTO Geneva' },
    { id: 'st-w2', nameAr: 'سلمى المنذر', nameEn: 'Salma Al-Munzer', roleAr: 'الممثل الدائم للمملكة في جنيف', roleEn: "Saudi Arabia's Permanent Representative in Geneva", email: 's.almunzer@mofa.gov.sa', phone: '+41 22 849 8200', org: 'Saudi Mission, Geneva' },
  ],
  'arab-league': [
    { id: 'st-a1', nameAr: 'أحمد أبو الغيط', nameEn: 'Ahmed Aboul Gheit', roleAr: 'الأمين العام لجامعة الدول العربية', roleEn: 'Secretary-General, League of Arab States', email: 'sg@lasportal.org', phone: '+20 2 2575 0511', org: 'Arab League HQ' },
  ],
}

const ROADMAPS: Record<string, RoadmapPhase[]> = {
  unido: [
    { id: 'p1', labelAr: 'إطلاق الشراكة الاستراتيجية', labelEn: 'Strategic Partnership Launch', period: '2024 Q1', status: 'completed', descAr: 'توقيع اتفاقية التعاون الأساسية وتحديد نقاط الاتصال', descEn: 'Signing of the framework cooperation agreement and establishing focal points' },
    { id: 'p2', labelAr: 'بناء القدرات الصناعية', labelEn: 'Industrial Capacity Building', period: '2024 Q3–2025', status: 'completed', descAr: 'برامج تدريب للمنشآت الصغيرة والمتوسطة وتقييم القطاعات', descEn: 'SME training programs and sector readiness assessments' },
    { id: 'p3', labelAr: 'ربط رحلة المستثمر', labelEn: 'Investor Journey Integration', period: '2025–2026', status: 'in_progress', descAr: 'تكامل قاعدة البيانات الصناعية مع منصة رحلة المستثمر (85% مكتمل)', descEn: 'Integration of industrial database with Investor Journey platform (85% complete)' },
    { id: 'p4', labelAr: 'توسيع نطاق المشاريع المشتركة', labelEn: 'Joint Projects Scale-up', period: '2026–2027', status: 'upcoming', descAr: 'إطلاق 5 مشاريع صناعية مشتركة بالشراكة مع القطاع الخاص', descEn: 'Launch of 5 joint industrial projects in partnership with the private sector' },
    { id: 'p5', labelAr: 'مراجعة شاملة وتجديد الاتفاقية', labelEn: 'Comprehensive Review & Renewal', period: '2027', status: 'upcoming', descAr: 'تقييم شامل للإنجازات وتحديث الإطار الاستراتيجي', descEn: 'Full achievement assessment and strategic framework renewal' },
  ],
}

const DEFAULT_ROADMAP: RoadmapPhase[] = [
  { id: 'p1', labelAr: 'مرحلة التأسيس', labelEn: 'Foundation Phase', period: '2024', status: 'completed', descAr: 'إرساء أسس التعاون الثنائي وتبادل المعلومات', descEn: 'Establishing bilateral cooperation foundations' },
  { id: 'p2', labelAr: 'مرحلة التطوير', labelEn: 'Development Phase', period: '2025', status: 'in_progress', descAr: 'تنفيذ البرامج المشتركة وتبادل الخبرات', descEn: 'Implementing joint programs and knowledge exchange' },
  { id: 'p3', labelAr: 'مرحلة التوسع', labelEn: 'Expansion Phase', period: '2026', status: 'upcoming', descAr: 'توسيع نطاق الشراكة إلى قطاعات جديدة', descEn: 'Expanding partnership to new sectors' },
  { id: 'p4', labelAr: 'مرحلة المأسسة', labelEn: 'Institutionalization Phase', period: '2027', status: 'upcoming', descAr: 'مأسسة التعاون وتجديد الإطار القانوني', descEn: 'Institutionalizing cooperation and renewing legal framework' },
]

const STATUS_STYLES = {
  completed: { bar: 'bg-emerald-500', dot: 'bg-emerald-500', label: 'مكتمل' },
  in_progress: { bar: 'bg-[var(--color-brand)]', dot: 'bg-[var(--color-brand)]', label: 'جارٍ' },
  upcoming: { bar: 'bg-[var(--color-border)]', dot: 'bg-[var(--color-border)]', label: 'قادم' },
}

export default function OrganizationDetailPage() {
  const params = useParams()
  const { language, showToast } = useApp()
  const isAr = language === 'ar'

  const idRaw = Array.isArray(params.id) ? params.id[0] : params.id
  const id = idRaw ?? ''
  const org = ORGANIZATIONS.find((o) => o.id === id || String(o.numericId) === id)

  const orgKey = org?.id ?? id
  const stakeholders = STAKEHOLDERS[orgKey] ?? STAKEHOLDERS[id] ?? []
  const roadmap = ROADMAPS[orgKey] ?? ROADMAPS[id] ?? DEFAULT_ROADMAP

  const [showAddPhase, setShowAddPhase] = useState(false)
  const [newPhaseLabel, setNewPhaseLabel] = useState('')
  const [newPhasePeriod, setNewPhasePeriod] = useState('')
  const [roadmapItems, setRoadmapItems] = useState(roadmap)
  const [editHover, setEditHover] = useState<string | null>(null)
  const [editingPhase, setEditingPhase] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  if (!org) {
    return (
      <div className="card p-12 text-center">
        <Building2 size={40} className="mx-auto mb-3 opacity-20" />
        <p className="text-sm">لم يتم العثور على المنظمة</p>
        <Link href="/ir/organizations" className="mt-3 inline-block text-sm text-[var(--color-brand)]">
          ← العودة إلى قائمة المنظمات
        </Link>
      </div>
    )
  }

  const addPhase = () => {
    if (!newPhaseLabel.trim()) return
    setRoadmapItems((prev) => [
      ...prev,
      {
        id: `p${Date.now()}`,
        labelAr: newPhaseLabel,
        labelEn: newPhaseLabel,
        period: newPhasePeriod || '2027+',
        status: 'upcoming',
        descAr: 'مرحلة مضافة حديثاً',
        descEn: 'Newly added phase',
      },
    ])
    setNewPhaseLabel('')
    setNewPhasePeriod('')
    setShowAddPhase(false)
    showToast(isAr ? 'تمت إضافة المرحلة' : 'Phase added')
  }

  const startEdit = (phase: RoadmapPhase) => {
    setEditingPhase(phase.id)
    setEditText(isAr ? phase.labelAr : phase.labelEn)
  }

  const saveEdit = (id: string) => {
    setRoadmapItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, labelAr: editText, labelEn: editText } : p,
      ),
    )
    setEditingPhase(null)
    showToast(isAr ? 'تم تحديث المرحلة' : 'Phase updated')
  }

  const integrationProgress = id === 'unido' ? 85 : id === 'wto' ? 72 : id === 'isesco' ? 60 : id === 'arab-league' ? 90 : 45

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <Link
          href="/ir/organizations"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-[var(--color-brand)] no-underline hover:underline"
        >
          <ArrowRight size={14} className="rtl-flip" />
          {isAr ? 'العودة إلى قائمة المنظمات' : 'Back to Organizations'}
        </Link>
        <PageHeader
          title={`${org.acronym} — ${isAr ? org.nameAr : org.nameEn}`}
          subtitle={isAr ? `${org.typeAr} · ${org.headquartersAr}` : `${org.typeEn} · ${org.headquartersEn}`}
          actions={
            <a href={org.website} target="_blank" rel="noopener noreferrer" className="btn btn-ghost border-[var(--color-border)] text-sm gap-2 no-underline">
              <Globe size={14} />
              {org.website.replace('https://', '')}
            </a>
          }
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: isAr ? 'الدول الأعضاء' : 'Member States', value: org.memberStates, icon: Globe },
          { label: isAr ? 'مذكرات تفاهم نشطة' : 'Active MoUs', value: org.activeMoUs, icon: Building2 },
          { label: isAr ? 'النوع' : 'Type', value: isAr ? org.typeAr : org.typeEn, icon: Building2 },
          { label: isAr ? 'المقر الرئيسي' : 'Headquarters', value: isAr ? org.headquartersAr : org.headquartersEn, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-4 flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand)]/10">
              <Icon size={14} className="text-[var(--color-brand)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
              <p className="text-sm font-semibold text-[var(--color-text)]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          {/* Investor journey integration progress */}
          <div className="card p-5">
            <p className="text-sm font-semibold text-[var(--color-text)] mb-1">
              {isAr ? 'حالة الربط مع رحلة المستثمر' : 'Investor Journey Integration Status'}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-3 rounded-full bg-[var(--color-bg)] overflow-hidden border border-[var(--color-border)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${integrationProgress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-[var(--color-brand)]"
                />
              </div>
              <span className="w-12 shrink-0 text-sm font-bold text-[var(--color-brand)]">{integrationProgress}%</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-[var(--color-text-muted)]">
              <div><span className="block font-semibold text-[var(--color-text)]">نقاط البيانات</span>المتزامنة: {Math.round(integrationProgress * 4.7)}</div>
              <div><span className="block font-semibold text-[var(--color-text)]">آخر مزامنة</span>2026-08-06 08:00</div>
              <div><span className="block font-semibold text-[var(--color-text)]">الحالة</span>{integrationProgress >= 80 ? 'متصل' : integrationProgress >= 60 ? 'جزئي' : 'في التطوير'}</div>
            </div>
          </div>

          {/* Stakeholders */}
          <div>
            <SectionTitle title={isAr ? 'جهات الاتصال والنظراء' : 'Contacts & Stakeholders'} />
            {stakeholders.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] card p-4">
                {isAr ? 'لا توجد بيانات اتصال مسجلة لهذه المنظمة' : 'No contacts registered for this organization'}
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {stakeholders.map((st) => (
                  <div key={st.id} className="card p-4 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)]/10 text-sm font-bold text-[var(--color-brand)]">
                      {(isAr ? st.nameAr : st.nameEn).charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-text)]">
                        {isAr ? st.nameAr : st.nameEn}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">
                        {isAr ? st.roleAr : st.roleEn}
                      </p>
                      <p className="text-[11px] text-[var(--color-brand)] mt-0.5 font-mono">{st.email}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)] font-mono">{st.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Focus areas */}
          <div className="card p-4">
            <p className="text-sm font-semibold text-[var(--color-text)] mb-3">
              {isAr ? 'مجالات التركيز' : 'Focus Areas'}
            </p>
            <div className="flex flex-wrap gap-2">
              {(isAr ? org.focusAreasAr : org.focusAreasEn).map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-[var(--color-brand)]/10 px-3 py-1 text-xs font-medium text-[var(--color-brand)]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <SectionTitle title={isAr ? 'خارطة الطريق' : 'Roadmap'} />
            <button
              onClick={() => setShowAddPhase(true)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] hover:bg-[var(--color-brand)]/20 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="relative space-y-0 ps-4 before:absolute before:start-0 before:top-0 before:h-full before:w-0.5 before:bg-[var(--color-border)]">
            {roadmapItems.map((phase) => {
              const s = STATUS_STYLES[phase.status]
              return (
                <div
                  key={phase.id}
                  className="relative pb-4"
                  onMouseEnter={() => setEditHover(phase.id)}
                  onMouseLeave={() => setEditHover(null)}
                >
                  <div className={`absolute -start-2 top-2 h-4 w-4 rounded-full border-2 border-[var(--color-bg)] ${s.dot}`} />
                  <div className="card ms-3 p-3">
                    <div className="flex items-start justify-between gap-2">
                      {editingPhase === phase.id ? (
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="input-base h-7 flex-1 text-xs"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(phase.id)}
                        />
                      ) : (
                        <p className="text-xs font-semibold text-[var(--color-text)] flex-1">
                          {isAr ? phase.labelAr : phase.labelEn}
                        </p>
                      )}
                      {editHover === phase.id && editingPhase !== phase.id && (
                        <button
                          onClick={() => startEdit(phase)}
                          className="text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors"
                        >
                          <Edit3 size={12} />
                        </button>
                      )}
                      {editingPhase === phase.id && (
                        <button onClick={() => saveEdit(phase.id)} className="text-[var(--color-brand)]">
                          <Save size={12} />
                        </button>
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] text-[var(--color-text-muted)]">{phase.period}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        phase.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        phase.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                      {isAr ? phase.descAr : phase.descEn}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Add phase modal */}
      <AnimatePresence>
        {showAddPhase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowAddPhase(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="card w-full max-w-md p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-[var(--color-text)]">{isAr ? 'إضافة مرحلة جديدة' : 'Add Phase'}</h3>
                <button onClick={() => setShowAddPhase(false)}><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <input
                  value={newPhaseLabel}
                  onChange={(e) => setNewPhaseLabel(e.target.value)}
                  placeholder={isAr ? 'اسم المرحلة...' : 'Phase name...'}
                  className="input-base"
                  autoFocus
                />
                <input
                  value={newPhasePeriod}
                  onChange={(e) => setNewPhasePeriod(e.target.value)}
                  placeholder={isAr ? 'الفترة الزمنية (مثل: 2027)' : 'Period (e.g. 2027)'}
                  className="input-base"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowAddPhase(false)} className="btn btn-ghost border-[var(--color-border)] text-sm">
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button onClick={addPhase} className="btn btn-primary text-sm gap-2">
                  <Plus size={14} />
                  {isAr ? 'إضافة' : 'Add'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
