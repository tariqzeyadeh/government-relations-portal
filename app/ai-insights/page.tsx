'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, CheckCircle2, X, AlertTriangle, TrendingUp, Info, BarChart2 } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { AI_INSIGHTS } from '@/lib/ops-mock-data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

type Insight = typeof AI_INSIGHTS[number] & { accepted: boolean | null }

const TYPE_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; border: string }> = {
  خطر:    { icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
  تحذير:  { icon: AlertTriangle, color: 'text-amber-600',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20'  },
  فرصة:   { icon: TrendingUp,    color: 'text-emerald-600',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20'},
  تحليل:  { icon: BarChart2,     color: 'text-blue-600',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'   },
}

export default function AiInsightsPage() {
  const { isRtl, showToast } = useApp()
  const [insights, setInsights] = useState<Insight[]>(AI_INSIGHTS as Insight[])

  const act = (id: string, accept: boolean) => {
    setInsights((prev) => prev.map((ins) => ins.id === id ? { ...ins, accepted: accept } : ins))
    const ins = insights.find((i) => i.id === id)
    if (!ins) return
    if (accept) {
      showToast(`تم قبول التوصية: "${ins.title}"`, 'success')
    } else {
      showToast(`تم تجاهل التنبيه: "${ins.title}"`, 'info')
    }
  }

  const pending = insights.filter((i) => i.accepted === null)
  const done    = insights.filter((i) => i.accepted !== null)

  return (
    <div className="min-h-screen bg-background p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-purple-500/10">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-foreground">رؤى الذكاء الاصطناعي</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">توصيات وتنبيهات مدعومة بالذكاء الاصطناعي</p>
        </div>
        <div className="ms-auto flex gap-3">
          <div className="text-center">
            <p className="text-xl font-extrabold text-foreground">{pending.length}</p>
            <p className="text-[10px] text-muted-foreground">بانتظار الإجراء</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-emerald-600">{done.filter((d) => d.accepted).length}</p>
            <p className="text-[10px] text-muted-foreground">مقبولة</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-muted-foreground">{done.filter((d) => !d.accepted).length}</p>
            <p className="text-[10px] text-muted-foreground">مُتجاهَلة</p>
          </div>
        </div>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wide">تتطلب إجراءً</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {pending.map((ins) => {
                const cfg = TYPE_CONFIG[ins.type] ?? TYPE_CONFIG['تحليل']
                const TypeIcon = cfg.icon
                return (
                  <motion.div
                    key={ins.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card className={`border rounded-2xl shadow-sm ${cfg.border}`}>
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl shrink-0 ${cfg.bg}`}>
                            <TypeIcon className={`w-4 h-4 ${cfg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={`text-[10px] ${cfg.color} border-current/30`}>{ins.type}</Badge>
                              <span className="text-[10px] text-muted-foreground ms-auto">{ins.date}</span>
                            </div>
                            <h3 className="text-[14px] font-bold text-foreground leading-snug">{ins.title}</h3>
                            <p className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed">{ins.body}</p>
                          </div>
                        </div>

                        {/* Confidence */}
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-muted-foreground">الثقة:</span>
                          <Progress value={ins.confidence} className="flex-1 h-1.5 rounded-full" />
                          <span className="text-[11px] font-bold text-foreground">{ins.confidence}%</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => act(ins.id, true)}
                            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl bg-emerald-600 text-white text-[12px] font-bold hover:bg-emerald-700 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> قبول
                          </button>
                          <button
                            onClick={() => act(ins.id, false)}
                            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl border border-border/60 text-muted-foreground text-[12px] font-medium hover:bg-muted/40 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> تجاهل
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Processed */}
      {done.length > 0 && (
        <div className="space-y-3">
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wide">تمت المعالجة</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {done.map((ins) => (
              <Card key={ins.id} className="border-border/30 rounded-2xl opacity-60">
                <CardContent className="p-4 flex items-center gap-3">
                  {ins.accepted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground truncate">{ins.title}</p>
                    <p className="text-[10px] text-muted-foreground">{ins.accepted ? 'تم القبول' : 'تم التجاهل'} · {ins.date}</p>
                  </div>
                  <button
                    onClick={() => setInsights((prev) => prev.map((i) => i.id === ins.id ? { ...i, accepted: null } : i))}
                    className="text-[10px] text-primary hover:underline shrink-0"
                  >
                    تراجع
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {insights.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 gap-2">
          <Info className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-[13px] text-muted-foreground">لا توجد رؤى في الوقت الحالي</p>
        </div>
      )}
    </div>
  )
}
