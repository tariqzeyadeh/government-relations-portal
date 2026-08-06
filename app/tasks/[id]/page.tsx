'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Tag,
  MessageSquare,
  Paperclip,
  Save,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit'
import { TASKS } from '@/lib/ops-mock-data'
import { useApp } from '@/lib/app-context'

type SlaLevel = 'green' | 'yellow' | 'red'

const SLA_CFG: Record<SlaLevel, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  green: { label: 'ضمن المدة', className: 'bg-emerald-500/15 text-emerald-700', Icon: CheckCircle2 },
  yellow: { label: 'يقترب', className: 'bg-amber-500/15 text-amber-700', Icon: Clock },
  red: { label: 'متأخر', className: 'bg-red-500/15 text-red-700', Icon: AlertTriangle },
}

const STATUSES = ['قيد التنفيذ', 'معلقة', 'متأخر', 'تم الإنجاز'] as const

const STATUS_SLA: Record<string, SlaLevel> = {
  'قيد التنفيذ': 'yellow',
  معلقة: 'green',
  متأخر: 'red',
  'تم الإنجاز': 'green',
}

const DESCRIPTIONS: Record<string, string> = {
  'TSK-001':
    'مراجعة النسخة النهائية من مذكرة التفاهم مع الأردن، بما يشمل البنود القانونية والمالية والجدول الزمني للتنفيذ، ثم رفع الملاحظات للأمانة قبل موعد الاجتماع التالي.',
  'TSK-002':
    'إعداد تقرير ربع سنوي حول حجم التجارة الثنائية مع مصر، يتضمن مؤشرات الصادرات والواردات وأبرز الفرص الاستثمارية والتوصيات التنفيذية.',
  'TSK-003':
    'تحديث ملف الدولة للمغرب بالمعلومات الدبلوماسية والاقتصادية الأحدث، ومراجعة نقاط الاتصال والفرص القطاعية.',
  'TSK-004':
    'إعداد دراسة جدوى أولية لمركز الذكاء الاصطناعي المشترك، مع تقدير التكاليف والمخاطر والمتطلبات التنظيمية.',
  'TSK-005':
    'صياغة مسودة بروتوكول الأمن السيبراني للتعاون مع العراق ومواءمتها مع سياسات الوزارة والأطر الوطنية.',
}

const ACTIVITY = [
  { id: 'a1', user: 'أحمد المنصوري', action: 'تم إنشاء المهمة', time: '2026-07-28 09:15' },
  { id: 'a2', user: 'سارة الراشدي', action: 'أُضيفت ملاحظات للمراجعة', time: '2026-08-01 11:40' },
  { id: 'a3', user: 'خالد إبراهيم', action: 'تم تحديث تاريخ الاستحقاق', time: '2026-08-03 14:05' },
]

const ATTACHMENTS = [
  { id: 'f1', name: 'مسودة_المهمة.pdf', size: '420 KB' },
  { id: 'f2', name: 'ملاحظات_المراجعة.docx', size: '88 KB' },
]

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { showToast, isRtl } = useApp()

  const base = useMemo(
    () => TASKS.find((t) => t.id === id) ?? TASKS[0],
    [id],
  )

  const [status, setStatus] = useState(base.status)
  const [sla, setSla] = useState<SlaLevel>(base.sla)
  const [priority, setPriority] = useState<'عالية' | 'متوسطة' | 'منخفضة'>(
    base.sla === 'red' ? 'عالية' : base.sla === 'yellow' ? 'متوسطة' : 'منخفضة',
  )
  const [notes, setNotes] = useState('')
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([
    { id: 'c1', user: 'سارة الراشدي', text: 'يرجى إرفاق النسخة المحدّثة قبل نهاية الأسبوع.', time: '2026-08-04 16:20' },
    { id: 'c2', user: base.owner, text: 'سأرفع المسودة بعد مراجعة الشؤون القانونية.', time: '2026-08-05 10:05' },
  ])

  const description =
    DESCRIPTIONS[base.id] ??
    `تفاصيل إضافية حول المهمة «${base.name}» ضمن نطاق ${base.module}. تشمل المتابعة والتنسيق مع الأطراف المعنية حتى الإنجاز.`

  const slaCfg = SLA_CFG[sla]
  const SlaIcon = slaCfg.Icon

  const updateStatus = (next: string) => {
    setStatus(next)
    setSla(STATUS_SLA[next] ?? 'green')
    showToast(`تم تحديث الحالة إلى «${next}»`)
  }

  const saveNotes = () => {
    showToast('تم حفظ ملاحظات المهمة')
  }

  const addComment = () => {
    if (!comment.trim()) return
    setComments((prev) => [
      {
        id: `c${Date.now()}`,
        user: 'م. أحمد المحمد',
        text: comment.trim(),
        time: new Date().toLocaleString('ar-SA'),
      },
      ...prev,
    ])
    setComment('')
    showToast('تم إضافة التعليق')
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        title={base.name}
        subtitle={`${base.id} · ${base.nameEn}`}
        actions={
          <Link href="/tasks" className="btn border-border text-sm no-underline gap-1.5">
            <ArrowLeft size={14} /> قائمة المهام
          </Link>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-5 lg:col-span-2">
          <div className="card space-y-4 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${slaCfg.className}`}>
                <SlaIcon size={13} /> {slaCfg.label}
              </span>
              <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                {base.module}
              </span>
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                أولوية: {priority}
              </span>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-bold text-foreground">الوصف</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-bold text-foreground">ملاحظات داخلية</h2>
              <textarea
                className="input-base min-h-[100px] resize-y text-sm"
                value={notes}
                placeholder="أضف ملاحظات للمتابعة…"
                onChange={(e) => setNotes(e.target.value)}
              />
              <button type="button" onClick={saveNotes} className="btn btn-primary mt-2 gap-1.5 text-sm">
                <Save size={14} /> حفظ الملاحظات
              </button>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
              <Paperclip size={15} className="text-brand" /> المرفقات
            </h2>
            <ul className="space-y-2">
              {ATTACHMENTS.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5"
                >
                  <span className="text-sm font-medium text-foreground">{f.name}</span>
                  <span className="text-[11px] text-muted-foreground">{f.size}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
              <MessageSquare size={15} className="text-brand" /> التعليقات
            </h2>
            <div className="mb-4 flex gap-2">
              <input
                className="input-base flex-1 text-sm"
                value={comment}
                placeholder="اكتب تعليقاً…"
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addComment()}
              />
              <button type="button" onClick={addComment} className="btn btn-primary text-sm shrink-0">
                إرسال
              </button>
            </div>
            <ul className="space-y-3">
              {comments.map((c) => (
                <li key={c.id} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-foreground">{c.user}</span>
                    <span className="text-[10px] text-muted-foreground" dir="ltr">
                      {c.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{c.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Side */}
        <div className="space-y-5">
          <div className="card space-y-4 p-5">
            <h2 className="text-sm font-bold text-foreground">تفاصيل المهمة</h2>

            <InfoRow icon={Tag} label="المعرّف">
              <span className="font-mono text-xs">{base.id}</span>
            </InfoRow>
            <InfoRow icon={User} label="المسؤول">
              {base.owner}
            </InfoRow>
            <InfoRow icon={Calendar} label="الاستحقاق">
              <span dir="ltr">{base.due}</span>
            </InfoRow>
            <InfoRow icon={Tag} label="النطاق">
              {base.module}
            </InfoRow>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">الحالة</label>
              <select
                value={status}
                onChange={(e) => updateStatus(e.target.value)}
                className="input-base text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">الأولوية</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                className="input-base text-sm"
              >
                <option value="عالية">عالية</option>
                <option value="متوسطة">متوسطة</option>
                <option value="منخفضة">منخفضة</option>
              </select>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-3 text-sm font-bold text-foreground">سجل النشاط</h2>
            <ul className="space-y-3">
              {ACTIVITY.map((a) => (
                <li key={a.id} className="relative border-s-2 border-brand/30 ps-3">
                  <p className="text-xs font-semibold text-foreground">{a.action}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {a.user} · <span dir="ltr">{a.time}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof User
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 rounded-md bg-primary/10 p-1.5">
        <Icon size={13} className="text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{children}</p>
      </div>
    </div>
  )
}
