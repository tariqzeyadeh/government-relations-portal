'use client'

import { useState } from 'react'
import { Search, MapPin, Users, Building2, FileText, Plane, ExternalLink, Rss, Globe2, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useApp } from '@/lib/app-context'

const COUNTRIES = [
  {
    id: 1, name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', flag: '🇸🇦', region: 'GCC', capital: 'Riyadh',
    population: '36M', gdp: '$1.07T', status: 'Strategic Partner',
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
    population: '10M', gdp: '$509B', status: 'Strategic Partner',
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
    population: '4.9M', gdp: '$163B', status: 'Key Partner',
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
    population: '2.9M', gdp: '$214B', status: 'Strategic Partner',
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
    population: '1.5M', gdp: '$43B', status: 'Key Partner',
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
    population: '4.5M', gdp: '$114B', status: 'Key Partner',
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

export function CountriesView() {
  const { language } = useApp()
  const isRtl = language === 'ar'

  const T = {
    searchPlaceholder: isRtl ? 'البحث في دول مجلس التعاون...' : 'Search GCC countries...',
    gcsBanner:         isRtl ? 'دول مجلس التعاون الخليجي — 6 دول' : 'Gulf Cooperation Council (GCC) Member States — 6 countries',
    gccBadge:          isRtl ? 'تكامل الأمانة العامة لمجلس التعاون نشط' : 'GCC Secretariat Integration Active',
    overviewTab:       isRtl ? 'نظرة عامة'    : 'Overview',
    cooperationTab:    isRtl ? 'التعاون'       : 'Cooperation',
    liveNewsTab:       isRtl ? 'الأخبار المباشرة' : 'Live News',
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
    statusLabels:      { 'Strategic Partner': isRtl ? 'شريك استراتيجي' : 'Strategic Partner', 'Major Partner': isRtl ? 'شريك رئيسي' : 'Major Partner', 'Key Partner': isRtl ? 'شريك مهم' : 'Key Partner' },
  }

  const [selected, setSelected] = useState(COUNTRIES[0])
  const [search, setSearch] = useState('')

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.nameAr.includes(search) ||
    c.capital.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor: Record<string, string> = {
    'Strategic Partner': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Major Partner': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Key Partner': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  }

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      {/* GCC Banner */}
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-primary/5 border border-primary/20">
        <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
          <Globe2 className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="text-[13px] font-semibold text-foreground">{T.gcsBanner}</span>
        <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-[10px] rounded-lg font-semibold px-2.5">{T.gccBadge}</Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Country list */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder={T.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-[13px] h-10 rounded-xl bg-muted/50 border-border/60"
            />
          </div>
          <div className="flex flex-col gap-1.5 overflow-y-auto">
            {filtered.map((country) => (
              <button
                key={country.id}
                onClick={() => setSelected(country)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 ${
                  selected.id === country.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border/50 hover:bg-muted/40 hover:border-primary/20 hover:-translate-y-px'
                }`}
              >
                <span className="text-2xl leading-none shrink-0" role="img" aria-label={country.name}>{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-bold text-foreground truncate">{country.name}</span>
                    <span className={`text-[12px] font-extrabold shrink-0 ${selected.id === country.id ? 'text-primary' : 'text-muted-foreground'}`}>{country.cooperationScore}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{country.nameAr}</p>
                  <Progress value={country.cooperationScore} className="mt-2 h-1.5 rounded-full" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Country detail */}
        <div className="xl:col-span-2 overflow-y-auto">
          <Tabs defaultValue="overview">
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-4">
                <span className="text-4xl" role="img" aria-label={selected.name}>{selected.flag}</span>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
                  <p className="text-sm text-muted-foreground/70 font-medium">{selected.nameAr}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{selected.capital} · {selected.region}</span>
                  </div>
                </div>
              </div>
              <Badge className={`${statusColor[selected.status] ?? ''} border-0 text-xs px-3 py-1`}>
                {T.statusLabels[selected.status as keyof typeof T.statusLabels] ?? selected.status}
              </Badge>
            </div>

            <TabsList className="mb-4 rounded-xl bg-muted/60 p-1 gap-1">
              <TabsTrigger value="overview" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.overviewTab}</TabsTrigger>
              <TabsTrigger value="cooperation" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.cooperationTab}</TabsTrigger>
              <TabsTrigger value="news" className="rounded-lg text-[13px] font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">{T.liveNewsTab}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: T.population,  value: selected.population,         icon: Users     },
                  { label: T.gdp,         value: selected.gdp,                icon: TrendingUp },
                  { label: T.agreements,  value: String(selected.agreements), icon: FileText  },
                  { label: T.companies,   value: String(selected.companies),  icon: Building2  },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <Card key={stat.label} className="border-border/50 shadow-sm rounded-2xl">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                        </div>
                        <span className="text-xl font-extrabold text-foreground">{stat.value}</span>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Counterparts */}
              <Card className="border-border/50 mb-4 shadow-sm rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[13px] font-bold flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    {T.counterparts}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {selected.counterparts.map((cp) => (
                    <Badge key={cp} variant="secondary" className="text-[11px] font-medium py-1 px-2.5 rounded-lg">
                      {cp}
                    </Badge>
                  ))}
                </CardContent>
              </Card>

              {/* Latest Visit */}
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-blue-500/10">
                    <Plane className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{T.latestVisit}</p>
                    <p className="text-[14px] font-bold text-foreground mt-0.5">{selected.latestVisit}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cooperation">
              <Card className="border-border/50 mb-4 shadow-sm rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[13px] font-bold">{T.keySectors}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {selected.sectors.map((s) => (
                    <Badge key={s} className="bg-primary/10 text-primary border-primary/20 text-[11px] rounded-lg font-semibold px-2.5 py-1">{s}</Badge>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-border/50 mb-4 shadow-sm rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[13px] font-bold">{T.areasOfCoop}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selected.areas.map((area) => (
                    <div key={area} className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                      <Globe2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-[12px] font-medium text-foreground">{area}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-bold text-foreground">{T.cooperationScore}</span>
                    <span className="text-3xl font-extrabold text-primary">{selected.cooperationScore}<span className="text-base text-muted-foreground font-medium">/100</span></span>
                  </div>
                  <Progress value={selected.cooperationScore} className="h-2.5 rounded-full" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="news">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground mb-1 font-medium">
                  <Rss className="w-3.5 h-3.5 text-amber-500" />
                  {T.liveNewsFeed} {selected.name}
                </div>
                {selected.news.map((item, i) => (
                  <Card key={i} className="border-border/50 shadow-sm rounded-2xl hover:border-primary/30 hover:shadow-md transition-all duration-150 cursor-pointer group">
                    <CardContent className="p-4 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">{item.title}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">{item.source}</span>
                          <span className="text-[11px] text-muted-foreground">{item.time}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
