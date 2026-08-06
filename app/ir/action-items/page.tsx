'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save, X, Plus, CheckCircle2, Clock, Circle } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { ACTION_ITEMS, MEETINGS, type ActionItem } from '@/lib/mock-data'
import { PageHeader, SectionTitle, SlaBadge } from '@/components/ui-kit'

const STATUS_AR: Record<ActionItem['status'], string> = {
  pending: 'معلّق',
  in_progress: 'جارٍ',
  done: 'مكتمل',
}

const STATUS_ICONS: Record<ActionItem['status'], React.ElementType> = {
  pending: Circle,
  in_progress: Clock,
  done: CheckCircle2,
}

const STATUS_STYLES: Record<ActionItem['status'], string> = {
  pending: 'text-gray-400',
  in_progress: 'text-[var(--color-brand)]',
  done: 'text-emerald-500',
}

const SLA_BY_DATE: (due: string) => 'red' | 'yellow' | 'green' = (due) => {
  const days = Math.floor((new Date(due).getTime() - Date.now()) / 86400000)
  if (days < 0) return 'red'
  if (days < 5) return 'yellow'
  return 'green'
}

const EXTRA_ITEMS: ActionItem[] = [
  { id: 'ai-004', titleEn: 'Draft joint communiqué for Jordan JEC', titleAr: 'إعداد مسودة البيان المشترك للجنة الاقتصادية مع الأردن', ownerEn: 'JEC Secretariat', ownerAr: 'أمانة اللجنة الاقتصادية', dueDate: '2026-08-20', meetingId: 'mtg-jec-2026-03', status: 'pending' },
  { id: 'ai-005', titleEn: 'Prepare TIAP technology report annex', titleAr: 'إعداد ملحق تقرير التكنولوجيا للجنة الاستشارية', ownerEn: 'Dr. Sara Al-Rashidi', ownerAr: 'د. سارة الرشيدي', dueDate: '2026-08-25', meetingId: 'mtg-mining-2026-01', status: 'pending' },
  { id: 'ai-006', titleEn: 'Confirm attendance list for mining conference', titleAr: 'تأكيد قائمة الحضور لمؤتمر التعدين', ownerEn: 'Events Division', ownerAr: 'إدارة الفعاليات', dueDate: '2026-08-10', meetingId: 'mtg-mining-2026-02', status: 'in_progress' },
]

export default function ActionItemsPage() {
  const { language, showToast } = useApp()
  const isAr = language === 'ar'

  const [items, setItems] = useState<ActionItem[]>([...ACTION_ITEMS, ...EXTRA_ITEMS])
  const [editId, setEditId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editOwner, setEditOwner] = useState('')
  const [editDue, setEditDue] = useState('')
  const [filterStatus, setFilterStatus] = useState<ActionItem['status'] | 'all'>('all')
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newOwner, setNewOwner] = useState('')
  const [newDue, setNewDue] = useState('')
  const [newMeeting, setNewMeeting] = useState(MEETINGS[0].id)

  const filtered = filterStatus === 'all' ? items : items.filter((i) => i.status === filterStatus)

  const startEdit = (item: ActionItem) => {
    setEditId(item.id)
    setEditTitle(isAr ? item.titleAr : item.titleEn)
    setEditOwner(isAr ? item.ownerAr : item.ownerEn)
    setEditDue(item.dueDate)
  }

  const saveEdit = () => {
    if (!editId) return
    setItems((prev) =>
      prev.map((i) =>
        i.id === editId
          ? { ...i, titleAr: editTitle, titleEn: editTitle, ownerAr: editOwner, ownerEn: editOwner, dueDate: editDue }
          : i,
      ),
    )
    setEditId(null)
    showToast(isAr ? 'تم تحديث البند' : 'Item updated')
  }

  const cycleStatus = (id: string) => {
    const ORDER: ActionItem['status'][] = ['pending', 'in_progress', 'done']
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i
        const next = ORDER[(ORDER.indexOf(i.status) + 1) % ORDER.length]
        showToast(`${isAr ? 'الحالة:' : 'Status:'} ${STATUS_AR[next]}`)
        return { ...i, status: next }
      }),
    )
  }

  const addItem = () => {
    if (!newTitle.trim() || !newDue) return
    setItems((prev) => [
      {
        id: `ai-new-${Date.now()}`,
        titleAr: newTitle,
        titleEn: newTitle,
        ownerAr: newOwner || 'غير محدد',
        ownerEn: newOwner || 'TBD',
        dueDate: newDue,
        meetingId: newMeeting,
        status: 'pending',
      },
      ...prev,
    ])
    setNewTitle('')
    setNewOwner('')
    setNewDue('')
    setShowNew(false)
    showToast(isAr ? 'تم إضافة البند' : 'Item added')
  }

  const getMeetingName = (id: string) => {
    const m = MEETINGS.find((m) => m.id === id)
    return m ? (isAr ? m.titleAr : m.titleEn) : id
  }

  const counts = {
    all: items.length,
    pending: items.filter((i) => i.status === 'pending').length,
    in_progress: items.filter((i) => i.status === 'in_progress').length,
    done: items.filter((i) => i.status === 'done').length,
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={isAr ? 'بنود العمل' : 'Action Items'}
        subtitle={isAr ? `${items.length} بند مسجّل` : `${items.length} action items`}
        actions={
          <button
            onClick={() => setShowNew((v) => !v)}
            className="btn btn-primary gap-2 text-sm"
          >
            <Plus size={15} />
            {isAr ? 'بند جديد' : 'New Item'}
          </button>
        }
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { key: 'all', label: isAr ? 'الكل' : 'All', count: counts.all, color: 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]' },
          { key: 'pending', label: isAr ? 'معلّق' : 'Pending', count: counts.pending, color: 'bg-gray-100 text-gray-600' },
          { key: 'in_progress', label: isAr ? 'جارٍ' : 'In Progress', count: counts.in_progress, color: 'bg-blue-100 text-blue-700' },
          { key: 'done', label: isAr ? 'مكتمل' : 'Done', count: counts.done, color: 'bg-emerald-100 text-emerald-700' },
        ].map(({ key, label, count, color }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key as ActionItem['status'] | 'all')}
            className={`card p-3 text-center transition-all ${filterStatus === key ? 'ring-2 ring-[var(--color-brand)]' : ''}`}
          >
            <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
            <p className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${color}`}>
              {count}
            </p>
          </button>
        ))}
      </div>

      {/* New item inline form */}
      {showNew && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card p-4"
        >
          <p className="mb-3 text-sm font-semibold text-[var(--color-text)]">
            {isAr ? 'إضافة بند عمل جديد' : 'Add New Action Item'}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={isAr ? 'عنوان البند...' : 'Item title...'}
              className="input-base text-sm col-span-2"
            />
            <input
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              placeholder={isAr ? 'المسؤول...' : 'Owner...'}
              className="input-base text-sm"
            />
            <input
              type="date"
              value={newDue}
              onChange={(e) => setNewDue(e.target.value)}
              className="input-base text-sm"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <select
              value={newMeeting}
              onChange={(e) => setNewMeeting(e.target.value)}
              className="input-base h-9 w-auto text-xs flex-1 max-w-xs"
            >
              {MEETINGS.map((m) => (
                <option key={m.id} value={m.id}>{isAr ? m.titleAr : m.titleEn}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={() => setShowNew(false)} className="btn btn-ghost h-9 border-[var(--color-border)] text-xs">
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={addItem} className="btn btn-primary h-9 gap-1.5 text-xs">
                <Plus size={13} />
                {isAr ? 'إضافة' : 'Add'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Items table */}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
              <th className="p-3 text-start font-medium w-8" />
              <th className="p-3 text-start font-medium">{isAr ? 'البند' : 'Item'}</th>
              <th className="p-3 text-start font-medium">{isAr ? 'المسؤول' : 'Owner'}</th>
              <th className="p-3 text-start font-medium">{isAr ? 'الاجتماع' : 'Meeting'}</th>
              <th className="p-3 text-start font-medium">{isAr ? 'الموعد' : 'Due'}</th>
              <th className="p-3 text-start font-medium">SLA</th>
              <th className="p-3 text-start font-medium">{isAr ? 'الحالة' : 'Status'}</th>
              <th className="p-3 text-start font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const StatusIcon = STATUS_ICONS[item.status]
              const isEditing = editId === item.id
              return (
                <tr
                  key={item.id}
                  className={`border-b border-[var(--color-border)] last:border-0 transition-colors ${
                    isEditing ? 'bg-[var(--color-brand)]/5' : 'hover:bg-[var(--color-bg)]'
                  }`}
                >
                  <td className="p-3">
                    <button
                      onClick={() => cycleStatus(item.id)}
                      className="cursor-pointer transition-colors hover:opacity-70"
                      title={isAr ? 'اضغط لتغيير الحالة' : 'Click to cycle status'}
                    >
                      <StatusIcon size={16} className={STATUS_STYLES[item.status]} />
                    </button>
                  </td>
                  <td className="p-3">
                    {isEditing ? (
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="input-base h-8 text-xs w-full"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                      />
                    ) : (
                      <p className={`font-medium text-[var(--color-text)] ${item.status === 'done' ? 'line-through opacity-60' : ''}`}>
                        {isAr ? item.titleAr : item.titleEn}
                      </p>
                    )}
                  </td>
                  <td className="p-3 text-xs text-[var(--color-text-muted)]">
                    {isEditing ? (
                      <input
                        value={editOwner}
                        onChange={(e) => setEditOwner(e.target.value)}
                        className="input-base h-8 text-xs w-full"
                      />
                    ) : (
                      isAr ? item.ownerAr : item.ownerEn
                    )}
                  </td>
                  <td className="p-3 text-xs text-[var(--color-text-muted)] max-w-[160px] truncate">
                    {getMeetingName(item.meetingId)}
                  </td>
                  <td className="p-3 text-xs text-[var(--color-text-muted)]">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editDue}
                        onChange={(e) => setEditDue(e.target.value)}
                        className="input-base h-8 text-xs"
                      />
                    ) : (
                      item.dueDate
                    )}
                  </td>
                  <td className="p-3">
                    <SlaBadge status={SLA_BY_DATE(item.dueDate)} />
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      item.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {STATUS_AR[item.status]}
                    </span>
                  </td>
                  <td className="p-3">
                    {isEditing ? (
                      <div className="flex gap-1">
                        <button onClick={saveEdit} className="text-[var(--color-brand)] hover:opacity-70">
                          <Save size={14} />
                        </button>
                        <button onClick={() => setEditId(null)} className="text-[var(--color-text-muted)] hover:opacity-70">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(item)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-[var(--color-text-muted)]">
            {isAr ? 'لا توجد بنود في هذه الحالة' : 'No items in this status'}
          </div>
        )}
      </div>
    </div>
  )
}
