'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Plus, X, Search, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { AGREEMENTS, type Agreement, type AgreementStatus, type AgreementType, type SlaStatus } from '@/lib/mock-data'
import { PageHeader, SectionTitle, SlaBadge } from '@/components/ui-kit'

const STATUS_OPTIONS: AgreementStatus[] = ['active', 'draft', 'expired', 'under_review']
const TYPE_OPTIONS: AgreementType[] = ['MoU', 'MoC', 'LoI', 'Framework', 'Technical']
const COUNTRIES = [...new Set(AGREEMENTS.map((a) => a.countryNameAr))]

const STATUS_AR: Record<AgreementStatus, string> = {
  active: 'نشط',
  draft: 'مسودة',
  expired: 'منتهٍ',
  under_review: 'قيد المراجعة',
}

const STATUS_STYLES: Record<AgreementStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-blue-100 text-blue-700',
  expired: 'bg-red-100 text-red-700',
  under_review: 'bg-amber-100 text-amber-700',
}

const NEW_AGREEMENT_DEFAULTS = {
  titleAr: '',
  titleEn: '',
  type: 'MoU' as AgreementType,
  countryNameAr: '',
  status: 'draft' as AgreementStatus,
  expiryDate: '',
  ownerAr: '',
  sectorAr: '',
}

export default function AgreementsPage() {
  const { language, showToast } = useApp()
  const isAr = language === 'ar'

  const [statusFilter, setStatusFilter] = useState<AgreementStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<AgreementType | 'all'>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newForm, setNewForm] = useState(NEW_AGREEMENT_DEFAULTS)
  const [agreements, setAgreements] = useState<Agreement[]>(AGREEMENTS)
  const [sortField, setSortField] = useState<keyof Agreement | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = agreements.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    if (typeFilter !== 'all' && a.type !== typeFilter) return false
    if (countryFilter !== 'all' && a.countryNameAr !== countryFilter) return false
    if (search && !a.titleAr.includes(search) && !a.documentNumber.includes(search) && !a.countryNameAr.includes(search)) return false
    return true
  })

  const sorted = sortField
    ? [...filtered].sort((a, b) => {
        const av = String(a[sortField] ?? '')
        const bv = String(b[sortField] ?? '')
        if (av === bv) return 0
        const cmp = av < bv ? -1 : 1
        return sortDir === 'asc' ? cmp : -cmp
      })
    : filtered

  const selected = selectedId ? agreements.find((a) => a.id === selectedId) : null

  const toggleSort = (field: keyof Agreement) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ field }: { field: keyof Agreement }) =>
    sortField === field ? (
      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : null

  const updateSelectedStatus = (status: AgreementStatus) => {
    if (!selectedId) return
    setAgreements((prev) => prev.map((a) => (a.id === selectedId ? { ...a, status } : a)))
    showToast(isAr ? `تم تحديث الحالة إلى: ${STATUS_AR[status]}` : `Status updated to ${status}`)
  }

  const createAgreement = () => {
    if (!newForm.titleAr || !newForm.expiryDate) {
      showToast(isAr ? 'يرجى ملء الحقول الإلزامية' : 'Fill required fields')
      return
    }
    const newAgr: Agreement = {
      id: `agr-new-${Date.now()}`,
      documentNumber: `DOC-${Date.now().toString().slice(-6)}`,
      type: newForm.type,
      titleAr: newForm.titleAr,
      titleEn: newForm.titleEn || newForm.titleAr,
      countryId: 'new',
      countryNameAr: newForm.countryNameAr || 'غير محدد',
      countryNameEn: newForm.countryNameAr || 'N/A',
      status: newForm.status,
      expiryDate: newForm.expiryDate,
      slaDaysRemaining: 365,
      slaStatus: 'green',
      ownerAr: newForm.ownerAr || 'غير محدد',
      ownerEn: newForm.ownerAr || 'N/A',
      sectorAr: newForm.sectorAr || 'عام',
      sectorEn: newForm.sectorAr || 'General',
    }
    setAgreements((prev) => [newAgr, ...prev])
    setNewForm(NEW_AGREEMENT_DEFAULTS)
    setShowCreate(false)
    showToast(isAr ? 'تم إنشاء الاتفاقية' : 'Agreement created')
  }

  const COLUMNS: { key: keyof Agreement; labelAr: string; sortable?: boolean }[] = [
    { key: 'documentNumber', labelAr: 'رقم الوثيقة', sortable: true },
    { key: 'type', labelAr: 'النوع', sortable: true },
    { key: 'countryNameAr', labelAr: 'الطرف الثاني', sortable: true },
    { key: 'status', labelAr: 'المرحلة', sortable: true },
    { key: 'sectorAr', labelAr: 'القطاع' },
    { key: 'expiryDate', labelAr: 'تاريخ الانتهاء', sortable: true },
    { key: 'slaStatus', labelAr: 'SLA' },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title={isAr ? 'الاتفاقيات والمذكرات' : 'Agreements & MoUs'}
        subtitle={isAr ? `${agreements.length} اتفاقية مسجلة` : `${agreements.length} agreements on record`}
        actions={
          <button
            onClick={() => setShowCreate(true)}
            className="btn btn-primary gap-2 text-sm"
          >
            <Plus size={15} />
            {isAr ? 'إنشاء اتفاقية جديدة' : 'New Agreement'}
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث...' : 'Search...'}
            className="input-base ps-9 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AgreementStatus | 'all')}
          className="input-base h-11 w-auto text-sm"
        >
          <option value="all">{isAr ? 'كل الحالات' : 'All Statuses'}</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_AR[s]}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as AgreementType | 'all')}
          className="input-base h-11 w-auto text-sm"
        >
          <option value="all">{isAr ? 'كل الأنواع' : 'All Types'}</option>
          {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="input-base h-11 w-auto text-sm"
        >
          <option value="all">{isAr ? 'كل الدول' : 'All Countries'}</option>
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex h-11 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-3 text-xs text-[var(--color-text-muted)]">
          <Filter size={13} />
          {sorted.length} {isAr ? 'نتيجة' : 'results'}
        </div>
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2">
        {([['all', 'الكل'], ...STATUS_OPTIONS.map((s) => [s, STATUS_AR[s]])] as [string, string][]).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setStatusFilter(val as AgreementStatus | 'all')}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === val
                ? 'bg-[var(--color-brand)] text-white'
                : 'bg-[var(--color-bg-elev)] border border-[var(--color-border)] text-[var(--color-text-muted)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[750px] text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
              {COLUMNS.map(({ key, labelAr, sortable }) => (
                <th
                  key={key}
                  onClick={() => sortable && toggleSort(key)}
                  className={`p-3 text-start font-medium ${sortable ? 'cursor-pointer hover:text-[var(--color-text)] select-none' : ''}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {labelAr}
                    <SortIcon field={key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((agr) => (
              <tr
                key={agr.id}
                onClick={() => setSelectedId(agr.id === selectedId ? null : agr.id)}
                className={`border-b border-[var(--color-border)] last:border-0 cursor-pointer transition-colors ${
                  selectedId === agr.id
                    ? 'bg-[var(--color-brand)]/5'
                    : 'hover:bg-[var(--color-bg)]'
                }`}
              >
                <td className="p-3 font-mono text-xs text-[var(--color-text-muted)]">{agr.documentNumber}</td>
                <td className="p-3">
                  <span className="rounded bg-[var(--color-brand)]/10 px-1.5 py-0.5 text-[11px] font-semibold text-[var(--color-brand)]">
                    {agr.type}
                  </span>
                </td>
                <td className="p-3 font-medium text-[var(--color-text)]">{isAr ? agr.countryNameAr : agr.countryNameEn}</td>
                <td className="p-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[agr.status]}`}>
                    {STATUS_AR[agr.status]}
                  </span>
                </td>
                <td className="p-3 text-xs text-[var(--color-text-muted)]">{isAr ? agr.sectorAr : agr.sectorEn}</td>
                <td className="p-3 text-xs text-[var(--color-text-muted)]">{agr.expiryDate}</td>
                <td className="p-3"><SlaBadge status={agr.slaStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div className="p-10 text-center text-sm text-[var(--color-text-muted)]">
            لا توجد اتفاقيات مطابقة للفلاتر المحددة
          </div>
        )}
      </div>

      {/* Detail slide-over — docked to inline-end; animate from off-screen edge (RTL-safe) */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setSelectedId(null)}
          />
        )}
        {selected && (
          <motion.aside
            key="detail-panel"
            initial={{ x: isAr ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isAr ? '-100%' : '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-y-0 end-0 z-50 w-[400px] max-w-full overflow-y-auto border-s border-[var(--color-border)] bg-[var(--color-card)] shadow-xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <h2 className="font-bold text-[var(--color-text)] text-sm">{isAr ? 'تفاصيل الاتفاقية' : 'Agreement Detail'}</h2>
              <button onClick={() => setSelectedId(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">{isAr ? 'العنوان' : 'Title'}</p>
                <p className="mt-0.5 font-semibold text-[var(--color-text)]">{isAr ? selected.titleAr : selected.titleEn}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: isAr ? 'رقم الوثيقة' : 'Doc #', value: selected.documentNumber },
                  { label: isAr ? 'النوع' : 'Type', value: selected.type },
                  { label: isAr ? 'الدولة' : 'Country', value: isAr ? selected.countryNameAr : selected.countryNameEn },
                  { label: isAr ? 'القطاع' : 'Sector', value: isAr ? selected.sectorAr : selected.sectorEn },
                  { label: isAr ? 'المسؤول' : 'Owner', value: isAr ? selected.ownerAr : selected.ownerEn },
                  { label: isAr ? 'تاريخ الانتهاء' : 'Expiry', value: selected.expiryDate },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-[var(--color-bg)] p-2.5">
                    <p className="text-[11px] text-[var(--color-text-muted)]">{label}</p>
                    <p className="text-xs font-medium text-[var(--color-text)] mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[var(--color-text-muted)]">{isAr ? 'الحالة الحالية' : 'Current Status'}:</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[selected.status]}`}>
                  {STATUS_AR[selected.status]}
                </span>
                <SlaBadge status={selected.slaStatus} />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-[var(--color-text)]">{isAr ? 'تحديث الحالة' : 'Update Status'}</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateSelectedStatus(s)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors border ${
                        selected.status === s
                          ? 'bg-[var(--color-brand)] text-white border-transparent'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      {STATUS_AR[s]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <p className="mb-2 text-xs font-semibold text-[var(--color-text)]">{isAr ? 'SLA — أيام متبقية' : 'SLA — Days Remaining'}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        selected.slaStatus === 'green' ? 'bg-emerald-500' :
                        selected.slaStatus === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, (selected.slaDaysRemaining / 365) * 100))}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold" style={{
                    color: selected.slaStatus === 'green' ? '#059669' : selected.slaStatus === 'yellow' ? '#d97706' : '#dc2626'
                  }}>
                    {selected.slaDaysRemaining} {isAr ? 'يوم' : 'days'}
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Create slide-over */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            key="create-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setShowCreate(false)}
          />
        )}
        {showCreate && (
          <motion.aside
            key="create-panel"
            initial={{ x: isAr ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isAr ? '-100%' : '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-y-0 end-0 z-50 w-[420px] max-w-full overflow-y-auto border-s border-[var(--color-border)] bg-[var(--color-card)] shadow-xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <h2 className="font-bold text-[var(--color-text)] text-sm">
                {isAr ? 'إنشاء اتفاقية جديدة' : 'New Agreement'}
              </h2>
              <button onClick={() => setShowCreate(false)}>
                <X size={18} className="text-[var(--color-text-muted)]" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text)]">
                  {isAr ? 'عنوان الاتفاقية (عربي) *' : 'Title (Arabic) *'}
                </label>
                <input
                  value={newForm.titleAr}
                  onChange={(e) => setNewForm((f) => ({ ...f, titleAr: e.target.value }))}
                  className="input-base text-sm"
                  placeholder="مذكرة تفاهم..."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text)]">
                  {isAr ? 'النوع' : 'Type'}
                </label>
                <select
                  value={newForm.type}
                  onChange={(e) => setNewForm((f) => ({ ...f, type: e.target.value as AgreementType }))}
                  className="input-base text-sm"
                >
                  {TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text)]">
                  {isAr ? 'الدولة الشريكة' : 'Partner Country'}
                </label>
                <input
                  value={newForm.countryNameAr}
                  onChange={(e) => setNewForm((f) => ({ ...f, countryNameAr: e.target.value }))}
                  className="input-base text-sm"
                  placeholder={isAr ? 'الصين...' : 'China...'}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text)]">
                  {isAr ? 'المسؤول' : 'Owner'}
                </label>
                <input
                  value={newForm.ownerAr}
                  onChange={(e) => setNewForm((f) => ({ ...f, ownerAr: e.target.value }))}
                  className="input-base text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text)]">
                  {isAr ? 'القطاع' : 'Sector'}
                </label>
                <input
                  value={newForm.sectorAr}
                  onChange={(e) => setNewForm((f) => ({ ...f, sectorAr: e.target.value }))}
                  className="input-base text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text)]">
                  {isAr ? 'تاريخ الانتهاء *' : 'Expiry Date *'}
                </label>
                <input
                  type="date"
                  value={newForm.expiryDate}
                  onChange={(e) => setNewForm((f) => ({ ...f, expiryDate: e.target.value }))}
                  className="input-base text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text)]">
                  {isAr ? 'المرحلة الابتدائية' : 'Initial Status'}
                </label>
                <select
                  value={newForm.status}
                  onChange={(e) => setNewForm((f) => ({ ...f, status: e.target.value as AgreementStatus }))}
                  className="input-base text-sm"
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_AR[s]}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn btn-ghost border-[var(--color-border)] text-sm">
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button onClick={createAgreement} className="btn btn-primary gap-2 text-sm">
                  <Plus size={14} />
                  {isAr ? 'إنشاء' : 'Create'}
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
