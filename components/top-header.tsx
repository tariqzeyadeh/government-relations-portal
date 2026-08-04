'use client'

import { Bell, Sun, Moon, Globe, ChevronDown, Search, Settings, User, LogOut } from 'lucide-react'
import Image from 'next/image'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

const NOTIFICATIONS = [
  {
    id: 1,
    text: 'Joint Committee meeting scheduled for Aug 15',
    textAr: 'اجتماع اللجنة المشتركة مجدول في 15 أغسطس',
    type: 'meeting',
    time: '2h ago',
    timeAr: 'منذ ساعتين',
  },
  {
    id: 2,
    text: 'New MoU with Republic of Korea pending signature',
    textAr: 'مذكرة تفاهم جديدة مع جمهورية كوريا بانتظار التوقيع',
    type: 'mou',
    time: '4h ago',
    timeAr: 'منذ 4 ساعات',
  },
  {
    id: 3,
    text: 'Country profile update required: Germany',
    textAr: 'مطلوب تحديث ملف الدولة: ألمانيا',
    type: 'update',
    time: '1d ago',
    timeAr: 'منذ يوم',
  },
  {
    id: 4,
    text: 'Document review deadline: Economic Partnership',
    textAr: 'موعد مراجعة الوثيقة: الشراكة الاقتصادية',
    type: 'deadline',
    time: '2d ago',
    timeAr: 'منذ يومين',
  },
  {
    id: 5,
    text: 'Diplomatic visit: French delegation arriving Aug 20',
    textAr: 'زيارة دبلوماسية: الوفد الفرنسي يصل في 20 أغسطس',
    type: 'visit',
    time: '2d ago',
    timeAr: 'منذ يومين',
  },
]

const PAGE_TITLES: Record<string, { en: string; ar: string }> = {
  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  countries: { en: 'Country Profiles', ar: 'ملفات الدول' },
  organizations: { en: 'Organizations & MoUs', ar: 'المنظمات ومذكرات التفاهم' },
  committees: { en: 'Committees & Meetings', ar: 'اللجان والاجتماعات' },
  documents: { en: 'Document Center', ar: 'مركز الوثائق' },
  tasks: { en: 'Task Management', ar: 'إدارة المهام' },
  visits: { en: 'Visits & Events', ar: 'الزيارات والمناسبات' },
  decisions: { en: 'Decisions & Voting', ar: 'القرارات والتصويت' },
  reports: { en: 'Reports & KPIs', ar: 'التقارير ومؤشرات الأداء' },
}

const TYPE_DOT: Record<string, string> = {
  meeting: 'bg-blue-500',
  mou: 'bg-amber-500',
  update: 'bg-violet-500',
  deadline: 'bg-red-500',
  visit: 'bg-emerald-500',
}

export function TopHeader() {
  const { darkMode, toggleDarkMode, language, toggleLanguage, user, logout, activeTab, notifications } = useApp()
  const isRtl = language === 'ar'
  const page = PAGE_TITLES[activeTab] ?? { en: '', ar: '' }

  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 px-4 flex flex-row justify-between items-center border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] z-50"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Left: Etimad logo + breadcrumb title */}
      <div className={cn('flex items-center gap-3 flex-shrink-0', isRtl && 'flex-row-reverse')}>
        <div className="flex items-center justify-center shrink-0">
          <Image
            src="/etimad-logo.png"
            alt="Etimad"
            width={100}
            height={56}
            className="object-contain"
            priority
          />
        </div>
        <div className={cn('hidden sm:block border-l border-[var(--color-border)] pl-3', isRtl ? 'text-right border-l-0 border-r pr-3 pl-0' : 'text-left')}>
          <div className="text-[10px] text-[var(--color-text-muted)] leading-none">
            {isRtl ? page.ar : page.en}
          </div>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center gap-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] focus-within:bg-[var(--color-surface-elevated)] rounded-[var(--radius-md)] px-3.5 py-2 w-52 lg:w-72 border border-[var(--color-border)] transition-colors duration-150">
        <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
        <input
          type="text"
          placeholder={isRtl ? 'بحث...' : 'Search anything...'}
          className="bg-transparent text-[13px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] flex-1 outline-none min-w-0"
          aria-label="Search"
        />
      </div>

      {/* Right: Controls */}
      <div className={cn('flex items-center gap-2 flex-shrink-0', isRtl && 'flex-row-reverse')}>
        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          title="Toggle language"
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--color-text)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:border-[var(--color-brand)] transition-all duration-200 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{isRtl ? 'EN' : 'AR'}</span>
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          title={darkMode ? 'Light mode' : 'Dark mode'}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="cursor-pointer p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] transition-colors duration-200 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative group">
          <button
            className="relative cursor-pointer p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] transition-colors duration-200 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            aria-label={`Notifications (${notifications} unread)`}
          >
            <Bell className="w-4 h-4" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[var(--color-surface-elevated)]" aria-hidden="true" />
            )}
          </button>
          {/* Dropdown */}
          <div className={cn('absolute top-full mt-1 w-80 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] hidden group-focus-within:block z-50', isRtl ? 'left-0' : 'right-0')}>
            <div className={cn('flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]', isRtl && 'flex-row-reverse')}>
              <span className="text-sm font-semibold text-[var(--color-text)]">
                {isRtl ? 'الإشعارات' : 'Notifications'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-semibold">
                {notifications} {isRtl ? 'جديد' : 'new'}
              </span>
            </div>
            {NOTIFICATIONS.map((n) => (
              <div key={n.id} className={cn('flex items-start gap-3 py-3 px-4 hover:bg-[var(--color-surface)] cursor-pointer border-b border-[var(--color-border)] last:border-0', isRtl && 'flex-row-reverse text-right')}>
                <span className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', TYPE_DOT[n.type])} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[var(--color-text)] leading-relaxed">{isRtl ? n.textAr : n.text}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{isRtl ? n.timeAr : n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User profile */}
        {user && (
          <div className="relative group">
            <button
              className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] transition-all duration-150 border border-[var(--color-border)] cursor-pointer"
              aria-label="User menu"
            >
              <div className="w-7 h-7 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white text-[10px] font-bold shrink-0 ring-2 ring-[var(--color-brand)]/20">
                {user.avatar}
              </div>
              <div className={cn('hidden sm:block', isRtl ? 'text-right' : 'text-left')}>
                <div className="text-[12px] font-semibold text-[var(--color-text)] leading-tight">
                  {user.name.split(' ').slice(-2).join(' ')}
                </div>
                <div className="text-[10px] text-[var(--color-text-muted)] capitalize leading-none mt-0.5">
                  {user.role.replace('_', ' ')}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-[var(--color-text-muted)] hidden sm:block" />
            </button>
            {/* Dropdown */}
            <div className={cn('absolute top-full mt-1 w-52 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] hidden group-focus-within:block z-50', isRtl ? 'left-0' : 'right-0')}>
              <div className="px-4 py-3 border-b border-[var(--color-border)]">
                <div className="text-[13px] font-semibold text-[var(--color-text)]">{user.name}</div>
                <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{user.email}</div>
              </div>
              <div className="p-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[var(--color-text)] rounded-[var(--radius-sm)] hover:bg-[var(--color-surface)] transition-colors">
                  <User className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  {isRtl ? 'ملفي الشخصي' : 'My Profile'}
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[var(--color-text)] rounded-[var(--radius-sm)] hover:bg-[var(--color-surface)] transition-colors">
                  <Settings className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  {isRtl ? 'الإعدادات' : 'Settings'}
                </button>
                <div className="my-1 border-t border-[var(--color-border)]" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[var(--color-destructive)] rounded-[var(--radius-sm)] hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {isRtl ? 'تسجيل الخروج' : 'Sign Out'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
