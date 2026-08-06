'use client'

import { useMemo, useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useApp } from '@/lib/app-context'

function LoginInner() {
  const { login, isLoggedIn, logout } = useApp()
  const router = useRouter()
  const search = useSearchParams()
  const forceMfa = search.get('mfa') === '1'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mfa, setMfa] = useState(forceMfa)
  const [otp, setOtp] = useState('')
  const [seconds, setSeconds] = useState(60)

  useEffect(() => {
    if (isLoggedIn && !mfa) {
      // coming from sidebar login link already logged out
    }
  }, [isLoggedIn, mfa])

  useEffect(() => {
    if (!mfa) return
    if (seconds <= 0) return
    const t = window.setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [mfa, seconds])

  const canResend = seconds <= 0

  const startLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setMfa(true)
    setSeconds(60)
  }

  const confirmOtp = (e: React.FormEvent) => {
    e.preventDefault()
    login()
    router.push('/portal')
  }

  const pattern = useMemo(
    () => (
      <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="geo" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="#2fa9e0" strokeWidth="0.6" />
            <circle cx="20" cy="20" r="2" fill="#2fa9e0" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo)" />
      </svg>
    ),
    [],
  )

  return (
    <div className="flex min-h-screen flex-col lg:flex-row" dir="rtl">
      {/* Pattern panel */}
      <div className="relative hidden min-h-[220px] flex-1 overflow-hidden bg-brand3 lg:block">
        {pattern}
        <div className="relative z-10 flex h-full flex-col justify-end p-10 text-white">
          <p className="text-sm text-brand2">المملكة العربية السعودية</p>
          <h2 className="mt-2 max-w-md text-2xl font-bold leading-relaxed">
            International Relations & Government Committees Portal
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/80">
            منصة مؤسسية آمنة لإدارة العلاقات الثنائية، المذكرات، اللجان، والتنسيق الدبلوماسي.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center bg-[var(--color-bg)] p-6 sm:p-10">
        <div className="card w-full max-w-md p-6 sm:p-8">
          <div className="mb-6 text-center lg:hidden">
            <p className="text-xs text-brand2">المملكة العربية السعودية</p>
            <h1 className="mt-1 text-lg font-bold text-[var(--color-brand)]">
              International Relations & Government Committees Portal
            </h1>
          </div>

          <h1 className="mb-1 text-xl font-bold text-[var(--color-text)]">تسجيل الدخول</h1>
          <p className="mb-6 text-sm text-[var(--color-text-muted)]">
            أدخل بيانات الاعتماد للمتابعة إلى البوابة
          </p>

          {!mfa ? (
            <form onSubmit={startLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium">اسم المستخدم</label>
                <input
                  className="input-base"
                  placeholder="admin@ministry.gov.sa"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">كلمة المرور</label>
                <input
                  type="password"
                  className="input-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                تسجيل الدخول
              </button>
              <button
                type="button"
                className="btn w-full border-[var(--color-brand)] text-[var(--color-brand)]"
                onClick={() => {
                  setMfa(true)
                  setSeconds(60)
                }}
              >
                الدخول عبر النفاذ الوطني الموحد (Nafath)
              </button>
            </form>
          ) : (
            <form onSubmit={confirmOtp} className="space-y-4">
              <div className="rounded-lg border border-brand/40 bg-brand/10 p-3 text-sm">
                تم إرسال رمز التحقق لمرة واحدة (OTP) إلى جوالك المسجّل.
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">رمز التحقق (OTP)</label>
                <input
                  className="input-base tracking-[0.4em] text-center text-lg"
                  maxLength={6}
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                تأكيد الرمز
              </button>
              <button
                type="button"
                disabled={!canResend}
                onClick={() => setSeconds(60)}
                className="btn w-full disabled:opacity-50"
              >
                {canResend ? 'إعادة إرسال الرمز' : `إعادة إرسال الرمز (${seconds}ث)`}
              </button>
              <button type="button" className="text-xs text-[var(--color-brand)]" onClick={() => setMfa(false)}>
                العودة لتسجيل الدخول
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">…</div>}>
      <LoginInner />
    </Suspense>
  )
}
