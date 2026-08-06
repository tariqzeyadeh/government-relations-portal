'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, CheckCircle2, AlertTriangle, Clock, Circle, Search, Filter } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { TASKS } from '@/lib/ops-mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type SlaLevel = 'green' | 'yellow' | 'red'
type Task = typeof TASKS[number]

const SLA_CFG: Record<SlaLevel, { dot: string; label: string; ring: string }> = {
  green:  { dot: 'bg-emerald-500', label: 'ضمن المدة',  ring: 'ring-emerald-500/20' },
  yellow: { dot: 'bg-amber-500',   label: 'يقترب',       ring: 'ring-amber-500/20'   },
  red:    { dot: 'bg-red-500',     label: 'متأخر',       ring: 'ring-red-500/20'     },
}

const STATUSES = ['قيد التنفيذ', 'معلقة', 'متأخر', 'تم الإنجاز']
const STATUS_SLA: Record<string, SlaLevel> = {
  'قيد التنفيذ': 'yellow',
  'معلقة':       'green',
  'متأخر':       'red',
  'تم الإنجاز':  'green',
}

const OWNERS = ['أحمد المنصوري', 'سارة الراشدي', 'خالد إبراهيم', 'عمر ناصر']
const MODULES = ['مذكرات', 'تقارير', 'ملفات الدول', 'مشاريع', 'أمن', 'استثمار', 'تعليم', 'فعاليات']

const emptyForm = { name: '', owner: OWNERS[0], due: '', module: MODULES[0] }

export default function TasksPage() {
  const { isRtl, showToast } = useApp()
  const [tasks, setTasks] = useState<Task[]>(TASKS)
  const [search, setSearch] = useState('')
  const [filterSla, setFilterSla] = useState<SlaLevel | 'all'>('all')
  const [showSlide, setShowSlide] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const addTask = () => {
    if (!form.name.trim()) { showToast('يرجى إدخال اسم المهمة', 'error'); return }
    if (!form.due) { showToast('يرجى تحديد تاريخ الاستحقاق', 'error'); return }
    const id = `TSK-${String(tasks.length + 1).padStart(3, '0')}`
    const newTask: Task = { id, name: form.name, nameEn: form.name, owner: form.owner, due: form.due, sla: 'green', status: 'معلقة', module: form.module }
    setTasks((prev) => [newTask, ...prev])
    showToast(`تم إضافة المهمة "${form.name}"`, 'success')
    setForm(emptyForm)
    setShowSlide(false)
  }

  const updateStatus = (id: string, status: string) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t
      const newSla = STATUS_SLA[status] ?? 'green'
      return { ...t, status, sla: newSla }
    }))
    if (status === 'تم الإنجاز') showToast('تم تحديث حالة المهمة إلى "تم الإنجاز" ✓', 'success')
  }

  const filtered = tasks.filter((t) =>
    (filterSla === 'all' || t.sla === filterSla) &&
    (!search || t.name.includes(search) || t.owner.includes(search) || t.module.includes(search))
  )

  const kpis = [
    { label: 'إجمالي المهام', value: tasks.length, color: 'text-blue-600', bg: 'bg-blue-500/10', icon: Circle },
    { label: 'ضمن المدة',     value: tasks.filter((t) => t.sla === 'green').length,  color: 'text-emerald-600', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
    { label: 'تقترب',         value: tasks.filter((t) => t.sla === 'yellow').length, color: 'text-amber-600',   bg: 'bg-amber-500/10',   icon: Clock       },
    { label: 'متأخرة',        value: tasks.filter((t) => t.sla === 'red').length,    color: 'text-red-600',     bg: 'bg-red-500/10',     icon: AlertTriangle},
  ]

  return (
    <div className="min-h-screen bg-background p-6 space-y-5" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">إدارة المهام</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">جدول المهام الشامل مع مؤشرات SLA</p>
        </div>
        <button
          onClick={() => setShowSlide(true)}
          className="ms-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[12px] font-bold hover:brightness-105 transition-all shadow-sm shadow-primary/20"
        >
          <Plus className="w-3.5 h-3.5" /> إضافة مهمة
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <Card key={k.label} className="border-border/50 rounded-2xl shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${k.bg}`}><Icon className={`w-4 h-4 ${k.color}`} /></div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">{k.label}</p>
                  <p className="text-xl font-extrabold text-foreground">{k.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="border-border/50 rounded-2xl shadow-sm">
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث في المهام…"
              className="w-full ps-9 pe-3 h-9 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            {(['all', 'green', 'yellow', 'red'] as const).map((s) => (
              <button key={s} onClick={() => setFilterSla(s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all border ${filterSla === s ? 'border-primary/30 bg-primary/5 text-primary' : 'border-border/50 text-muted-foreground hover:bg-muted/40'}`}>
                {s !== 'all' && <span className={`w-2 h-2 rounded-full ${SLA_CFG[s].dot}`} />}
                {s === 'all' ? 'الكل' : SLA_CFG[s].label}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground ms-auto">{filtered.length} مهمة</span>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                {['#', 'اسم المهمة', 'المسؤول', 'الاستحقاق', 'SLA', 'النطاق', 'الحالة'].map((h) => (
                  <th key={h} className="text-start px-4 py-3 font-bold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((task, idx) => {
                const slaCfg = SLA_CFG[task.sla]
                return (
                  <tr key={task.id} className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${task.status === 'تم الإنجاز' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3 text-muted-foreground font-mono">{task.id}</td>
                    <td className="px-4 py-3 font-semibold text-foreground max-w-[200px]">
                      <span className={task.status === 'تم الإنجاز' ? 'line-through text-muted-foreground' : ''}>{task.name}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{task.owner}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">{task.due}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ring-2 ${slaCfg.dot} ${slaCfg.ring}`} />
                        <span className={`text-[10px] font-semibold ${task.sla === 'red' ? 'text-red-600' : task.sla === 'yellow' ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {slaCfg.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{task.module}</Badge></td>
                    <td className="px-4 py-3">
                      <select
                        value={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                        className={`h-7 px-2 rounded-lg border text-[11px] font-semibold outline-none transition-all cursor-pointer
                          ${task.status === 'متأخر' ? 'bg-red-500/10 border-red-500/20 text-red-700' :
                            task.status === 'تم الإنجاز' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' :
                            task.status === 'قيد التنفيذ' ? 'bg-blue-500/10 border-blue-500/20 text-blue-700' :
                            'bg-amber-500/10 border-amber-500/20 text-amber-700'}`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slide-over Add Task */}
      <AnimatePresence>
        {showSlide && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSlide(false)}
              className="fixed inset-0 bg-black/40 z-40" />
            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 end-0 h-full w-full max-w-sm bg-card border-s border-border shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <h2 className="text-[15px] font-bold text-foreground">إضافة مهمة جديدة</h2>
                <button onClick={() => setShowSlide(false)} className="ms-auto p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-muted-foreground">اسم المهمة *</label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="أدخل اسم المهمة…"
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[13px] outline-none focus:border-primary/40" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-muted-foreground">المسؤول</label>
                  <select value={form.owner} onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] outline-none focus:border-primary/40">
                    {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-muted-foreground">تاريخ الاستحقاق *</label>
                  <input type="date" value={form.due} onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] outline-none focus:border-primary/40" dir="ltr" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-muted-foreground">النطاق / الوحدة</label>
                  <select value={form.module} onChange={(e) => setForm((f) => ({ ...f, module: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] outline-none focus:border-primary/40">
                    {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-border flex gap-2">
                <button onClick={() => setShowSlide(false)} className="flex-1 h-9 rounded-xl border border-border text-[12px] text-muted-foreground hover:bg-muted transition-colors">إلغاء</button>
                <button onClick={addTask} className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-[12px] font-bold hover:brightness-105 transition-all">إضافة المهمة</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
