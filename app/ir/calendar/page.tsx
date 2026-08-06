'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Edit3, Trash2, RefreshCw, X } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { CALENDAR_EVENTS, type CalendarEvent } from '@/lib/mock-data'
import { PageHeader } from '@/components/ui-kit'

const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
const DAYS_AR = ['أحد', 'اثن', 'ثلاث', 'أربع', 'خميس', 'جمعة', 'سبت']
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const TYPE_STYLES: Record<CalendarEvent['type'], string> = {
  committee: 'bg-blue-500',
  conference: 'bg-purple-500',
  visit: 'bg-amber-500',
  signing: 'bg-emerald-500',
  reception: 'bg-pink-500',
  cultural: 'bg-orange-400',
}

const TYPE_AR: Record<CalendarEvent['type'], string> = {
  committee: 'لجنة',
  conference: 'مؤتمر',
  visit: 'زيارة',
  signing: 'توقيع',
  reception: 'استقبال',
  cultural: 'ثقافي',
}

// Add mining conference from spec
const INITIAL_EVENTS: CalendarEvent[] = [
  ...CALENDAR_EVENTS,
  {
    id: 'cal-extra-mining',
    date: '2026-08-12',
    titleEn: 'International Mining & Minerals Conference 2026',
    titleAr: 'مؤتمر التعدين والمعادن الدولي 2026',
    type: 'conference',
    locationEn: 'King Abdullah Financial District, Riyadh',
    locationAr: 'مركز الملك عبدالله المالي، الرياض',
    attendees: 350,
  },
]

export default function CalendarPage() {
  const { language, showToast } = useApp()
  const isAr = language === 'ar'

  const now = new Date(2026, 7) // August 2026
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS)
  const [popoverEvent, setPopoverEvent] = useState<CalendarEvent | null>(null)
  const [createDate, setCreateDate] = useState<string | null>(null)
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventType, setNewEventType] = useState<CalendarEvent['type']>('committee')
  const [newEventLocation, setNewEventLocation] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState('')

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1)
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const pad = cells.length % 7 !== 0 ? 7 - (cells.length % 7) : 0
  const allCells = [...cells, ...Array(pad).fill(null)]

  const eventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter((e) => e.date === dateStr)
  }

  const handleDayClick = (day: number | null) => {
    if (!day) return
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayEvents = eventsForDate(day)
    if (dayEvents.length > 0) {
      setPopoverEvent(dayEvents[0])
    } else {
      setCreateDate(dateStr)
    }
  }

  const createEvent = () => {
    if (!newEventTitle.trim() || !createDate) return
    const newEvent: CalendarEvent = {
      id: `cal-new-${Date.now()}`,
      date: createDate,
      titleAr: newEventTitle,
      titleEn: newEventTitle,
      type: newEventType,
      locationAr: newEventLocation || 'غير محدد',
      locationEn: newEventLocation || 'TBD',
      attendees: 0,
    }
    setEvents((prev) => [...prev, newEvent])
    setCreateDate(null)
    setNewEventTitle('')
    setNewEventLocation('')
    showToast(isAr ? 'تم إضافة الحدث' : 'Event added')
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setPopoverEvent(null)
    showToast(isAr ? 'تم حذف الحدث' : 'Event deleted')
  }

  const syncEvent = () => {
    showToast(isAr ? 'تمت المزامنة مع التقويم' : 'Synced to calendar')
    setPopoverEvent(null)
  }

  const saveEdit = () => {
    if (!popoverEvent) return
    setEvents((prev) => prev.map((e) => e.id === popoverEvent.id ? { ...e, titleAr: editTitle, titleEn: editTitle } : e))
    setPopoverEvent((p) => p ? { ...p, titleAr: editTitle, titleEn: editTitle } : p)
    setEditMode(false)
    showToast(isAr ? 'تم تحديث الحدث' : 'Event updated')
  }

  const today = new Date()
  const todayDay = today.getFullYear() === year && today.getMonth() === month ? today.getDate() : -1

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)

  return (
    <div className="space-y-5">
      <PageHeader
        title={isAr ? 'التقويم الدبلوماسي' : 'Diplomatic Calendar'}
        subtitle={isAr ? 'إدارة الفعاليات والاجتماعات والمناسبات الدبلوماسية' : 'Manage events, meetings, and diplomatic occasions'}
        actions={
          <button
            onClick={() => { setCreateDate(`${year}-${String(month + 1).padStart(2, '0')}-01`); setNewEventTitle('') }}
            className="btn btn-primary gap-2 text-sm"
          >
            <Plus size={15} />
            {isAr ? 'إضافة حدث' : 'Add Event'}
          </button>
        }
      />

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(TYPE_AR).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <span className={`h-2.5 w-2.5 rounded-full ${TYPE_STYLES[type as CalendarEvent['type']]}`} />
            {label}
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        {/* Calendar */}
        <div className="lg:col-span-3 card p-4">
          {/* Month nav */}
          <div className="mb-4 flex items-center justify-between">
            <button onClick={prevMonth} className="btn btn-ghost h-9 w-9 p-0 border-[var(--color-border)]">
              <ChevronRight size={16} className="rtl-flip" />
            </button>
            <h2 className="font-bold text-[var(--color-text)]">
              {isAr ? MONTHS_AR[month] : new Date(year, month).toLocaleString('en', { month: 'long' })} {year}
            </h2>
            <button onClick={nextMonth} className="btn btn-ghost h-9 w-9 p-0 border-[var(--color-border)]">
              <ChevronLeft size={16} className="rtl-flip" />
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 text-center">
            {(isAr ? DAYS_AR : DAYS_EN).map((d) => (
              <div key={d} className="py-1.5 text-xs font-semibold text-[var(--color-text-muted)]">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-[var(--color-border)] rounded-lg overflow-hidden">
            {allCells.map((day, i) => {
              const dayEvents = day ? eventsForDate(day) : []
              const isToday = day === todayDay
              return (
                <div
                  key={i}
                  onClick={() => handleDayClick(day)}
                  className={`min-h-[72px] cursor-pointer p-1.5 transition-colors ${
                    day
                      ? 'bg-[var(--color-card)] hover:bg-[var(--color-bg)]'
                      : 'bg-[var(--color-bg)] cursor-default'
                  }`}
                >
                  {day && (
                    <>
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                          isToday
                            ? 'bg-[var(--color-brand)] text-white'
                            : 'text-[var(--color-text)]'
                        }`}
                      >
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {dayEvents.slice(0, 2).map((e) => (
                          <div
                            key={e.id}
                            className={`truncate rounded px-1 py-0.5 text-[10px] font-medium text-white ${TYPE_STYLES[e.type]}`}
                          >
                            {isAr ? e.titleAr : e.titleEn}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-[var(--color-text-muted)] ps-1">
                            +{dayEvents.length - 2}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar: upcoming */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
            {isAr ? 'الأحداث القادمة' : 'Upcoming Events'}
          </h3>
          <div className="space-y-2">
            {upcomingEvents.map((e) => (
              <button
                key={e.id}
                onClick={() => setPopoverEvent(e)}
                className="w-full text-start card p-3 hover:bg-[var(--color-bg)] transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_STYLES[e.type]}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[var(--color-text)] truncate">
                      {isAr ? e.titleAr : e.titleEn}
                    </p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{e.date}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)] truncate">
                      {isAr ? e.locationAr : e.locationEn}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event popover */}
      <AnimatePresence>
        {popoverEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => e.target === e.currentTarget && setPopoverEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="card w-full max-w-sm p-5 shadow-xl"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${TYPE_STYLES[popoverEvent.type]}`} />
                  <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                    {TYPE_AR[popoverEvent.type]} · {popoverEvent.date}
                  </span>
                </div>
                <button onClick={() => { setPopoverEvent(null); setEditMode(false) }}>
                  <X size={16} className="text-[var(--color-text-muted)]" />
                </button>
              </div>
              {editMode ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input-base text-sm mb-3"
                  autoFocus
                />
              ) : (
                <p className="text-sm font-semibold text-[var(--color-text)] mb-1">
                  {isAr ? popoverEvent.titleAr : popoverEvent.titleEn}
                </p>
              )}
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                📍 {isAr ? popoverEvent.locationAr : popoverEvent.locationEn}
                {popoverEvent.attendees ? ` · ${popoverEvent.attendees} ${isAr ? 'مشارك' : 'attendees'}` : ''}
              </p>
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <button onClick={saveEdit} className="btn btn-primary flex-1 h-9 text-xs gap-1.5">
                      <Plus size={13} /> {isAr ? 'حفظ' : 'Save'}
                    </button>
                    <button onClick={() => setEditMode(false)} className="btn btn-ghost h-9 border-[var(--color-border)] text-xs">
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setEditMode(true); setEditTitle(isAr ? popoverEvent.titleAr : popoverEvent.titleEn) }}
                      className="btn btn-ghost flex-1 h-9 border-[var(--color-border)] text-xs gap-1.5"
                    >
                      <Edit3 size={13} /> {isAr ? 'تعديل' : 'Edit'}
                    </button>
                    <button onClick={syncEvent} className="btn btn-ghost h-9 border-[var(--color-border)] text-xs gap-1.5">
                      <RefreshCw size={13} /> {isAr ? 'مزامنة' : 'Sync'}
                    </button>
                    <button
                      onClick={() => deleteEvent(popoverEvent.id)}
                      className="btn h-9 border-red-200 text-red-600 hover:bg-red-50 text-xs gap-1.5"
                    >
                      <Trash2 size={13} /> {isAr ? 'حذف' : 'Delete'}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create event modal */}
      <AnimatePresence>
        {createDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => e.target === e.currentTarget && setCreateDate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="card w-full max-w-md p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-[var(--color-text)]">
                  {isAr ? `إضافة حدث — ${createDate}` : `New Event — ${createDate}`}
                </h3>
                <button onClick={() => setCreateDate(null)}><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <input
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder={isAr ? 'عنوان الحدث...' : 'Event title...'}
                  className="input-base text-sm"
                  autoFocus
                />
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as CalendarEvent['type'])}
                  className="input-base text-sm"
                >
                  {Object.entries(TYPE_AR).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <input
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  placeholder={isAr ? 'الموقع...' : 'Location...'}
                  className="input-base text-sm"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setCreateDate(null)} className="btn btn-ghost border-[var(--color-border)] text-sm">
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button onClick={createEvent} className="btn btn-primary text-sm gap-2">
                  <Plus size={14} />
                  {isAr ? 'إضافة' : 'Add'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
