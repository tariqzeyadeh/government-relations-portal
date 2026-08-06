'use client'

import React, { useState } from 'react'
import {
  FileText, Search, Download, Eye, Filter, Upload, Clock,
  FileCheck, Lock, File, FilePen, Folder, ChevronRight, Star,
} from 'lucide-react'
import { useApp } from '@/lib/app-context'

const DOCUMENTS = [
  { id: 1, name: 'MoU on Energy Cooperation: Egypt',      type: 'MoU',         category: 'mous',           size: '2.4 MB', date: 'Aug 1, 2026',  status: 'pending_review', classification: 'Restricted', starred: true,  version: '2.1' },
  { id: 2, name: 'JEC Session 3: Minutes & Resolutions',  type: 'Minutes',     category: 'minutes',        size: '890 KB', date: 'Jul 28, 2026', status: 'approved',       classification: 'Internal',   starred: false, version: '1.0' },
  { id: 3, name: 'Annual Bilateral Report 2025: Iraq',    type: 'Report',      category: 'reports',        size: '5.1 MB', date: 'Jan 31, 2026', status: 'approved',       classification: 'Public',     starred: true,  version: '1.0' },
  { id: 4, name: 'Digital Economy Partnership Agreement', type: 'Agreement',   category: 'mous',           size: '3.8 MB', date: 'Mar 12, 2026', status: 'approved',       classification: 'Restricted', starred: false, version: '3.0' },
  { id: 5, name: 'Security Protocol Briefing: Q3 2026',   type: 'Brief',       category: 'classified',     size: '1.2 MB', date: 'Jul 15, 2026', status: 'classified',     classification: 'Top Secret', starred: false, version: '1.0' },
  { id: 6, name: 'Cultural Exchange Program Framework',   type: 'Framework',   category: 'policy',         size: '1.7 MB', date: 'Apr 5, 2026',  status: 'approved',       classification: 'Internal',   starred: true,  version: '2.0' },
  { id: 7, name: 'TIAP Workshop Proceedings',             type: 'Proceedings', category: 'minutes',        size: '4.2 MB', date: 'Jun 20, 2026', status: 'draft',          classification: 'Internal',   starred: false, version: '0.9' },
  { id: 8, name: 'Trade Statistics Report H1 2026',       type: 'Report',      category: 'reports',        size: '6.7 MB', date: 'Jul 10, 2026', status: 'approved',       classification: 'Public',     starred: true,  version: '1.0' },
  { id: 9, name: 'Diplomatic Note: Republic of Lebanon',  type: 'Note',        category: 'correspondence', size: '450 KB', date: 'Aug 3, 2026',  status: 'pending_review', classification: 'Restricted', starred: false, version: '1.0' },
]

const STATUS_CONFIG: Record<string, { labelEn: string; labelAr: string; bg: string; text: string }> = {
  approved:       { labelEn: 'Approved',       labelAr: 'معتمد',        bg: 'bg-emerald-500/10', text: 'text-emerald-700' },
  pending_review: { labelEn: 'Pending Review', labelAr: 'قيد المراجعة', bg: 'bg-amber-500/10',   text: 'text-amber-700'   },
  draft:          { labelEn: 'Draft',          labelAr: 'مسودة',        bg: 'bg-blue-500/10',    text: 'text-blue-700'    },
  classified:     { labelEn: 'Classified',     labelAr: 'سري',          bg: 'bg-red-500/10',     text: 'text-red-700'     },
}

const CLASSIFICATION_CONFIG: Record<string, { css: string; labelAr: string }> = {
  'Public':     { css: 'bg-gray-100 text-gray-600',        labelAr: 'عام'        },
  'Internal':   { css: 'bg-blue-500/10 text-blue-700',     labelAr: 'داخلي'      },
  'Restricted': { css: 'bg-amber-500/10 text-amber-700',   labelAr: 'مقيد'       },
  'Top Secret': { css: 'bg-red-500/10 text-red-700',       labelAr: 'سري للغاية' },
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  MoU: FileCheck, Agreement: FileCheck, Minutes: FilePen, Report: FileText,
  Brief: File, Framework: Folder, Proceedings: FilePen, Note: FileText,
}

export function DocumentsView() {
  const { language } = useApp()
  const isRtl = language === 'ar'
  const [search, setSearch] = useState('')
  const [activeFolder, setActiveFolder] = useState<string | null>(null)

  const T = {
    totalDocs:        isRtl ? 'إجمالي الوثائق'              : 'Total Documents',
    pendingReview:    isRtl ? 'قيد المراجعة'                 : 'Pending Review',
    approvedMonth:    isRtl ? 'معتمدة هذا الشهر'             : 'Approved This Month',
    classifiedFiles:  isRtl ? 'الملفات السرية'               : 'Classified Files',
    foldersHeading:   isRtl ? 'المجلدات'                     : 'Folders',
    allDocs:          isRtl ? 'جميع الوثائق'                 : 'All Documents',
    folderMous:       isRtl ? 'مذكرات التفاهم والاتفاقيات'   : 'MoUs & Agreements',
    folderMinutes:    isRtl ? 'محاضر الاجتماعات'             : 'Meeting Minutes',
    folderCorr:       isRtl ? 'المراسلات الدبلوماسية'        : 'Diplomatic Correspondence',
    folderPolicy:     isRtl ? 'الوثائق السياسية'             : 'Policy Documents',
    folderClassified: isRtl ? 'الملفات السرية'               : 'Classified Files',
    folderReports:    isRtl ? 'التقارير والتحليلات'          : 'Reports & Analysis',
    storageUsed:      isRtl ? 'المساحة المستخدمة'            : 'Storage Used',
    storageDetail:    isRtl ? '62.3 غ.ب من 100 غ.ب'         : '62.3 GB of 100 GB used',
    searchPlaceholder:isRtl ? 'البحث في الوثائق...'          : 'Search documents...',
    filterBtn:        isRtl ? 'تصفية'                        : 'Filter',
    uploadBtn:        isRtl ? 'رفع وثيقة'                    : 'Upload',
    thDocument:       isRtl ? 'الوثيقة'                      : 'Document',
    thType:           isRtl ? 'النوع'                        : 'Type',
    thClass:          isRtl ? 'التصنيف'                      : 'Classification',
    thStatus:         isRtl ? 'الحالة'                       : 'Status',
    thModified:       isRtl ? 'آخر تعديل'                    : 'Modified',
    thActions:        isRtl ? 'الإجراءات'                    : 'Actions',
    noDocsTitle:      isRtl ? 'لا توجد وثائق'                : 'No documents found',
    noDocsSubtitle:   isRtl ? 'حاول تعديل بحثك أو التصفية'  : 'Try adjusting your search or filter',
    preview:          isRtl ? 'معاينة'                       : 'Preview',
    download:         isRtl ? 'تحميل'                        : 'Download',
  }

  const FOLDERS = [
    { key: 'mous',           name: T.folderMous,       count: 47,  icon: FileCheck, color: 'text-amber-600',   bg: 'bg-amber-500/10'   },
    { key: 'minutes',        name: T.folderMinutes,    count: 124, icon: FilePen,   color: 'text-blue-600',    bg: 'bg-blue-500/10'    },
    { key: 'correspondence', name: T.folderCorr,       count: 89,  icon: FileText,  color: 'text-violet-600',  bg: 'bg-violet-500/10'  },
    { key: 'policy',         name: T.folderPolicy,     count: 31,  icon: File,      color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { key: 'classified',     name: T.folderClassified, count: 12,  icon: Lock,      color: 'text-red-600',     bg: 'bg-red-500/10'     },
    { key: 'reports',        name: T.folderReports,    count: 63,  icon: Folder,    color: 'text-cyan-600',    bg: 'bg-cyan-500/10'    },
  ]

  const STATS = [
    { label: T.totalDocs,       value: '366', icon: FileText,  color: 'text-blue-600',    bg: 'bg-blue-500/10'    },
    { label: T.pendingReview,   value: '18',  icon: Clock,     color: 'text-amber-600',   bg: 'bg-amber-500/10'   },
    { label: T.approvedMonth,   value: '41',  icon: FileCheck, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: T.classifiedFiles, value: '12',  icon: Lock,      color: 'text-red-600',     bg: 'bg-red-500/10'     },
  ]

  const filtered = DOCUMENTS.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase())
    const matchFolder = !activeFolder || d.category === activeFolder
    return matchSearch && matchFolder
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm p-5 flex items-center gap-4">
              <div className={`p-2.5 rounded-xl shrink-0 ${stat.bg}`}><Icon className={`w-5 h-5 ${stat.color}`} /></div>
              <div>
                <p className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-extrabold text-[var(--color-text)] mt-0.5">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="space-y-1.5">
          <h3 className="text-[12px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 px-1">{T.foldersHeading}</h3>
          <button onClick={() => setActiveFolder(null)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${!activeFolder ? 'bg-[var(--color-brand)] text-white shadow-sm' : 'text-[var(--color-text-muted)] hover:bg-gray-100/60 hover:text-[var(--color-text)]'}`}>
            <Folder className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">{T.allDocs}</span>
            <span className="text-[11px] opacity-70">{DOCUMENTS.length}</span>
          </button>
          {FOLDERS.map((folder) => {
            const Icon = folder.icon
            const active = activeFolder === folder.key
            return (
              <button key={folder.key} onClick={() => setActiveFolder(folder.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150 ${active ? 'bg-[var(--color-brand)] text-white shadow-sm font-semibold' : 'text-[var(--color-text)] hover:bg-gray-100/60 font-medium'}`}>
                <div className={`shrink-0 p-1 rounded-lg ${active ? 'bg-white/15' : folder.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : folder.color}`} />
                </div>
                <span className="flex-1 text-left truncate">{folder.name}</span>
                <span className="text-[11px] opacity-60">{folder.count}</span>
                {!active && <ChevronRight className="w-3 h-3 opacity-30" />}
              </button>
            )
          })}

          <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm p-4 space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{T.storageUsed}</p>
              <span className="text-[10px] font-bold text-[var(--color-text)]">62%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full rounded-full bg-[var(--color-brand)]" style={{ width: '62%' }} />
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)]">{T.storageDetail}</p>
          </div>
        </div>

        <div className="xl:col-span-3 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
              <input placeholder={T.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 h-10 text-[13px] rounded-xl bg-gray-100/50 border border-[var(--color-border)]/60 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-brand)]/40" />
            </div>
            <button className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]/60 px-3.5 py-2 rounded-xl transition-all hover:bg-gray-100/60 font-medium">
              <Filter className="w-3.5 h-3.5" />{T.filterBtn}
            </button>
            <button className="flex items-center gap-1.5 text-[12px] bg-[var(--color-brand)] text-white px-3.5 py-2 rounded-xl hover:bg-[var(--color-brand2)] transition-all font-medium shadow-sm">
              <Upload className="w-3.5 h-3.5" />{T.uploadBtn}
            </button>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]/50 bg-gray-100/30">
                    <th className="text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-5 py-3">{T.thDocument}</th>
                    <th className="text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-4 py-3 hidden sm:table-cell">{T.thType}</th>
                    <th className="text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-4 py-3 hidden md:table-cell">{T.thClass}</th>
                    <th className="text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-4 py-3">{T.thStatus}</th>
                    <th className="text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-4 py-3 hidden lg:table-cell">{T.thModified}</th>
                    <th className="text-right text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-5 py-3">{T.thActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((doc) => {
                    const DocIcon = TYPE_ICONS[doc.type] ?? FileText
                    const status = STATUS_CONFIG[doc.status]
                    const classConfig = CLASSIFICATION_CONFIG[doc.classification]
                    return (
                      <tr key={doc.id} className="border-b border-[var(--color-border)]/30 hover:bg-gray-100/20 transition-colors duration-100 group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-gray-100/60 rounded-lg shrink-0">
                              <DocIcon className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-[var(--color-text)] truncate max-w-[200px]">{doc.name}</p>
                              <p className="text-[10px] text-[var(--color-text-muted)]">{doc.size} · v{doc.version}</p>
                            </div>
                            {doc.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <span className="text-[12px] text-[var(--color-text-muted)] font-medium">{doc.type}</span>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${classConfig.css}`}>
                            {isRtl ? classConfig.labelAr : doc.classification}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center ${status.bg} ${status.text} text-[10px] px-2.5 py-0.5 rounded-lg font-semibold`}>
                            {isRtl ? status.labelAr : status.labelEn}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <span className="text-[12px] text-[var(--color-text-muted)]">{doc.date}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <button className="p-1.5 rounded-lg hover:bg-[var(--color-brand)]/10 hover:text-[var(--color-brand)] transition-colors" title={T.preview}>
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-[var(--color-brand)]/10 hover:text-[var(--color-brand)] transition-colors" title={T.download}>
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100/60 flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-5 h-5 text-[var(--color-text-muted)]/50" />
                  </div>
                  <p className="text-[13px] font-semibold text-[var(--color-text-muted)]">{T.noDocsTitle}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]/60 mt-1">{T.noDocsSubtitle}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
