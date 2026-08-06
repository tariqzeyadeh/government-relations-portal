'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Plus, Edit3, Save, X, MapPin, Globe, Users, Calendar, Briefcase } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { getCountryById } from '@/lib/countries-world'
import { AGREEMENTS } from '@/lib/mock-data'
import { getCompaniesByCountry } from '@/lib/companies-mock'
import { SectionTitle, SlaBadge, PageHeader } from '@/components/ui-kit'

interface Counterpart {
  id: string
  nameAr: string
  nameEn: string
  titleAr: string
  titleEn: string
  org: string
  email: string
}

const COUNTERPARTS_BY_COUNTRY: Record<string, Counterpart[]> = {
  korea: [
    { id: 'cp-1', nameAr: 'لي جونغ هو', nameEn: 'Lee Jong-ho', titleAr: 'وزير التجارة والصناعة الكوري', titleEn: 'Minister of Trade and Industry', org: 'MOTIE', email: 'dg.international@motie.go.kr' },
    { id: 'cp-2', nameAr: 'أنغ يونغ-جين', nameEn: 'Ahn Young-jin', titleAr: 'رئيس هيئة الاستثمار', titleEn: 'President, Invest Korea / KOTRA', org: 'KOTRA', email: 'cooperation@kotra.or.kr' },
    { id: 'cp-3', nameAr: 'كيم مين-سيوك', nameEn: 'Kim Min-seok', titleAr: 'نائب وزير التجارة والصناعة', titleEn: 'Vice Minister of Trade, Industry', org: 'MOTIE', email: 'bilateral@motie.go.kr' },
  ],
  japan: [
    { id: 'cp-j1', nameAr: 'ياسوتوشي نيشيمورا', nameEn: 'Yasutoshi Nishimura', titleAr: 'وزير الاقتصاد والتجارة والصناعة', titleEn: 'Minister of Economy, Trade and Industry', org: 'METI', email: 'sa.cooperation@meti.go.jp' },
    { id: 'cp-j2', nameAr: 'هيروشي ماتسويا', nameEn: 'Hiroshi Matsuya', titleAr: 'مدير المشاركة الثنائية', titleEn: 'Director of Bilateral Engagement', org: 'JETRO', email: 'riyadh@jetro.go.jp' },
  ],
  china: [
    { id: 'cp-c1', nameAr: 'جين ​​زوانغ-لونغ', nameEn: 'Jin Zhuanglong', titleAr: 'وزير الصناعة وتكنولوجيا المعلومات', titleEn: 'Minister of Industry and IT', org: 'MIIT', email: 'international@miit.gov.cn' },
    { id: 'cp-c2', nameAr: 'شو لي', nameEn: 'Xu Li', titleAr: 'مدير عام الشؤون الدولية', titleEn: 'Director General, International Affairs', org: 'NDRC', email: 'sa@ndrc.gov.cn' },
  ],
  germany: [
    { id: 'cp-g1', nameAr: 'روبرت هابيك', nameEn: 'Robert Habeck', titleAr: 'وزير الشؤون الاقتصادية وحماية المناخ', titleEn: 'Federal Minister for Economic Affairs', org: 'BMWK', email: 'bilateral@bmwk.bund.de' },
    { id: 'cp-g2', nameAr: 'ماتياس ماخنيغ', nameEn: 'Matthias Machnig', titleAr: 'مدير شراكات الخليج', titleEn: 'Director, Gulf Partnerships', org: 'GIZ', email: 'riyadh@giz.de' },
  ],
  france: [
    { id: 'cp-f1', nameAr: 'برونو لومير', nameEn: 'Bruno Le Maire', titleAr: 'وزير الاقتصاد والمالية', titleEn: 'Minister of Economy and Finance', org: "Ministère de l'Économie", email: 'dae@finances.gouv.fr' },
  ],
}

const NEWS_BY_COUNTRY: Record<string, { date: string; titleAr: string; titleEn: string; tag: string }[]> = {
  korea: [
    { date: '2026-08-01', titleAr: 'تقدم مفاوضات اتفاقية المدن الذكية مع كوريا', titleEn: 'Smart cities framework negotiations advance with Korea', tag: 'مفاوضات' },
    { date: '2026-06-15', titleAr: 'زيارة وفد كوري رفيع لمقر الوزارة', titleEn: 'High-level Korean delegation visits Ministry HQ', tag: 'زيارة' },
    { date: '2026-04-22', titleAr: 'توقيع بروتوكول تعاون في مجال التقنيات الناعمة', titleEn: 'Cooperation protocol signed on soft technology', tag: 'توقيع' },
    { date: '2026-02-10', titleAr: 'اجتماع فني للجنة المدن الذكية السعودية الكورية', titleEn: 'Saudi-Korean Smart Cities technical committee meeting', tag: 'اجتماع' },
  ],
  japan: [
    { date: '2026-08-05', titleAr: 'استعدادات استقبال وفد الهيدروجين الياباني', titleEn: 'Preparations for Japanese hydrogen delegation', tag: 'زيارة' },
    { date: '2025-11-20', titleAr: 'توقيع مذكرة التعاون في الطاقة والهيدروجين', titleEn: 'Energy and Hydrogen MoC signed', tag: 'توقيع' },
  ],
  china: [
    { date: '2026-07-28', titleAr: 'بيان صحفي: مفاوضات تجديد مذكرة التفاهم مع الصين', titleEn: 'Press release: China MoU renewal negotiations', tag: 'إعلام' },
    { date: '2026-05-10', titleAr: 'اجتماع اللجنة السعودية الصينية الثنائية', titleEn: 'Saudi-China bilateral committee meeting', tag: 'اجتماع' },
  ],
}

const DEFAULT_NEWS = [
  { date: '2026-06-01', titleAr: 'بدء مباحثات تعاون ثنائي', titleEn: 'Bilateral cooperation talks initiated', tag: 'مباحثات' },
  { date: '2026-03-15', titleAr: 'تبادل وفود اقتصادية', titleEn: 'Economic delegation exchange', tag: 'زيارة' },
]

const DEFAULT_COUNTERPARTS: Counterpart[] = [
  { id: 'dcp-1', nameAr: 'ممثل وزارة التجارة', nameEn: 'Ministry of Trade Representative', titleAr: 'مدير التعاون الدولي', titleEn: 'Director of International Cooperation', org: 'Ministry of Trade', email: 'cooperation@ministry.gov' },
  { id: 'dcp-2', nameAr: 'مستشار الاستثمار الأجنبي', nameEn: 'Foreign Investment Adviser', titleAr: 'مستشار أول', titleEn: 'Senior Adviser', org: 'Investment Board', email: 'investment@board.gov' },
]

const TAG_COLORS: Record<string, string> = {
  مفاوضات: 'bg-blue-100 text-blue-700',
  زيارة: 'bg-purple-100 text-purple-700',
  توقيع: 'bg-emerald-100 text-emerald-700',
  اجتماع: 'bg-amber-100 text-amber-700',
  إعلام: 'bg-gray-100 text-gray-600',
  مباحثات: 'bg-indigo-100 text-indigo-700',
}

export default function CountryDetailPage() {
  const params = useParams()
  const { language, showToast } = useApp()
  const isAr = language === 'ar'

  const idRaw = Array.isArray(params.id) ? params.id[0] : params.id
  const id = idRaw ?? ''
  const country = getCountryById(id)

  const counterparts = COUNTERPARTS_BY_COUNTRY[id] ?? DEFAULT_COUNTERPARTS
  const news = NEWS_BY_COUNTRY[id] ?? DEFAULT_NEWS
  const agreements = AGREEMENTS.filter((a) => a.countryId === id || (id === '1' && a.countryId === 'korea'))
  const countryCompanies = getCompaniesByCountry(id === '1' ? 'korea' : id)

  const [editMode, setEditMode] = useState(false)
  const [localCounterparts, setLocalCounterparts] = useState<Counterpart[]>(counterparts)
  const [showNewsModal, setShowNewsModal] = useState(false)
  const [newNewsTitle, setNewNewsTitle] = useState('')
  const [newsItems, setNewsItems] = useState(news)

  if (!country) {
    return (
      <div className="card p-12 text-center">
        <Globe size={40} className="mx-auto mb-3 opacity-20 text-[var(--color-text-muted)]" />
        <p className="text-sm font-medium text-[var(--color-text)]">لم يتم العثور على الدولة</p>
        <Link href="/ir/countries" className="mt-3 inline-block text-sm text-[var(--color-brand)]">
          ← العودة إلى قائمة الدول
        </Link>
      </div>
    )
  }

  const saveCounterparts = () => {
    setEditMode(false)
    showToast(isAr ? 'تم حفظ بيانات النظراء' : 'Counterparts saved')
  }

  const addNews = () => {
    if (!newNewsTitle.trim()) return
    setNewsItems((prev) => [
      { date: new Date().toISOString().split('T')[0], titleAr: newNewsTitle, titleEn: newNewsTitle, tag: 'مستجد' },
      ...prev,
    ])
    setNewNewsTitle('')
    setShowNewsModal(false)
    showToast(isAr ? 'تمت إضافة الخبر' : 'News item added')
  }

  const updateCpField = (cpId: string, field: keyof Counterpart, val: string) => {
    setLocalCounterparts((prev) => prev.map((cp) => (cp.id === cpId ? { ...cp, [field]: val } : cp)))
  }

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link
          href="/ir/countries"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-[var(--color-brand)] no-underline hover:underline"
        >
          <ArrowRight size={14} className="rtl-flip" />
          {isAr ? 'العودة إلى قائمة الدول' : 'Back to Countries'}
        </Link>
        <PageHeader
          title={`${country.flag} ${isAr ? country.nameAr : country.nameEn}`}
          subtitle={isAr ? `العاصمة: ${country.capitalAr} · المنطقة: ${country.region}` : `Capital: ${country.capitalEn} · Region: ${country.region}`}
          actions={
            <button
              onClick={() => setShowNewsModal(true)}
              className="btn btn-primary gap-2 text-sm"
            >
              <Plus size={15} />
              {isAr ? 'إضافة خبر جديد' : 'Add News'}
            </button>
          }
        />
      </div>

      {/* Country info cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Globe, label: isAr ? 'رمز الدولة' : 'Country Code', value: country.iso2.toUpperCase() },
          { icon: MapPin, label: isAr ? 'العاصمة' : 'Capital', value: isAr ? country.capitalAr : country.capitalEn },
          { icon: Users, label: isAr ? 'المنطقة' : 'Region', value: isAr ? country.region : country.region },
          { icon: Calendar, label: isAr ? 'الاتفاقيات' : 'Agreements', value: agreements.length > 0 ? agreements.length : '—' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand)]/10">
              <Icon size={16} className="text-[var(--color-brand)]" />
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
          {/* Counterparts */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <SectionTitle title={isAr ? 'جدول النظراء' : 'Counterparts'} />
              {editMode ? (
                <div className="flex gap-2">
                  <button
                    onClick={saveCounterparts}
                    className="btn btn-primary h-8 gap-1.5 px-3 text-xs"
                  >
                    <Save size={12} />
                    {isAr ? 'حفظ' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setLocalCounterparts(counterparts); setEditMode(false) }}
                    className="btn btn-ghost h-8 px-3 text-xs border-[var(--color-border)]"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="btn btn-ghost h-8 gap-1.5 px-3 text-xs border-[var(--color-border)]"
                >
                  <Edit3 size={12} />
                  {isAr ? 'تعديل النظراء' : 'Edit'}
                </button>
              )}
            </div>
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                    <th className="p-3 text-start font-medium">{isAr ? 'الاسم' : 'Name'}</th>
                    <th className="p-3 text-start font-medium">{isAr ? 'المسمى الوظيفي' : 'Title'}</th>
                    <th className="p-3 text-start font-medium">{isAr ? 'الجهة' : 'Organization'}</th>
                    <th className="p-3 text-start font-medium">{isAr ? 'البريد' : 'Email'}</th>
                  </tr>
                </thead>
                <tbody>
                  {localCounterparts.map((cp) => (
                    <tr
                      key={cp.id}
                      className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <td className="p-3 font-medium text-[var(--color-text)]">
                        {editMode ? (
                          <input
                            value={isAr ? cp.nameAr : cp.nameEn}
                            onChange={(e) => updateCpField(cp.id, isAr ? 'nameAr' : 'nameEn', e.target.value)}
                            className="input-base h-8 text-xs"
                          />
                        ) : (
                          isAr ? cp.nameAr : cp.nameEn
                        )}
                      </td>
                      <td className="p-3 text-[var(--color-text-muted)] text-xs">
                        {isAr ? cp.titleAr : cp.titleEn}
                      </td>
                      <td className="p-3 text-[var(--color-text-muted)] text-xs">{cp.org}</td>
                      <td className="p-3 text-xs text-[var(--color-brand)] font-mono">{cp.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agreements */}
          {agreements.length > 0 && (
            <div>
              <SectionTitle title={isAr ? 'الاتفاقيات المرتبطة' : 'Related Agreements'} viewAllHref="/ir/agreements" />
              <div className="space-y-2">
                {agreements.map((agr) => (
                  <div key={agr.id} className="card p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {isAr ? agr.titleAr : agr.titleEn}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {agr.documentNumber} · {isAr ? agr.ownerAr : agr.ownerEn}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                        agr.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        agr.status === 'draft' ? 'bg-blue-100 text-blue-700' :
                        agr.status === 'expired' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {agr.status === 'active' ? 'نشط' : agr.status === 'draft' ? 'مسودة' :
                         agr.status === 'expired' ? 'منتهٍ' : 'قيد المراجعة'}
                      </span>
                      <SlaBadge status={agr.slaStatus} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* News timeline */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <SectionTitle title={isAr ? 'الأخبار والمستجدات' : 'News & Updates'} />
            <button
              onClick={() => setShowNewsModal(true)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] hover:bg-[var(--color-brand)]/20 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="relative space-y-0 ps-4 before:absolute before:start-0 before:top-0 before:h-full before:w-0.5 before:bg-[var(--color-border)]">
            {newsItems.map((item, i) => (
              <div key={i} className="relative pb-4">
                <div className="absolute -start-1.5 top-1.5 h-3 w-3 rounded-full bg-[var(--color-brand)] border-2 border-[var(--color-bg)]" />
                <div className="card ms-3 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TAG_COLORS[item.tag] ?? 'bg-gray-100 text-gray-600'}`}>
                      {item.tag}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">{item.date}</span>
                  </div>
                  <p className="text-xs font-medium text-[var(--color-text)]">
                    {isAr ? item.titleAr : item.titleEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key companies widget */}
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <SectionTitle title={isAr ? 'الشركات الرئيسية ومؤشرات الأداء' : 'Key Companies & KPIs'} />
          <Link
            href={`/ir/companies?country=${id === '1' ? 'korea' : id}`}
            className="text-xs font-semibold text-[var(--color-brand)] no-underline hover:underline"
          >
            {isAr ? 'عرض كل الشركات' : 'View All'}
          </Link>
        </div>
        {countryCompanies.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="grid gap-2 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2">
              {countryCompanies.slice(0, 4).map((co) => (
                <Link key={co.id} href={`/ir/companies/${co.id}`} className="no-underline">
                  <div className="card card-hover flex items-center gap-3 p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand)]/10 text-xs font-extrabold text-[var(--color-brand)]">
                      {co.logoInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                        {isAr ? co.nameAr : co.nameEn}
                      </p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">{co.sectorAr}</p>
                      <p className="text-[11px] font-semibold text-[var(--color-brand)]">{co.investmentsKpi}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Briefcase size={15} className="text-[var(--color-brand)]" />
                <p className="text-xs font-bold text-[var(--color-text)]">
                  {isAr ? 'ملخص الاستثمارات' : 'Investment summary'}
                </p>
              </div>
              {(() => {
                const totalCurrent = countryCompanies.length
                const active = countryCompanies.filter((c) => c.investmentStatus === 'نشط').length
                const negotiating = countryCompanies.filter((c) => c.investmentStatus === 'قيد التفاوض').length
                const bars = [
                  { label: isAr ? 'شركات' : 'Companies', value: totalCurrent, pct: 100, color: 'bg-[var(--color-brand)]' },
                  { label: isAr ? 'استثمار نشط' : 'Active', value: active, pct: totalCurrent ? (active / totalCurrent) * 100 : 0, color: 'bg-emerald-500' },
                  { label: isAr ? 'قيد التفاوض' : 'Negotiating', value: negotiating, pct: totalCurrent ? (negotiating / totalCurrent) * 100 : 0, color: 'bg-amber-500' },
                ]
                return (
                  <div className="space-y-3">
                    {bars.map((b) => (
                      <div key={b.label}>
                        <div className="mb-1 flex justify-between text-[11px]">
                          <span className="text-[var(--color-text-muted)]">{b.label}</span>
                          <span className="font-semibold text-[var(--color-text)]">{b.value}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
                          <div className={`h-full rounded-full ${b.color}`} style={{ width: `${Math.max(b.pct, 8)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </div>
        ) : (
          <div className="card p-6 text-center text-sm text-[var(--color-text-muted)]">
            {isAr ? 'لا توجد شركات مسجّلة لهذه الدولة بعد' : 'No companies registered for this country yet'}
            <div className="mt-2">
              <Link href="/ir/companies/new" className="text-xs font-semibold text-[var(--color-brand)] no-underline hover:underline">
                {isAr ? 'إضافة شركة' : 'Add company'}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Resources */}
      <div>
        <SectionTitle title={isAr ? 'الموارد والمصادر' : 'Resources'} />
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { label: isAr ? 'ملف التعاون الثنائي' : 'Bilateral Cooperation File', type: 'PDF', size: '2.1 MB' },
            { label: isAr ? 'تقرير الزيارات 2025-2026' : 'Visits Report 2025-2026', type: 'XLSX', size: '890 KB' },
            { label: isAr ? 'دليل الاتصال بالنظراء' : 'Counterpart Contact Directory', type: 'PDF', size: '1.4 MB' },
          ].map(({ label, type, size }) => (
            <div
              key={label}
              className="card flex items-center gap-3 p-3 cursor-pointer hover:bg-[var(--color-bg)] transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand)]/10 text-xs font-bold text-[var(--color-brand)]">
                {type}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[var(--color-text)]">{label}</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">{size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add news modal */}
      <AnimatePresence>
        {showNewsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowNewsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="card w-full max-w-md p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-[var(--color-text)]">
                  {isAr ? 'إضافة خبر جديد' : 'Add News Item'}
                </h3>
                <button
                  onClick={() => setShowNewsModal(false)}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--color-text)]">
                    {isAr ? 'عنوان الخبر' : 'News Title'}
                  </label>
                  <input
                    value={newNewsTitle}
                    onChange={(e) => setNewNewsTitle(e.target.value)}
                    placeholder={isAr ? 'أدخل عنوان الخبر...' : 'Enter news title...'}
                    className="input-base"
                    autoFocus
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowNewsModal(false)}
                  className="btn btn-ghost border-[var(--color-border)] text-sm"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button onClick={addNews} className="btn btn-primary text-sm gap-2">
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
