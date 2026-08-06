'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CheckCircle2, Circle, Sparkles, Save, ChevronLeft,
  FileText, Users, Calendar, Clock, Send, ArrowLeft,
  Printer, Download, ChevronRight,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit'
import { MEETINGS, COMMITTEES, ACTION_ITEMS } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'

const ID_MAP: Record<string, string> = {
  '1': 'mtg-mining-2026-02',
  'mining-2026': 'mtg-mining-2026-02',
}

const APPROVAL_STEPS = [
  { id: 'draft', label: 'مسودة', desc: 'إعداد المحضر الأولي' },
  { id: 'review', label: 'مراجعة', desc: 'مراجعة أعضاء اللجنة' },
  { id: 'approved', label: 'اعتماد', desc: 'توقيع رئيس اللجنة' },
  { id: 'published', label: 'نشر', desc: 'إرسال للأطراف المعنية' },
]

const AI_SUGGESTIONS = [
  'اعتمدت اللجنة في جلستها الثانية المنعقدة بتاريخ 7 أغسطس 2026 قراراً بالموافقة على إطار استكشاف الليثيوم مع المملكة الأسترالية (الإصدار 3.2) وفقاً للشروط والأحكام المدرجة في الملحق (جـ).',
  'كلّفت اللجنة إدارة الشؤون القانونية بالتفاوض على صياغة بديلة للمادة السابعة من مذكرة التفاهم المتعلقة بالمعادن النادرة وعرضها على اللجنة للمراجعة خلال أربعة عشر يوماً من تاريخ انعقاد الجلسة.',
  'أوصت اللجنة باعتماد خط أنابيب الاستثمار للربع الثالث لعام 2026 المتضمن أربعة مشاريع استثمارية بقيمة إجمالية تبلغ 1.28 مليار ريال، مع تشكيل فرق التفاوض المتخصصة بحلول 20 أغسطس 2026.',
]

export default function MinutesPage() {
  const { id } = useParams<{ id: string }>()
  const resolvedId = ID_MAP[id] || id
  const meeting = MEETINGS.find((m) => m.id === resolvedId) ?? MEETINGS[0]
  const committee = COMMITTEES.find((c) => c.id === meeting.committeeId)
  const { showToast } = useApp()

  const [minutesText, setMinutesText] = useState(`محضر الجلسة الثانية
لجنة التعدين والمعادن المشتركة

التاريخ: ${meeting.date}
الوقت: ${meeting.time}
المكان: ${meeting.locationAr}
عدد الحاضرين: ${meeting.attendees} عضواً

أولاً: افتتاح الجلسة
افتتح رئيس اللجنة معالي بندر الخريف الجلسة في الساعة العاشرة صباحاً، ورحّب بالأعضاء والمدعوّين. تم التحقق من اكتمال النصاب القانوني بحضور 14 من أصل 18 عضواً.

ثانياً: اعتماد جدول الأعمال
وافقت اللجنة بالإجماع على جدول الأعمال المقترح. كما تمت المصادقة على محضر الجلسة الافتتاحية المنعقدة بتاريخ 15 مايو 2026 مع تعديل طفيف في البند الثالث.

ثالثاً: إطار استكشاف الليثيوم مع أستراليا
عرض م. فهد القحطاني مسودة الإطار (الإصدار 3.2)...
`)

  const [currentStep, setCurrentStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const textRef = useRef<HTMLTextAreaElement>(null)

  const actionItems = ACTION_ITEMS.slice(0, 3)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    showToast('تم حفظ المحضر بنجاح')
  }

  const handleAi = async () => {
    setAiLoading(true)
    await new Promise((r) => setTimeout(r, 1400))
    setAiSuggestion(AI_SUGGESTIONS[Math.floor(Math.random() * AI_SUGGESTIONS.length)])
    setAiLoading(false)
    setShowAiPanel(true)
  }

  const insertAi = () => {
    setMinutesText((t) => t + '\n\n' + aiSuggestion)
    setShowAiPanel(false)
    setAiSuggestion('')
    showToast('تم إدراج نص الذكاء الاصطناعي')
  }

  const advanceStep = () => {
    if (currentStep < APPROVAL_STEPS.length - 1) {
      setCurrentStep((s) => s + 1)
      showToast(`انتقل المحضر إلى مرحلة: ${APPROVAL_STEPS[currentStep + 1].label}`)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="محضر الجلسة"
        subtitle={`${meeting.titleAr} — ${committee?.nameAr ?? ''}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/committees/meetings/${id}/workspace`}
              className="btn btn-ghost border border-[var(--color-border)] text-xs no-underline"
            >
              <ArrowLeft size={13} /> مساحة العمل
            </Link>
            <button
              onClick={() => showToast('جارٍ الطباعة…')}
              className="btn btn-ghost border border-[var(--color-border)] text-xs"
            >
              <Printer size={13} /> طباعة
            </button>
            <button onClick={handleSave} className="btn btn-primary text-xs" disabled={saving}>
              <Save size={13} /> {saving ? 'جارٍ الحفظ…' : 'حفظ المحضر'}
            </button>
          </div>
        }
      />

      {/* Approval stepper */}
      <div className="card p-4">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
          مسار الاعتماد
        </h3>
        <div className="relative flex items-start justify-between gap-0">
          {/* connecting line */}
          <div className="absolute top-3.5 start-0 end-0 h-0.5 bg-[var(--color-gray-200)]" />
          <div
            className="absolute top-3.5 start-0 h-0.5 bg-[var(--color-brand)] transition-all duration-500"
            style={{ width: `${(currentStep / (APPROVAL_STEPS.length - 1)) * 100}%` }}
          />
          {APPROVAL_STEPS.map((s, idx) => (
            <div key={s.id} className="relative z-10 flex flex-1 flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                  idx < currentStep
                    ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white'
                    : idx === currentStep
                      ? 'border-[var(--color-gold)] bg-[var(--color-gold)] text-white'
                      : 'border-[var(--color-gray-300)] bg-[var(--color-bg-elev)] text-[var(--color-text-muted)]'
                }`}
              >
                {idx < currentStep ? <CheckCircle2 size={14} /> : idx + 1}
              </div>
              <p className={`mt-1.5 text-center text-[11px] font-semibold ${idx <= currentStep ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
                {s.label}
              </p>
              <p className="mt-0.5 text-center text-[10px] text-[var(--color-text-muted)]">{s.desc}</p>
            </div>
          ))}
        </div>
        {currentStep < APPROVAL_STEPS.length - 1 && (
          <div className="mt-4 flex justify-center">
            <button onClick={advanceStep} className="btn btn-primary text-xs">
              الانتقال إلى مرحلة: {APPROVAL_STEPS[currentStep + 1].label} <ChevronLeft size={13} />
            </button>
          </div>
        )}
        {currentStep === APPROVAL_STEPS.length - 1 && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600">
            <CheckCircle2 size={14} /> تم نشر المحضر رسمياً
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Editor */}
        <div className="card overflow-hidden">
          {/* Editor toolbar */}
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5">
            <div className="flex items-center gap-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-[11px] text-[var(--color-text-muted)]">
              <FileText size={11} /> محضر الجلسة {meeting.date}
            </div>
            <div className="flex-1" />
            <button
              onClick={handleAi}
              disabled={aiLoading}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-l from-[var(--color-brand)] to-[var(--color-gold)] px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
            >
              <Sparkles size={13} />
              {aiLoading ? 'جارٍ التوليد…' : 'إدراج باستخدام الذكاء الاصطناعي'}
            </button>
          </div>

          {/* AI suggestion panel */}
          {showAiPanel && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-[var(--color-border)] bg-gradient-to-l from-[var(--color-brand)]/5 to-[var(--color-gold)]/5 p-4"
            >
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[var(--color-brand)]">
                <Sparkles size={13} /> اقتراح الذكاء الاصطناعي
              </div>
              <p className="mb-3 text-xs leading-relaxed text-[var(--color-text)]">{aiSuggestion}</p>
              <div className="flex gap-2">
                <button onClick={insertAi} className="btn btn-primary text-xs px-3">
                  إدراج في المحضر
                </button>
                <button
                  onClick={() => setShowAiPanel(false)}
                  className="btn btn-ghost border border-[var(--color-border)] text-xs px-3"
                >
                  تجاهل
                </button>
              </div>
            </motion.div>
          )}

          <textarea
            ref={textRef}
            className="min-h-[480px] w-full resize-y bg-transparent p-5 text-sm leading-loose text-[var(--color-text)] outline-none"
            value={minutesText}
            onChange={(e) => setMinutesText(e.target.value)}
            dir="rtl"
          />
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Meeting info */}
          <div className="card p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
              بيانات الاجتماع
            </h3>
            <div className="space-y-2 text-xs">
              <InfoLine icon={Calendar} label="التاريخ">{meeting.date}</InfoLine>
              <InfoLine icon={Clock} label="الوقت">{meeting.time}</InfoLine>
              <InfoLine icon={Users} label="الحضور">{meeting.attendees} عضواً</InfoLine>
              <InfoLine icon={FileText} label="بنود الأعمال">{meeting.agendaItems} بنود</InfoLine>
            </div>
          </div>

          {/* Action items */}
          <div className="card p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
              بنود العمل المقررة
            </h3>
            <div className="space-y-2">
              {actionItems.map((item) => (
                <div key={item.id} className="rounded-lg bg-[var(--color-gray-100)] p-2.5">
                  <p className="text-xs font-medium text-[var(--color-text)] leading-snug">{item.titleAr}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
                    <span>{item.ownerAr}</span>
                    <span>{item.dueDate}</span>
                  </div>
                  <div className="mt-1">
                    <span className={`text-[10px] font-semibold rounded-full px-1.5 py-0.5 ${item.status === 'done' ? 'bg-emerald-500/15 text-emerald-700' : item.status === 'in_progress' ? 'bg-blue-500/15 text-blue-700' : 'bg-amber-500/15 text-amber-700'}`}>
                      {item.status === 'done' ? 'مكتمل' : item.status === 'in_progress' ? 'جارٍ' : 'معلّق'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick nav */}
          <div className="card p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
              روابط سريعة
            </h3>
            <div className="space-y-1.5">
              {[
                { href: `/committees/voting/${id}`, label: 'التصويت على القرارات' },
                { href: `/committees/meetings/${id}/workspace`, label: 'مساحة العمل' },
                { href: `/committees/decisions`, label: 'لوحة القرارات' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[var(--color-text)] no-underline hover:bg-[var(--color-gray-100)] hover:text-[var(--color-brand)]"
                >
                  <ChevronLeft size={12} className="text-[var(--color-brand)]" /> {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoLine({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
        <Icon size={11} /> {label}
      </span>
      <span className="font-medium text-[var(--color-text)]">{children}</span>
    </div>
  )
}
