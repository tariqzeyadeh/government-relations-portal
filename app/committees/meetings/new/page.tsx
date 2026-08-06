'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  CheckCircle2, ChevronLeft, ChevronRight, GripVertical,
  Paperclip, Plus, Trash2, X, Users, Calendar, MapPin,
  Clock, FileText, ArrowRight,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit'
import { COMMITTEES, COMMITTEE_TYPES, MEETING_TYPES } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'

// ─── fake available members ─────────────────────────────────────────────────
const ALL_MEMBERS = [
  { id: 'm1', nameAr: 'م. فهد القحطاني', role: 'ممثل الصناعة' },
  { id: 'm2', nameAr: 'د. نورة الحربي', role: 'ممثل الطاقة' },
  { id: 'm3', nameAr: 'م. سلطان الدوسري', role: 'ممثل الاستثمار' },
  { id: 'm4', nameAr: 'أ. لينا الشهري', role: 'مستشار قانوني' },
  { id: 'm5', nameAr: 'د. ماجد العتيبي', role: 'خبير فني' },
  { id: 'm6', nameAr: 'أ. هند الزهراني', role: 'أمانة اللجنة' },
  { id: 'm7', nameAr: 'م. أحمد المحمد', role: 'المدير التنفيذي' },
  { id: 'm8', nameAr: 'د. خالد الغامدي', role: 'ممثل التخطيط' },
]

interface AgendaItem {
  id: string
  titleAr: string
  duration: number
  presenter: string
}

const DEFAULT_AGENDA: AgendaItem[] = [
  { id: 'ag1', titleAr: 'افتتاح الجلسة والتحقق من النصاب', duration: 10, presenter: 'رئيس الجلسة' },
  { id: 'ag2', titleAr: 'اعتماد جدول الأعمال ومحضر الجلسة السابقة', duration: 15, presenter: 'أمانة اللجنة' },
  { id: 'ag3', titleAr: 'عرض التطورات في ملف التعاون', duration: 20, presenter: 'م. فهد القحطاني' },
  { id: 'ag4', titleAr: 'مناقشة مقترحات الشراكات الجديدة', duration: 30, presenter: 'فريق الاستثمار' },
  { id: 'ag5', titleAr: 'البنود المتنوعة', duration: 10, presenter: 'رئيس الجلسة' },
]

const STEPS = ['أساسيات الاجتماع', 'الدعوات', 'جدول الأعمال']

export default function NewMeetingPage() {
  const router = useRouter()
  const { showToast } = useApp()

  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  // Step 1 state
  const [form, setForm] = useState({
    titleAr: '',
    committeeId: COMMITTEES[0].id,
    typeId: 'regular',
    date: '',
    time: '',
    locationAr: '',
    notes: '',
  })

  // Step 2 state — available = not invited, invited = invited
  const [available, setAvailable] = useState(ALL_MEMBERS.slice(4))
  const [invited, setInvited] = useState(ALL_MEMBERS.slice(0, 4))
  const [selAvail, setSelAvail] = useState<string[]>([])
  const [selInvited, setSelInvited] = useState<string[]>([])

  // Step 3 state
  const [agenda, setAgenda] = useState<AgendaItem[]>(DEFAULT_AGENDA)
  const [files, setFiles] = useState<string[]>(['ورقة إحاطة لجنة التعدين.pdf', 'مسودة إطار الليثيوم.docx'])
  const fileRef = useRef<HTMLInputElement>(null)

  // ── helpers ──────────────────────────────────────────────────────────────
  const canNext = () => {
    if (step === 0) return form.titleAr.trim() && form.date && form.time && form.locationAr.trim()
    if (step === 1) return invited.length > 0
    return agenda.length > 0
  }

  const moveToInvited = () => {
    const moving = available.filter((m) => selAvail.includes(m.id))
    setInvited((prev) => [...prev, ...moving])
    setAvailable((prev) => prev.filter((m) => !selAvail.includes(m.id)))
    setSelAvail([])
  }
  const moveToAvailable = () => {
    const moving = invited.filter((m) => selInvited.includes(m.id))
    setAvailable((prev) => [...prev, ...moving])
    setInvited((prev) => prev.filter((m) => !selInvited.includes(m.id)))
    setSelInvited([])
  }

  const handleFinish = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    showToast('تم إنشاء الاجتماع بنجاح')
    router.push('/committees/meetings/mtg-mining-2026-02/workspace')
  }

  const removeAgendaItem = (id: string) => setAgenda((prev) => prev.filter((a) => a.id !== id))
  const addAgendaItem = () =>
    setAgenda((prev) => [
      ...prev,
      { id: `ag${Date.now()}`, titleAr: 'بند جديد', duration: 15, presenter: 'المقرر' },
    ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="إنشاء اجتماع جديد"
        subtitle="أدخل تفاصيل الاجتماع وادعُ المشاركين وحدد جدول الأعمال"
      />

      {/* Step indicators */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <button
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                i < step
                  ? 'bg-[var(--color-brand)] text-white'
                  : i === step
                    ? 'bg-[var(--color-gold)] text-white'
                    : 'bg-[var(--color-gray-200)] text-[var(--color-text-muted)]'
              }`}
              onClick={() => i < step && setStep(i)}
            >
              {i < step ? <CheckCircle2 size={14} /> : i + 1}
            </button>
            <span className={`ms-2 text-xs font-medium ${i === step ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`mx-3 flex-1 h-px ${i < step ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-border)]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step panels */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <StepPanel key="step0">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="عنوان الجلسة *">
                <input
                  className="input-base"
                  value={form.titleAr}
                  placeholder="مثال: الجلسة الثانية للجنة التعدين 2026"
                  onChange={(e) => setForm((f) => ({ ...f, titleAr: e.target.value }))}
                />
              </Field>

              <Field label="اللجنة *">
                <select
                  className="input-base"
                  value={form.committeeId}
                  onChange={(e) => setForm((f) => ({ ...f, committeeId: e.target.value }))}
                >
                  {COMMITTEES.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameAr}</option>
                  ))}
                </select>
              </Field>

              <Field label="نوع الاجتماع *">
                <select
                  className="input-base"
                  value={form.typeId}
                  onChange={(e) => setForm((f) => ({ ...f, typeId: e.target.value }))}
                >
                  {MEETING_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.labelAr}</option>
                  ))}
                </select>
              </Field>

              <Field label="التاريخ *">
                <input
                  className="input-base"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </Field>

              <Field label="الوقت *">
                <input
                  className="input-base"
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                />
              </Field>

              <Field label="الموقع *">
                <input
                  className="input-base"
                  value={form.locationAr}
                  placeholder="مثال: قاعة المؤتمرات ب، مقر الوزارة"
                  onChange={(e) => setForm((f) => ({ ...f, locationAr: e.target.value }))}
                />
              </Field>

              <Field label="ملاحظات" className="sm:col-span-2">
                <textarea
                  className="input-base h-20 resize-none py-2"
                  value={form.notes}
                  placeholder="أي معلومات إضافية حول هذا الاجتماع..."
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </Field>
            </div>

            {/* Preview strip */}
            {form.titleAr && form.date && (
              <div className="mt-4 flex flex-wrap gap-3 rounded-lg bg-[var(--color-brand)]/6 p-3 text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1"><FileText size={12} />{form.titleAr}</span>
                <span className="flex items-center gap-1"><Calendar size={12} />{form.date} {form.time}</span>
                {form.locationAr && <span className="flex items-center gap-1"><MapPin size={12} />{form.locationAr}</span>}
              </div>
            )}
          </StepPanel>
        )}

        {step === 1 && (
          <StepPanel key="step1">
            <p className="mb-4 text-sm text-[var(--color-text-muted)]">
              اختر الأعضاء من القائمة اليسرى وانقل المدعوّين إلى القائمة اليمنى.
            </p>
            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
              {/* Available */}
              <Listbox
                label={`الأعضاء المتاحون (${available.length})`}
                members={available}
                selected={selAvail}
                onToggle={(id) =>
                  setSelAvail((prev) =>
                    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                  )
                }
              />

              {/* Arrow buttons */}
              <div className="flex flex-col gap-2 pt-8">
                <button
                  onClick={moveToInvited}
                  disabled={selAvail.length === 0}
                  className="btn btn-primary disabled:opacity-40 text-xs px-3 py-1"
                  title="نقل إلى المدعوّين"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={moveToAvailable}
                  disabled={selInvited.length === 0}
                  className="btn btn-ghost border border-[var(--color-border)] disabled:opacity-40 text-xs px-3 py-1"
                  title="إعادة إلى المتاحين"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Invited */}
              <Listbox
                label={`المدعوّون (${invited.length})`}
                members={invited}
                selected={selInvited}
                onToggle={(id) =>
                  setSelInvited((prev) =>
                    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                  )
                }
                accent
              />
            </div>
            {invited.length === 0 && (
              <p className="mt-4 text-xs text-red-500">يجب دعوة عضو واحد على الأقل للمتابعة.</p>
            )}
          </StepPanel>
        )}

        {step === 2 && (
          <StepPanel key="step2">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-[var(--color-text-muted)]">
                اسحب البنود لإعادة ترتيبها. انقر على الزائد لإضافة بند جديد.
              </p>
              <button
                onClick={addAgendaItem}
                className="btn btn-primary text-xs px-3"
              >
                <Plus size={13} /> بند جديد
              </button>
            </div>

            <Reorder.Group axis="y" values={agenda} onReorder={setAgenda} className="space-y-2">
              {agenda.map((item, idx) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className="flex cursor-grab items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-3 active:cursor-grabbing"
                >
                  <GripVertical size={16} className="mt-0.5 shrink-0 text-[var(--color-text-muted)]" />
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-[10px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <input
                      className="w-full bg-transparent text-sm font-medium text-[var(--color-text)] outline-none"
                      value={item.titleAr}
                      onChange={(e) =>
                        setAgenda((prev) =>
                          prev.map((a) => (a.id === item.id ? { ...a, titleAr: e.target.value } : a)),
                        )
                      }
                    />
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        <input
                          className="w-10 bg-transparent outline-none"
                          type="number"
                          min={5}
                          max={120}
                          value={item.duration}
                          onChange={(e) =>
                            setAgenda((prev) =>
                              prev.map((a) =>
                                a.id === item.id ? { ...a, duration: +e.target.value } : a,
                              ),
                            )
                          }
                        />{' '}
                        دقيقة
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        <input
                          className="bg-transparent outline-none"
                          value={item.presenter}
                          onChange={(e) =>
                            setAgenda((prev) =>
                              prev.map((a) =>
                                a.id === item.id ? { ...a, presenter: e.target.value } : a,
                              ),
                            )
                          }
                        />
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAgendaItem(item.id)}
                    className="text-[var(--color-text-muted)] hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {/* File attachments */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                مرفقات الجلسة
              </p>
              <div className="space-y-2">
                {files.map((f) => (
                  <div
                    key={f}
                    className="flex items-center justify-between rounded-lg bg-[var(--color-gray-100)] px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2 text-[var(--color-text)]">
                      <Paperclip size={13} className="text-[var(--color-brand)]" /> {f}
                    </span>
                    <button
                      onClick={() => setFiles((prev) => prev.filter((x) => x !== f))}
                      className="text-[var(--color-text-muted)] hover:text-red-500"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileRef.current?.click()}
                  className="btn btn-ghost border border-dashed border-[var(--color-border)] w-full text-xs text-[var(--color-text-muted)]"
                >
                  <Plus size={13} /> إضافة مرفق
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFiles((prev) => [...prev, e.target.files![0].name])
                    }
                  }}
                />
              </div>
            </div>
          </StepPanel>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="btn btn-ghost border border-[var(--color-border)] text-sm disabled:opacity-40"
        >
          <ChevronRight size={16} /> السابق
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="btn btn-primary text-sm disabled:opacity-40"
          >
            التالي <ChevronLeft size={16} />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={submitting || !canNext()}
            className="btn btn-primary text-sm disabled:opacity-40"
          >
            {submitting ? 'جارٍ الحفظ…' : (
              <>إنشاء الاجتماع <ArrowRight size={16} /></>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── sub-components ──────────────────────────────────────────────────────────
function StepPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      className="card p-5"
    >
      {children}
    </motion.div>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-[var(--color-text-muted)]">
        {label}
      </label>
      {children}
    </div>
  )
}

function Listbox({
  label,
  members,
  selected,
  onToggle,
  accent,
}: {
  label: string
  members: { id: string; nameAr: string; role: string }[]
  selected: string[]
  onToggle: (id: string) => void
  accent?: boolean
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-[var(--color-text-muted)]">{label}</p>
      <div
        className={`min-h-[220px] rounded-lg border ${accent ? 'border-[var(--color-brand)]' : 'border-[var(--color-border)]'} bg-[var(--color-bg-elev)] overflow-y-auto`}
      >
        {members.length === 0 ? (
          <p className="p-4 text-xs text-[var(--color-text-muted)] text-center">لا يوجد أعضاء</p>
        ) : (
          members.map((m) => (
            <button
              key={m.id}
              onClick={() => onToggle(m.id)}
              className={`flex w-full items-start gap-2 px-3 py-2.5 text-right transition-colors hover:bg-[var(--color-gray-100)] ${
                selected.includes(m.id) ? 'bg-[var(--color-brand)]/8' : ''
              }`}
            >
              <div
                className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-2 transition-colors ${
                  selected.includes(m.id)
                    ? 'border-[var(--color-brand)] bg-[var(--color-brand)]'
                    : 'border-[var(--color-border)]'
                }`}
              />
              <div>
                <p className="text-sm text-[var(--color-text)]">{m.nameAr}</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">{m.role}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
