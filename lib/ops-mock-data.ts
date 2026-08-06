// ─── Global mock data for all portal pages ───────────────────────────────────

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const TASKS = [
  { id: 'TSK-001', name: 'مراجعة مذكرة التفاهم مع الأردن', nameEn: 'Review Jordan MoU', owner: 'أحمد المنصوري', due: '2026-08-10', sla: 'green'  as const, status: 'قيد التنفيذ', module: 'مذكرات' },
  { id: 'TSK-002', name: 'إعداد تقرير التجارة الثنائية مع مصر', nameEn: 'Egypt Trade Report', owner: 'سارة الراشدي', due: '2026-08-14', sla: 'yellow' as const, status: 'معلقة',      module: 'تقارير' },
  { id: 'TSK-003', name: 'تحديث ملف المغرب', nameEn: 'Update Morocco Profile', owner: 'خالد إبراهيم', due: '2026-08-02', sla: 'red'    as const, status: 'متأخر',      module: 'ملفات الدول' },
  { id: 'TSK-004', name: 'دراسة جدوى مركز الذكاء الاصطناعي', nameEn: 'AI Center Feasibility', owner: 'أحمد المنصوري', due: '2026-08-20', sla: 'green'  as const, status: 'قيد التنفيذ', module: 'مشاريع' },
  { id: 'TSK-005', name: 'بروتوكول الأمن السيبراني — العراق', nameEn: 'Cybersec Protocol Iraq', owner: 'خالد إبراهيم', due: '2026-07-30', sla: 'red'    as const, status: 'متأخر',      module: 'أمن' },
  { id: 'TSK-006', name: 'خارطة طريق استثمار دول الخليج', nameEn: 'GCC Investment Roadmap', owner: 'سارة الراشدي', due: '2026-08-25', sla: 'green'  as const, status: 'معلقة',      module: 'استثمار' },
  { id: 'TSK-007', name: 'تقييم برنامج اللغة مع الأردن', nameEn: 'Language Program Eval', owner: 'عمر ناصر', due: '2026-09-01', sla: 'green'  as const, status: 'معلقة',      module: 'تعليم' },
  { id: 'TSK-008', name: 'تقرير تقييم التهديدات السنوي', nameEn: 'Annual Threat Assessment', owner: 'عمر ناصر', due: '2026-09-15', sla: 'yellow' as const, status: 'قيد التنفيذ', module: 'أمن' },
  { id: 'TSK-009', name: 'إنهاء مواقف التفاوض المناخي', nameEn: 'Climate Negotiation Positions', owner: 'أحمد المنصوري', due: '2026-08-25', sla: 'yellow' as const, status: 'قيد التنفيذ', module: 'مذكرات' },
  { id: 'TSK-010', name: 'تنسيق حفل توقيع مذكرة الهيدروجين', nameEn: 'Hydrogen MoU Signing Ceremony', owner: 'سارة الراشدي', due: '2026-08-18', sla: 'green'  as const, status: 'تم الإنجاز', module: 'فعاليات' },
]

// ── Integrations ──────────────────────────────────────────────────────────────
export const INTEGRATIONS = [
  { id: 'sap',        name: 'SAP C4C',              nameAr: 'SAP C4C',                 status: 'connected' as const, lastSync: 'منذ 4 دقائق',  endpoint: 'https://api.sap-c4c.gov.sa/v2', apiKey: 'sk-sap-****-3921' },
  { id: 'snow',       name: 'ServiceNow',            nameAr: 'ServiceNow',              status: 'connected' as const, lastSync: 'منذ 12 دقيقة',  endpoint: 'https://gov.service-now.com/api', apiKey: 'sn-tok-****-8841' },
  { id: 'sinai',      name: 'منصة صناعي',            nameAr: 'منصة صناعي',             status: 'connected' as const, lastSync: 'منذ 7 دقائق',   endpoint: 'https://sanai.moi.gov.sa/api/v1', apiKey: 'sn-****-7712' },
  { id: 'rehla',      name: 'رحلة المستثمر',         nameAr: 'رحلة المستثمر',          status: 'error'     as const, lastSync: 'منذ ساعتين',    endpoint: 'https://investor.sa/api',         apiKey: 'rh-****-4490' },
  { id: 'nafath',     name: 'نفاذ',                  nameAr: 'نفاذ',                    status: 'connected' as const, lastSync: 'منذ دقيقتين',   endpoint: 'https://nafath.gov.sa/api',       apiKey: 'nf-****-1002' },
  { id: 'powerbi',    name: 'Power BI',              nameAr: 'Power BI',                status: 'connected' as const, lastSync: 'منذ 30 دقيقة',  endpoint: 'https://api.powerbi.com/v1.0/myorg', apiKey: 'pbi-****-5533' },
  { id: 'laser',      name: 'Laserfiche',            nameAr: 'Laserfiche',              status: 'syncing'   as const, lastSync: 'جارٍ الآن…',    endpoint: 'https://laser.gov.sa/api/v3',     apiKey: 'lf-****-9921' },
]

// ── Audit Logs ────────────────────────────────────────────────────────────────
export const AUDIT_LOGS = [
  { id: 'LOG-8829', datetime: '2026-08-01 10:30', user: 'admin', op: 'إنشاء مذكرة تفاهم', ip: '192.168.1.1', auth: '2FA-TOTP', module: 'مذكرات', payload: { action: 'CREATE_MOU', user_id: 102, entityId: 'MOU-CN-2026-01', fields: { country: 'China', type: 'Framework' } } },
  { id: 'LOG-8841', datetime: '2026-08-06 08:42:17', user: 'أحمد المنصوري', op: 'تحديث مذكرة تفاهم', ip: '10.12.4.21',  auth: '2FA-TOTP', module: 'مذكرات',      payload: { action: 'UPDATE', entityId: 'MOU-JO-2026-04', fields: { status: { from: 'draft', to: 'final_review' }, updatedBy: 'a.almansouri@mofa.gov' } } },
  { id: 'LOG-8840', datetime: '2026-08-06 08:30:05', user: 'سارة الراشدي',  op: 'رفع وثيقة',         ip: '10.12.5.14',  auth: '2FA-SMS',  module: 'أرشيف',       payload: { action: 'CREATE', entityId: 'DOC-2026-0441', fields: { filename: 'egypt_trade_q3.pdf', size: 2048512, folderId: 'F-TRADE' } } },
  { id: 'LOG-8839', datetime: '2026-08-06 08:15:44', user: 'خالد إبراهيم',  op: 'تسجيل دخول',        ip: '10.12.1.100', auth: 'SSO-SAML', module: 'نظام',        payload: { action: 'LOGIN', sessionId: 'sess_4k92xp', userAgent: 'Mozilla/5.0 (Windows NT 10.0)', mfaMethod: 'SSO-SAML' } },
  { id: 'LOG-8838', datetime: '2026-08-06 07:58:22', user: 'عمر ناصر',      op: 'تغيير حالة مهمة',   ip: '10.12.6.33',  auth: '2FA-TOTP', module: 'مهام',        payload: { action: 'UPDATE', entityId: 'TSK-008', fields: { status: { from: 'pending', to: 'in_progress' } } } },
  { id: 'LOG-8837', datetime: '2026-08-06 07:44:09', user: 'سارة الراشدي',  op: 'إنشاء تقرير',       ip: '10.12.5.14',  auth: '2FA-SMS',  module: 'تقارير',      payload: { action: 'CREATE', entityId: 'RPT-2026-0088', fields: { type: 'bilateral_trade', period: 'Q3-2026', generatedBy: 's.alrashidi@mofa.gov' } } },
  { id: 'LOG-8836', datetime: '2026-08-06 07:31:55', user: 'أحمد المنصوري', op: 'الموافقة على قرار',  ip: '10.12.4.21',  auth: '2FA-TOTP', module: 'قرارات',      payload: { action: 'APPROVE', entityId: 'DEC-JEC-2026-12', fields: { voteResult: 'approved', votes: { for: 11, against: 0, abstain: 1 } } } },
  { id: 'LOG-8835', datetime: '2026-08-06 07:20:00', user: 'خالد إبراهيم',  op: 'تعديل صلاحيات مستخدم', ip: '10.12.1.100', auth: 'SSO-SAML', module: 'إدارة',  payload: { action: 'UPDATE', entityId: 'USR-0092', fields: { role: { from: 'committee_member', to: 'executive' }, grantedBy: 'k.ibrahim@mofa.gov' } } },
  { id: 'LOG-8834', datetime: '2026-08-05 17:55:12', user: 'عمر ناصر',      op: 'تصدير تقرير',       ip: '10.12.6.33',  auth: '2FA-TOTP', module: 'تقارير',      payload: { action: 'EXPORT', entityId: 'RPT-2026-0085', fields: { format: 'PDF', pages: 22, sizeBytes: 1844200 } } },
  { id: 'LOG-8833', datetime: '2026-08-05 17:40:08', user: 'سارة الراشدي',  op: 'حذف وثيقة مؤقتة',   ip: '10.12.5.14',  auth: '2FA-SMS',  module: 'أرشيف',       payload: { action: 'DELETE', entityId: 'DOC-2026-0438', fields: { reason: 'duplicate', deletedBy: 's.alrashidi@mofa.gov' } } },
  { id: 'LOG-8832', datetime: '2026-08-05 17:10:44', user: 'أحمد المنصوري', op: 'تفويض توقيع',       ip: '10.12.4.21',  auth: '2FA-TOTP', module: 'تفويضات',    payload: { action: 'CREATE', entityId: 'DEL-2026-14', fields: { delegator: 'a.almansouri', delegatee: 's.alrashidi', scope: 'مذكرات التفاهم', expiresAt: '2026-09-01' } } },
  { id: 'LOG-8831', datetime: '2026-08-05 16:55:30', user: 'خالد إبراهيم',  op: 'مزامنة تكامل',      ip: '10.12.1.100', auth: 'SSO-SAML', module: 'تكاملات',    payload: { action: 'SYNC', entityId: 'INT-NAFATH', fields: { recordsSynced: 412, duration_ms: 3210, status: 'success' } } },
  { id: 'LOG-8830', datetime: '2026-08-05 16:30:11', user: 'عمر ناصر',      op: 'إنشاء تذكرة دعم',   ip: '10.12.6.33',  auth: '2FA-TOTP', module: 'دعم',         payload: { action: 'CREATE', entityId: 'TKT-108', fields: { title: 'خطأ في رفع الملفات', priority: 'high', category: 'مشكلة تقنية' } } },
]

// ── Support Tickets ───────────────────────────────────────────────────────────
export const SUPPORT_TICKETS = [
  {
    id: 'TKT-104', title: 'خطأ عند تصدير تقرير PDF', category: 'مشكلة تقنية', priority: 'عالية', status: 'مفتوحة',
    created: '2026-08-05 14:22', creator: 'سارة الراشدي', description: 'عند النقر على تصدير PDF تظهر رسالة خطأ "500 Internal Server Error" ولا يتم تنزيل الملف.',
    attachments: ['screenshot_error.png'],
    replies: [
      { author: 'فريق الدعم', time: '2026-08-05 15:10', body: 'تم استلام التذكرة، نحن نحقق في المشكلة.' },
      { author: 'سارة الراشدي', time: '2026-08-05 15:30', body: 'المشكلة تحدث فقط مع تقارير تزيد عن 20 صفحة.' },
    ],
  },
  {
    id: 'TKT-105', title: 'استفسار: كيفية إعداد تفويض موقت', category: 'استفسار', priority: 'متوسطة', status: 'مفتوحة',
    created: '2026-08-05 16:45', creator: 'عمر ناصر', description: 'أرغب في معرفة خطوات إنشاء تفويض مؤقت لمدة أسبوع للتوقيع على المذكرات.',
    attachments: [],
    replies: [
      { author: 'فريق الدعم', time: '2026-08-05 17:20', body: 'يمكنك الذهاب إلى الإدارة > التوقيعات والتفويضات > إنشاء تفويض جديد.' },
    ],
  },
  {
    id: 'TKT-106', title: 'عدم ظهور اللجان في لوحة التحكم', category: 'مشكلة تقنية', priority: 'عالية', status: 'مغلقة',
    created: '2026-08-04 09:15', creator: 'أحمد المنصوري', description: 'بعد آخر تحديث لا تظهر اللجان التي أنا عضو فيها في لوحة التحكم الرئيسية.',
    attachments: ['dashboard_empty.png', 'console_log.txt'],
    replies: [
      { author: 'فريق الدعم', time: '2026-08-04 10:00', body: 'تم تحديد المشكلة: خطأ في مزامنة صلاحيات المستخدمين.' },
      { author: 'فريق الدعم', time: '2026-08-04 11:30', body: 'تم الإصلاح، يرجى تسجيل الخروج وإعادة الدخول.' },
      { author: 'أحمد المنصوري', time: '2026-08-04 11:45', body: 'تم الحل، شكراً!' },
    ],
  },
  {
    id: 'TKT-107', title: 'طلب إضافة صلاحية تعديل على لجنة TIAP', category: 'طلب صلاحية', priority: 'منخفضة', status: 'مفتوحة',
    created: '2026-08-05 11:00', creator: 'خالد إبراهيم', description: 'أحتاج إلى صلاحية تعديل على لجنة TIAP-2026 لتحديث جدول الأعمال.',
    attachments: [],
    replies: [],
  },
  {
    id: 'TKT-108', title: 'خطأ في رفع الملفات بتنسيق DOCX', category: 'مشكلة تقنية', priority: 'عالية', status: 'مفتوحة',
    created: '2026-08-05 16:30', creator: 'عمر ناصر', description: 'يظهر خطأ "unsupported file type" عند محاولة رفع ملفات DOCX في مركز الوثائق رغم أن الصيغة مدعومة.',
    attachments: ['error_docx.png'],
    replies: [
      { author: 'فريق الدعم', time: '2026-08-05 17:00', body: 'نحن نعمل على حل المشكلة، من المتوقع الإصلاح خلال ساعة.' },
    ],
  },
]

// ── Delegations ───────────────────────────────────────────────────────────────
export const DELEGATIONS = [
  { id: 'DEL-2026-11', delegator: 'أحمد المنصوري', delegatee: 'سارة الراشدي', scope: 'مذكرات التفاهم', start: '2026-08-01', end: '2026-08-15', status: 'نشطة' as const },
  { id: 'DEL-2026-12', delegator: 'سارة الراشدي',  delegatee: 'خالد إبراهيم', scope: 'التوقيع على التقارير', start: '2026-08-03', end: '2026-08-10', status: 'نشطة' as const },
  { id: 'DEL-2026-13', delegator: 'أحمد المنصوري', delegatee: 'عمر ناصر',    scope: 'قرارات اللجنة الاقتصادية', start: '2026-07-20', end: '2026-08-05', status: 'منتهية' as const },
]

// ── RBAC Roles Matrix ─────────────────────────────────────────────────────────
export type AccessLevel = 'read' | 'edit' | 'none'
export const MODULES = ['إدارة المذكرات', 'التوقيع', 'إدارة اللجان', 'التقارير', 'الأرشيف', 'إدارة المستخدمين']
export const ROLES_MATRIX: { role: string; permissions: Record<string, AccessLevel> }[] = [
  { role: 'قيادات التعدين',   permissions: { 'إدارة المذكرات': 'read', 'التوقيع': 'edit', 'إدارة اللجان': 'read', 'التقارير': 'read', 'الأرشيف': 'read', 'إدارة المستخدمين': 'none' } },
  { role: 'عضو لجنة',         permissions: { 'إدارة المذكرات': 'edit', 'التوقيع': 'none', 'إدارة اللجان': 'read', 'التقارير': 'read', 'الأرشيف': 'edit', 'إدارة المستخدمين': 'none' } },
  { role: 'قيادات الصناعة',   permissions: { 'إدارة المذكرات': 'read', 'التوقيع': 'edit', 'إدارة اللجان': 'edit', 'التقارير': 'edit', 'الأرشيف': 'read', 'إدارة المستخدمين': 'none' } },
  { role: 'مدير النظام',       permissions: { 'إدارة المذكرات': 'edit', 'التوقيع': 'edit', 'إدارة اللجان': 'edit', 'التقارير': 'edit', 'الأرشيف': 'edit', 'إدارة المستخدمين': 'edit' } },
]

// ── Archive ───────────────────────────────────────────────────────────────────
export const ARCHIVE_FOLDERS = [
  { id: 'F-MOU',    name: 'مذكرات التفاهم',        count: 48, icon: '📄', lastModified: '2026-08-05' },
  { id: 'F-TRADE',  name: 'التجارة والاستثمار',     count: 31, icon: '📊', lastModified: '2026-08-06' },
  { id: 'F-MINS',   name: 'محاضر الاجتماعات',       count: 62, icon: '📝', lastModified: '2026-08-04' },
  { id: 'F-LEGAL',  name: 'الوثائق القانونية',      count: 19, icon: '⚖️', lastModified: '2026-08-03' },
  { id: 'F-REPORT', name: 'التقارير الرسمية',       count: 27, icon: '📈', lastModified: '2026-08-06' },
  { id: 'F-CORR',   name: 'المراسلات الرسمية',     count: 84, icon: '✉️', lastModified: '2026-08-06' },
]

export const ARCHIVE_FILES: Record<string, { id: string; name: string; type: string; size: string; uploaded: string; uploader: string }[]> = {
  'F-MOU': [
    { id: 'f1', name: 'مذكرة التفاهم الهيدروجين - الأردن 2026.pdf', type: 'PDF', size: '1.8 MB', uploaded: '2026-08-05', uploader: 'أحمد المنصوري' },
    { id: 'f2', name: 'مذكرة التفاهم التقنية - المغرب.docx',         type: 'DOCX', size: '842 KB', uploaded: '2026-08-03', uploader: 'سارة الراشدي' },
    { id: 'f3', name: 'اتفاقية التعاون الدفاعي - العراق.pdf',         type: 'PDF', size: '2.4 MB', uploaded: '2026-07-28', uploader: 'خالد إبراهيم' },
  ],
  'F-TRADE': [
    { id: 'f4', name: 'تقرير التجارة الثنائية Q2 2026 - مصر.xlsx',   type: 'XLSX', size: '3.1 MB', uploaded: '2026-08-06', uploader: 'سارة الراشدي' },
    { id: 'f5', name: 'إحصاءات التصدير 2026 - الخليج.pdf',            type: 'PDF', size: '988 KB', uploaded: '2026-08-04', uploader: 'عمر ناصر' },
  ],
  'F-MINS': [
    { id: 'f6', name: 'محضر جلسة JEC الثانية 2026.pdf',              type: 'PDF', size: '1.2 MB', uploaded: '2026-08-01', uploader: 'أحمد المنصوري' },
    { id: 'f7', name: 'محضر ورشة عمل TIAP - يوليو 2026.docx',        type: 'DOCX', size: '560 KB', uploaded: '2026-07-22', uploader: 'سارة الراشدي' },
  ],
  'F-LEGAL': [
    { id: 'f8', name: 'رأي قانوني - مذكرة الهيدروجين.pdf',            type: 'PDF', size: '744 KB', uploaded: '2026-08-02', uploader: 'خالد إبراهيم' },
  ],
  'F-REPORT': [
    { id: 'f9', name: 'تقرير الأداء الربعي Q2 2026.pdf',              type: 'PDF', size: '4.2 MB', uploaded: '2026-08-05', uploader: 'سارة الراشدي' },
    { id: 'f10', name: 'تقرير تقييم التهديدات 2026.pdf',               type: 'PDF', size: '2.9 MB', uploaded: '2026-08-03', uploader: 'عمر ناصر' },
  ],
  'F-CORR': [
    { id: 'f11', name: 'مراسلة سفارة الأردن - أغسطس 2026.pdf',       type: 'PDF', size: '320 KB', uploaded: '2026-08-06', uploader: 'أحمد المنصوري' },
    { id: 'f12', name: 'خطاب رسمي لوزارة الخارجية المغربية.pdf',      type: 'PDF', size: '280 KB', uploaded: '2026-08-04', uploader: 'سارة الراشدي' },
  ],
}

// ── Media ─────────────────────────────────────────────────────────────────────
export const MEDIA = [
  { id: 'MED-001', title: 'توقيع مذكرة التفاهم مع الأردن', titleEn: 'Jordan MoU Signing', type: 'صورة', date: '2026-08-05', status: 'منشور', tags: ['أردن', 'مذكرات'], thumb: '🤝' },
  { id: 'MED-002', title: 'ورشة عمل لجنة TIAP التقنية',     titleEn: 'TIAP Technical Workshop', type: 'فيديو', date: '2026-08-04', status: 'منشور', tags: ['TIAP', 'تقنية'], thumb: '🎬' },
  { id: 'MED-003', title: 'مؤتمر صحفي — مبادرة الهيدروجين الأخضر', titleEn: 'Green Hydrogen Press', type: 'صورة', date: '2026-08-03', status: 'مسودة', tags: ['طاقة', 'هيدروجين'], thumb: '📸' },
  { id: 'MED-004', title: 'زيارة وزير الخارجية للمغرب',      titleEn: 'FM Visit Morocco',  type: 'ألبوم', date: '2026-07-30', status: 'منشور', tags: ['المغرب', 'زيارات'], thumb: '🗂️' },
  { id: 'MED-005', title: 'إنفوجرافيك — إحصاءات التجارة Q2', titleEn: 'Trade Stats Infographic', type: 'إنفوجرافيك', date: '2026-08-06', status: 'مسودة', tags: ['تجارة', 'إحصاءات'], thumb: '📊' },
]

// ── AI Insights ───────────────────────────────────────────────────────────────
export const AI_INSIGHTS = [
  { id: 'AI-01', type: 'خطر', title: 'خطر انتهاء صلاحية مذكرة التفاهم', body: 'مذكرة التفاهم المتعلقة بالطاقة المتجددة مع الجزائر ستنتهي خلال 22 يوماً، يُنصح ببدء إجراءات التجديد فوراً.', confidence: 94, date: '2026-08-06', accepted: null as boolean | null, color: 'red' },
  { id: 'AI-02', type: 'فرصة', title: 'فرصة توسيع التعاون مع تونس', body: 'استناداً إلى أنماط التواصل الدبلوماسي خلال الربع الثالث، هناك إمكانية لتطوير شراكة في قطاع التعليم التقني مع تونس.', confidence: 81, date: '2026-08-06', accepted: null as boolean | null, color: 'green' },
  { id: 'AI-03', type: 'تحذير', title: 'تأخر في تنفيذ قرارات اللجنة الاقتصادية', body: '3 من أصل 5 قرارات للجنة JEC الصادرة في يوليو لم تنفذ بعد، مما يؤثر على مؤشرات الأداء الربعية.', confidence: 88, date: '2026-08-05', accepted: null as boolean | null, color: 'amber' },
  { id: 'AI-04', type: 'فرصة', title: 'توصية بتعزيز العلاقات مع مصر', body: 'البيانات التاريخية تُظهر أن الربع الثالث هو الأنسب لتوقيع اتفاقيات التجارة مع مصر، يُوصى بجدولة اجتماع وزاري.', confidence: 76, date: '2026-08-05', accepted: null as boolean | null, color: 'blue' },
  { id: 'AI-05', type: 'خطر', title: 'ضغط على جدول أعمال SCWG', body: 'تحليل سعة الفريق يُشير إلى أن لجنة SCWG تعمل بطاقة 112%، مما قد يؤدي إلى تأخيرات في اجتماع أغسطس.', confidence: 91, date: '2026-08-04', accepted: null as boolean | null, color: 'red' },
  { id: 'AI-06', type: 'تحليل', title: 'اتجاه إيجابي في مؤشرات التعاون الخليجي', body: 'خلال الأشهر الستة الماضية، ارتفع معدل إتمام مبادرات التعاون الخليجي بنسبة 18%، ويُتوقع استمرار هذا الاتجاه.', confidence: 85, date: '2026-08-04', accepted: null as boolean | null, color: 'purple' },
]

// ── Committee Types ───────────────────────────────────────────────────────────
export const COMMITTEE_TYPES = [
  { id: 'CT-01', name: 'لجنة مشتركة',         nameEn: 'Joint Committee',          description: 'لجان ثنائية دائمة للتعاون المشترك' },
  { id: 'CT-02', name: 'مجموعة عمل',           nameEn: 'Working Group',            description: 'مجموعات تقنية متخصصة ومؤقتة' },
  { id: 'CT-03', name: 'لجنة استشارية',        nameEn: 'Advisory Panel',           description: 'لجان استشارية لصانعي القرار' },
  { id: 'CT-04', name: 'لجنة تنسيق',           nameEn: 'Coordination Committee',   description: 'لجان تنسيق بين الوزارات والجهات' },
]

// ── Meeting Types ─────────────────────────────────────────────────────────────
export const MEETING_TYPES = [
  { id: 'MT-01', name: 'جلسة عادية',           nameEn: 'Regular Session',          duration: 120 },
  { id: 'MT-02', name: 'جلسة طارئة',           nameEn: 'Emergency Session',        duration: 60  },
  { id: 'MT-03', name: 'ورشة عمل',             nameEn: 'Workshop',                 duration: 240 },
  { id: 'MT-04', name: 'اجتماع وزاري',         nameEn: 'Ministerial Meeting',      duration: 90  },
  { id: 'MT-05', name: 'مؤتمر إقليمي',         nameEn: 'Regional Conference',      duration: 480 },
]

// ── Notification Templates ────────────────────────────────────────────────────
export const NOTIFICATION_TEMPLATES = [
  {
    id: 'NT-01',
    name: 'تذكير موعد الاجتماع',
    nameEn: 'Meeting Reminder',
    body: 'عزيزي [اسم_المستخدم]، يُذكَّر بأن اجتماع [اسم_اللجنة] مقرر في [تاريخ_الاجتماع] الساعة [وقت_الاجتماع]. يرجى الاطلاع على جدول الأعمال المرفق.',
    channel: 'بريد إلكتروني + إشعار داخلي',
  },
  {
    id: 'NT-02',
    name: 'انتهاء صلاحية مذكرة تفاهم',
    nameEn: 'MoU Expiry Alert',
    body: 'تنبيه: مذكرة التفاهم [رقم_المذكرة] المبرمة مع [اسم_الدولة] ستنتهي في [تاريخ_الانتهاء]. يرجى اتخاذ الإجراءات اللازمة للتجديد أو الإنهاء.',
    channel: 'بريد إلكتروني',
  },
  {
    id: 'NT-03',
    name: 'مهمة متأخرة',
    nameEn: 'Overdue Task',
    body: 'تنبيه: المهمة "[اسم_المهمة]" المسندة إلى [اسم_المسؤول] قد تجاوزت موعدها المحدد [تاريخ_الاستحقاق]. يرجى تحديث الحالة أو التواصل مع المسؤول.',
    channel: 'إشعار داخلي',
  },
  {
    id: 'NT-04',
    name: 'قرار جديد للتصويت',
    nameEn: 'New Decision for Vote',
    body: 'قرار جديد يتطلب تصويتك: "[عنوان_القرار]" في إطار [اسم_اللجنة]. آخر موعد للتصويت: [تاريخ_الانتهاء].',
    channel: 'بريد إلكتروني + رسالة SMS',
  },
]
