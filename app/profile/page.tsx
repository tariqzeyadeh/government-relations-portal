'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Settings, Shield, Save, Moon, Sun, Globe, Smartphone, Mail } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { PROFILE } from '@/lib/mock-data'
import { PageHeader } from '@/components/ui-kit'

type Tab = 'personal' | 'prefs' | 'security'

const TABS: { id: Tab; labelAr: string; labelEn: string; icon: React.ElementType }[] = [
  { id: 'personal', labelAr: 'البيانات الشخصية', labelEn: 'Personal', icon: User },
  { id: 'prefs', labelAr: 'التفضيلات', labelEn: 'Preferences', icon: Settings },
  { id: 'security', labelAr: 'الأمان', labelEn: 'Security', icon: Shield },
]

export default function ProfilePage() {
  const { user, updateUser, showToast, darkMode, toggleDarkMode, language, setLanguage } = useApp()
  const isAr = language === 'ar'

  const [tab, setTab] = useState<Tab>('personal')
  const [mobile, setMobile] = useState(user?.mobile ?? PROFILE.mobile ?? '')
  const [altEmail, setAltEmail] = useState(user?.altEmail ?? PROFILE.altEmail ?? '')
  const [tabletNotif, setTabletNotif] = useState(true)
  const [emailDigest, setEmailDigest] = useState(false)
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  const savePersonal = () => {
    updateUser({ mobile, altEmail })
    showToast(isAr ? 'تم حفظ البيانات بنجاح' : 'Profile saved')
  }

  const savePassword = () => {
    if (!currentPw || !newPw || !confirmPw) {
      showToast(isAr ? 'يرجى ملء جميع الحقول' : 'Fill all fields')
      return
    }
    if (newPw !== confirmPw) {
      showToast(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match')
      return
    }
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
    showToast(isAr ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        title={isAr ? 'الملف الشخصي' : 'Profile'}
        subtitle={isAr ? 'إدارة بياناتك الشخصية وتفضيلاتك' : 'Manage your account details and preferences'}
      />

      {/* Avatar + summary */}
      <div className="card p-5 flex flex-wrap items-center gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-2xl font-bold text-white shadow">
          {PROFILE.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-[var(--color-text)]">{PROFILE.nameAr}</p>
          <p className="text-sm text-[var(--color-text-muted)]">{PROFILE.titleAr}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{PROFILE.email}</p>
        </div>
        <div className="text-xs text-[var(--color-text-muted)] text-end">
          <p>{isAr ? 'آخر تسجيل دخول' : 'Last login'}</p>
          <p className="font-medium text-[var(--color-text)]">
            {new Date(PROFILE.lastLogin).toLocaleString('ar-SA')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-1">
        {TABS.map(({ id, labelAr, labelEn, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-[var(--color-brand)] text-white shadow'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-elev)]'
            }`}
          >
            <Icon size={15} />
            {isAr ? labelAr : labelEn}
          </button>
        ))}
      </div>

      {/* Tab: Personal */}
      {tab === 'personal' && (
        <motion.div
          key="personal"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 space-y-5"
        >
          {/* Read-only fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
                {isAr ? 'الاسم الكامل (عربي)' : 'Full Name (Arabic)'}
              </label>
              <input
                readOnly
                value={PROFILE.nameAr}
                className="input-base opacity-60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
                {isAr ? 'الاسم (إنجليزي)' : 'Full Name (English)'}
              </label>
              <input
                readOnly
                value={PROFILE.nameEn}
                className="input-base opacity-60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
                {isAr ? 'البريد الإلكتروني الرسمي' : 'Official Email'}
              </label>
              <input
                readOnly
                value={PROFILE.email}
                className="input-base opacity-60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
                {isAr ? 'هاتف المكتب' : 'Office Phone'}
              </label>
              <input
                readOnly
                value={PROFILE.phone}
                className="input-base opacity-60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
                {isAr ? 'المسمى الوظيفي' : 'Job Title'}
              </label>
              <input
                readOnly
                value={PROFILE.titleAr}
                className="input-base opacity-60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
                {isAr ? 'الإدارة' : 'Department'}
              </label>
              <input
                readOnly
                value={PROFILE.departmentAr}
                className="input-base opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          <hr className="border-[var(--color-border)]" />
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
            {isAr ? 'بيانات قابلة للتعديل' : 'Editable Fields'}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--color-text)]">
                <Smartphone size={12} />
                {isAr ? 'رقم الجوال' : 'Mobile'}
              </label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+966 5X XXX XXXX"
                className="input-base"
                dir="ltr"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--color-text)]">
                <Mail size={12} />
                {isAr ? 'البريد البديل' : 'Alt Email'}
              </label>
              <input
                value={altEmail}
                onChange={(e) => setAltEmail(e.target.value)}
                placeholder="alternative@email.com"
                className="input-base"
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={savePersonal}
              className="btn btn-primary gap-2"
            >
              <Save size={15} />
              {isAr ? 'حفظ البيانات' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Tab: Preferences */}
      {tab === 'prefs' && (
        <motion.div
          key="prefs"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 space-y-5"
        >
          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-[var(--color-brand)]" />
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {isAr ? 'لغة الواجهة' : 'Interface Language'}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {isAr ? 'العربية / الإنجليزية' : 'Arabic / English'}
                </p>
              </div>
            </div>
            <div className="flex gap-1 rounded-lg border border-[var(--color-border)] p-1">
              <button
                onClick={() => setLanguage('ar')}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  language === 'ar' ? 'bg-[var(--color-brand)] text-white' : 'text-[var(--color-text-muted)]'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  language === 'en' ? 'bg-[var(--color-brand)] text-white' : 'text-[var(--color-text-muted)]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <hr className="border-[var(--color-border)]" />

          {/* Dark mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={18} className="text-brand" /> : <Sun size={18} className="text-brand2" />}
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {isAr ? 'الوضع الليلي' : 'Dark Mode'}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {darkMode ? (isAr ? 'مفعّل' : 'Enabled') : (isAr ? 'معطّل' : 'Disabled')}
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                darkMode ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-border)]'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <hr className="border-[var(--color-border)]" />

          {/* Notifications */}
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
            {isAr ? 'إعدادات الإشعارات' : 'Notification Settings'}
          </p>

          {[
            { label: isAr ? 'إشعارات اللوحة الإلكترونية' : 'Tablet notifications', value: tabletNotif, set: setTabletNotif },
            { label: isAr ? 'ملخص البريد اليومي' : 'Daily email digest', value: emailDigest, set: setEmailDigest },
            { label: isAr ? 'تنبيهات SMS للمهام العاجلة' : 'SMS alerts for urgent tasks', value: smsAlerts, set: setSmsAlerts },
          ].map(({ label, value, set }) => (
            <div key={label} className="flex items-center justify-between">
              <p className="text-sm text-[var(--color-text)]">{label}</p>
              <button
                onClick={() => set(!value)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  value ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-border)]'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    value ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={() => showToast(isAr ? 'تم حفظ التفضيلات' : 'Preferences saved')}
              className="btn btn-primary gap-2"
            >
              <Save size={15} />
              {isAr ? 'حفظ التفضيلات' : 'Save Preferences'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Tab: Security */}
      {tab === 'security' && (
        <motion.div
          key="security"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 space-y-5"
        >
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
            {isAr ? 'تغيير كلمة المرور' : 'Change Password'}
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-text)]">
                {isAr ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="input-base"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-text)]">
                {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="input-base"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-text)]">
                {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              </label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="input-base"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={savePassword} className="btn btn-primary gap-2">
              <Shield size={15} />
              {isAr ? 'تغيير كلمة المرور' : 'Update Password'}
            </button>
          </div>

          <hr className="border-[var(--color-border)]" />

          <div className="space-y-3">
            <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
              {isAr ? 'سجل نشاط الحساب' : 'Account Activity'}
            </p>
            {[
              { action: isAr ? 'تسجيل دخول ناجح' : 'Successful login', ip: '192.168.1.5', time: '2026-08-06 07:55' },
              { action: isAr ? 'تحديث ملف شخصي' : 'Profile updated', ip: '192.168.1.5', time: '2026-08-05 14:20' },
              { action: isAr ? 'تسجيل دخول ناجح' : 'Successful login', ip: '10.0.1.88', time: '2026-08-04 08:10' },
            ].map((entry, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-[var(--color-bg)] p-3 text-xs">
                <span className="font-medium text-[var(--color-text)]">{entry.action}</span>
                <div className="text-end text-[var(--color-text-muted)]">
                  <p>{entry.ip}</p>
                  <p>{entry.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
