'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type UserRole = 'executive' | 'committee_member' | 'system_admin'
export type Language = 'en' | 'ar'
export type ActiveTab =
  | 'dashboard'
  | 'countries'
  | 'organizations'
  | 'committees'
  | 'documents'
  | 'tasks'
  | 'visits'
  | 'decisions'
  | 'reports'

export interface AppUser {
  name: string
  role: UserRole
  email: string
  avatar: string
  ministry: string
}

interface AppContextType {
  isLoggedIn: boolean
  user: AppUser | null
  darkMode: boolean
  language: Language
  activeTab: ActiveTab
  notifications: number
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  login: (role: UserRole) => void
  logout: () => void
  toggleDarkMode: () => void
  toggleLanguage: () => void
  setActiveTab: (tab: ActiveTab) => void
  t: (key: string) => string
}

const USERS: Record<UserRole, AppUser> = {
  executive: {
    name: 'H.E. Ahmed Al-Mansouri',
    role: 'executive',
    email: 'a.almansouri@mofa.gov',
    avatar: 'AM',
    ministry: 'Ministry of Foreign Affairs',
  },
  committee_member: {
    name: 'Dr. Sara Al-Rashidi',
    role: 'committee_member',
    email: 's.alrashidi@mofa.gov',
    avatar: 'SR',
    ministry: 'International Cooperation Division',
  },
  system_admin: {
    name: 'Eng. Khalid Ibrahim',
    role: 'system_admin',
    email: 'k.ibrahim@mofa.gov',
    avatar: 'KI',
    ministry: 'IT & Digital Transformation',
  },
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    countries: 'Country Profiles',
    organizations: 'Organizations & MoUs',
    committees: 'Committees & Meetings',
    documents: 'Document Center',
    tasks: 'Task Management',
    visits: 'Visits & Events',
    decisions: 'Decisions & Voting',
    reports: 'Reports & KPIs',
    logout: 'Sign Out',
    darkMode: 'Dark Mode',
    language: 'العربية',
    notifications: 'Notifications',
    profile: 'My Profile',
    settings: 'Settings',
    welcome: 'Welcome back',
    ministry: 'Ministry of Foreign Affairs',
    portalTitle: 'GovIR Portal',
    portalSubtitle: 'International Relations & Committee Management',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    countries: 'ملفات الدول',
    organizations: 'المنظمات ومذكرات التفاهم',
    committees: 'اللجان والاجتماعات',
    documents: 'مركز الوثائق',
    tasks: 'إدارة المهام',
    visits: 'الزيارات والمناسبات',
    decisions: 'القرارات والتصويت',
    reports: 'التقارير ومؤشرات الأداء',
    logout: 'تسجيل الخروج',
    darkMode: 'الوضع المظلم',
    language: 'English',
    notifications: 'الإشعارات',
    profile: 'ملفي الشخصي',
    settings: 'الإعدادات',
    welcome: 'مرحباً بعودتك',
    ministry: 'وزارة الشؤون الخارجية',
    portalTitle: 'بوابة العلاقات الدولية',
    portalSubtitle: 'إدارة العلاقات الدولية واللجان',
  },
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<AppUser | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
  const [notifications] = useState(5)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev)

  const login = (role: UserRole) => {
    setUser(USERS[role])
    setIsLoggedIn(true)
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setActiveTab('dashboard')
  }

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
      return next
    })
  }

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'ar' : 'en'
      document.documentElement.setAttribute('lang', next)
      document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr')
      return next
    })
  }

  const t = (key: string): string => TRANSLATIONS[language][key] ?? key

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        user,
        darkMode,
        language,
        activeTab,
        notifications,
        sidebarCollapsed,
        toggleSidebar,
        login,
        logout,
        toggleDarkMode,
        toggleLanguage,
        setActiveTab,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
