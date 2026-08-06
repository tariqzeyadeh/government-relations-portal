'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ArrowLeft,
  Bookmark, Highlighter, MessageSquare, Download, LayoutList,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit'
import { MEETINGS, COMMITTEES } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'

const ID_MAP: Record<string, string> = {
  '1': 'mtg-mining-2026-02',
  'mining-2026': 'mtg-mining-2026-02',
}

// ── Fake document sections ───────────────────────────────────────────────────
const DOCUMENT_SECTIONS = [
  {
    id: 'sec1',
    heading: 'ملخص تنفيذي',
    content: `تهدف لجنة التعدين والمعادن المشتركة إلى تعزيز التعاون الثنائي في مجالات التنقيب عن المعادن الحيوية واستخراجها وتصنيعها. تأسست اللجنة وفقاً للمادة الثانية عشرة من الاتفاقية الإطارية للتعاون الصناعي الموقعة في مسقط عام 2021.

تتمحور أعمال الجلسة الثانية حول ثلاثة محاور استراتيجية: إطار استكشاف الليثيوم مع المملكة الأسترالية، وحالة مذكرة التفاهم المتعلقة بسلسلة توريد المعادن النادرة، وخط أنابيب الاستثمار للربع الثالث من عام 2026.`,
  },
  {
    id: 'sec2',
    heading: 'إطار استكشاف الليثيوم مع أستراليا',
    content: `بناءً على مباحثات الجلسة الافتتاحية في مايو 2026، أعدّ الفريق الفني المشترك مسودة إطار الليثيوم (الإصدار 3.2) التي تتضمن:

١. آلية تقاسم البيانات الجيولوجية بين هيئة المساحة الجيولوجية السعودية ونظيرتها الأسترالية (Geoscience Australia)
٢. نموذج المشاريع المشتركة في منطقتي تبوك والجوف باحتياطيات مقدّرة بـ 4.2 مليون طن من كربونات الليثيوم المكافئة
٣. إطار التمويل المشترك بمساهمة صندوق الاستثمارات العامة (PIF) بنسبة 40% من رأس المال الاستثماري

يُوصي الفريق الفني باعتماد المسودة مع إدراج التعديلات القانونية الواردة في الملحق (جـ).`,
  },
  {
    id: 'sec3',
    heading: 'حالة مذكرة التفاهم — المعادن النادرة',
    content: `تُعدّ المعادن النادرة من الأصول الاستراتيجية عالية الأولوية في ظل التنافس الدولي المتصاعد على سلاسل التوريد. تُغطّي مذكرة التفاهم المقترحة العناصر الأرضية النادرة (REE) السبعة عشر، مع التركيز على النيوديميوم والبراسيوديميوم للتطبيقات الكهربائية.

الموقف الحالي: أكملت إدارة الشؤون القانونية مراجعة المسودة وأبدت تحفظات على المادة (7) المتعلقة بآلية تسوية النزاعات. يُقترح استبدال التحكيم الدولي (ICC) بمركز التحكيم التجاري الخليجي وفقاً لتوجيهات إدارة الشؤون القانونية المؤرخة 2026/08/01.`,
  },
  {
    id: 'sec4',
    heading: 'خط أنابيب الاستثمار — الربع الثالث 2026',
    content: `يتضمن خط الاستثمار للربع الثالث أربعة مشاريع استثمارية جديدة بقيمة إجمالية تبلغ 1.28 مليار ريال:

• مشروع التعدين الشمالي (منطقة الحدود الشمالية): 480 مليون ريال — شريك أسترالي
• مصنع معالجة الليثيوم أوليان (المنطقة الصناعية بالجبيل): 320 مليون ريال — شراكة محلية دولية
• استكشاف الكوبالت والمنجنيز (منطقة الباحة): 260 مليون ريال — مرحلة الجدوى
• برنامج التدريب المهني المشترك مع TAFE Australia: 220 مليون ريال — مرحلة التنفيذ

يُرجى اعتماد المشاريع المذكورة واتخاذ قرار بشأن تشكيل فريق التفاوض للمشروع الأول.`,
  },
  {
    id: 'sec5',
    heading: 'التوصيات والقرارات المقترحة',
    content: `بناءً على ما سبق عرضه، يوصي الفريق الفني المشترك بما يلي:

القرار (أ): اعتماد إطار استكشاف الليثيوم (الإصدار 3.2) مع التعديلات القانونية الواردة في الملحق (جـ) والتوجيه بتوقيعه قبل 2026/09/01.

القرار (ب): تكليف إدارة الشؤون القانونية بالتفاوض على صياغة بديلة للمادة (7) من مذكرة التفاهم — المعادن النادرة وعرضها على اللجنة للتصويت خلال 14 يوماً.

القرار (جـ): اعتماد مشاريع خط أنابيب الاستثمار الأربعة وتشكيل فرق التفاوض المتخصصة بحلول 2026/08/20.`,
  },
]

export default function DocumentReadPage() {
  const { id } = useParams<{ id: string }>()
  const resolvedId = ID_MAP[id] || id
  const meeting = MEETINGS.find((m) => m.id === resolvedId) ?? MEETINGS[0]
  const committee = COMMITTEES.find((c) => c.id === meeting.committeeId)
  const { showToast } = useApp()

  const [fontSize, setFontSize] = useState(15)
  const [currentSection, setCurrentSection] = useState(0)
  const [highlights, setHighlights] = useState<Record<string, boolean>>({})
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({})

  const section = DOCUMENT_SECTIONS[currentSection]
  const canPrev = currentSection > 0
  const canNext = currentSection < DOCUMENT_SECTIONS.length - 1

  const zoomIn = () => setFontSize((s) => Math.min(s + 2, 24))
  const zoomOut = () => setFontSize((s) => Math.max(s - 2, 10))

  const toggleHighlight = (id: string) => {
    setHighlights((h) => ({ ...h, [id]: !h[id] }))
    showToast(highlights[id] ? 'تم إلغاء التظليل' : 'تم تظليل القسم')
  }

  const toggleBookmark = (id: string) => {
    setBookmarks((b) => ({ ...b, [id]: !b[id] }))
    showToast(bookmarks[id] ? 'تمت إزالة الإشارة المرجعية' : 'تمت إضافة إشارة مرجعية')
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="قراءة وثائق الاجتماع"
        subtitle={`${meeting.titleAr} — ${committee?.nameAr ?? ''}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/committees/meetings/${id}/workspace`}
              className="btn btn-ghost border border-[var(--color-border)] text-xs no-underline"
            >
              <ArrowLeft size={13} /> العودة لمساحة العمل
            </Link>
            <button
              onClick={() => showToast('جارٍ تحميل المستند…')}
              className="btn btn-primary text-xs"
            >
              <Download size={13} /> تحميل PDF
            </button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        {/* TOC sidebar */}
        <div className="card p-4">
          <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-[var(--color-text)] uppercase tracking-wide">
            <LayoutList size={13} /> فهرس المحتويات
          </h3>
          <nav className="space-y-1">
            {DOCUMENT_SECTIONS.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setCurrentSection(idx)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-right text-xs transition-colors ${
                  idx === currentSection
                    ? 'bg-[var(--color-brand)] text-white font-semibold'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-text)]'
                }`}
              >
                <span className={`shrink-0 rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold ${idx === currentSection ? 'bg-white/25 text-white' : 'bg-[var(--color-gray-200)] text-[var(--color-text-muted)]'}`}>
                  {idx + 1}
                </span>
                <span className="text-right leading-snug">{sec.heading}</span>
                {bookmarks[sec.id] && <Bookmark size={10} className="ms-auto shrink-0 fill-current" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Document viewer */}
        <div className="card overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5">
            <span className="text-xs text-[var(--color-text-muted)]">
              {currentSection + 1} / {DOCUMENT_SECTIONS.length}
            </span>
            <div className="flex-1" />
            <span className="text-xs text-[var(--color-text-muted)]">حجم الخط: {fontSize}px</span>
            <button
              onClick={zoomOut}
              disabled={fontSize <= 10}
              className="flex h-7 w-7 items-center justify-center rounded border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-gray-100)] disabled:opacity-40"
              title="تصغير النص (A-)"
            >
              <ZoomOut size={14} />
            </button>
            <span className="w-6 text-center text-xs font-bold text-[var(--color-brand)]">A</span>
            <button
              onClick={zoomIn}
              disabled={fontSize >= 24}
              className="flex h-7 w-7 items-center justify-center rounded border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-gray-100)] disabled:opacity-40"
              title="تكبير النص (A+)"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => toggleHighlight(section.id)}
              className={`flex h-7 items-center gap-1 rounded border px-2 text-xs transition-colors ${highlights[section.id] ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/15 text-[var(--color-gold)]' : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-gray-100)]'}`}
            >
              <Highlighter size={13} /> تظليل
            </button>
            <button
              onClick={() => toggleBookmark(section.id)}
              className={`flex h-7 items-center gap-1 rounded border px-2 text-xs transition-colors ${bookmarks[section.id] ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/15 text-[var(--color-brand)]' : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-gray-100)]'}`}
            >
              <Bookmark size={13} /> إشارة
            </button>
            <button
              onClick={() => showToast('تمت إضافة تعليق توضيحي')}
              className="flex h-7 items-center gap-1 rounded border border-[var(--color-border)] px-2 text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-gray-100)]"
            >
              <MessageSquare size={13} /> تعليق
            </button>
          </div>

          {/* Content */}
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`p-6 sm:p-8 ${highlights[section.id] ? 'bg-[var(--color-gold)]/8' : ''}`}
          >
            <h2 className="mb-5 border-b border-[var(--color-border)] pb-3 text-base font-bold text-[var(--color-text)]">
              {section.heading}
            </h2>
            <div
              className="leading-loose text-[var(--color-text)] whitespace-pre-line"
              style={{ fontSize: `${fontSize}px` }}
            >
              {section.content}
            </div>
          </motion.div>

          {/* Navigation footer */}
          <div className="flex items-center justify-between border-t border-[var(--color-border)] px-6 py-3">
            <button
              onClick={() => setCurrentSection((s) => s - 1)}
              disabled={!canPrev}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-gray-100)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={14} /> القسم السابق
            </button>

            <div className="flex gap-1.5">
              {DOCUMENT_SECTIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSection(i)}
                  className={`h-1.5 rounded-full transition-all ${i === currentSection ? 'w-6 bg-[var(--color-brand)]' : 'w-1.5 bg-[var(--color-gray-300)]'}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSection((s) => s + 1)}
              disabled={!canNext}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-gray-100)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              البند التالي <ChevronLeft size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
