'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Shield, Filter } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { AUDIT_LOGS } from '@/lib/ops-mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Log = typeof AUDIT_LOGS[number]

const MODULE_COLORS: Record<string, string> = {
  مذكرات:   'bg-blue-500/10 text-blue-700',
  أرشيف:    'bg-purple-500/10 text-purple-700',
  نظام:     'bg-muted/60 text-muted-foreground',
  مهام:     'bg-amber-500/10 text-amber-700',
  تقارير:   'bg-emerald-500/10 text-emerald-700',
  قرارات:   'bg-indigo-500/10 text-indigo-700',
  إدارة:    'bg-red-500/10 text-red-700',
  تفويضات: 'bg-orange-500/10 text-orange-700',
  تكاملات: 'bg-cyan-500/10 text-cyan-700',
  دعم:      'bg-pink-500/10 text-pink-700',
}

const AUTH_CFG: Record<string, { bg: string; text: string }> = {
  '2FA-TOTP': { bg: 'bg-emerald-500/10', text: 'text-emerald-700' },
  '2FA-SMS':  { bg: 'bg-blue-500/10',    text: 'text-blue-700'    },
  'SSO-SAML': { bg: 'bg-purple-500/10',  text: 'text-purple-700'  },
}

const MODULES_FILTER = ['الكل', ...Array.from(new Set(AUDIT_LOGS.map((l) => l.module)))]
const USERS_FILTER   = ['الكل', ...Array.from(new Set(AUDIT_LOGS.map((l) => l.user)))]

export default function AuditPage() {
  const { isRtl } = useApp()
  const [search, setSearch] = useState('')
  const [filterModule, setFilterModule] = useState('الكل')
  const [filterUser,   setFilterUser]   = useState('الكل')
  const [selected, setSelected] = useState<Log | null>(null)

  const filtered = AUDIT_LOGS.filter((l) =>
    (filterModule === 'الكل' || l.module === filterModule) &&
    (filterUser   === 'الكل' || l.user   === filterUser)   &&
    (!search || l.op.includes(search) || l.user.includes(search) || l.id.includes(search))
  )

  return (
    <div className="min-h-screen bg-background p-6 space-y-5" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10"><Shield className="w-5 h-5 text-primary" /></div>
        <div>
          <h1 className="text-xl font-extrabold text-foreground">سجل التدقيق</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">سجل كامل لجميع أنشطة النظام — للقراءة فقط</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border/50 rounded-2xl shadow-sm">
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث في السجل…"
              className="w-full ps-9 pe-3 h-9 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <select value={filterModule} onChange={(e) => setFilterModule(e.target.value)}
              className="h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] text-foreground outline-none focus:border-primary/40">
              {MODULES_FILTER.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}
              className="h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] text-foreground outline-none focus:border-primary/40">
              {USERS_FILTER.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <span className="text-[11px] text-muted-foreground ms-auto">{filtered.length} سجل</span>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11.5px]">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                {['التاريخ والوقت', 'المعرف', 'المستخدم', 'العملية', 'الوحدة', 'عنوان IP', 'المصادقة'].map((h) => (
                  <th key={h} className="text-start px-4 py-3 font-bold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => {
                const authCfg = AUTH_CFG[log.auth] ?? { bg: 'bg-muted/60', text: 'text-muted-foreground' }
                const modCls  = MODULE_COLORS[log.module] ?? 'bg-muted/60 text-muted-foreground'
                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelected(log)}
                    className="border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono text-muted-foreground whitespace-nowrap">{log.datetime}</td>
                    <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">{log.id}</td>
                    <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{log.user}</td>
                    <td className="px-4 py-3 text-foreground">{log.op}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${modCls}`}>{log.module}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground" dir="ltr">{log.ip}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${authCfg.bg} ${authCfg.text}`}>{log.auth}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* JSON Payload Modal — read only */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/50 z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <Card className="w-full max-w-xl border-border/50 rounded-2xl shadow-2xl">
                <CardHeader className="px-5 pt-4 pb-3 border-b border-border/50 flex flex-row items-center gap-2">
                  <div>
                    <CardTitle className="text-[14px] font-bold">تفاصيل الحدث — {selected.id}</CardTitle>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{selected.datetime} · {selected.user} · {selected.op}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="ms-auto p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px]">{selected.module}</Badge>
                    <Badge variant="outline" className="text-[10px]" dir="ltr">{selected.ip}</Badge>
                    <Badge variant="outline" className="text-[10px]">{selected.auth}</Badge>
                    <Badge variant="secondary" className="text-[10px] text-amber-600 bg-amber-500/10">للقراءة فقط</Badge>
                  </div>
                  <div className="bg-muted/30 rounded-xl border border-border/40 p-4 overflow-auto max-h-72">
                    <pre className="text-[11px] font-mono text-foreground leading-relaxed whitespace-pre-wrap" dir="ltr">
                      {JSON.stringify(selected.payload, null, 2)}
                    </pre>
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
