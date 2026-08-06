'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ThumbsUp, ThumbsDown, Minus, CheckCircle2, X,
  Vote, PenTool, Calendar, Users, ArrowLeft,
  ShieldCheck, FileText, Clock,
} from 'lucide-react'
import { PageHeader, SlaBadge } from '@/components/ui-kit'
import { MEETINGS, COMMITTEES, DECISIONS } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'

const ID_MAP: Record<string, string> = {
  '1': 'dec-003',
  'mining-2026': 'dec-003',
}

type MemberVote = 'for' | 'against' | 'abstain' | 'pending'

const VOTING_MEMBERS: { id: string; nameAr: string; role: string; avatar: string; vote: MemberVote }[] = [
  { id: 'vm1', nameAr: 'معالي بندر الخريف', role: 'رئيس اللجنة', avatar: 'BK', vote: 'for' },
  { id: 'vm2', nameAr: 'م. فهد القحطاني', role: 'ممثل الصناعة', avatar: 'FK', vote: 'for' },
  { id: 'vm3', nameAr: 'د. نورة الحربي', role: 'ممثل الطاقة', avatar: 'NH', vote: 'for' },
  { id: 'vm4', nameAr: 'م. سلطان الدوسري', role: 'ممثل الاستثمار', avatar: 'SD', vote: 'abstain' },
  { id: 'vm5', nameAr: 'د. ماجد العتيبي', role: 'خبير فني', avatar: 'ME', vote: 'pending' },
  { id: 'vm6', nameAr: 'أ. لينا الشهري', role: 'مستشار قانوني', avatar: 'LS', vote: 'pending' },
  { id: 'vm7', nameAr: 'م. أحمد المحمد', role: 'مدير التعاون الدولي', avatar: 'AM', vote: 'pending' },
  { id: 'vm8', nameAr: 'د. خالد الغامدي', role: 'ممثل التخطيط', avatar: 'KG', vote: 'for' },
]

type VoteChoice = 'for' | 'against' | 'abstain' | null

export default function VotingPage() {
  const { id } = useParams<{ id: string }>()
  const resolvedDecisionId = ID_MAP[id] || id
  const decision =
    DECISIONS.find((d) => d.id === resolvedDecisionId) ??
    DECISIONS.find((d) => d.column === 'pending') ??
    DECISIONS[0]
  const committee = COMMITTEES.find((c) => c.id === decision.committeeId)
  const meeting =
    MEETINGS.find((m) => m.committeeId === decision.committeeId) ?? MEETINGS[0]
  const { showToast } = useApp()

  const [myVote, setMyVote] = useState<VoteChoice>(null)
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [votingEnded, setVotingEnded] = useState(false)
  const [showSignModal, setShowSignModal] = useState(false)
  const [signed, setSigned] = useState(false)
  const [memberVotes, setMemberVotes] = useState(VOTING_MEMBERS)

  const votesFor = memberVotes.filter((v) => v.vote === 'for').length
  const votesAgainst = memberVotes.filter((v) => v.vote === 'against').length
  const votesAbstain = memberVotes.filter((v) => v.vote === 'abstain').length
  const votesPending = memberVotes.filter((v) => v.vote === 'pending').length
  const total = memberVotes.length

  const submitVote = () => {
    if (!myVote) return
    setMemberVotes((prev) =>
      prev.map((m) => (m.nameAr === 'م. أحمد المحمد' ? { ...m, vote: myVote as MemberVote } : m)),
    )
    setSubmitted(true)
    showToast(`تم تسجيل تصويتك: ${myVote === 'for' ? 'موافق' : myVote === 'against' ? 'رافض' : 'ممتنع'}`)
  }

  const endVote = () => {
    setVotingEnded(true)
    showToast('تم إنهاء التصويت وإغلاق الجلسة')
  }

  const handleSign = async () => {
    await new Promise((r) => setTimeout(r, 800))
    setSigned(true)
    setShowSignModal(false)
    showToast('تم التوقيع الرقمي على القرار بنجاح')
  }

  const voteBarWidth = (n: number) => `${(n / total) * 100}%`

  return (
    <div className="space-y-5">
      <PageHeader
        title="تفاصيل القرار والتصويت"
        subtitle={`${decision.titleAr} — ${committee?.nameAr ?? ''}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/committees/voting"
              className="btn btn-ghost border border-[var(--color-border)] text-xs no-underline"
            >
              <ArrowLeft size={13} /> قائمة القرارات
            </Link>
            <Link
              href={`/committees/meetings/${meeting.id.includes('mining') || decision.committeeId === 'mining-2026' ? 'mining-2026' : meeting.id}/workspace`}
              className="btn btn-ghost border border-[var(--color-border)] text-xs no-underline"
            >
              <ArrowLeft size={13} /> مساحة العمل
            </Link>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        {/* Left — Decision + voting */}
        <div className="space-y-4">
          {/* Decision card */}
          <div className="card border-[var(--color-gold)] border-2 p-5">
            <div className="mb-1 flex items-start justify-between gap-3">
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-gold)]">
                  القرار المطروح للتصويت
                </p>
                <h2 className="text-base font-bold leading-snug text-[var(--color-text)]">
                  {decision.titleAr}
                </h2>
              </div>
              <SlaBadge
                status={decision.priority === 'high' ? 'red' : decision.priority === 'medium' ? 'yellow' : 'green'}
                label={decision.priority === 'high' ? 'أولوية عالية' : decision.priority === 'medium' ? 'أولوية متوسطة' : 'أولوية منخفضة'}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1"><Calendar size={12} /> {decision.date}</span>
              <span className="flex items-center gap-1"><Users size={12} /> {total} مصوّت</span>
              <span className="flex items-center gap-1"><Vote size={12} /> {votesPending} تصويت معلّق</span>
            </div>
          </div>

          {/* My vote (if not submitted) */}
          {!submitted && !votingEnded && (
            <div className="card p-5">
              <h3 className="mb-4 text-sm font-bold text-[var(--color-text)]">صوّت الآن</h3>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { choice: 'for' as const, icon: ThumbsUp, label: 'موافق', color: 'bg-emerald-500/15 border-emerald-500 text-emerald-700' },
                    { choice: 'against' as const, icon: ThumbsDown, label: 'رافض', color: 'bg-red-500/15 border-red-500 text-red-700' },
                    { choice: 'abstain' as const, icon: Minus, label: 'ممتنع', color: 'bg-gray-500/15 border-gray-400 text-gray-600' },
                  ] as const
                ).map(({ choice, icon: Icon, label, color }) => (
                  <button
                    key={choice}
                    onClick={() => setMyVote(choice)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:scale-105 ${
                      myVote === choice ? color : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-sm font-bold">{label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-semibold text-[var(--color-text-muted)]">
                  ملاحظة (اختياري)
                </label>
                <textarea
                  className="input-base h-16 resize-none py-2 text-sm"
                  placeholder="أضف تعليقاً أو تحفظاً على هذا القرار…"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <button
                onClick={submitVote}
                disabled={!myVote}
                className="mt-4 btn btn-primary w-full text-sm disabled:opacity-40"
              >
                <Vote size={15} /> تأكيد التصويت
              </button>
            </div>
          )}

          {/* After submit */}
          {submitted && !votingEnded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card border-emerald-400 border p-5"
            >
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 size={20} />
                <span className="font-bold">تم تسجيل تصويتك بنجاح</span>
              </div>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                تصويتك:{' '}
                <span className={`font-semibold ${myVote === 'for' ? 'text-emerald-600' : myVote === 'against' ? 'text-red-600' : 'text-gray-500'}`}>
                  {myVote === 'for' ? 'موافق' : myVote === 'against' ? 'رافض' : 'ممتنع'}
                </span>
                {reason && <span className="ms-1 text-[var(--color-text-muted)]">— «{reason}»</span>}
              </p>
              <button
                onClick={endVote}
                className="mt-4 btn w-full border-2 border-[var(--color-brand)] bg-transparent text-sm font-bold text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white"
              >
                إنهاء التصويت وإغلاق الجلسة
              </button>
            </motion.div>
          )}

          {/* Voting ended */}
          {votingEnded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-5 text-center"
            >
              <CheckCircle2 size={32} className="mx-auto mb-2 text-[var(--color-brand)]" />
              <h3 className="text-base font-bold text-[var(--color-text)]">
                {votesFor > votesAgainst ? 'اعتُمد القرار' : 'رُفض القرار'}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {votesFor} موافق — {votesAgainst} رافض — {votesAbstain} ممتنع
              </p>
              {!signed ? (
                <button
                  onClick={() => setShowSignModal(true)}
                  className="mx-auto mt-4 btn btn-primary flex items-center gap-2 text-sm"
                >
                  <PenTool size={15} /> إنهاء التصويت والتوقيع
                </button>
              ) : (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600">
                  <ShieldCheck size={16} /> تم التوقيع الرقمي وإرسال القرار
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right — results + members */}
        <div className="space-y-4">
          {/* Live results */}
          <div className="card p-4">
            <h3 className="mb-3 text-sm font-bold text-[var(--color-text)]">نتائج التصويت الآنية</h3>
            <div className="space-y-3">
              {[
                { label: 'موافق', count: votesFor, color: 'bg-emerald-500' },
                { label: 'رافض', count: votesAgainst, color: 'bg-red-500' },
                { label: 'ممتنع', count: votesAbstain, color: 'bg-gray-400' },
                { label: 'لم يصوّت', count: votesPending, color: 'bg-amber-400' },
              ].map(({ label, count, color }) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-[var(--color-text-muted)]">{label}</span>
                    <span className="font-bold text-[var(--color-text)]">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--color-gray-200)]">
                    <motion.div
                      className={`h-2 rounded-full ${color}`}
                      initial={{ width: 0 }}
                      animate={{ width: voteBarWidth(count) }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-[var(--color-border)] pt-3 text-center text-xs text-[var(--color-text-muted)]">
              الإجمالي: {total} مصوّت — النصاب: {Math.ceil(total / 2) + 1}
            </div>
          </div>

          {/* Member votes */}
          <div className="card p-4">
            <h3 className="mb-3 text-sm font-bold text-[var(--color-text)]">أصوات الأعضاء</h3>
            <div className="space-y-1.5">
              {memberVotes.map((m) => (
                <div key={m.id} className="flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)]/15 text-[9px] font-bold text-[var(--color-brand)]">
                    {m.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium text-[var(--color-text)]">{m.nameAr}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{m.role}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      m.vote === 'for'
                        ? 'bg-emerald-500/15 text-emerald-700'
                        : m.vote === 'against'
                          ? 'bg-red-500/15 text-red-700'
                          : m.vote === 'abstain'
                            ? 'bg-gray-500/15 text-gray-600'
                            : 'bg-amber-500/15 text-amber-700'
                    }`}
                  >
                    {m.vote === 'for' ? 'موافق' : m.vote === 'against' ? 'رافض' : m.vote === 'abstain' ? 'ممتنع' : 'معلّق'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sign modal */}
      <AnimatePresence>
        {showSignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setShowSignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card w-full max-w-sm p-6 text-center shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <ShieldCheck size={40} className="mx-auto mb-3 text-[var(--color-brand)]" />
              <h2 className="mb-1 text-base font-bold text-[var(--color-text)]">تأكيد التوقيع الرقمي</h2>
              <p className="mb-5 text-sm text-[var(--color-text-muted)]">
                سيتم توقيع القرار رقمياً باسم «م. أحمد المحمد» وإرساله إلى جميع أطراف الاتفاقية.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleSign}
                  className="flex-1 btn btn-primary text-sm"
                >
                  <PenTool size={14} /> توقيع وإرسال
                </button>
                <button
                  onClick={() => setShowSignModal(false)}
                  className="btn btn-ghost border border-[var(--color-border)] text-sm"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
