import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  MapPin,
  Building2,
  FileSignature,
  Calendar,
  Tags,
  ListChecks,
  Radar,
  Users,
  PlusCircle,
  Presentation,
  BookOpen,
  FileText,
  Vote,
  GanttChart,
  Archive,
  BarChart2,
  Sparkles,
  Newspaper,
  CheckSquare,
  PenTool,
  Shield,
  ScrollText,
  Plug,
  Settings,
  LifeBuoy,
  Home,
  UserCircle,
} from 'lucide-react'

export type NavGroupId = 'general' | 'ir' | 'committees' | 'ops' | 'admin'

export interface NavItem {
  href: string
  labelAr: string
  labelEn: string
  icon: LucideIcon
  /** Paths that should highlight this item (prefix or exact) */
  matchPrefixes?: string[]
}

export interface NavGroup {
  id: NavGroupId
  labelAr: string
  labelEn: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'general',
    labelAr: 'عام',
    labelEn: 'General',
    items: [
      { href: '/portal', labelAr: 'بوابة الدخول', labelEn: 'Portal Hub', icon: Home },
      { href: '/profile', labelAr: 'الملف الشخصي', labelEn: 'Profile', icon: UserCircle },
    ],
  },
  {
    id: 'ir',
    labelAr: 'العلاقات الدولية',
    labelEn: 'International Relations',
    items: [
      { href: '/ir/dashboard', labelAr: 'لوحة العلاقات الدولية', labelEn: 'IR Dashboard', icon: LayoutDashboard },
      {
        href: '/ir/countries/korea',
        labelAr: 'ملفات الدول',
        labelEn: 'Country Profiles',
        icon: MapPin,
        matchPrefixes: ['/ir/countries'],
      },
      {
        href: '/ir/organizations/unido',
        labelAr: 'المنظمات الدولية',
        labelEn: 'Organizations',
        icon: Building2,
        matchPrefixes: ['/ir/organizations'],
      },
      { href: '/ir/agreements', labelAr: 'الاتفاقيات والمذكرات', labelEn: 'Agreements', icon: FileSignature },
      { href: '/ir/calendar', labelAr: 'التقويم الدبلوماسي', labelEn: 'Calendar', icon: Calendar },
      { href: '/ir/topics', labelAr: 'المواضيع الاستراتيجية', labelEn: 'Topics', icon: Tags },
      { href: '/ir/action-items', labelAr: 'بنود العمل', labelEn: 'Action Items', icon: ListChecks },
      { href: '/ir/benchmarking', labelAr: 'المقارنة المعيارية', labelEn: 'Benchmarking', icon: Radar },
    ],
  },
  {
    id: 'committees',
    labelAr: 'اللجان والمجالس',
    labelEn: 'Committees',
    items: [
      { href: '/committees/dashboard', labelAr: 'لوحة اللجان', labelEn: 'Committees Dashboard', icon: Users },
      { href: '/committees/meetings/new', labelAr: 'إنشاء اجتماع', labelEn: 'New Meeting', icon: PlusCircle },
      {
        href: '/committees/meetings/mining-2026/workspace',
        labelAr: 'مساحة الاجتماع',
        labelEn: 'Meeting Workspace',
        icon: Presentation,
        matchPrefixes: ['/committees/meetings/'],
      },
      {
        href: '/committees/meetings/mining-2026/read',
        labelAr: 'قراءة الوثائق',
        labelEn: 'Document Reader',
        icon: BookOpen,
      },
      {
        href: '/committees/minutes/mining-2026',
        labelAr: 'المحاضر',
        labelEn: 'Minutes',
        icon: FileText,
        matchPrefixes: ['/committees/minutes'],
      },
      {
        href: '/committees/voting/mining-2026',
        labelAr: 'التصويت',
        labelEn: 'Voting',
        icon: Vote,
        matchPrefixes: ['/committees/voting'],
      },
      { href: '/committees/decisions', labelAr: 'القرارات', labelEn: 'Decisions', icon: GanttChart },
      { href: '/committees/matrix', labelAr: 'مصفوفة المتابعة', labelEn: 'Follow-up Matrix', icon: LayoutDashboard },
    ],
  },
  {
    id: 'ops',
    labelAr: 'العمليات والتحليلات',
    labelEn: 'Operations',
    items: [
      { href: '/archive', labelAr: 'الأرشيف الرقمي', labelEn: 'Archive', icon: Archive },
      { href: '/reports', labelAr: 'التقارير', labelEn: 'Reports', icon: BarChart2 },
      { href: '/ai-insights', labelAr: 'رؤى الذكاء الاصطناعي', labelEn: 'AI Insights', icon: Sparkles },
      { href: '/media-center', labelAr: 'المركز الإعلامي', labelEn: 'Media Center', icon: Newspaper },
      { href: '/tasks', labelAr: 'المهام الشاملة', labelEn: 'Tasks', icon: CheckSquare },
    ],
  },
  {
    id: 'admin',
    labelAr: 'الإدارة والأمن',
    labelEn: 'Admin & Security',
    items: [
      { href: '/admin/signatures', labelAr: 'التوقيع الرقمي', labelEn: 'Signatures', icon: PenTool },
      { href: '/admin/users', labelAr: 'المستخدمون والصلاحيات', labelEn: 'Users & RBAC', icon: Shield },
      { href: '/admin/audit', labelAr: 'سجلات التدقيق', labelEn: 'Audit Logs', icon: ScrollText },
      { href: '/admin/integrations', labelAr: 'التكاملات', labelEn: 'Integrations', icon: Plug },
      { href: '/admin/settings', labelAr: 'إعدادات النظام', labelEn: 'Settings', icon: Settings },
      { href: '/support', labelAr: 'الدعم الفني', labelEn: 'Support', icon: LifeBuoy },
    ],
  },
]

/** Arabic breadcrumb segment labels by path segment */
export const BREADCRUMB_LABELS: Record<string, string> = {
  portal: 'الرئيسية',
  profile: 'الملف الشخصي',
  ir: 'العلاقات الدولية',
  dashboard: 'لوحة التحكم',
  countries: 'ملفات الدول',
  organizations: 'المنظمات',
  agreements: 'الاتفاقيات',
  calendar: 'التقويم',
  topics: 'المواضيع',
  'action-items': 'بنود العمل',
  benchmarking: 'المقارنة المعيارية',
  committees: 'المجالس واللجان',
  meetings: 'الاجتماعات',
  new: 'إنشاء اجتماع',
  workspace: 'تفاصيل الاجتماع',
  read: 'قراءة الوثائق',
  minutes: 'المحاضر',
  voting: 'التصويت',
  decisions: 'القرارات',
  matrix: 'مصفوفة المتابعة',
  archive: 'الأرشيف',
  reports: 'التقارير',
  'ai-insights': 'رؤى الذكاء الاصطناعي',
  'media-center': 'المركز الإعلامي',
  tasks: 'المهام',
  admin: 'الإدارة',
  signatures: 'التوقيع الرقمي',
  users: 'المستخدمون',
  audit: 'سجلات التدقيق',
  integrations: 'التكاملات',
  settings: 'الإعدادات',
  support: 'الدعم الفني',
  korea: 'جمهورية كوريا الجنوبية',
  unido: 'منظمة اليونيدو',
  'mining-2026': 'لجنة التعدين 2026',
  '1': 'التفاصيل',
}

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (pathname === item.href) return true
  if (item.matchPrefixes?.some((p) => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p))) {
    // Prefer more specific workspace/read split
    if (item.href.includes('/workspace') && pathname.includes('/read')) return false
    if (item.href.includes('/read') && pathname.includes('/workspace')) return false
    if (item.href.includes('/new') && pathname.includes('/meetings/') && !pathname.endsWith('/new')) return false
    return true
  }
  return false
}
