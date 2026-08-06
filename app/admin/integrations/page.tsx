'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Settings, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { INTEGRATIONS } from '@/lib/ops-mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Integration = typeof INTEGRATIONS[number]
type StatusType = 'connected' | 'error' | 'syncing'

const LOGOS: Record<string, string> = {
  sap: '🔷', snow: '❄️', sinai: '🏭', rehla: '🚀', nafath: '🔐', powerbi: '📊', laser: '🗂️',
}

export default function IntegrationsPage() {
  const { isRtl, showToast } = useApp()
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS)
  const [syncing, setSyncing] = useState<Set<string>>(new Set())
  const [settingsFor, setSettingsFor] = useState<Integration | null>(null)
  const [editForm, setEditForm] = useState<{ endpoint: string; apiKey: string }>({ endpoint: '', apiKey: '' })

  const syncNow = async (id: string) => {
    setSyncing((prev) => new Set(prev).add(id))
    setIntegrations((prev) => prev.map((i) => i.id === id ? { ...i, status: 'syncing' as StatusType } : i))
    await new Promise((r) => setTimeout(r, 2200))
    setSyncing((prev) => { const s = new Set(prev); s.delete(id); return s })
    setIntegrations((prev) => prev.map((i) => i.id === id ? { ...i, status: 'connected' as StatusType, lastSync: 'الآن' } : i))
    const int = integrations.find((i) => i.id === id)
    showToast(`تمت مزامنة ${int?.nameAr ?? id} بنجاح`, 'success')
  }

  const openSettings = (int: Integration) => {
    setSettingsFor(int)
    setEditForm({ endpoint: int.endpoint, apiKey: int.apiKey })
  }

  const saveSettings = () => {
    if (!settingsFor) return
    setIntegrations((prev) => prev.map((i) => i.id === settingsFor.id ? { ...i, endpoint: editForm.endpoint, apiKey: editForm.apiKey } : i))
    showToast(`تم حفظ إعدادات ${settingsFor.nameAr}`, 'success')
    setSettingsFor(null)
  }

  const getStatusDot = (status: StatusType, isSyncing: boolean) => {
    if (isSyncing) return 'bg-amber-400 animate-pulse shadow-amber-400/60'
    if (status === 'connected') return 'bg-emerald-500 shadow-emerald-500/60'
    if (status === 'error')     return 'bg-red-500 shadow-red-500/60'
    return 'bg-amber-400 animate-pulse shadow-amber-400/60'
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-foreground">التكاملات الخارجية</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          {integrations.filter((i) => i.status === 'connected').length} متصل ·{' '}
          {integrations.filter((i) => i.status === 'error').length} خطأ ·{' '}
          {integrations.filter((i) => i.status === 'syncing').length} مزامنة جارية
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {integrations.map((int) => {
          const isSyncing = syncing.has(int.id)
          const dotClass = getStatusDot(int.status as StatusType, isSyncing)
          return (
            <motion.div key={int.id} layout>
              <Card className="border-border/50 rounded-2xl shadow-sm hover:border-primary/20 transition-all h-full">
                <CardContent className="p-5 flex flex-col gap-4 h-full">
                  {/* Logo + name + dot */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center text-xl flex-shrink-0">
                      {LOGOS[int.id] ?? '🔗'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-bold text-foreground truncate">{int.nameAr}</p>
                        <span className={`w-2.5 h-2.5 rounded-full shadow-md flex-shrink-0 ${dotClass}`} />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {isSyncing ? 'جارٍ المزامنة…' : int.status === 'connected' ? `آخر مزامنة: ${int.lastSync}` : 'خطأ في الاتصال'}
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center gap-2">
                    {isSyncing ? (
                      <Badge className="text-[10px] bg-amber-500/10 text-amber-700 border-0 gap-1">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" /> مزامنة
                      </Badge>
                    ) : int.status === 'connected' ? (
                      <Badge className="text-[10px] bg-emerald-500/10 text-emerald-700 border-0 gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> متصل
                      </Badge>
                    ) : (
                      <Badge className="text-[10px] bg-red-500/10 text-red-700 border-0 gap-1">
                        <AlertCircle className="w-2.5 h-2.5" /> خطأ
                      </Badge>
                    )}
                    <p className="text-[10px] text-muted-foreground truncate" dir="ltr">{int.endpoint.split('/')[2]}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => syncNow(int.id)}
                      disabled={isSyncing}
                      className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 disabled:opacity-50 transition-colors"
                    >
                      {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                      {isSyncing ? 'مزامنة…' : 'مزامنة الآن'}
                    </button>
                    <button
                      onClick={() => openSettings(int)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl border border-border/50 hover:bg-muted/40 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {settingsFor && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSettingsFor(null)}
              className="fixed inset-0 bg-black/40 z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <Card className="w-full max-w-md border-border/50 rounded-2xl shadow-2xl">
                <CardHeader className="px-5 pt-4 pb-3 border-b border-border/50 flex flex-row items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center text-lg">
                    {LOGOS[settingsFor.id] ?? '🔗'}
                  </div>
                  <div>
                    <CardTitle className="text-[14px] font-bold">إعدادات {settingsFor.nameAr}</CardTitle>
                    <p className="text-[10px] text-muted-foreground">تعديل مفتاح API ونقطة النهاية</p>
                  </div>
                  <button onClick={() => setSettingsFor(null)} className="ms-auto p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-muted-foreground">نقطة النهاية (Endpoint)</label>
                    <input
                      value={editForm.endpoint}
                      onChange={(e) => setEditForm((f) => ({ ...f, endpoint: e.target.value }))}
                      className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] font-mono outline-none focus:border-primary/40"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-muted-foreground">مفتاح API</label>
                    <input
                      value={editForm.apiKey}
                      onChange={(e) => setEditForm((f) => ({ ...f, apiKey: e.target.value }))}
                      type="password"
                      className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] font-mono outline-none focus:border-primary/40"
                      dir="ltr"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button onClick={() => setSettingsFor(null)} className="px-4 py-2 rounded-xl border border-border text-[12px] text-muted-foreground hover:bg-muted transition-colors">إلغاء</button>
                    <button onClick={saveSettings} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-[12px] font-bold hover:brightness-105 transition-all">حفظ</button>
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
