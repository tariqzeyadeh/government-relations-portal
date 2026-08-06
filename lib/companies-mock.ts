export type InvestmentStatus = 'نشط' | 'قيد التفاوض' | 'مخطط' | 'متوقف'
export type JourneyStatus = 'مسجّل' | 'قيد التقييم' | 'مؤهّل' | 'مستثمر نشط'

export interface CompanyStakeholder {
  id: string
  nameAr: string
  nameEn: string
  roleAr: string
  roleEn: string
}

export interface Company {
  id: string
  nameAr: string
  nameEn: string
  countryId: string
  countryNameAr: string
  countryNameEn: string
  countryFlag: string
  sectorAr: string
  sectorEn: string
  cooperationStatusAr: string
  cooperationStatusEn: string
  investmentStatus: InvestmentStatus
  journeyStatus: JourneyStatus
  investmentsKpi: string
  currentInvestment: string
  plannedInvestment: string
  hqAr: string
  hqEn: string
  established: string
  website: string
  logoInitials: string
  cooperationAreasAr: string[]
  cooperationAreasEn: string[]
  stakeholders: CompanyStakeholder[]
  news: { date: string; titleAr: string; titleEn: string }[]
  linkedToInvestorJourney: boolean
}

export const COMPANY_SECTORS = [
  'التعدين والمعادن',
  'الطاقة المتجددة',
  'الصناعة التحويلية',
  'التقنية والذكاء الاصطناعي',
  'النقل واللوجستيات',
]

export const COMPANIES: Company[] = [
  {
    id: '1',
    nameAr: 'سامسونج للصناعات الثقيلة',
    nameEn: 'Samsung Heavy Industries',
    countryId: 'korea',
    countryNameAr: 'كوريا الجنوبية',
    countryNameEn: 'South Korea',
    countryFlag: '🇰🇷',
    sectorAr: 'الصناعة التحويلية',
    sectorEn: 'Manufacturing',
    cooperationStatusAr: 'شراكة استراتيجية',
    cooperationStatusEn: 'Strategic partnership',
    investmentStatus: 'نشط',
    journeyStatus: 'مستثمر نشط',
    investmentsKpi: '1.2 مليار $',
    currentInvestment: '850 مليون $',
    plannedInvestment: '350 مليون $',
    hqAr: 'سيول، كوريا الجنوبية',
    hqEn: 'Seoul, South Korea',
    established: '1974',
    website: 'https://www.samsungshi.com',
    logoInitials: 'SH',
    cooperationAreasAr: ['بناء السفن', 'المعدات الصناعية', 'نقل التقنية'],
    cooperationAreasEn: ['Shipbuilding', 'Industrial equipment', 'Tech transfer'],
    stakeholders: [
      { id: 's1', nameAr: 'بارك جين سو', nameEn: 'Park Jin-soo', roleAr: 'المدير الإقليمي للخليج', roleEn: 'Gulf Regional Director' },
      { id: 's2', nameAr: 'أحمد السبيعي', nameEn: 'Ahmed Al-Subaie', roleAr: 'مدير الشراكات — السعودية', roleEn: 'Saudi Partnerships Manager' },
    ],
    news: [
      { date: '2026-08-01', titleAr: 'افتتاح مكتب تمثيلي في الرياض', titleEn: 'Riyadh representative office opened' },
      { date: '2026-06-12', titleAr: 'توقيع مذكرة تعاون صناعي', titleEn: 'Industrial MoU signed' },
    ],
    linkedToInvestorJourney: true,
  },
  {
    id: '2',
    nameAr: 'تويوتا موتور',
    nameEn: 'Toyota Motor Corporation',
    countryId: 'japan',
    countryNameAr: 'اليابان',
    countryNameEn: 'Japan',
    countryFlag: '🇯🇵',
    sectorAr: 'الصناعة التحويلية',
    sectorEn: 'Manufacturing',
    cooperationStatusAr: 'تعاون فعّال',
    cooperationStatusEn: 'Active cooperation',
    investmentStatus: 'قيد التفاوض',
    journeyStatus: 'مؤهّل',
    investmentsKpi: '640 مليون $',
    currentInvestment: '420 مليون $',
    plannedInvestment: '220 مليون $',
    hqAr: 'تويوتا، اليابان',
    hqEn: 'Toyota City, Japan',
    established: '1937',
    website: 'https://www.toyota-global.com',
    logoInitials: 'TM',
    cooperationAreasAr: ['السيارات الكهربائية', 'الهيدروجين', 'سلاسل الإمداد'],
    cooperationAreasEn: ['EVs', 'Hydrogen', 'Supply chains'],
    stakeholders: [
      { id: 's1', nameAr: 'هيروشي تاناكا', nameEn: 'Hiroshi Tanaka', roleAr: 'نائب الرئيس للشؤون الدولية', roleEn: 'VP International Affairs' },
    ],
    news: [
      { date: '2026-07-20', titleAr: 'مباحثات مصنع بطاريات في المملكة', titleEn: 'Battery plant talks in KSA' },
    ],
    linkedToInvestorJourney: true,
  },
  {
    id: '3',
    nameAr: 'سينوبك',
    nameEn: 'Sinopec',
    countryId: 'china',
    countryNameAr: 'الصين',
    countryNameEn: 'China',
    countryFlag: '🇨🇳',
    sectorAr: 'الطاقة المتجددة',
    sectorEn: 'Renewable Energy',
    cooperationStatusAr: 'قيد التطوير',
    cooperationStatusEn: 'Under development',
    investmentStatus: 'مخطط',
    journeyStatus: 'قيد التقييم',
    investmentsKpi: '980 مليون $',
    currentInvestment: '310 مليون $',
    plannedInvestment: '670 مليون $',
    hqAr: 'بكين، الصين',
    hqEn: 'Beijing, China',
    established: '2000',
    website: 'https://www.sinopec.com',
    logoInitials: 'SP',
    cooperationAreasAr: ['البتروكيماويات', 'الطاقة النظيفة', 'التكرير'],
    cooperationAreasEn: ['Petrochemicals', 'Clean energy', 'Refining'],
    stakeholders: [
      { id: 's1', nameAr: 'ليو وي', nameEn: 'Liu Wei', roleAr: 'مدير أسواق الشرق الأوسط', roleEn: 'MENA Markets Director' },
    ],
    news: [
      { date: '2026-05-08', titleAr: 'دراسة جدوى مجمع صناعي مشترك', titleEn: 'Joint industrial complex feasibility' },
    ],
    linkedToInvestorJourney: false,
  },
  {
    id: '4',
    nameAr: 'سيمنز للطاقة',
    nameEn: 'Siemens Energy',
    countryId: 'germany',
    countryNameAr: 'ألمانيا',
    countryNameEn: 'Germany',
    countryFlag: '🇩🇪',
    sectorAr: 'الطاقة المتجددة',
    sectorEn: 'Renewable Energy',
    cooperationStatusAr: 'شراكة استراتيجية',
    cooperationStatusEn: 'Strategic partnership',
    investmentStatus: 'نشط',
    journeyStatus: 'مستثمر نشط',
    investmentsKpi: '1.5 مليار $',
    currentInvestment: '1.1 مليار $',
    plannedInvestment: '400 مليون $',
    hqAr: 'ميونخ، ألمانيا',
    hqEn: 'Munich, Germany',
    established: '2020',
    website: 'https://www.siemens-energy.com',
    logoInitials: 'SE',
    cooperationAreasAr: ['توربينات الغاز', 'الشبكات الذكية', 'الهيدروجين الأخضر'],
    cooperationAreasEn: ['Gas turbines', 'Smart grids', 'Green hydrogen'],
    stakeholders: [
      { id: 's1', nameAr: 'كلاوس فيشر', nameEn: 'Klaus Fischer', roleAr: 'المدير التنفيذي الإقليمي', roleEn: 'Regional CEO' },
      { id: 's2', nameAr: 'نورة العتيبي', nameEn: 'Noura Al-Otaibi', roleAr: 'مديرة المشاريع المشتركة', roleEn: 'Joint Projects Director' },
    ],
    news: [
      { date: '2026-08-03', titleAr: 'توسيع مشروع الهيدروجين الأخضر', titleEn: 'Green hydrogen project expansion' },
      { date: '2026-04-15', titleAr: 'افتتاح مركز تدريب فني', titleEn: 'Technical training center opened' },
    ],
    linkedToInvestorJourney: true,
  },
  {
    id: '5',
    nameAr: 'ريو تينتو',
    nameEn: 'Rio Tinto',
    countryId: 'australia',
    countryNameAr: 'أستراليا',
    countryNameEn: 'Australia',
    countryFlag: '🇦🇺',
    sectorAr: 'التعدين والمعادن',
    sectorEn: 'Mining & Minerals',
    cooperationStatusAr: 'تعاون فعّال',
    cooperationStatusEn: 'Active cooperation',
    investmentStatus: 'نشط',
    journeyStatus: 'مسجّل',
    investmentsKpi: '720 مليون $',
    currentInvestment: '520 مليون $',
    plannedInvestment: '200 مليون $',
    hqAr: 'ملبورن، أستراليا',
    hqEn: 'Melbourne, Australia',
    established: '1873',
    website: 'https://www.riotinto.com',
    logoInitials: 'RT',
    cooperationAreasAr: ['الليثيوم', 'النحاس', 'استكشاف المعادن'],
    cooperationAreasEn: ['Lithium', 'Copper', 'Mineral exploration'],
    stakeholders: [
      { id: 's1', nameAr: 'جيمس كوبر', nameEn: 'James Cooper', roleAr: 'مدير تطوير الأعمال — الشرق الأوسط', roleEn: 'ME Business Development' },
    ],
    news: [
      { date: '2026-07-01', titleAr: 'اتفاق إطار استكشاف الليثيوم', titleEn: 'Lithium exploration framework agreed' },
    ],
    linkedToInvestorJourney: true,
  },
  {
    id: '6',
    nameAr: 'توتال إنرجيز',
    nameEn: 'TotalEnergies',
    countryId: 'france',
    countryNameAr: 'فرنسا',
    countryNameEn: 'France',
    countryFlag: '🇫🇷',
    sectorAr: 'الطاقة المتجددة',
    sectorEn: 'Renewable Energy',
    cooperationStatusAr: 'قيد التطوير',
    cooperationStatusEn: 'Under development',
    investmentStatus: 'قيد التفاوض',
    journeyStatus: 'مؤهّل',
    investmentsKpi: '890 مليون $',
    currentInvestment: '290 مليون $',
    plannedInvestment: '600 مليون $',
    hqAr: 'باريس، فرنسا',
    hqEn: 'Paris, France',
    established: '1924',
    website: 'https://totalenergies.com',
    logoInitials: 'TE',
    cooperationAreasAr: ['الطاقة الشمسية', 'الغاز', 'التحول الطاقي'],
    cooperationAreasEn: ['Solar', 'Gas', 'Energy transition'],
    stakeholders: [
      { id: 's1', nameAr: 'ماري دوبوا', nameEn: 'Marie Dubois', roleAr: 'مديرة الخليج', roleEn: 'Gulf Director' },
    ],
    news: [
      { date: '2026-06-28', titleAr: 'مباحثات محطة شمسية مشتركة', titleEn: 'Joint solar plant discussions' },
    ],
    linkedToInvestorJourney: false,
  },
]

export function getCompanyById(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id)
}

export function getCompaniesByCountry(countryId: string): Company[] {
  return COMPANIES.filter((c) => c.countryId === countryId)
}
