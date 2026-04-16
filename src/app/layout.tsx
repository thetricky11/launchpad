import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'LaunchPad — By CreatorDB',
  description: 'AI-powered influencer marketing campaigns in seconds',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className} min-h-screen antialiased`} style={{ background: '#F6F7F9', color: '#1F1F21' }}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
