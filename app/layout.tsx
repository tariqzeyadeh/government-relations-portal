import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'International Relations & Government Committees Portal',
  description:
    'Secure enterprise portal for international relations, MoUs, committees, and diplomatic coordination.',
}

/** Prevents system dark preference from painting before React hydrates (matches Committee Main ThemeContext). */
const themeBootScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="antialiased bg-surface text-text">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
