import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GovIR Portal — International Relations & Committee Management',
  description:
    'Government International Relations & Committee Management Portal — secure, enterprise-grade platform for managing bilateral relations, MoUs, committees, and diplomatic events.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
