'use client'

import React, { useState } from 'react'
import { Search, MapPin, Users, Building2, FileText, Plane, ExternalLink, Rss, Globe2, TrendingUp } from 'lucide-react'
import { useApp } from '@/lib/app-context'

const COUNTRIES = [
  {
    id: 1, name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', flag: '🇸🇦', region: 'GCC', capital: 'Riyadh',
    population: '36M', gdp: '$1.07T', status: 'Strategic Partner', statusAr: 'شريك استراتيجي',
    cooperationScore: 98, sectors: ['Energy', 'Vision 2030', 'Defense', 'Finance'],
    counterparts: ['FM Prince Faisal bin Farhan', 'Amb. Saud Al-Sati', 'Min. Khalid Al-Falih'],
    agreements: 54, latestVisit: 'Jul 20, 2026', companies: 31,
    areas: ['Oil & Gas', 'NEOM Smart City', 'Defense Cooperation', 'Hajj & Umrah Coordination'],
    news: [
      { title: 'GCC Summit agenda finalised for Riyadh session', time: '1h ago', source: 'Saudi Gazette' },
      { title: 'Vision 2030 bilateral project portfolio expanded', time: '2d ago', source: 'Arab News' },
      { title: 'Joint energy security framework signed in Q3', time: '4d ago', source: 'Bloomberg ME' },
    ],
  },
  {
    id: 2, name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', flag: '🇦🇪', region: 'GCC', capital: 'Abu Dhabi',
    population: '10M', gdp: '$509B', status: 'Strategic Partner', statusAr: 'شريك استراتيجي',
    cooperationScore: 96, sectors: ['Trade', 'Technology', 'Tourism', 'Aviation'],
    counterparts: ['FM Sheikh Abdullah bin Zayed', 'Amb. Lana Nusseibeh', 'Min. Thani Al-Zeyoudi'],
    agreements: 48, latestVisit: 'Aug 1, 2026', companies: 44,
    areas: ['Fintech & Digital Economy', 'Expo Legacy Projects', 'Space Programme', 'Renewable Energy'],
    news: [
      { title: 'UAE-hosted AI summit draws 60-nation participation', time: '3h ago', source: 'Gulf News' },
      { title: 'New direct investment corridor announced at GITEX', time: '1d ago', source: 'The National' },
      { title: 'UAE Mars Mission data sharing agreement renewed', time: '5d ago', source: 'Khaleej Times' },
    ],
  },
  {
    id: 3, name: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼', region: 'GCC', capital: 'Kuwait City',
    population: '4.9M', gdp: '$163B', status: 'Key Partner', statusAr: 'شريك مهم',
    cooperationScore: 89, sectors: ['Oil', 'Finance', 'Infrastructure', 'Diplomacy'],
    counterparts: ['FM Abdullah Al-Yahya', 'Amb. Jasem Al-Budaiwi', 'Min. Bader Al-Saad'],
    agreements: 36, latestVisit: 'Jun 5, 2026', companies: 18,
    areas: ['Kuwait Vision 2035', 'Financial Markets Integration', 'Water Desalination', 'Regional Mediation'],
    news: [
      { title: 'Kuwait Fund announces $2.1B regional development package', time: '2h ago', source: 'Kuwait Times' },
      { title: 'New industrial zone cooperation MoU signed', time: '3d ago', source: 'Arab Times' },
      { title: 'Bilateral judicial cooperation framework finalised', time: '6d ago', source: 'Al-Qabas' },
    ],
  },
  {
    id: 4, name: 'Qatar', nameAr: 'قطر', flag: '🇶🇦', region: 'GCC', capital: 'Doha',
    population: '2.9M', gdp: '$214B', status: 'Strategic Partner', statusAr: 'شريك استراتيجي',
    cooperationScore: 91, sectors: ['LNG', 'Sports', 'Media', 'Aviation'],
    counterparts: ['FM Sheikh Mohammed bin Abdulrahman', 'Amb. Mishal Al-Ansari', 'Min. Ali Al-Kuwari'],
    agreements: 41, latestVisit: 'Jul 8, 2026', companies: 27,
    areas: ['LNG & Petrochemicals', 'FIFA 2022 Legacy', 'Al Jazeera Partnership', 'Qatar National Vision 2030'],
    news: [
      { title: 'Qatar expands LNG supply agreement through 2040', time: '4h ago', source: 'Peninsula Qatar' },
      { title: 'Doha Forum announces joint policy research initiative', time: '2d ago', source: 'Al-Sharq' },
      { title: 'Qatari mediation role in regional dispute recognised', time: '7d ago', source: 'Reuters' },
    ],
  },
  {
    id: 5, name: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭', region: 'GCC', capital: 'Manama',
    population: '1.5M', gdp: '$43B', status: 'Key Partner', statusAr: 'شريك مهم',
    cooperationScore: 85, sectors: ['Finance', 'Fintech', 'Defence', 'Tourism'],
    counterparts: ['FM Dr. Abdullatif Al-Zayani', 'Amb. Khalid Al-Jalahma', 'Min. Zayed Al-Zayani'],
    agreements: 29, latestVisit: 'May 18, 2026', companies: 15,
    areas: ['Islamic Finance Hub', 'Fintech Regulatory Sandbox', 'US 5th Fleet Coordination', 'Grand Prix Tourism'],
    news: [
      { title: 'Bahrain FinTech Bay launches cross-border pilot', time: '5h ago', source: 'Trade Arabia' },
      { title: 'Bahrain-GCC unified banking licence framework progresses', time: '3d ago', source: 'Gulf Daily News' },
      { title: 'F1 Grand Prix 2026 bilateral hospitality MoU signed', time: '8d ago', source: 'Bahrain News Agency' },
    ],
  },
  {
    id: 6, name: 'Oman', nameAr: 'عُمان', flag: '🇴🇲', region: 'GCC', capital: 'Muscat',
    population: '4.5M', gdp: '$114B', status: 'Key Partner', statusAr: 'شريك مهم',
    cooperationScore: 87, sectors: ['Energy', 'Tourism', 'Fisheries', 'Logistics'],
    counterparts: ['FM Badr Al-Busaidi', 'Amb. Hunaina Al-Mughairy', 'Min. Salim Al-Aufi'],
    agreements: 33, latestVisit: 'Apr 30, 2026', companies: 21,
    areas: ['Duqm Special Economic Zone', 'Blue Economy', 'Oman Vision 2040', 'Iran-GCC Diplomatic Bridge'],
    news: [
      { title: 'Duqm Port agreement brings new maritime route', time: '6h ago', source: 'Times of Oman' },
      { title: 'Oman-India green hydrogen MoU signed at COP31', time: '4d ago', source: 'Oman Daily Observer' },
      { title: 'Joint fisheries management committee meets in Muscat', time: '9d ago', source: 'Muscat Daily' },
    ],
  },
]

const STATUS_COLORS: Record<string, string> = {
  'Strategic Partner': 'bg-emerald-100 text-emerald-700',
  'Major Partner':     'bg-blue-100 text-blue-700',
  'Key Partner':       'bg-amber-100 text-amber-700',
}

type CountryType = typeof COUNTRIES[0]

export function CountriesView() {
  const { language } = useApp()
  const isRtl = language === 'ar'
  const [selected, setSelected] = useState<CountryType>(COUNTRIES[0])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const T = {
    searchPlaceholder: isRtl ? 'البحث في دول مجلس التعاون...' : 'Search GCC countries...',
    gcsBanner:         isRtl ? 'دول مجلس التعاون الخليجي — 6 دول' : 'Gulf Cooperation Council (GCC) Member States — 6 countries',
    gccBadge:          isRtl ? 'تكامل الأمانة العامة نشط' : 'GCC Secretariat Integration Active',
    overviewTab:       isRtl ? 'نظرة عامة'    : 'Overview',
    cooperationTab:    isRtl ? 'التعاون'       : 'Cooperation',
    liveNewsTab:       isRtl ? 'الأخبار'       : 'Live News',
    population:        isRtl ? 'السكان'        : 'Population',
    gdp:               isRtl ? 'الناتج المحلي' : 'GDP',
    agreements:        isRtl ? 'الاتفاقيات'    : 'Agreements',
    companies:         isRtl ? 'الشركات'       : 'Companies',
    counterparts:      isRtl ? 'نظراء الحكومة' : 'Government Counterparts',
    latestVisit:       isRtl ? 'آخر زيارة دبلوماسية' : 'Latest Diplomatic Visit',
    keySectors:        isRtl ? 'القطاعات الرئيسية' : 'Key Sectors',
    areasOfCoop:       isRtl ? 'مجالات التعاون' : 'Areas of Cooperation',
    cooperationScore:  isRtl ? 'درجة التعاون'  : 'Cooperation Score',
    liveNewsFeed:      isRtl ? 'مصدر الأخبار المباشر —' : 'Live news feed —',
  }

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.nameAr.includes(search) ||
    c.capital.toLowerCase().includes(search.toLowerCase())
  )

  const TABS = [
    { key: 'overview',    label: T.overviewTab    },
    { key: 'cooperation', label: T.cooperationTab },
    { key: 'news',        label: T.liveNewsTab    },
  ]

  return (
    <div className="space-y-4">
      {/* GCC Banner */}
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[var(--color-brand)]/5 border border-[var(--color-brand)]/20">
        <div className="p-1.5 bg-[var(--color-brand)]/10 rounded-lg shrink-0">
          <Globe2 className="w-3.5 h-3.5 text-[var(--color-brand)]" />
        </div>
        <span className="text-[13px] font-semibold text-[var(--color-text)]">{T.gcsBanner}</span>
        <span className="ml-auto inline-flex items-center bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-[10px] rounded-lg font-semibold px-2.5 py-1">
          {T.gccBadge}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Country list */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <input
              placeholder={T.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 h-10 text-[13px] rounded-xl bg-gray-100/50 border border-[var(--color-border)]/60 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-brand)]/40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            {filtered.map((country) => (
              <button
                key={country.id}
                onClick={() => { setSelected(country); setActiveTab('overview') }}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 ${
                  selected.id === country.id
                    ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5 shadow-sm'
                    : 'border-[var(--color-border)]/50 hover:bg-gray-100/40 hover:border-[var(--color-brand)]/20'
                }`}
              >
                <span className="text-2xl leading-none shrink-0">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-bold text-[var(--color-text)] truncate">{country.name}</span>
                    <span className={`text-[12px] font-extrabold shrink-0 ${selected.id === country.id ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-muted)]'}`}>
                      {country.cooperationScore}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{country.nameAr}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--color-brand)]" style={{ width: `${country.cooperationScore}%` }} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Country detail */}
        <div className="xl:col-span-2">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{selected.flag}</span>
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text)]">{selected.name}</h2>
                <p className="text-sm text-[var(--color-text-muted)]/70 font-medium">{selected.nameAr}</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span className="text-sm text-[var(--color-text-muted)]">{selected.capital} · {selected.region}</span>
                </div>
              </div>
            </div>
            <span className={`inline-flex items-center text-xs px-3 py-1 rounded-lg font-semibold ${STATUS_COLORS[selected.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {isRtl ? selected.statusAr : selected.status}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 p-1 rounded-xl bg-gray-100/60">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  activeTab === tab.key
                    ? 'bg-[var(--color-surface-elevated)] shadow-sm text-[var(--color-text)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: T.population, value: selected.population, icon: Users },
                  { label: T.gdp,        value: selected.gdp,        icon: TrendingUp },
                  { label: T.agreements, value: String(selected.agreements), icon: FileText },
                  { label: T.companies,  value: String(selected.companies),  icon: Building2 },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm p-4">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Icon className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                        <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wide">{stat.label}</span>
                      </div>
                      <span className="text-xl font-extrabold text-[var(--color-text)]">{stat.value}</span>
                    </div>
                  )
                })}
              </div>

              <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm">
                <div className="px-5 pt-4 pb-2">
                  <h4 className="text-[13px] font-bold text-[var(--color-text)] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[var(--color-brand)]" />{T.counterparts}
                  </h4>
                </div>
                <div className="px-5 pb-4 flex flex-wrap gap-2">
                  {selected.counterparts.map((cp) => (
                    <span key={cp} className="inline-flex items-center text-[11px] font-medium py-1 px-2.5 rounded-lg bg-gray-100 text-[var(--color-text)]">{cp}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm p-4 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10">
                  <Plane className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">{T.latestVisit}</p>
                  <p className="text-[14px] font-bold text-[var(--color-text)] mt-0.5">{selected.latestVisit}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cooperation' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm">
                <div className="px-5 pt-4 pb-2">
                  <h4 className="text-[13px] font-bold text-[var(--color-text)]">{T.keySectors}</h4>
                </div>
                <div className="px-5 pb-4 flex flex-wrap gap-2">
                  {selected.sectors.map((s) => (
                    <span key={s} className="inline-flex items-center bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-[11px] rounded-lg font-semibold px-2.5 py-1">{s}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm">
                <div className="px-5 pt-4 pb-2">
                  <h4 className="text-[13px] font-bold text-[var(--color-text)]">{T.areasOfCoop}</h4>
                </div>
                <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selected.areas.map((area) => (
                    <div key={area} className="flex items-center gap-2 p-3 rounded-xl bg-gray-100/40 hover:bg-gray-100/60 transition-colors">
                      <Globe2 className="w-3.5 h-3.5 text-[var(--color-brand)] shrink-0" />
                      <span className="text-[12px] font-medium text-[var(--color-text)]">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-bold text-[var(--color-text)]">{T.cooperationScore}</span>
                  <span className="text-3xl font-extrabold text-[var(--color-brand)]">
                    {selected.cooperationScore}<span className="text-base text-[var(--color-text-muted)] font-medium">/100</span>
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--color-brand)]" style={{ width: `${selected.cooperationScore}%` }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[12px] text-[var(--color-text-muted)] mb-1 font-medium">
                <Rss className="w-3.5 h-3.5 text-amber-500" />
                {T.liveNewsFeed} {selected.name}
              </div>
              {selected.news.map((item, i) => (
                <div key={i} className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm hover:border-[var(--color-brand)]/30 hover:shadow-md transition-all duration-150 cursor-pointer group p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--color-text)] group-hover:text-[var(--color-brand)] transition-colors leading-snug">{item.title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[11px] font-medium text-[var(--color-text-muted)] bg-gray-100/60 px-2 py-0.5 rounded-full">{item.source}</span>
                      <span className="text-[11px] text-[var(--color-text-muted)]">{item.time}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)] transition-colors shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
