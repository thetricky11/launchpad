'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

interface NavProps {
  user?: { email: string; name: string } | null
}

export function Nav({ user }: NavProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast.success('Signed out')
      window.location.href = '/login'
    } catch {
      window.location.href = '/login'
    }
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/campaigns', label: 'Campaigns' },
    { href: '/billing', label: 'Billing' },
  ]

  const isActive = (href: string) => {
    if (href === '/campaigns') return pathname.startsWith('/campaigns')
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav style={{ background: '#1C1549', borderBottom: '1px solid #261D64' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group" style={{ textDecoration: 'none' }}>
            <img src="/brand-logo.avif" alt="LaunchPad" style={{ height: 32 }} />
            <div className="leading-tight">
              <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                LaunchPad
              </div>
              <div style={{ color: '#BBB4EC', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.04em', lineHeight: 1.1 }}>
                BY CREATORDB
              </div>
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: isActive(link.href) ? '#FF7B3E' : '#D2CDF3',
                  background: isActive(link.href) ? 'rgba(255,123,62,0.12)' : 'transparent',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: isActive(link.href) ? 600 : 400,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User area */}
          <div className="flex items-center gap-3">
            {user && (
              <span style={{ color: '#8E82E2', fontSize: '0.8rem', display: 'none' }} className="sm:block">
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,97,23,0.15)',
                border: '1px solid rgba(255,97,23,0.3)',
                color: '#FF7B3E',
                padding: '0.4rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
