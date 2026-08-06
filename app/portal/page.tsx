'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Globe, Users, CheckSquare, FileSignature, Bell, BellOff,
  TrendingUp, AlertTriangle, Info,
} from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { PORTAL_ALERTS, AGREEMENTS, TASKS, COMMITTEES } from '@/lib/mock-data'
import { KpiCard, SectionTitle, SlaBadge, PageHeader } from '@/components/ui-kit'

const SEVERITY_STYLES = {
  high: 'border-s-4 border-red-400 bg-red-500/8',
  medium: 'border-s-4 border-amber-400 bg-amber-500/8',
  low: 'border-s-4 border-emerald-400 bg-emerald-500/8',
}

const SEVERITY_ICONS = {
  high: AlertTriangle,
  medium: Bell,
  low: Info,
}

const SEVERITY_AR = { high: 'عالي', medium: 'متوسط', low: 'منخفض' }

export default function PortalPage() {
  const { user, language, showToast } = useApp()
  const isAr = language === 'ar'
  const [readAlerts, setReadAlerts] = useState<Set<string>>(new Set())

  const markRead = (id: string) => {
    setReadAlerts((prev) => new Set([...prev, id]))
    showToast('تم تعليم التنبيه كمقروء')
  }

  const unread = PORTAL_ALERTS.filter((a) => !readAlerts.has(a.id))

  const activeAgreements = AGREEMENTS.filter((a) => a.status === 'active').length
  const openTasks = TASKS.filter((t) => t.status !== 'completed').length
  const upcomingCount = COMMITTEES.filter((c) => c.status !== 'concluded').length
  const partnerCountries = [...new Set(AGREEMENTS.map((a) => a.countryId))].length

  const heroLinks = [
    {
      icon: Globe,
      title: isAr ? 'لوحة العلاقات الدولية' : 'IR Dashboard',
      desc: isAr ? 'الاتفاقيات والدول والمؤشرات' : 'Agreements, countries, KPIs',
      href: '/ir/dashboard',
      color: 'var(--color-brand)',
      bg: 'rgba(47,169,224,0.12)',
    },
    {
      icon: Users,
      title: isAr ? 'اللجان والمجالس' : 'Committees',
      desc: isAr ? 'جلسات ومقررات وقرارات اللجان' : 'Sessions, minutes, decisions',
      href: '/committees/dashboard',
      color: 'var(--color-brand2)',
      bg: 'rgba(22,145,208,0.12)',
    },
    {
      icon: CheckSquare,
      title: isAr ? 'المهام الشاملة' : 'Tasks',
      desc: isAr ? 'متابعة المهام واتفاقيات مستوى الخدمة' : 'Track tasks and SLA',
      href: '/tasks',
      color: '#3b82f6',
      bg: '#3b82f618',
    },
    {
      icon: FileSignature,
      title: isAr ? 'الاتفاقيات والمذكرات' : 'Agreements',
      desc: isAr ? 'مذكرات التفاهم والاتفاقيات النشطة' : 'MoUs, frameworks, active',
      href: '/ir/agreements',
      color: '#8b5cf6',
      bg: '#8b5cf618',
    },
  ]

  const today = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Greeting hero — solid Committee brand gradient, readable white text */}
      <div
        className="rounded-xl p-6 text-white shadow-md"
        style={{
          background: 'linear-gradient(135deg, #15508a 0%, #1691d0 45%, #2fa9e0 100%)',
        }}
      >
        <p className="text-sm text-white/80">{today}</p>
        <h1 className="mt-1 text-2xl font-bold text-white">مرحباً، {user?.nameAr ?? 'م. أحمد المحمد'}</h1>
        <p className="mt-0.5 text-sm text-white/85">{user?.roleAr ?? 'مدير التعاون الدولي'}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {openTasks} مهام مفتوحة
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {unread.length} تنبيهات جديدة
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label={isAr ? 'الاتفاقيات النشطة' : 'Active Agreements'}
          value={activeAgreements}
          href="/ir/agreements"
          hint={isAr ? 'اضغط للعرض' : 'Click to view'}
        />
        <KpiCard
          label={isAr ? 'الدول الشريكة' : 'Partner Countries'}
          value={partnerCountries}
          href="/ir/countries"
          hint={isAr ? 'دولة في الشبكة' : 'in network'}
        />
        <KpiCard
          label={isAr ? 'المهام المفتوحة' : 'Open Tasks'}
          value={openTasks}
          href="/tasks"
          hint={isAr ? 'تتطلب المتابعة' : 'require follow-up'}
        />
        <KpiCard
          label={isAr ? 'اجتماعات قادمة' : 'Upcoming Meetings'}
          value={upcomingCount}
          href="/committees/meetings/new"
          hint={isAr ? 'هذا الشهر' : 'this month'}
        />
      </div>

      {/* Quick access */}
      <div>
        <SectionTitle title={isAr ? 'الوصول السريع' : 'Quick Access'} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {heroLinks.map(({ icon: Icon, title, desc, href, color, bg }) => (
            <Link key={href} href={href} className="no-underline">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="card cursor-pointer p-5"
                style={{ transition: 'transform 180ms ease-out, box-shadow 180ms ease-out' }}
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: bg }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <p className="text-sm font-semibold text-[var(--color-text)]">{title}</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alerts panel */}
        <div className="lg:col-span-2">
          <SectionTitle
            title={isAr ? `التنبيهات (${unread.length})` : `Alerts (${unread.length})`}
            viewAllHref="/ir/agreements"
          />
          {unread.length === 0 ? (
            <div className="card p-8 text-center">
              <BellOff size={32} className="mx-auto mb-2 opacity-30 text-[var(--color-text-muted)]" />
              <p className="text-sm text-[var(--color-text-muted)]">لا توجد تنبيهات جديدة</p>
            </div>
          ) : (
            <div className="space-y-2">
              {unread.map((alert) => {
                const SIcon = SEVERITY_ICONS[alert.severity]
                return (
                  <div
                    key={alert.id}
                    className={`card overflow-hidden ${SEVERITY_STYLES[alert.severity]} p-4`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <SIcon size={13} className="shrink-0 text-[var(--color-text-muted)]" />
                          <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                            {isAr ? SEVERITY_AR[alert.severity] : alert.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {new Date(alert.timestamp).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[var(--color-text)]">
                          {isAr ? alert.titleAr : alert.titleEn}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {isAr ? alert.summaryAr : alert.summaryEn}
                        </p>
                      </div>
                      <button
                        onClick={() => markRead(alert.id)}
                        className="btn btn-ghost h-8 shrink-0 border-[var(--color-border)] px-3 text-xs hover:bg-[var(--color-bg)]"
                      >
                        تعليم كمقروء
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent tasks */}
        <div>
          <SectionTitle title={isAr ? 'المهام الأخيرة' : 'Recent Tasks'} viewAllHref="/tasks" />
          <div className="card divide-y divide-[var(--color-border)] overflow-hidden">
            {TASKS.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-2 p-3 hover:bg-[var(--color-bg)] cursor-pointer transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-[var(--color-text)]">
                    {isAr ? task.titleAr : task.titleEn}
                  </p>
                  <p className="truncate text-[11px] text-[var(--color-text-muted)]">
                    {isAr ? task.assigneeAr : task.assigneeEn}
                  </p>
                </div>
                <SlaBadge status={task.slaStatus} />
              </div>
            ))}
            <div className="p-3 text-center">
              <Link href="/tasks" className="text-xs font-medium text-[var(--color-brand)] hover:underline no-underline">
                عرض كل المهام →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Agreements quick view */}
      <div>
        <SectionTitle
          title={isAr ? 'أحدث الاتفاقيات' : 'Latest Agreements'}
          viewAllHref="/ir/agreements"
        />
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                <th className="p-3 text-start font-medium">رقم الوثيقة</th>
                <th className="p-3 text-start font-medium">الاتفاقية</th>
                <th className="p-3 text-start font-medium">الطرف الثاني</th>
                <th className="p-3 text-start font-medium">المرحلة</th>
                <th className="p-3 text-start font-medium">SLA</th>
              </tr>
            </thead>
            <tbody>
              {AGREEMENTS.slice(0, 4).map((agr) => (
                <tr
                  key={agr.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)] cursor-pointer transition-colors"
                >
                  <td className="p-3 font-mono text-xs text-[var(--color-text-muted)]">
                    {agr.documentNumber}
                  </td>
                  <td className="p-3 font-medium text-[var(--color-text)]">
                    {isAr ? agr.titleAr : agr.titleEn}
                  </td>
                  <td className="p-3 text-[var(--color-text-muted)]">
                    {isAr ? agr.countryNameAr : agr.countryNameEn}
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      agr.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      agr.status === 'draft' ? 'bg-blue-100 text-blue-700' :
                      agr.status === 'expired' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {agr.status === 'active' ? 'نشط' : agr.status === 'draft' ? 'مسودة' :
                       agr.status === 'expired' ? 'منتهٍ' : 'قيد المراجعة'}
                    </span>
                  </td>
                  <td className="p-3">
                    <SlaBadge status={agr.slaStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
