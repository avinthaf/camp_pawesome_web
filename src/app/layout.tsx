import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Camp Pawesome',
  description: 'Premium boarding and daycare for your furry family',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
