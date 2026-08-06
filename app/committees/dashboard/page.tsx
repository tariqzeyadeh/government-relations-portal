'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, MapPin, Users, FileText, X, Plus,
  ChevronLeft, Clock, Vote, CheckSquare2, LayoutGrid,
} from 'lucide-react'
import { PageHeader, SectionTitle, KpiCard, SlaBadge, ViewAllLink } from '@/components/ui-kit'
import { COMMITTEES, MEETINGS, DECISIONS, TASKS } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'

const upcomingMeetings = MEETINGS.filter((m) => m.status === 'upcoming')
const pendingDecisions = DECISIONS.filter((d) => d.column === 'pending')
const activeTasks = TASKS.filter((t) => t.status === 'in_progress')

const STATUS_LABEL: Record<string, string> = {
  upcoming: 'قادم',
  in_progress: 'جارٍ الآن',
  completed: 'مكتمل',
  scheduled: 'مجدوَل',
  active: 'نشط',
  concluded: 'منتهٍ',
}
const STATUS_COLOR: Record<string, string> = {
  upcoming: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  in_progress: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  scheduled: 'bg-amber-500/15 text-amber-700',
  active: 'bg-emerald-500/15 text-emerald-700',
  concluded: 'bg-gray-500/15 text-gray-600',
}

export default function CommitteesDashboard() {
  const { showToast } = useApp()
  const [selectedMeeting, setSelectedMeeting] = useState<(typeof MEETINGS)[0] | null>(null)

  const getCommittee = (committeeId: string) => COMMITTEES.find((c) => c.id === committeeId)

  return (
    <div className="space-y-6">
      <PageHeader
        title="لوحة تحكم اللجان والمجالس"
        subtitle="نظرة شاملة على حالة اللجان والاجتماعات والقرارات"
        actions={
          <Link
            href="/committees/meetings/new"
            className="btn btn-primary no-underline text-sm"
          >
            <Plus size={15} /> اجتماع جديد
          </Link>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="اللجان النشطة"
          value={COMMITTEES.length}
          hint={`${COMMITTEES.filter((c) => c.status === 'active').length} نشطة — ${COMMITTEES.filter((c) => c.status === 'scheduled').length} مجدوَلة`}
          href="/committees/matrix"
        />
        <KpiCard
          label="اجتماعات قادمة"
          value={upcomingMeetings.length}
          hint="خلال الـ 7 أيام القادمة"
          href="/committees/meetings/new"
        />
        <KpiCard
          label="قرارات معلّقة"
          value={pendingDecisions.length}
          hint="بانتظار التصويت"
          href="/committees/decisions"
        />
        <KpiCard
          label="مهام جارية"
          value={activeTasks.length}
          hint="قيد التنفيذ الآن"
        />
      </div>

      {/* Committee cards */}
      <div>
        <SectionTitle title="اللجان المسجّلة" viewAllHref="/committees/matrix" />
        <div className="grid gap-3 sm:grid-cols-3">
          {COMMITTEES.map((c) => (
            <motion.div
              key={c.id}
              whileHover={{ y: -2 }}
              className="card card-hover p-4 cursor-pointer"
              onClick={() =>
                showToast(`اللجنة: ${c.nameAr} — ${c.members} عضو`)
              }
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--color-text)] leading-snug">{c.nameAr}</p>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_COLOR[c.status]}`}>
                  {STATUS_LABEL[c.status]}
                </span>
              </div>
              <p className="mb-3 text-[11px] text-[var(--color-text-muted)] line-clamp-2">{c.mandateAr}</p>
              <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1">
                  <Users size={12} /> {c.members} عضو
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {c.nextMeeting}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/committees/meetings/${c.id}/workspace`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] font-medium text-[var(--color-brand)] no-underline hover:underline"
                >
                  مساحة العمل ←
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming meetings table */}
      <div className="card p-4">
        <SectionTitle title="الاجتماعات القادمة والأخيرة" viewAllHref="/committees/decisions" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['الاجتماع', 'اللجنة', 'التاريخ / الوقت', 'الموقع', 'الحضور', 'الحالة', ''].map(
                  (h) => (
                    <th
                      key={h}
                      className="py-2 pe-3 text-right text-[11px] font-semibold text-[var(--color-text-muted)] first:pe-0"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {MEETINGS.map((m) => {
                const committee = getCommittee(m.committeeId)
                return (
                  <tr
                    key={m.id}
                    className="group cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-gray-100)]"
                    onClick={() => setSelectedMeeting(m)}
                  >
                    <td className="py-3 pe-3 font-medium text-[var(--color-text)]">{m.titleAr}</td>
                    <td className="py-3 pe-3 text-[var(--color-text-muted)]">
                      {committee?.nameAr ?? m.committeeId}
                    </td>
                    <td className="py-3 pe-3 text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {m.date}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
                        <Clock size={11} />
                        {m.time}
                      </span>
                    </td>
                    <td className="py-3 pe-3 text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="shrink-0" />
                        <span className="line-clamp-1">{m.locationAr}</span>
                      </span>
                    </td>
                    <td className="py-3 pe-3 text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {m.attendees}
                      </span>
                    </td>
                    <td className="py-3 pe-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_COLOR[m.status] ?? 'bg-gray-200 text-gray-600'}`}
                      >
                        {STATUS_LABEL[m.status] ?? m.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/committees/meetings/${m.id}/workspace`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-semibold text-[var(--color-brand)] no-underline opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                      >
                        فتح ←
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[11px] text-[var(--color-text-muted)]">
            {MEETINGS.length} اجتماع — {upcomingMeetings.length} قادم
          </p>
          <ViewAllLink href="/committees/decisions" />
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { href: '/committees/decisions', icon: Vote, label: 'القرارات والتصويت', color: 'text-purple-600' },
          { href: '/committees/matrix', icon: LayoutGrid, label: 'مصفوفة المتابعة', color: 'text-blue-600' },
          { href: '/committees/meetings/mining-2026/read', icon: FileText, label: 'قراءة الوثائق', color: 'text-orange-600' },
          { href: '/committees/minutes/mining-2026', icon: CheckSquare2, label: 'المحاضر الرسمية', color: 'text-emerald-600' },
        ].map(({ href, icon: Icon, label, color }) => (
          <Link key={href} href={href} className="card card-hover flex items-center gap-3 p-4 no-underline hover:border-[var(--color-brand)]">
            <Icon size={20} className={color} />
            <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
          </Link>
        ))}
      </div>

      {/* Meeting detail modal */}
      <AnimatePresence>
        {selectedMeeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setSelectedMeeting(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              className="card w-full max-w-lg p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[var(--color-text)]">
                    {selectedMeeting.titleAr}
                  </h2>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                    {getCommittee(selectedMeeting.committeeId)?.nameAr}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMeeting(null)}
                  className="rounded-md p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-text)]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <InfoRow icon={Calendar} label="التاريخ والوقت">
                  {selectedMeeting.date} — الساعة {selectedMeeting.time}
                </InfoRow>
                <InfoRow icon={MapPin} label="الموقع">
                  {selectedMeeting.locationAr}
                </InfoRow>
                <InfoRow icon={Users} label="الحضور المؤكَّد">
                  {selectedMeeting.attendees} مشارك
                </InfoRow>
                <InfoRow icon={FileText} label="بنود جدول الأعمال">
                  {selectedMeeting.agendaItems} بند
                </InfoRow>
                <InfoRow icon={Clock} label="حالة الاجتماع">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_COLOR[selectedMeeting.status]}`}>
                    {STATUS_LABEL[selectedMeeting.status]}
                  </span>
                </InfoRow>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href={`/committees/meetings/${selectedMeeting.id}/workspace`}
                  className="btn btn-primary text-sm no-underline"
                >
                  فتح مساحة العمل
                </Link>
                <Link
                  href={`/committees/meetings/${selectedMeeting.id}/read`}
                  className="btn btn-ghost border border-[var(--color-border)] text-sm no-underline"
                >
                  قراءة الوثائق
                </Link>
                <Link
                  href={`/committees/minutes/${selectedMeeting.id}`}
                  className="btn btn-ghost border border-[var(--color-border)] text-sm no-underline"
                >
                  المحضر
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2 text-[var(--color-text-muted)]">
      <Icon size={14} className="mt-0.5 shrink-0 text-[var(--color-brand)]" />
      <div>
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
        <div className="text-sm text-[var(--color-text)]">{children}</div>
      </div>
    </div>
  )
}
