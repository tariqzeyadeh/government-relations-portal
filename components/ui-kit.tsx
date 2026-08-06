'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[var(--color-text-muted)]">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function ViewAllLink({ href, label = 'عرض الكل' }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="text-xs font-medium text-[var(--color-brand)] no-underline hover:underline"
    >
      {label} (View All)
    </Link>
  )
}

export function SectionTitle({
  title,
  viewAllHref,
}: {
  title: string
  viewAllHref?: string
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-sm font-semibold text-[var(--color-text)]">{title}</h2>
      {viewAllHref && <ViewAllLink href={viewAllHref} />}
    </div>
  )
}

export function KpiCard({
  label,
  value,
  href,
  hint,
}: {
  label: string
  value: string | number
  href?: string
  hint?: string
}) {
  const inner = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        'card card-hover cursor-pointer p-4',
        href && 'hover:border-[var(--color-brand)]',
      )}
    >
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[var(--color-brand)]">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">{hint}</p>}
    </motion.div>
  )
  return href ? (
    <Link href={href} className="block no-underline">
      {inner}
    </Link>
  ) : (
    inner
  )
}

export function SlaBadge({ status, label }: { status: 'red' | 'yellow' | 'green'; label?: string }) {
  const map = {
    red: { bg: 'bg-red-500/15 text-red-700 dark:text-red-300', text: label ?? 'خطر التأخير' },
    yellow: { bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300', text: label ?? 'تحذير' },
    green: { bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300', text: label ?? 'ضمن الوقت' },
  }
  const m = map[status]
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${m.bg}`}>
      {m.text}
    </span>
  )
}

export function EmptyHint({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[var(--color-text-muted)]">{children}</p>
}
