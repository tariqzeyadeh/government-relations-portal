'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Save, X, Lock, Edit, EyeOff } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { ROLES_MATRIX, MODULES, type AccessLevel } from '@/lib/ops-mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const LEVEL_CYCLE: AccessLevel[] = ['read', 'edit', 'none']
const LEVEL_CFG: Record<AccessLevel, { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
  read: { label: 'قراءة فقط', bg: 'bg-blue-500/10',    text: 'text-blue-600',    icon: Lock  },
  edit: { label: 'تعديل',     bg: 'bg-emerald-500/10', text: 'text-emerald-600', icon: Edit  },
  none: { label: 'لا يوجد وصول', bg: 'bg-muted/60',  text: 'text-muted-foreground', icon: EyeOff },
}

type MatrixRow = { role: string; permissions: Record<string, AccessLevel> }

export default function UsersPage() {
  const { isRtl, showToast } = useApp()
  const [matrix, setMatrix] = useState<MatrixRow[]>(ROLES_MATRIX)
  const [dirty, setDirty] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [newRole, setNewRole] = useState('')

  const cyclePermission = (roleIdx: number, mod: string) => {
    setMatrix((prev) => {
      const copy = prev.map((r, i) => {
        if (i !== roleIdx) return r
        const cur = r.permissions[mod] as AccessLevel
        const next = LEVEL_CYCLE[(LEVEL_CYCLE.indexOf(cur) + 1) % LEVEL_CYCLE.length]
        return { ...r, permissions: { ...r.permissions, [mod]: next } }
      })
      return copy
    })
    setDirty(true)
  }

  const save = () => {
    setDirty(false)
    showToast('تم حفظ صلاحيات المصفوفة بنجاح', 'success')
  }

  const createRole = () => {
    if (!newRole.trim()) { showToast('يرجى إدخال اسم الدور', 'error'); return }
    const permissions = Object.fromEntries(MODULES.map((m) => [m, 'none' as AccessLevel]))
    setMatrix((prev) => [...prev, { role: newRole.trim(), permissions }])
    setNewRole('')
    setShowModal(false)
    setDirty(true)
    showToast(`تم إنشاء الدور "${newRole.trim()}"`, 'success')
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">إدارة الصلاحيات (RBAC)</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">مصفوفة الأدوار والوحدات — انقر على خلية لتدوير الصلاحية</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="ms-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[12px] font-bold hover:brightness-105 transition-all shadow-sm shadow-primary/20">
          <Plus className="w-3.5 h-3.5" /> دور جديد
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {(Object.entries(LEVEL_CFG) as [AccessLevel, typeof LEVEL_CFG[AccessLevel]][]).map(([lvl, cfg]) => {
          const Icon = cfg.icon
          return (
            <div key={lvl} className="flex items-center gap-1.5">
              <div className={`p-1 rounded-md ${cfg.bg}`}><Icon className={`w-3 h-3 ${cfg.text}`} /></div>
              <span className="text-[11px] text-muted-foreground">{cfg.label}</span>
            </div>
          )
        })}
        <p className="text-[10px] text-muted-foreground ms-auto">انقر على أي خلية للتبديل</p>
      </div>

      {/* Matrix table */}
      <Card className="border-border/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="text-start px-5 py-3 font-bold text-muted-foreground sticky start-0 bg-muted/30 min-w-[160px]">الدور / الوحدة</th>
                {MODULES.map((m) => (
                  <th key={m} className="text-center px-3 py-3 font-semibold text-muted-foreground min-w-[120px]">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, ri) => (
                <tr key={row.role} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-foreground sticky start-0 bg-card">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-[9px] font-extrabold text-primary">{row.role[0]}</span>
                      </div>
                      {row.role}
                    </div>
                  </td>
                  {MODULES.map((mod) => {
                    const lvl = row.permissions[mod] as AccessLevel
                    const cfg = LEVEL_CFG[lvl]
                    const Icon = cfg.icon
                    return (
                      <td key={mod} className="px-3 py-3.5 text-center">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => cyclePermission(ri, mod)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:brightness-110 cursor-pointer ${cfg.bg} ${cfg.text}`}
                        >
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </motion.button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sticky save */}
      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 bg-card border border-primary/20 shadow-xl rounded-2xl px-5 py-3">
              <span className="text-[12px] text-muted-foreground">توجد تغييرات غير محفوظة</span>
              <button onClick={save}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[12px] font-bold hover:brightness-105 transition-all">
                <Save className="w-3.5 h-3.5" /> حفظ التغييرات
              </button>
              <button onClick={() => { setMatrix(ROLES_MATRIX); setDirty(false) }}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Role Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/40 z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <Card className="w-full max-w-sm border-border/50 rounded-2xl shadow-2xl">
                <CardHeader className="px-5 pt-4 pb-2 flex flex-row items-center gap-2">
                  <CardTitle className="text-[14px] font-bold">إنشاء دور جديد</CardTitle>
                  <button onClick={() => setShowModal(false)} className="ms-auto p-1 hover:bg-muted rounded-lg transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-muted-foreground">اسم الدور *</label>
                    <input value={newRole} onChange={(e) => setNewRole(e.target.value)}
                      placeholder="مثال: قيادات التعليم"
                      className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40"
                      onKeyDown={(e) => e.key === 'Enter' && createRole()} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">سيتم إنشاء الدور بدون صلاحيات. يمكنك تعديل الصلاحيات من المصفوفة.</p>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-border text-[12px] text-muted-foreground hover:bg-muted transition-colors">إلغاء</button>
                    <button onClick={createRole} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-[12px] font-bold hover:brightness-105 transition-all">إنشاء</button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
