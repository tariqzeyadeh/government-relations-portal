// Rich Arabic/English mock data for the GovIR portal prototype

export type AlertSeverity = 'high' | 'medium' | 'low'
export type AgreementStatus = 'draft' | 'active' | 'expired' | 'under_review'
export type AgreementType = 'MoU' | 'MoC' | 'LoI' | 'Framework' | 'Technical'
export type SlaStatus = 'red' | 'yellow' | 'green'
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type IntegrationStatus = 'connected' | 'disconnected' | 'degraded'
export type DecisionColumn = 'pending' | 'approved' | 'rejected' | 'implemented'

export interface SidebarAlert {
  id: string
  severity: AlertSeverity
  titleEn: string
  titleAr: string
  bodyEn: string
  bodyAr: string
  timestamp: string
  link?: string
}

export interface PortalAlert {
  id: string
  severity: AlertSeverity
  titleEn: string
  titleAr: string
  summaryEn: string
  summaryAr: string
  timestamp: string
}

export interface Agreement {
  id: string
  documentNumber: string
  type: AgreementType
  titleEn: string
  titleAr: string
  countryId: string
  countryNameEn: string
  countryNameAr: string
  status: AgreementStatus
  signedDate?: string
  expiryDate: string
  slaDaysRemaining: number
  slaStatus: SlaStatus
  ownerEn: string
  ownerAr: string
  sectorEn: string
  sectorAr: string
}

export interface Organization {
  id: string
  numericId: number
  nameEn: string
  nameAr: string
  acronym: string
  typeEn: string
  typeAr: string
  headquartersEn: string
  headquartersAr: string
  memberStates: number
  activeMoUs: number
  website: string
  focusAreasEn: string[]
  focusAreasAr: string[]
}

export interface Committee {
  id: string
  numericId: number
  nameEn: string
  nameAr: string
  typeId: string
  chairEn: string
  chairAr: string
  members: number
  nextMeeting: string
  status: 'active' | 'scheduled' | 'concluded'
  mandateEn: string
  mandateAr: string
}

export interface Meeting {
  id: string
  committeeId: string
  titleEn: string
  titleAr: string
  date: string
  time: string
  locationEn: string
  locationAr: string
  agendaItems: number
  attendees: number
  status: 'upcoming' | 'in_progress' | 'completed'
}

export interface Task {
  id: string
  titleEn: string
  titleAr: string
  assigneeEn: string
  assigneeAr: string
  dueDate: string
  slaStatus: SlaStatus
  slaDaysRemaining: number
  priority: 'high' | 'medium' | 'low'
  committeeId?: string
  agreementId?: string
  status: 'open' | 'in_progress' | 'completed' | 'overdue'
}

export interface AuditLog {
  id: string
  timestamp: string
  user: string
  actionEn: string
  actionAr: string
  ipAddress: string
  module: string
}

export interface SupportTicket {
  id: string
  ticketNumber: string
  subjectEn: string
  subjectAr: string
  requesterEn: string
  requesterAr: string
  status: TicketStatus
  priority: 'critical' | 'high' | 'medium' | 'low'
  createdAt: string
  categoryEn: string
  categoryAr: string
}

export interface Integration {
  id: string
  nameEn: string
  nameAr: string
  provider: string
  status: IntegrationStatus
  lastSync: string
  descriptionEn: string
  descriptionAr: string
}

export interface ProfileUser {
  nameEn: string
  nameAr: string
  titleEn: string
  titleAr: string
  email: string
  phone: string
  mobile?: string
  altEmail?: string
  departmentEn: string
  departmentAr: string
  ministryEn?: string
  ministryAr?: string
  role: string
  roleEn?: string
  roleAr?: string
  avatar: string
  lastLogin: string
}

export interface CalendarEvent {
  id: string
  date: string
  titleEn: string
  titleAr: string
  type: 'committee' | 'conference' | 'visit' | 'signing' | 'reception' | 'cultural'
  locationEn: string
  locationAr: string
  attendees?: number
}

export interface Topic {
  id: string
  titleEn: string
  titleAr: string
  committeeId: string
  status: 'open' | 'discussed' | 'resolved'
  priority: 'high' | 'medium' | 'low'
}

export interface ActionItem {
  id: string
  titleEn: string
  titleAr: string
  ownerEn: string
  ownerAr: string
  dueDate: string
  meetingId: string
  status: 'pending' | 'in_progress' | 'done'
}

export interface BenchmarkMetric {
  id: string
  labelEn: string
  labelAr: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  period: string
}

export interface Decision {
  id: string
  titleEn: string
  titleAr: string
  column: DecisionColumn
  committeeId: string
  date: string
  votesFor: number
  votesAgainst: number
  priority: 'high' | 'medium' | 'low'
}

export interface ArchiveFolder {
  id: string
  nameEn: string
  nameAr: string
  fileCount: number
  lastModified: string
}

export interface ArchiveFile {
  id: string
  folderId: string
  nameEn: string
  nameAr: string
  size: string
  uploadedAt: string
  uploadedBy: string
}

export interface MediaItem {
  id: string
  titleEn: string
  titleAr: string
  type: 'photo' | 'video' | 'press_release'
  date: string
  countryId?: string
  thumbnailUrl: string
}

export interface AiInsight {
  id: string
  titleEn: string
  titleAr: string
  summaryEn: string
  summaryAr: string
  confidence: number
  category: string
  generatedAt: string
}

export interface RolePermission {
  module: string
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
  approve: boolean
}

export interface RoleMatrixEntry {
  roleId: string
  roleEn: string
  roleAr: string
  permissions: RolePermission[]
}

export interface Delegation {
  id: string
  delegateEn: string
  delegateAr: string
  principalEn: string
  principalAr: string
  scopeEn: string
  scopeAr: string
  validFrom: string
  validTo: string
  status: 'active' | 'expired' | 'pending'
}

export interface CommitteeType {
  id: string
  labelEn: string
  labelAr: string
  descriptionEn: string
  descriptionAr: string
}

export interface MeetingType {
  id: string
  labelEn: string
  labelAr: string
}

export interface NotificationTemplate {
  id: string
  nameEn: string
  nameAr: string
  channel: 'email' | 'sms' | 'portal' | 'all'
  subjectEn: string
  subjectAr: string
  bodyEn: string
  bodyAr: string
}

export const SIDEBAR_ALERTS: SidebarAlert[] = [
  {
    id: 'alert-china-mou',
    severity: 'high',
    titleEn: 'China MoU Renewal — Action Required',
    titleAr: 'تجديد مذكرة التفاهم مع الصين — إجراء مطلوب',
    bodyEn:
      'The bilateral Memorandum of Understanding on Industrial Cooperation with the Ministry of Industry and Information Technology (MIIT) of the People\'s Republic of China expires on 2026-09-15. Legal review of the renewal draft (DOC-2026-CN-0047) is complete. The Deputy Minister\'s signature is pending. Failure to renew before expiry will suspend joint venture facilitation under Article 7 and halt the Riyadh-Beijing SME exchange programme affecting 23 registered Saudi companies. Coordinate with the Chinese Embassy commercial section and schedule the signing ceremony before the National Day holiday (2026-10-01).',
    bodyAr:
      'تنبيه: اقتراب موعد تجديد الاتفاقية الإطارية مع جمهورية الصين.',
    timestamp: '2026-08-06T08:15:00+03:00',
    link: '/ir/agreements/china-mou-2026',
  },
  {
    id: 'alert-mining-committee',
    severity: 'medium',
    titleEn: 'Mining Committee Session Tomorrow',
    titleAr: 'جلسة لجنة التعدين غداً',
    bodyEn:
      'The Joint Mining & Minerals Cooperation Committee (mining-2026) holds its 2nd session tomorrow at 10:00 AST in Conference Hall B, Ministry HQ. Agenda: (1) review of lithium exploration framework with Australia, (2) rare-earth supply chain MoU status, (3) Q3 investment pipeline. 14 of 18 members confirmed. Briefing pack uploaded to Document Center.',
    bodyAr:
      'تذكير: اجتماع لجنة التعدين غداً الساعة 10 صباحاً.',
    timestamp: '2026-08-05T16:30:00+03:00',
    link: '/ir/committees/mining-2026',
  },
]

export const PORTAL_ALERTS: PortalAlert[] = [
  {
    id: 'portal-china-mou',
    severity: 'high',
    titleEn: 'China MoU expires 15 Sep — signature pending',
    titleAr: 'تنبيه: اقتراب تجديد اتفاقية الصين',
    summaryEn: 'Renewal draft DOC-2026-CN-0047 awaits Deputy Minister signature.',
    summaryAr: 'تنبيه: اقتراب تجديد اتفاقية الصين',
    timestamp: '2026-08-06T08:15:00+03:00',
  },
  {
    id: 'portal-mining',
    severity: 'medium',
    titleEn: 'Mining Committee — tomorrow 10:00',
    titleAr: 'تذكير: اجتماع لجنة التعدين غداً',
    summaryEn: 'Session 2 agenda: lithium framework, rare-earth MoU, Q3 pipeline.',
    summaryAr: 'تذكير: اجتماع لجنة التعدين غداً',
    timestamp: '2026-08-05T16:30:00+03:00',
  },
  {
    id: 'portal-france-loi',
    severity: 'low',
    titleEn: 'France LoI expired — archival review',
    titleAr: 'خطاب نوايا فرنسا منتهٍ — مراجعة أرشيفية',
    summaryEn: 'LoI-FR-2024-011 expired 2026-07-31. Renewal not initiated.',
    summaryAr: 'انتهى LoI-FR-2024-011 في 2026-07-31. لم يُبدأ التجديد.',
    timestamp: '2026-08-01T09:00:00+03:00',
  },
]

export const AGREEMENTS: Agreement[] = [
  {
    id: 'agr-china-mou-draft',
    documentNumber: 'DOC-2026-CN-0047',
    type: 'MoU',
    titleEn: 'Industrial Cooperation MoU — China (Renewal Draft)',
    titleAr: 'مذكرة تفاهم التعاون الصناعي — الصين (مسودة تجديد)',
    countryId: 'china',
    countryNameEn: 'China',
    countryNameAr: 'الصين',
    status: 'draft',
    expiryDate: '2026-09-15',
    slaDaysRemaining: 40,
    slaStatus: 'red',
    ownerEn: 'Eng. Fahad Al-Qahtani',
    ownerAr: 'م. فهد القحطاني',
    sectorEn: 'Industry & Technology',
    sectorAr: 'الصناعة والتكنولوجيا',
  },
  {
    id: 'agr-japan-moc',
    documentNumber: 'MoC-JP-2025-0033',
    type: 'MoC',
    titleEn: 'Memorandum of Cooperation — Japan (Energy & Hydrogen)',
    titleAr: 'مذكرة تعاون — اليابان (الطاقة والهيدروجين)',
    countryId: 'japan',
    countryNameEn: 'Japan',
    countryNameAr: 'اليابان',
    status: 'active',
    signedDate: '2025-11-20',
    expiryDate: '2028-11-20',
    slaDaysRemaining: 836,
    slaStatus: 'green',
    ownerEn: 'Dr. Noura Al-Harbi',
    ownerAr: 'د. نورة الحربي',
    sectorEn: 'Energy',
    sectorAr: 'الطاقة',
  },
  {
    id: 'agr-france-loi',
    documentNumber: 'LoI-FR-2024-011',
    type: 'LoI',
    titleEn: 'Letter of Intent — France (Cultural Exchange)',
    titleAr: 'خطاب نوايا — فرنسا (التبادل الثقافي)',
    countryId: 'france',
    countryNameEn: 'France',
    countryNameAr: 'فرنسا',
    status: 'expired',
    signedDate: '2024-08-01',
    expiryDate: '2026-07-31',
    slaDaysRemaining: -6,
    slaStatus: 'red',
    ownerEn: 'Ms. Lina Al-Shehri',
    ownerAr: 'أ. لينا الشهري',
    sectorEn: 'Culture',
    sectorAr: 'الثقافة',
  },
  {
    id: 'agr-korea-framework',
    documentNumber: 'FW-KR-2026-0008',
    type: 'Framework',
    titleEn: 'Framework Agreement — South Korea (Smart Cities)',
    titleAr: 'اتفاقية إطارية — كوريا الجنوبية (المدن الذكية)',
    countryId: 'korea',
    countryNameEn: 'South Korea',
    countryNameAr: 'كوريا الجنوبية',
    status: 'under_review',
    expiryDate: '2029-06-30',
    slaDaysRemaining: 1058,
    slaStatus: 'yellow',
    ownerEn: 'Eng. Sultan Al-Dosari',
    ownerAr: 'م. سلطان الدوسري',
    sectorEn: 'Smart Cities & ICT',
    sectorAr: 'المدن الذكية وتقنية المعلومات',
  },
  {
    id: 'agr-germany-technical',
    documentNumber: 'TA-DE-2025-0019',
    type: 'Technical',
    titleEn: 'Technical Agreement — Germany (Vocational Training)',
    titleAr: 'اتفاقية فنية — ألمانيا (التدريب المهني)',
    countryId: 'germany',
    countryNameEn: 'Germany',
    countryNameAr: 'ألمانيا',
    status: 'active',
    signedDate: '2025-03-12',
    expiryDate: '2027-03-12',
    slaDaysRemaining: 583,
    slaStatus: 'green',
    ownerEn: 'Dr. Majed Al-Otaibi',
    ownerAr: 'د. ماجد العتيبي',
    sectorEn: 'Education & Training',
    sectorAr: 'التعليم والتدريب',
  },
]

export const ORGANIZATIONS: Organization[] = [
  {
    id: 'unido',
    numericId: 1,
    nameEn: 'United Nations Industrial Development Organization',
    nameAr: 'منظمة الأمم المتحدة للتنمية الصناعية',
    acronym: 'UNIDO',
    typeEn: 'UN Specialized Agency',
    typeAr: 'وكالة أممية متخصصة',
    headquartersEn: 'Vienna, Austria',
    headquartersAr: 'فيينا، النمسا',
    memberStates: 170,
    activeMoUs: 3,
    website: 'https://www.unido.org',
    focusAreasEn: ['Industrial policy', 'SME development', 'Green industry', 'Investment promotion'],
    focusAreasAr: ['السياسة الصناعية', 'تنمية المنشآت الصغيرة والمتوسطة', 'الصناعة الخضراء', 'ترويج الاستثمار'],
  },
  {
    id: 'wto',
    numericId: 2,
    nameEn: 'World Trade Organization',
    nameAr: 'منظمة التجارة العالمية',
    acronym: 'WTO',
    typeEn: 'International Organization',
    typeAr: 'منظمة دولية',
    headquartersEn: 'Geneva, Switzerland',
    headquartersAr: 'جنيف، سويسرا',
    memberStates: 164,
    activeMoUs: 1,
    website: 'https://www.wto.org',
    focusAreasEn: ['Trade facilitation', 'Dispute settlement', 'Tariff negotiations'],
    focusAreasAr: ['تسهيل التجارة', 'تسوية المنازعات', 'مفاوضات التعريفات'],
  },
  {
    id: 'isesco',
    numericId: 3,
    nameEn: 'Islamic World Educational, Scientific and Cultural Organization',
    nameAr: 'منظمة العالم الإسلامي للتربية والعلوم والثقافة',
    acronym: 'ISESCO',
    typeEn: 'OIC Agency',
    typeAr: 'هيئة منظمة التعاون الإسلامي',
    headquartersEn: 'Rabat, Morocco',
    headquartersAr: 'الرباط، المغرب',
    memberStates: 53,
    activeMoUs: 2,
    website: 'https://www.isesco.org.ma',
    focusAreasEn: ['Education', 'Science', 'Culture', 'Heritage preservation'],
    focusAreasAr: ['التعليم', 'العلوم', 'الثقافة', 'حفظ التراث'],
  },
  {
    id: 'arab-league',
    numericId: 4,
    nameEn: 'League of Arab States',
    nameAr: 'جامعة الدول العربية',
    acronym: 'LAS',
    typeEn: 'Regional Organization',
    typeAr: 'منظمة إقليمية',
    headquartersEn: 'Cairo, Egypt',
    headquartersAr: 'القاهرة، مصر',
    memberStates: 22,
    activeMoUs: 5,
    website: 'https://www.lasportal.org',
    focusAreasEn: ['Arab economic integration', 'Political coordination', 'Joint summits'],
    focusAreasAr: ['التكامل الاقتصادي العربي', 'التنسيق السياسي', 'القمم المشتركة'],
  },
  {
    id: 'g20',
    numericId: 5,
    nameEn: 'Group of Twenty',
    nameAr: 'مجموعة العشرين',
    acronym: 'G20',
    typeEn: 'International Forum',
    typeAr: 'منتدى دولي',
    headquartersEn: 'Rotating presidency',
    headquartersAr: 'رئاسة متناوبة',
    memberStates: 19,
    activeMoUs: 0,
    website: 'https://www.g20.org',
    focusAreasEn: ['Global economy', 'Climate finance', 'Digital transformation'],
    focusAreasAr: ['الاقتصاد العالمي', 'تمويل المناخ', 'التحول الرقمي'],
  },
]

export const COMMITTEES: Committee[] = [
  {
    id: 'mining-2026',
    numericId: 1,
    nameEn: 'Joint Mining & Minerals Cooperation Committee',
    nameAr: 'اللجنة المشتركة للتعاون في التعدين والمعادن',
    typeId: 'joint-sectoral',
    chairEn: 'H.E. Bandar Al-Khorayef',
    chairAr: 'معالي بندر الخريف',
    members: 18,
    nextMeeting: '2026-08-07',
    status: 'scheduled',
    mandateEn: 'Oversee bilateral mining cooperation, investment frameworks, and critical minerals supply chains.',
    mandateAr: 'الإشراف على التعاون الثنائي في التعدين وأطر الاستثمار وسلاسل توريد المعادن الحيوية.',
  },
  {
    id: 'jec-2026',
    numericId: 2,
    nameEn: 'Joint Economic Committee — Jordan',
    nameAr: 'اللجنة الاقتصادية المشتركة — الأردن',
    typeId: 'bilateral',
    chairEn: 'Dr. Khaled Al-Ghamdi',
    chairAr: 'د. خالد الغامدي',
    members: 12,
    nextMeeting: '2026-08-08',
    status: 'active',
    mandateEn: 'Review trade, investment, and energy cooperation between Saudi Arabia and Jordan.',
    mandateAr: 'مراجعة التعاون التجاري والاستثماري والطاقة بين المملكة والأردن.',
  },
  {
    id: 'tiap-2026',
    numericId: 3,
    nameEn: 'Technology & Innovation Advisory Panel',
    nameAr: 'اللجنة الاستشارية للتكنولوجيا والابتكار',
    typeId: 'advisory',
    chairEn: 'Dr. Sara Al-Rashidi',
    chairAr: 'د. سارة الرشيدي',
    members: 15,
    nextMeeting: '2026-08-20',
    status: 'active',
    mandateEn: 'Advise on AI, cybersecurity, and digital infrastructure partnerships.',
    mandateAr: 'تقديم المشورة بشأن شراكات الذكاء الاصطناعي والأمن السيبراني والبنية التحتية الرقمية.',
  },
]

export const MEETINGS: Meeting[] = [
  {
    id: 'mtg-mining-2026-02',
    committeeId: 'mining-2026',
    titleEn: 'Mining Committee — 2nd Session 2026',
    titleAr: 'لجنة التعدين — الجلسة الثانية 2026',
    date: '2026-08-07',
    time: '10:00',
    locationEn: 'Conference Hall B, Ministry HQ, Riyadh',
    locationAr: 'قاعة المؤتمرات ب، مقر الوزارة، الرياض',
    agendaItems: 5,
    attendees: 14,
    status: 'upcoming',
  },
  {
    id: 'mtg-jec-2026-03',
    committeeId: 'jec-2026',
    titleEn: 'JEC 3rd Session 2026',
    titleAr: 'الجلسة الثالثة للجنة الاقتصادية المشتركة 2026',
    date: '2026-08-08',
    time: '09:30',
    locationEn: 'Jordan Embassy, Riyadh',
    locationAr: 'سفارة الأردن، الرياض',
    agendaItems: 7,
    attendees: 12,
    status: 'upcoming',
  },
  {
    id: 'mtg-mining-2026-01',
    committeeId: 'mining-2026',
    titleEn: 'Mining Committee — Inaugural Session',
    titleAr: 'لجنة التعدين — الجلسة الافتتاحية',
    date: '2026-05-15',
    time: '10:00',
    locationEn: 'Conference Hall A, Ministry HQ',
    locationAr: 'قاعة المؤتمرات أ، مقر الوزارة',
    agendaItems: 4,
    attendees: 16,
    status: 'completed',
  },
]

export const TASKS: Task[] = [
  {
    id: 'task-001',
    titleEn: 'Obtain Deputy Minister signature on China MoU renewal',
    titleAr: 'الحصول على توقيع نائب الوزير على تجديد مذكرة التفاهم مع الصين',
    assigneeEn: 'Eng. Fahad Al-Qahtani',
    assigneeAr: 'م. فهد القحطاني',
    dueDate: '2026-08-20',
    slaStatus: 'red',
    slaDaysRemaining: 14,
    priority: 'high',
    agreementId: 'agr-china-mou-draft',
    status: 'in_progress',
  },
  {
    id: 'task-002',
    titleEn: 'Prepare mining committee briefing pack',
    titleAr: 'إعداد حزمة إحاطة لجنة التعدين',
    assigneeEn: 'Dr. Noura Al-Harbi',
    assigneeAr: 'د. نورة الحربي',
    dueDate: '2026-08-06',
    slaStatus: 'yellow',
    slaDaysRemaining: 0,
    priority: 'high',
    committeeId: 'mining-2026',
    status: 'in_progress',
  },
  {
    id: 'task-003',
    titleEn: 'Legal review — Korea smart cities framework',
    titleAr: 'المراجعة القانونية — الإطار الكوري للمدن الذكية',
    assigneeEn: 'Legal Affairs Division',
    assigneeAr: 'إدارة الشؤون القانونية',
    dueDate: '2026-08-25',
    slaStatus: 'yellow',
    slaDaysRemaining: 19,
    priority: 'medium',
    agreementId: 'agr-korea-framework',
    status: 'open',
  },
  {
    id: 'task-004',
    titleEn: 'Archive expired France LoI documentation',
    titleAr: 'أرشفة وثائق خطاب نوايا فرنسا المنتهي',
    assigneeEn: 'Ms. Lina Al-Shehri',
    assigneeAr: 'أ. لينا الشهري',
    dueDate: '2026-08-15',
    slaStatus: 'green',
    slaDaysRemaining: 9,
    priority: 'low',
    agreementId: 'agr-france-loi',
    status: 'open',
  },
  {
    id: 'task-005',
    titleEn: 'Submit Q3 bilateral cooperation report to Cabinet',
    titleAr: 'تقديم تقرير التعاون الثنائي للربع الثالث إلى مجلس الوزراء',
    assigneeEn: 'M. Ahmed Al-Mohammed',
    assigneeAr: 'م. أحمد المحمد',
    dueDate: '2026-09-01',
    slaStatus: 'green',
    slaDaysRemaining: 26,
    priority: 'medium',
    status: 'open',
  },
  {
    id: 'task-006',
    titleEn: 'Coordinate Japan hydrogen delegation visit',
    titleAr: 'تنسيق زيارة وفد الهيدروجين الياباني',
    assigneeEn: 'Dr. Noura Al-Harbi',
    assigneeAr: 'د. نورة الحربي',
    dueDate: '2026-08-12',
    slaStatus: 'green',
    slaDaysRemaining: 6,
    priority: 'medium',
    agreementId: 'agr-japan-moc',
    status: 'in_progress',
  },
]

export const AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-08-01 10:30',
    user: 'admin',
    actionEn: 'Created MoU draft',
    actionAr: 'إنشاء مذكرة تفاهم',
    ipAddress: '192.168.1.1',
    module: 'agreements',
  },
  {
    id: 'log-002',
    timestamp: '2026-08-02 14:15',
    user: 'f.alqahtani',
    actionEn: 'Updated China MoU renewal draft',
    actionAr: 'تحديث مسودة تجديد مذكرة التفاهم مع الصين',
    ipAddress: '192.168.1.45',
    module: 'agreements',
  },
  {
    id: 'log-003',
    timestamp: '2026-08-03 09:00',
    user: 'n.alharbi',
    actionEn: 'Uploaded mining committee briefing pack',
    actionAr: 'رفع حزمة إحاطة لجنة التعدين',
    ipAddress: '10.0.2.88',
    module: 'documents',
  },
  {
    id: 'log-004',
    timestamp: '2026-08-04 16:45',
    user: 'admin',
    actionEn: 'Granted delegation authority to M. Ahmed Al-Mohammed',
    actionAr: 'منح صلاحية التفويض لم. أحمد المحمد',
    ipAddress: '192.168.1.1',
    module: 'delegations',
  },
  {
    id: 'log-005',
    timestamp: '2026-08-05 11:20',
    user: 's.aldosari',
    actionEn: 'Submitted Korea framework for legal review',
    actionAr: 'إحالة الإطار الكوري للمراجعة القانونية',
    ipAddress: '192.168.2.12',
    module: 'agreements',
  },
  {
    id: 'log-006',
    timestamp: '2026-08-06 08:00',
    user: 'system',
    actionEn: 'SAP C4C sync completed — 47 contact records updated',
    actionAr: 'اكتملت مزامنة SAP C4C — تحديث 47 سجل اتصال',
    ipAddress: '10.0.0.1',
    module: 'integrations',
  },
]

export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-104',
    ticketNumber: 'TKT-104',
    subjectEn: 'Cannot access Document Center — permission denied',
    subjectAr: 'تعذر الوصول إلى مركز الوثائق — رفض الصلاحية',
    requesterEn: 'Eng. Fahad Al-Qahtani',
    requesterAr: 'م. فهد القحطاني',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2026-08-05T11:30:00+03:00',
    categoryEn: 'Access & Permissions',
    categoryAr: 'الوصول والصلاحيات',
  },
  {
    id: 'tkt-101',
    ticketNumber: 'TKT-101',
    subjectEn: 'Laserfiche OCR not processing Arabic documents',
    subjectAr: 'التعرف الضوئي في Laserfiche لا يعالج الوثائق العربية',
    requesterEn: 'Document Center Team',
    requesterAr: 'فريق مركز الوثائق',
    status: 'open',
    priority: 'medium',
    createdAt: '2026-08-03T09:15:00+03:00',
    categoryEn: 'Integrations',
    categoryAr: 'التكاملات',
  },
  {
    id: 'tkt-102',
    ticketNumber: 'TKT-102',
    subjectEn: 'Power BI dashboard shows stale KPI data',
    subjectAr: 'لوحة Power BI تعرض بيانات مؤشرات قديمة',
    requesterEn: 'Reports Division',
    requesterAr: 'إدارة التقارير',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2026-08-01T14:00:00+03:00',
    categoryEn: 'Reporting',
    categoryAr: 'التقارير',
  },
  {
    id: 'tkt-103',
    ticketNumber: 'TKT-103',
    subjectEn: 'Nafath SSO timeout on mobile devices',
    subjectAr: 'انتهاء مهلة تسجيل الدخول عبر نفاذ على الأجهزة المحمولة',
    requesterEn: 'IT Security',
    requesterAr: 'أمن تقنية المعلومات',
    status: 'open',
    priority: 'critical',
    createdAt: '2026-08-04T16:20:00+03:00',
    categoryEn: 'Authentication',
    categoryAr: 'المصادقة',
  },
  {
    id: 'tkt-105',
    ticketNumber: 'TKT-105',
    subjectEn: 'ServiceNow workflow not triggering committee approval',
    subjectAr: 'سير عمل ServiceNow لا يُطلق موافقة اللجنة',
    requesterEn: 'Committees Secretariat',
    requesterAr: 'أمانة اللجان',
    status: 'open',
    priority: 'high',
    createdAt: '2026-08-06T07:45:00+03:00',
    categoryEn: 'Workflow',
    categoryAr: 'سير العمل',
  },
]

export const INTEGRATIONS: Integration[] = [
  {
    id: 'int-sap-c4c',
    nameEn: 'SAP Customer Experience (C4C)',
    nameAr: 'SAP Customer Experience (C4C)',
    provider: 'SAP',
    status: 'connected',
    lastSync: '2026-08-06T08:00:00+03:00',
    descriptionEn: 'CRM sync for diplomatic contacts, counterpart ministries, and visit tracking.',
    descriptionAr: 'مزامنة إدارة علاقات العملاء للاتصالات الدبلوماسية والوزارات النظيرة وتتبع الزيارات.',
  },
  {
    id: 'int-servicenow',
    nameEn: 'ServiceNow',
    nameAr: 'ServiceNow',
    provider: 'ServiceNow',
    status: 'connected',
    lastSync: '2026-08-06T07:30:00+03:00',
    descriptionEn: 'IT service management, approval workflows, and committee decision routing.',
    descriptionAr: 'إدارة خدمات تقنية المعلومات وسير عمل الموافقات وتوجيه قرارات اللجان.',
  },
  {
    id: 'int-sanayi',
    nameEn: 'Sanayi Platform',
    nameAr: 'منصة صناعي',
    provider: 'Ministry of Industry',
    status: 'connected',
    lastSync: '2026-08-05T22:00:00+03:00',
    descriptionEn: 'Industrial licensing, factory data, and investment opportunity feeds.',
    descriptionAr: 'تراخيص صناعية وبيانات المصانع وتغذية فرص الاستثمار.',
  },
  {
    id: 'int-investor-journey',
    nameEn: 'Investor Journey Platform',
    nameAr: 'رحلة المستثمر',
    provider: 'MISA',
    status: 'connected',
    lastSync: '2026-08-05T18:00:00+03:00',
    descriptionEn: 'Foreign investment pipeline, license status, and bilateral project registry.',
    descriptionAr: 'خط أنابيب الاستثمار الأجنبي وحالة التراخيص وسجل المشاريع الثنائية.',
  },
  {
    id: 'int-nafath',
    nameEn: 'Nafath (National SSO)',
    nameAr: 'نفاذ',
    provider: 'NIC',
    status: 'degraded',
    lastSync: '2026-08-06T06:00:00+03:00',
    descriptionEn: 'National digital identity and single sign-on for government employees.',
    descriptionAr: 'الهوية الرقمية الوطنية وتسجيل الدخول الموحد للموظفين الحكوميين.',
  },
  {
    id: 'int-powerbi',
    nameEn: 'Power BI',
    nameAr: 'Power BI',
    provider: 'Microsoft',
    status: 'connected',
    lastSync: '2026-08-05T23:45:00+03:00',
    descriptionEn: 'Executive dashboards, KPI reporting, and bilateral cooperation analytics.',
    descriptionAr: 'لوحات تنفيذية وتقارير مؤشرات الأداء وتحليلات التعاون الثنائي.',
  },
  {
    id: 'int-laserfiche',
    nameEn: 'Laserfiche ECM',
    nameAr: 'Laserfiche',
    provider: 'Laserfiche',
    status: 'disconnected',
    lastSync: '2026-08-04T12:00:00+03:00',
    descriptionEn: 'Enterprise content management, document archival, and OCR processing.',
    descriptionAr: 'إدارة المحتوى المؤسسي وأرشفة الوثائق والتعرف الضوئي على الحروف.',
  },
]

export const PROFILE: ProfileUser = {
  nameEn: 'M. Ahmed Al-Mohammed',
  nameAr: 'م. أحمد المحمد',
  titleEn: 'Director of International Cooperation',
  titleAr: 'مدير التعاون الدولي',
  email: 'admin@ministry.gov.sa',
  phone: '+966 11 401 5500',
  mobile: '+966 50 123 4567',
  altEmail: 'ahmed.alt@ministry.gov.sa',
  departmentEn: 'International Relations Directorate',
  departmentAr: 'إدارة العلاقات الدولية',
  ministryEn: 'Ministry of Industry and Mineral Resources',
  ministryAr: 'وزارة الصناعة والثروة المعدنية',
  role: 'system_admin',
  roleEn: 'Director of International Cooperation',
  roleAr: 'مدير التعاون الدولي',
  avatar: 'AM',
  lastLogin: '2026-08-06T07:55:00+03:00',
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-001',
    date: '2026-08-07',
    titleEn: 'Mining Committee — 2nd Session',
    titleAr: 'لجنة التعدين — الجلسة الثانية',
    type: 'committee',
    locationEn: 'Conference Hall B, Ministry HQ',
    locationAr: 'قاعة المؤتمرات ب، مقر الوزارة',
    attendees: 14,
  },
  {
    id: 'cal-002',
    date: '2026-08-08',
    titleEn: 'Joint Economic Committee — Jordan',
    titleAr: 'اللجنة الاقتصادية المشتركة — الأردن',
    type: 'committee',
    locationEn: 'Jordan Embassy, Riyadh',
    locationAr: 'سفارة الأردن، الرياض',
    attendees: 12,
  },
  {
    id: 'cal-003',
    date: '2026-08-12',
    titleEn: 'International Mining & Minerals Conference 2026',
    titleAr: 'مؤتمر التعدين والمعادن الدولي 2026',
    type: 'conference',
    locationEn: 'King Abdullah Financial District, Riyadh',
    locationAr: 'مركز الملك عبدالله المالي، الرياض',
    attendees: 350,
  },
  {
    id: 'cal-004',
    date: '2026-08-15',
    titleEn: 'China MoU Signing Ceremony (tentative)',
    titleAr: 'حفل توقيع مذكرة التفاهم مع الصين (مبدئي)',
    type: 'signing',
    locationEn: 'Ministry HQ — VIP Hall',
    locationAr: 'مقر الوزارة — القاعة الرئيسية',
    attendees: 40,
  },
  {
    id: 'cal-005',
    date: '2026-08-18',
    titleEn: 'Japanese Hydrogen Delegation Reception',
    titleAr: 'استقبال وفد الهيدروجين الياباني',
    type: 'reception',
    locationEn: 'Diplomatic Club, Riyadh',
    locationAr: 'النادي الدبلوماسي، الرياض',
    attendees: 25,
  },
  {
    id: 'cal-006',
    date: '2026-08-20',
    titleEn: 'TIAP Technical Workshop — AI Research Center',
    titleAr: 'ورشة TIAP الفنية — مركز بحوث الذكاء الاصطناعي',
    type: 'committee',
    locationEn: 'Innovation Hub, Riyadh',
    locationAr: 'مركز الابتكار، الرياض',
    attendees: 15,
  },
]

export const TOPICS: Topic[] = [
  {
    id: 'topic-001',
    titleEn: 'Lithium exploration framework with Australia',
    titleAr: 'إطار استكشاف الليثيوم مع أستراليا',
    committeeId: 'mining-2026',
    status: 'open',
    priority: 'high',
  },
  {
    id: 'topic-002',
    titleEn: 'Rare-earth supply chain MoU status',
    titleAr: 'حالة مذكرة التفاهم لسلسلة توريد المعادن النادرة',
    committeeId: 'mining-2026',
    status: 'discussed',
    priority: 'high',
  },
  {
    id: 'topic-003',
    titleEn: 'Green hydrogen investment pipeline — Jordan',
    titleAr: 'خط استثمار الهيدروجين الأخضر — الأردن',
    committeeId: 'jec-2026',
    status: 'open',
    priority: 'medium',
  },
  {
    id: 'topic-004',
    titleEn: 'AI research center feasibility study',
    titleAr: 'دراسة جدوى مركز بحوث الذكاء الاصطناعي',
    committeeId: 'tiap-2026',
    status: 'discussed',
    priority: 'high',
  },
]

export const ACTION_ITEMS: ActionItem[] = [
  {
    id: 'ai-001',
    titleEn: 'Circulate lithium framework draft to legal by 10 Aug',
    titleAr: 'إحالة مسودة إطار الليثيوم للقانونية بحلول 10 أغسطس',
    ownerEn: 'Mining Secretariat',
    ownerAr: 'أمانة التعدين',
    dueDate: '2026-08-10',
    meetingId: 'mtg-mining-2026-02',
    status: 'pending',
  },
  {
    id: 'ai-002',
    titleEn: 'Request MIIT counterpart confirmation for MoU signing date',
    titleAr: 'طلب تأكيد النظير في MIIT لتاريخ توقيع مذكرة التفاهم',
    ownerEn: 'Eng. Fahad Al-Qahtani',
    ownerAr: 'م. فهد القحطاني',
    dueDate: '2026-08-12',
    meetingId: 'mtg-mining-2026-01',
    status: 'in_progress',
  },
  {
    id: 'ai-003',
    titleEn: 'Update Q3 investment pipeline spreadsheet',
    titleAr: 'تحديث جدول خط أنابيب الاستثمار للربع الثالث',
    ownerEn: 'Investment Division',
    ownerAr: 'إدارة الاستثمار',
    dueDate: '2026-08-15',
    meetingId: 'mtg-mining-2026-02',
    status: 'pending',
  },
]

export const BENCHMARKING: BenchmarkMetric[] = [
  {
    id: 'bm-001',
    labelEn: 'Active bilateral agreements',
    labelAr: 'الاتفاقيات الثنائية النشطة',
    value: 314,
    target: 300,
    unit: '',
    trend: 'up',
    period: 'YTD 2026',
  },
  {
    id: 'bm-002',
    labelEn: 'MoU renewal rate',
    labelAr: 'معدل تجديد مذكرات التفاهم',
    value: 87,
    target: 90,
    unit: '%',
    trend: 'down',
    period: 'Rolling 12 months',
  },
  {
    id: 'bm-003',
    labelEn: 'Average committee session turnaround',
    labelAr: 'متوسط مدة إنجاز جلسات اللجان',
    value: 18,
    target: 21,
    unit: 'days',
    trend: 'up',
    period: 'Q2 2026',
  },
  {
    id: 'bm-004',
    labelEn: 'Diplomatic visits completed',
    labelAr: 'الزيارات الدبلوماسية المنجزة',
    value: 47,
    target: 50,
    unit: '',
    trend: 'stable',
    period: 'YTD 2026',
  },
  {
    id: 'bm-005',
    labelEn: 'Task SLA compliance',
    labelAr: 'الالتزام باتفاقية مستوى الخدمة للمهام',
    value: 92,
    target: 95,
    unit: '%',
    trend: 'up',
    period: 'Q2 2026',
  },
]

export const DECISIONS: Decision[] = [
  {
    id: 'dec-001',
    titleEn: 'Approve Joint AI Research Center Establishment',
    titleAr: 'الموافقة على إنشاء مركز بحوث الذكاء الاصطناعي المشترك',
    column: 'pending',
    committeeId: 'tiap-2026',
    date: '2026-08-20',
    votesFor: 8,
    votesAgainst: 2,
    priority: 'high',
  },
  {
    id: 'dec-002',
    titleEn: 'Ratify Green Hydrogen MoU Framework — Jordan',
    titleAr: 'التصديق على إطار مذكرة التفاهم للهيدروجين الأخضر — الأردن',
    column: 'approved',
    committeeId: 'jec-2026',
    date: '2026-08-08',
    votesFor: 11,
    votesAgainst: 0,
    priority: 'high',
  },
  {
    id: 'dec-003',
    titleEn: 'Extend Defense Cooperation Agreement — Iraq',
    titleAr: 'تمديد اتفاقية التعاون الدفاعي مع العراق',
    column: 'pending',
    committeeId: 'mining-2026',
    date: '2026-08-28',
    votesFor: 0,
    votesAgainst: 0,
    priority: 'high',
  },
  {
    id: 'dec-004',
    titleEn: 'Reject Climate MoU Draft — Insufficient Targets',
    titleAr: 'رفض مسودة مذكرة التفاهم المناخية — أهداف غير كافية',
    column: 'rejected',
    committeeId: 'jec-2026',
    date: '2026-07-28',
    votesFor: 2,
    votesAgainst: 8,
    priority: 'medium',
  },
  {
    id: 'dec-005',
    titleEn: 'Approve Scholarship Program Renewal — Jordan',
    titleAr: 'الموافقة على تجديد برنامج المنح الدراسية — الأردن',
    column: 'implemented',
    committeeId: 'jec-2026',
    date: '2026-07-15',
    votesFor: 8,
    votesAgainst: 0,
    priority: 'low',
  },
]

export const ARCHIVE_FOLDERS: ArchiveFolder[] = [
  {
    id: 'folder-mou-2024',
    nameEn: 'MoUs Signed 2024',
    nameAr: 'مذكرات التفاهم الموقعة 2024',
    fileCount: 42,
    lastModified: '2026-01-15',
  },
  {
    id: 'folder-committee-minutes',
    nameEn: 'Committee Minutes Archive',
    nameAr: 'أرشيف محاضر اللجان',
    fileCount: 156,
    lastModified: '2026-08-05',
  },
  {
    id: 'folder-expired',
    nameEn: 'Expired Agreements',
    nameAr: 'الاتفاقيات المنتهية',
    fileCount: 23,
    lastModified: '2026-08-01',
  },
]

export const ARCHIVE_FILES: ArchiveFile[] = [
  {
    id: 'file-001',
    folderId: 'folder-mou-2024',
    nameEn: 'MoU — Japan Energy Cooperation (signed)',
    nameAr: 'مذكرة تفاهم — التعاون الطاقوي مع اليابان (موقعة)',
    size: '2.4 MB',
    uploadedAt: '2025-11-20',
    uploadedBy: 'n.alharbi',
  },
  {
    id: 'file-002',
    folderId: 'folder-expired',
    nameEn: 'LoI — France Cultural Exchange (expired)',
    nameAr: 'خطاب نوايا — التبادل الثقافي مع فرنسا (منتهٍ)',
    size: '890 KB',
    uploadedAt: '2024-08-01',
    uploadedBy: 'l.alshehri',
  },
  {
    id: 'file-003',
    folderId: 'folder-committee-minutes',
    nameEn: 'Mining Committee — Inaugural Session Minutes',
    nameAr: 'محضر الجلسة الافتتاحية — لجنة التعدين',
    size: '1.1 MB',
    uploadedAt: '2026-05-16',
    uploadedBy: 'secretariat',
  },
]

export const MEDIA: MediaItem[] = [
  {
    id: 'media-001',
    titleEn: 'Saudi-Japan Hydrogen Summit — Opening Ceremony',
    titleAr: 'قمة الهيدروجين السعودية اليابانية — حفل الافتتاح',
    type: 'photo',
    date: '2026-06-10',
    countryId: 'japan',
    thumbnailUrl: '/media/hydrogen-summit-2026.jpg',
  },
  {
    id: 'media-002',
    titleEn: 'Mining Conference 2026 — Keynote Address',
    titleAr: 'مؤتمر التعدين 2026 — الكلمة الرئيسية',
    type: 'video',
    date: '2026-05-20',
    thumbnailUrl: '/media/mining-conference-keynote.mp4',
  },
  {
    id: 'media-003',
    titleEn: 'Press Release: China Industrial MoU Renewal Negotiations',
    titleAr: 'بيان صحفي: مفاوضات تجديد مذكرة التفاهم الصناعية مع الصين',
    type: 'press_release',
    date: '2026-07-28',
    countryId: 'china',
    thumbnailUrl: '/media/pr-china-mou-2026.pdf',
  },
]

export const AI_INSIGHTS: AiInsight[] = [
  {
    id: 'insight-001',
    titleEn: 'China MoU expiry risk — recommend early signing',
    titleAr: 'مخاطر انتهاء مذكرة التفاهم مع الصين — يُوصى بالتوقيع المبكر',
    summaryEn:
      'Based on historical renewal patterns, agreements with MIIT typically require 6–8 weeks from legal clearance to signature. Current timeline leaves only 5 weeks before expiry. Probability of lapse: 34%.',
    summaryAr:
      'بناءً على أنماط التجديد التاريخية، تتطلب الاتفاقيات مع MIIT عادة 6–8 أسابيع من اكتمال المراجعة القانونية حتى التوقيع. الجدول الحالي يترك 5 أسابيع فقط قبل انتهاء الصلاحية. احتمال التعثر: 34%.',
    confidence: 0.87,
    category: 'agreements',
    generatedAt: '2026-08-06T06:00:00+03:00',
  },
  {
    id: 'insight-002',
    titleEn: 'Mining committee attendance below quorum threshold',
    titleAr: 'حضور لجنة التعدين دون نصاب النصاب القانوني',
    summaryEn:
      '14 of 18 members confirmed for tomorrow\'s session. Quorum requires 10. Two key voting members (Ministry of Energy, PIF representative) have not RSVP\'d.',
    summaryAr:
      'أكد 14 من 18 عضواً حضور جلسة الغد. النصاب القانوني يتطلب 10. عضوان أساسيان (وزارة الطاقة وممثل صندوق الاستثمارات العامة) لم يؤكدا الحضور.',
    confidence: 0.92,
    category: 'committees',
    generatedAt: '2026-08-05T17:00:00+03:00',
  },
  {
    id: 'insight-003',
    titleEn: 'Bilateral visit surge expected in Q4',
    titleAr: 'توقع ارتفاع الزيارات الثنائية في الربع الرابع',
    summaryEn:
      'Calendar analysis shows 23% more diplomatic visits scheduled for Oct–Dec vs. Q3, driven by G20 follow-up meetings and National Day bilateral events.',
    summaryAr:
      'يُظهر تحليل التقويم زيادة 23% في الزيارات الدبلوماسية المجدولة لأكتوبر–ديسمبر مقارنة بالربع الثالث، مدفوعة باجتماعات متابعة مجموعة العشرين وفعاليات اليوم الوطني الثنائية.',
    confidence: 0.78,
    category: 'visits',
    generatedAt: '2026-08-04T12:00:00+03:00',
  },
]

export const ROLES_MATRIX: RoleMatrixEntry[] = [
  {
    roleId: 'executive',
    roleEn: 'Executive',
    roleAr: 'تنفيذي',
    permissions: [
      { module: 'dashboard', view: true, create: false, edit: false, delete: false, approve: true },
      { module: 'agreements', view: true, create: false, edit: false, delete: false, approve: true },
      { module: 'committees', view: true, create: false, edit: false, delete: false, approve: true },
      { module: 'decisions', view: true, create: false, edit: false, delete: false, approve: true },
      { module: 'documents', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'tasks', view: true, create: true, edit: false, delete: false, approve: true },
      { module: 'reports', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'admin', view: false, create: false, edit: false, delete: false, approve: false },
    ],
  },
  {
    roleId: 'committee_member',
    roleEn: 'Committee Member',
    roleAr: 'عضو لجنة',
    permissions: [
      { module: 'dashboard', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'agreements', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'committees', view: true, create: false, edit: true, delete: false, approve: false },
      { module: 'decisions', view: true, create: false, edit: false, delete: false, approve: true },
      { module: 'documents', view: true, create: true, edit: false, delete: false, approve: false },
      { module: 'tasks', view: true, create: true, edit: true, delete: false, approve: false },
      { module: 'reports', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'admin', view: false, create: false, edit: false, delete: false, approve: false },
    ],
  },
  {
    roleId: 'system_admin',
    roleEn: 'System Administrator',
    roleAr: 'مسؤول النظام',
    permissions: [
      { module: 'dashboard', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'agreements', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'committees', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'decisions', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'documents', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'tasks', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'reports', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'admin', view: true, create: true, edit: true, delete: true, approve: true },
    ],
  },
]

export const DELEGATIONS: Delegation[] = [
  {
    id: 'del-001',
    delegateEn: 'M. Ahmed Al-Mohammed',
    delegateAr: 'م. أحمد المحمد',
    principalEn: 'H.E. Deputy Minister for International Cooperation',
    principalAr: 'معالي نائب الوزير للتعاون الدولي',
    scopeEn: 'MoU signing authority up to SAR 50M; committee representation',
    scopeAr: 'صلاحية توقيع مذكرات التفاهم حتى 50 مليون ريال؛ تمثيل اللجان',
    validFrom: '2026-07-01',
    validTo: '2026-12-31',
    status: 'active',
  },
  {
    id: 'del-002',
    delegateEn: 'Eng. Fahad Al-Qahtani',
    delegateAr: 'م. فهد القحطاني',
    principalEn: 'Director of Industrial Cooperation',
    principalAr: 'مدير التعاون الصناعي',
    scopeEn: 'Draft agreement preparation and counterpart liaison — China, Korea',
    scopeAr: 'إعداد مسودات الاتفاقيات والتواصل مع النظراء — الصين، كوريا',
    validFrom: '2026-06-01',
    validTo: '2026-09-30',
    status: 'active',
  },
  {
    id: 'del-003',
    delegateEn: 'Dr. Noura Al-Harbi',
    delegateAr: 'د. نورة الحربي',
    principalEn: 'Director of Energy Partnerships',
    principalAr: 'مديرة شراكات الطاقة',
    scopeEn: 'Energy MoU negotiations — Japan, Germany',
    scopeAr: 'مفاوضات مذكرات التفاهم الطاقوية — اليابان، ألمانيا',
    validFrom: '2026-01-01',
    validTo: '2026-06-30',
    status: 'expired',
  },
]

export const COMMITTEE_TYPES: CommitteeType[] = [
  {
    id: 'joint-sectoral',
    labelEn: 'Joint Sectoral Committee',
    labelAr: 'لجنة قطاعية مشتركة',
    descriptionEn: 'Bilateral committee focused on a specific economic or industrial sector.',
    descriptionAr: 'لجنة ثنائية تركز على قطاع اقتصادي أو صناعي محدد.',
  },
  {
    id: 'bilateral',
    labelEn: 'Bilateral Economic Committee',
    labelAr: 'لجنة اقتصادية ثنائية',
    descriptionEn: 'Comprehensive economic cooperation committee with a partner country.',
    descriptionAr: 'لجنة تعاون اقتصادي شاملة مع دولة شريكة.',
  },
  {
    id: 'advisory',
    labelEn: 'Advisory Panel',
    labelAr: 'لجنة استشارية',
    descriptionEn: 'Expert advisory body providing recommendations on policy and strategy.',
    descriptionAr: 'هيئة استشارية خبيرة تقدم توصيات بشأن السياسات والاستراتيجيات.',
  },
  {
    id: 'steering',
    labelEn: 'Steering Committee',
    labelAr: 'لجنة توجيهية',
    descriptionEn: 'High-level oversight committee for major bilateral initiatives.',
    descriptionAr: 'لجنة إشراف عليا للمبادرات الثنائية الكبرى.',
  },
]

export const MEETING_TYPES: MeetingType[] = [
  { id: 'regular', labelEn: 'Regular Session', labelAr: 'جلسة عادية' },
  { id: 'extraordinary', labelEn: 'Extraordinary Session', labelAr: 'جلسة استثنائية' },
  { id: 'workshop', labelEn: 'Technical Workshop', labelAr: 'ورشة فنية' },
  { id: 'signing', labelEn: 'Signing Ceremony', labelAr: 'حفل توقيع' },
  { id: 'field-visit', labelEn: 'Field Visit', labelAr: 'زيارة ميدانية' },
]

export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl-mou-expiry',
    nameEn: 'MoU Expiry Warning',
    nameAr: 'تنبيه انتهاء مذكرة التفاهم',
    channel: 'all',
    subjectEn: 'Action Required: Agreement {{documentNumber}} expires in {{days}} days',
    subjectAr: 'إجراء مطلوب: تنتهي الاتفاقية {{documentNumber}} خلال {{days}} يوماً',
    bodyEn:
      'Dear {{recipientName}}, the agreement "{{title}}" with {{country}} expires on {{expiryDate}}. Please initiate renewal procedures or archive the document.',
    bodyAr:
      'عزيزي {{recipientName}}، تنتهي الاتفاقية "{{title}}" مع {{country}} في {{expiryDate}}. يُرجى بدء إجراءات التجديد أو أرشفة الوثيقة.',
  },
  {
    id: 'tpl-committee-reminder',
    nameEn: 'Committee Meeting Reminder',
    nameAr: 'تذكير باجتماع اللجنة',
    channel: 'email',
    subjectEn: 'Reminder: {{committeeName}} — {{date}} at {{time}}',
    subjectAr: 'تذكير: {{committeeName}} — {{date}} الساعة {{time}}',
    bodyEn:
      'This is a reminder that {{committeeName}} will convene on {{date}} at {{time}} in {{location}}. Please review the briefing pack in the Document Center.',
    bodyAr:
      'هذا تذكير بأن {{committeeName}} ستنعقد في {{date}} الساعة {{time}} في {{location}}. يُرجى مراجعة حزمة الإحاطة في مركز الوثائق.',
  },
  {
    id: 'tpl-decision-vote',
    nameEn: 'Decision Voting Request',
    nameAr: 'طلب التصويت على قرار',
    channel: 'portal',
    subjectEn: 'Vote Required: {{decisionTitle}}',
    subjectAr: 'تصويت مطلوب: {{decisionTitle}}',
    bodyEn:
      'A decision item "{{decisionTitle}}" requires your vote by {{deadline}}. Log in to the portal to cast your vote.',
    bodyAr:
      'يتطلب بند قرار "{{decisionTitle}}" تصويتك قبل {{deadline}}. سجّل الدخول إلى البوابة للإدلاء بصوتك.',
  },
  {
    id: 'tpl-task-overdue',
    nameEn: 'Task Overdue Alert',
    nameAr: 'تنبيه تأخر المهمة',
    channel: 'sms',
    subjectEn: 'Overdue Task: {{taskTitle}}',
    subjectAr: 'مهمة متأخرة: {{taskTitle}}',
    bodyEn: 'Task "{{taskTitle}}" was due on {{dueDate}} and is now overdue. SLA status: {{slaStatus}}.',
    bodyAr: 'المهمة "{{taskTitle}}" كان موعدها {{dueDate}} وهي الآن متأخرة. حالة SLA: {{slaStatus}}.',
  },
]
