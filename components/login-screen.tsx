'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Shield, Eye, EyeOff, Smartphone, Lock, Mail, ChevronRight, Fingerprint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useApp, type UserRole } from '@/lib/app-context'
import { cn } from '@/lib/utils'

const ROLE_BUTTONS: { role: UserRole; label: string; subtitle: string; accent: string; dot: string }[] = [
  {
    role: 'executive',
    label: 'Login as Executive',
    subtitle: 'H.E. Ahmed Al-Mansouri',
    accent: 'hover:bg-amber-500/10 hover:border-amber-500/40',
    dot: 'bg-amber-400',
  },
  {
    role: 'committee_member',
    label: 'Login as Committee Member',
    subtitle: 'Dr. Sara Al-Rashidi',
    accent: 'hover:bg-blue-500/10 hover:border-blue-500/40',
    dot: 'bg-blue-400',
  },
  {
    role: 'system_admin',
    label: 'Login as System Admin',
    subtitle: 'Eng. Khalid Ibrahim',
    accent: 'hover:bg-slate-500/10 hover:border-slate-500/40',
    dot: 'bg-slate-400',
  },
]

export function LoginScreen() {
  const { login } = useApp()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('ahmed.almansouri@mofa.gov')
  const [password, setPassword] = useState('••••••••••')
  const [mfaCode, setMfaCode] = useState('')
  const [mfaStep, setMfaStep] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCredentialLogin = () => setMfaStep(true)

  const handleMfaSubmit = () => {
    setLoading(true)
    setTimeout(() => { login('executive'); setLoading(false) }, 800)
  }

  const handleQuickLogin = (role: UserRole) => {
    setLoading(true)
    setTimeout(() => { login(role); setLoading(false) }, 500)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — Etimad brand */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden bg-[#0d1f14] p-12">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Green glow blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#1b6b45] opacity-[0.18] blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#1b6b45] opacity-[0.12] blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-[#22c55e] opacity-[0.06] blur-2xl -translate-x-1/2 -translate-y-1/2" />

        {/* Etimad Logo */}
        <div className="relative z-10">
          <Image
            src="/etimad-logo.png"
            alt="Etimad"
            width={200}
            height={80}
            className="object-contain h-20 w-auto"
            priority
          />
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight text-balance">
              Diplomatic Relations,<br />
              <span className="text-[#22c55e]">Intelligently Managed</span>
            </h2>
            <p className="text-[14px] text-white/50 mt-4 leading-relaxed max-w-sm">
              A secure, enterprise-grade platform for GCC bilateral relations, MoU tracking, committee management, and diplomatic event coordination.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['GCC Relations', 'MoU Tracking', 'Committee Mgmt', 'Task Management', 'Reports & KPIs'].map((f) => (
              <span key={f} className="text-[11px] px-3 py-1.5 rounded-full bg-white/6 text-white/60 border border-white/8 font-medium">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] text-white/40">All systems operational</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <span className="text-[11px] text-white/30">ISO 27001 · TLS 1.3</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Image
              src="/etimad-logo.png"
              alt="Etimad"
              width={160}
              height={64}
              className="object-contain h-14 w-auto"
              priority
            />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {mfaStep ? 'Verify Identity' : 'Sign In'}
              </h1>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] gap-1 px-2 py-1">
                <Lock className="w-2.5 h-2.5" /> TLS 1.3
              </Badge>
            </div>
            <p className="text-[13px] text-muted-foreground mt-1.5">
              {mfaStep
                ? 'Enter the 6-digit code sent to your registered device'
                : 'Step 1 of 2 — Enter your government credentials'}
            </p>
          </div>

          {!mfaStep ? (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Official Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-muted/50 border-border/60 text-[13px] transition-all focus:ring-2 focus:ring-primary/20"
                    placeholder="username@ministry.gov"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Password
                  </Label>
                  <button type="button" className="text-[11px] text-primary hover:underline">Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-11 h-11 rounded-xl bg-muted/50 border-border/60 text-[13px] transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* MFA notice */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-700/30">
                <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] font-semibold text-amber-800 dark:text-amber-300">MFA Required</p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400/80 mt-0.5 leading-relaxed">
                    A one-time code will be sent after credential verification.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleCredentialLogin}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-[13px] shadow-md shadow-primary/25 hover:shadow-primary/35 hover:brightness-105 transition-all duration-150"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col items-center py-4 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Fingerprint className="w-7 h-7 text-primary" />
                </div>
                <p className="text-[12px] text-muted-foreground text-center">
                  Code sent to <span className="font-semibold text-foreground">{email}</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mfa" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  One-Time Password
                </Label>
                <Input
                  id="mfa"
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center h-14 text-3xl tracking-[0.5em] rounded-xl bg-muted/50 border-border/60 font-mono transition-all focus:ring-2 focus:ring-primary/20"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleMfaSubmit}
                disabled={loading}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-[13px] shadow-md shadow-primary/25 hover:brightness-105 transition-all duration-150"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>
              <button
                type="button"
                onClick={() => setMfaStep(false)}
                className="w-full text-[12px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to credentials
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-[11px] text-muted-foreground">Quick access for demo</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          {/* Quick login buttons */}
          <div className="space-y-2">
            {ROLE_BUTTONS.map((item) => (
              <button
                key={item.role}
                onClick={() => handleQuickLogin(item.role)}
                disabled={loading}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border/60 text-foreground transition-all duration-150 disabled:opacity-50 hover:-translate-y-px hover:shadow-sm',
                  item.accent
                )}
              >
                <div className="flex items-center gap-3 text-left">
                  <span className={cn('w-2 h-2 rounded-full shrink-0', item.dot)} />
                  <div>
                    <div className="text-[12px] font-semibold">{item.label}</div>
                    <div className="text-[11px] text-muted-foreground">{item.subtitle}</div>
                  </div>
                </div>
                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            ))}
          </div>

          <p className="text-center text-[11px] text-muted-foreground/60 mt-8">
            © 2026 Ministry of Foreign Affairs · All rights reserved
          </p>
        </div>
      </div>
    </div>
  )
}
