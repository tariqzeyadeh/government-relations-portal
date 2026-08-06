'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Download, RefreshCw, Printer, BarChart2, Globe2, Users2, FileSpreadsheet } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const REPORT_TYPES = [
  { id: 'bilateral', label: 'التجارة الثنائية', icon: Globe2, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  { id: 'committee', label: 'أداء اللجان',       icon: Users2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { id: 'kpi',       label: 'مؤشرات الأداء',    icon: BarChart2, color: 'text-purple-600', bg: 'bg-purple-500/10' },
  { id: 'mou',       label: 'مذكرات التفاهم',   icon: FileText,  color: 'text-amber-600',  bg: 'bg-amber-500/10'  },
]

const PERIODS = ['الربع الثالث 2026', 'الربع الثاني 2026', 'الربع الأول 2026', 'الربع الرابع 2025', 'سنوي 2025']

const PREVIEW_HTML: Record<string, string> = {
  bilateral: `
    <div style="font-family: sans-serif; padding: 24px; direction: rtl; color: #1a1a1a;">
      <div style="text-align:center; margin-bottom:24px;">
        <h2 style="font-size:18px; font-weight:800; color:#1d4ed8;">تقرير التجارة الثنائية — الربع الثالث 2026</h2>
        <p style="font-size:12px; color:#6b7280;">وزارة الشؤون الخارجية | 6 أغسطس 2026</p>
      </div>
      <hr style="border-color:#e5e7eb; margin-bottom:20px;"/>
      <h3 style="font-size:14px; font-weight:700; margin-bottom:12px;">ملخص تنفيذي</h3>
      <p style="font-size:13px; line-height:1.8; color:#374151;">بلغ إجمالي حجم التجارة الثنائية مع الدول الشريكة خلال الربع الثالث من عام 2026 ما قيمته <strong>47.3 مليار دولار</strong>، بزيادة قدرها 12.4% مقارنةً بالفترة ذاتها من العام الماضي.</p>
      <h3 style="font-size:14px; font-weight:700; margin:20px 0 12px;">أبرز المؤشرات</h3>
      <table style="width:100%; border-collapse:collapse; font-size:12px;">
        <thead><tr style="background:#eff6ff;">
          <th style="padding:8px 12px; text-align:right; border:1px solid #dbeafe;">الدولة</th>
          <th style="padding:8px 12px; text-align:right; border:1px solid #dbeafe;">حجم التبادل</th>
          <th style="padding:8px 12px; text-align:right; border:1px solid #dbeafe;">التغيير</th>
          <th style="padding:8px 12px; text-align:right; border:1px solid #dbeafe;">الاتجاه</th>
        </tr></thead>
        <tbody>
          <tr><td style="padding:8px 12px; border:1px solid #f3f4f6;">مصر</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">12.4 مليار$</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">+8.2%</td><td style="padding:8px 12px; border:1px solid #f3f4f6; color:#16a34a;">↑ صاعد</td></tr>
          <tr style="background:#f9fafb;"><td style="padding:8px 12px; border:1px solid #f3f4f6;">الأردن</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">8.1 مليار$</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">+14.7%</td><td style="padding:8px 12px; border:1px solid #f3f4f6; color:#16a34a;">↑ صاعد</td></tr>
          <tr><td style="padding:8px 12px; border:1px solid #f3f4f6;">المغرب</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">6.8 مليار$</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">+3.1%</td><td style="padding:8px 12px; border:1px solid #f3f4f6; color:#16a34a;">↑ صاعد</td></tr>
          <tr style="background:#f9fafb;"><td style="padding:8px 12px; border:1px solid #f3f4f6;">العراق</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">5.2 مليار$</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">-1.4%</td><td style="padding:8px 12px; border:1px solid #f3f4f6; color:#dc2626;">↓ هابط</td></tr>
        </tbody>
      </table>
      <p style="margin-top:20px; font-size:11px; color:#9ca3af;">تم إنشاء هذا التقرير تلقائياً من منظومة بوابة العلاقات الدولية.</p>
    </div>`,
  committee: `
    <div style="font-family:sans-serif; padding:24px; direction:rtl; color:#1a1a1a;">
      <div style="text-align:center; margin-bottom:24px;">
        <h2 style="font-size:18px; font-weight:800; color:#7c3aed;">تقرير أداء اللجان — الربع الثالث 2026</h2>
        <p style="font-size:12px; color:#6b7280;">وزارة الشؤون الخارجية | 6 أغسطس 2026</p>
      </div>
      <hr style="border-color:#e5e7eb; margin-bottom:20px;"/>
      <h3 style="font-size:14px; font-weight:700; margin-bottom:12px;">ملخص الأداء</h3>
      <p style="font-size:13px; line-height:1.8; color:#374151;">عقدت اللجان المشتركة <strong>12 اجتماعاً</strong> خلال الربع الثالث، صدر عنها <strong>28 قراراً</strong> بمعدل إنجاز <strong>82%</strong>.</p>
      <table style="width:100%; border-collapse:collapse; font-size:12px; margin-top:16px;">
        <thead><tr style="background:#f5f3ff;">
          <th style="padding:8px 12px; text-align:right; border:1px solid #ede9fe;">اللجنة</th>
          <th style="padding:8px 12px; text-align:right; border:1px solid #ede9fe;">الاجتماعات</th>
          <th style="padding:8px 12px; text-align:right; border:1px solid #ede9fe;">القرارات</th>
          <th style="padding:8px 12px; text-align:right; border:1px solid #ede9fe;">معدل الإنجاز</th>
        </tr></thead>
        <tbody>
          <tr><td style="padding:8px 12px; border:1px solid #f3f4f6;">JEC-2026</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">5</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">12</td><td style="padding:8px 12px; border:1px solid #f3f4f6; color:#16a34a;">88%</td></tr>
          <tr style="background:#fafafa;"><td style="padding:8px 12px; border:1px solid #f3f4f6;">CEC-2026</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">3</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">7</td><td style="padding:8px 12px; border:1px solid #f3f4f6; color:#16a34a;">91%</td></tr>
          <tr><td style="padding:8px 12px; border:1px solid #f3f4f6;">TIAP-2026</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">2</td><td style="padding:8px 12px; border:1px solid #f3f4f6;">5</td><td style="padding:8px 12px; border:1px solid #f3f4f6; color:#d97706;">70%</td></tr>
        </tbody>
      </table>
    </div>`,
  kpi: `<div style="font-family:sans-serif; padding:24px; direction:rtl; color:#1a1a1a;"><h2 style="font-size:18px; font-weight:800; color:#065f46; text-align:center;">مؤشرات الأداء الرئيسية — Q3 2026</h2><p style="font-size:12px; color:#6b7280; text-align:center; margin-bottom:20px;">تقرير تنفيذي شامل</p><hr style="border-color:#d1fae5; margin-bottom:20px;"/><table style="width:100%; border-collapse:collapse; font-size:12px;"><thead><tr style="background:#ecfdf5;"><th style="padding:10px; text-align:right; border:1px solid #a7f3d0;">المؤشر</th><th style="padding:10px; text-align:right; border:1px solid #a7f3d0;">الهدف</th><th style="padding:10px; text-align:right; border:1px solid #a7f3d0;">الفعلي</th><th style="padding:10px; text-align:right; border:1px solid #a7f3d0;">الفجوة</th></tr></thead><tbody><tr><td style="padding:10px; border:1px solid #f3f4f6;">الاتفاقيات الموقعة</td><td style="padding:10px; border:1px solid #f3f4f6;">25</td><td style="padding:10px; border:1px solid #f3f4f6;">19</td><td style="padding:10px; border:1px solid #f3f4f6; color:#dc2626;">-6</td></tr><tr style="background:#f9fafb;"><td style="padding:10px; border:1px solid #f3f4f6;">مؤشر الرضا الدبلوماسي</td><td style="padding:10px; border:1px solid #f3f4f6;">90%</td><td style="padding:10px; border:1px solid #f3f4f6;">87%</td><td style="padding:10px; border:1px solid #f3f4f6; color:#d97706;">-3%</td></tr><tr><td style="padding:10px; border:1px solid #f3f4f6;">المهام المنجزة في الوقت</td><td style="padding:10px; border:1px solid #f3f4f6;">90%</td><td style="padding:10px; border:1px solid #f3f4f6;">78%</td><td style="padding:10px; border:1px solid #f3f4f6; color:#dc2626;">-12%</td></tr></tbody></table></div>`,
  mou: `<div style="font-family:sans-serif; padding:24px; direction:rtl; color:#1a1a1a;"><h2 style="font-size:18px; font-weight:800; color:#92400e; text-align:center;">تقرير مذكرات التفاهم — Q3 2026</h2><p style="font-size:12px; color:#6b7280; text-align:center; margin-bottom:20px;">نظرة شاملة على المذكرات النشطة والمنتهية</p><hr style="border-color:#fde68a; margin-bottom:20px;"/><p style="font-size:13px; line-height:1.8; color:#374151;">إجمالي مذكرات التفاهم النشطة: <strong>53 مذكرة</strong> بقيمة إجمالية تقديرية <strong>77.4 مليار دولار</strong>. تنتهي صلاحية <strong>4 مذكرات</strong> خلال الـ 90 يوماً القادمة وتستلزم التجديد الفوري.</p></div>`,
}

export default function ReportsPage() {
  const { isRtl, showToast } = useApp()
  const [reportType, setReportType] = useState('bilateral')
  const [period, setPeriod] = useState(PERIODS[0])
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generate = async () => {
    setGenerating(true)
    setGenerated(false)
    await new Promise((r) => setTimeout(r, 1400))
    setGenerating(false)
    setGenerated(true)
    showToast('تم إنشاء التقرير بنجاح', 'success')
  }

  const exportAs = (fmt: string) => {
    showToast(`جارٍ تصدير التقرير بصيغة ${fmt}…`, 'info')
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-xl font-extrabold text-foreground">مركز التقارير</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">أنشئ وصدِّر تقارير مخصصة على الفور</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <Card className="border-border/50 rounded-2xl shadow-sm">
            <CardHeader className="px-5 pt-4 pb-2">
              <CardTitle className="text-[14px] font-bold">إعدادات التقرير</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-muted-foreground">نوع التقرير</label>
                <div className="grid grid-cols-2 gap-2">
                  {REPORT_TYPES.map((rt) => {
                    const Icon = rt.icon
                    return (
                      <button
                        key={rt.id}
                        onClick={() => { setReportType(rt.id); setGenerated(false) }}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${reportType === rt.id ? 'border-primary/40 bg-primary/5' : 'border-border/50 hover:border-border'}`}
                      >
                        <div className={`p-1.5 rounded-lg ${rt.bg}`}><Icon className={`w-4 h-4 ${rt.color}`} /></div>
                        <span className="text-[11px] font-semibold text-foreground">{rt.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-muted-foreground">الفترة الزمنية</label>
                <select
                  value={period} onChange={(e) => { setPeriod(e.target.value); setGenerated(false) }}
                  className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/60 text-[12px] text-foreground outline-none focus:border-primary/40"
                >
                  {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <button
                onClick={generate}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:brightness-105 disabled:opacity-60 transition-all"
              >
                {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {generating ? 'جارٍ الإنشاء…' : 'إنشاء التقرير'}
              </button>
            </CardContent>
          </Card>

          {generated && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-border/50 rounded-2xl shadow-sm">
                <CardContent className="p-4 space-y-2">
                  <p className="text-[13px] font-bold text-foreground">تصدير التقرير</p>
                  {[['PDF', 'text-red-600', 'bg-red-500/10'], ['Word', 'text-blue-600', 'bg-blue-500/10'], ['Excel', 'text-emerald-600', 'bg-emerald-500/10']].map(([fmt, tc, bg]) => (
                    <button
                      key={fmt}
                      onClick={() => exportAs(fmt)}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border/50 hover:bg-muted/40 transition-colors`}
                    >
                      <div className={`p-1 rounded-md ${bg}`}>
                        {fmt === 'Excel' ? <FileSpreadsheet className={`w-3.5 h-3.5 ${tc}`} /> : <FileText className={`w-3.5 h-3.5 ${tc}`} />}
                      </div>
                      <span className="text-[12px] font-semibold text-foreground">تصدير {fmt}</span>
                      <Download className="w-3.5 h-3.5 text-muted-foreground ms-auto" />
                    </button>
                  ))}
                  <button onClick={() => exportAs('طباعة')} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border/50 hover:bg-muted/40 transition-colors">
                    <div className="p-1 rounded-md bg-muted/60"><Printer className="w-3.5 h-3.5 text-muted-foreground" /></div>
                    <span className="text-[12px] font-semibold text-foreground">طباعة</span>
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 rounded-2xl shadow-sm overflow-hidden h-full min-h-[500px]">
            <CardHeader className="px-5 pt-4 pb-3 border-b border-border/50 flex flex-row items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <CardTitle className="text-[14px] font-bold">معاينة التقرير</CardTitle>
              {generated && <Badge variant="secondary" className="ms-auto text-[10px]">مُنشأ</Badge>}
            </CardHeader>
            <CardContent className="p-0 h-full">
              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-80 gap-3">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-[13px] text-muted-foreground font-medium">جارٍ تحليل البيانات وإنشاء التقرير…</p>
                  </motion.div>
                ) : generated ? (
                  <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="overflow-auto h-full max-h-[600px]">
                    <div dangerouslySetInnerHTML={{ __html: PREVIEW_HTML[reportType] ?? PREVIEW_HTML.bilateral }} />
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-80 gap-3 text-center p-8">
                    <BarChart2 className="w-10 h-10 text-muted-foreground/40" />
                    <p className="text-[14px] font-semibold text-muted-foreground">اختر نوع التقرير والفترة الزمنية، ثم انقر "إنشاء التقرير"</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
