'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, PenLine, Plus, Trash2, Clock, CheckCircle2, X, Users } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { DELEGATIONS } from '@/lib/ops-mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

type Delegation = typeof DELEGATIONS[number]

const AWAITING_SIGS = [
  { id: 'DOC-2026-0441', title: 'مذكرة التفاهم — الهيدروجين الأخضر مع الأردن', type: 'مذكرة تفاهم', date: '2026-08-05', from: 'سارة الراشدي', priority: 'عالية' },
  { id: 'DOC-2026-0438', title: 'بروتوكول التعاون في تغير المناخ', type: 'بروتوكول', date: '2026-08-04', from: 'أحمد المنصوري', priority: 'متوسطة' },
  { id: 'DOC-2026-0435', title: 'تقرير الأداء الربعي Q2 2026', type: 'تقرير', date: '2026-08-03', from: 'خالد إبراهيم', priority: 'منخفضة' },
]

const DELEGATORS = ['أحمد المنصوري', 'سارة الراشدي', 'خالد إبراهيم', 'عمر ناصر']
const emptyDel = { delegator: DELEGATORS[0], delegatee: DELEGATORS[1], scope: '', days: '7' }

export default function SignaturesPage() {
  const { isRtl, showToast } = useApp()
  const [delegations, setDelegations] = useState<Delegation[]>(DELEGATIONS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyDel)

  const createDelegation = () => {
    if (!form.scope.trim()) { showToast('يرجى تحديد نطاق التفويض', 'error'); return }
    if (form.delegator === form.delegatee) { showToast('لا يمكن أن يكون المفوِّض والمفوَّض إليه نفس الشخص', 'error'); return }
    const start = new Date().toISOString().split('T')[0]
    const end = new Date(Date.now() + parseInt(form.days) * 86400000).toISOString().split('T')[0]
    const id = `DEL-2026-${delegations.length + 14}`
    const newDel: Delegation = { id, delegator: form.delegator, delegatee: form.delegatee, scope: form.scope, start, end, status: 'نشطة' }
    setDelegations((prev) => [newDel, ...prev])
    showToast(`تم إنشاء التفويض من ${form.delegator} إلى ${form.delegatee}`, 'success')
    setForm(emptyDel)
    setShowForm(false)
  }

  const revoke = (id: string) => {
    setDelegations((prev) => prev.map((d) => d.id === id ? { ...d, status: 'منتهية' as const } : d))
    showToast('تم إلغاء التفويض', 'info')
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <h1 className="text-xl font-extrabold text-foreground">التوقيعات والتفويضات</h1>

      {/* Cert stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 rounded-2xl shadow-sm">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10"><ShieldCheck className="w-4 h-4 text-emerald-600" /></div>
              <div>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">الشهادات الرقمية</p>
                <p className="text-xl font-extrabold text-foreground">98%</p>
              </div>
            </div>
            <Progress value={98} className="h-2 rounded-full" />
            <p className="text-[11px] text-emerald-600 font-semibold">47 شهادة صالحة · 1 تنتهي قريباً</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 rounded-2xl shadow-sm">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10"><Clock className="w-4 h-4 text-amber-600" /></div>
              <div>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">بانتظار التوقيع</p>
                <p className="text-xl font-extrabold text-foreground">{AWAITING_SIGS.length}</p>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">أقدمها منذ 3 أيام</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 rounded-2xl shadow-sm">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10"><Users className="w-4 h-4 text-blue-600" /></div>
              <div>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">التفويضات النشطة</p>
                <p className="text-xl font-extrabold text-foreground">{delegations.filter((d) => d.status === 'نشطة').length}</p>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">من إجمالي {delegations.length} تفويض</p>
          </CardContent>
        </Card>
      </div>

      {/* Awaiting signatures table */}
      <Card className="border-border/50 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="px-5 pt-4 pb-3 border-b border-border/50">
          <CardTitle className="text-[14px] font-bold">الوثائق بانتظار التوقيع</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                {['الرقم المرجعي', 'عنوان الوثيقة', 'النوع', 'طالب التوقيع', 'الأولوية', 'التاريخ', ''].map((h) => (
                  <th key={h} className="text-start px-4 py-2.5 font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AWAITING_SIGS.map((doc) => (
                <tr key={doc.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-muted-foreground">{doc.id}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{doc.title}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{doc.type}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{doc.from}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${doc.priority === 'عالية' ? 'bg-red-500/10 text-red-600' : doc.priority === 'متوسطة' ? 'bg-amber-500/10 text-amber-600' : 'bg-muted text-muted-foreground'}`}>
                      {doc.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono">{doc.date}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => showToast(`تم التوقيع على "${doc.title}"`, 'success')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 transition-colors">
                      <PenLine className="w-3 h-3" /> توقيع
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Create delegation */}
      <Card className="border-border/50 rounded-2xl shadow-sm">
        <CardHeader className="px-5 pt-4 pb-3 border-b border-border/50 flex flex-row items-center gap-2">
          <CardTitle className="text-[14px] font-bold">إنشاء تفويض جديد</CardTitle>
          <button onClick={() => setShowForm(!showForm)} className="ms-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold hover:brightness-105 transition-all">
            <Plus className="w-3 h-3" /> إنشاء
          </button>
        </CardHeader>
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
              <CardContent className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">المفوِّض *</label>
                  <select value={form.delegator} onChange={(e) => setForm((f) => ({ ...f, delegator: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] outline-none focus:border-primary/40">
                    {DELEGATORS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">المفوَّض إليه *</label>
                  <select value={form.delegatee} onChange={(e) => setForm((f) => ({ ...f, delegatee: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] outline-none focus:border-primary/40">
                    {DELEGATORS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">المدة (أيام) *</label>
                  <input type="number" min="1" max="90" value={form.days} onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] outline-none focus:border-primary/40" dir="ltr" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">نطاق التفويض *</label>
                  <input value={form.scope} onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
                    placeholder="مثال: مذكرات التفاهم"
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] outline-none focus:border-primary/40" />
                </div>
                <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-2">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-border text-[12px] text-muted-foreground hover:bg-muted transition-colors">إلغاء</button>
                  <button onClick={createDelegation} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-[12px] font-bold hover:brightness-105 transition-all">حفظ التفويض</button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Active delegations */}
      <Card className="border-border/50 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="px-5 pt-4 pb-3 border-b border-border/50">
          <CardTitle className="text-[14px] font-bold">التفويضات النشطة</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                {['الرقم', 'المفوِّض', 'المفوَّض إليه', 'النطاق', 'البداية', 'النهاية', 'الحالة', ''].map((h) => (
                  <th key={h} className="text-start px-4 py-2.5 font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {delegations.map((d) => (
                <tr key={d.id} className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${d.status === 'منتهية' ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3 font-mono text-muted-foreground text-[11px]">{d.id}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{d.delegator}</td>
                  <td className="px-4 py-3 text-foreground">{d.delegatee}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.scope}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono">{d.start}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono">{d.end}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${d.status === 'نشطة' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {d.status === 'نشطة' && (
                      <button onClick={() => revoke(d.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 text-[10px] font-semibold hover:bg-red-500/20 transition-colors">
                        <Trash2 className="w-3 h-3" /> إلغاء
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
