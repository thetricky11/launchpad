'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { Button } from './ui/button'
import { toast } from 'sonner'

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/login')
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/campaigns/new', label: 'New Campaign' },
    { href: '/billing', label: 'Billing' },
  ]

  return (
    <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-white">
              Launch<span className="text-indigo-400">Pad</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {links.map(link => (
                <Link key={link.href} href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors
                    ${pathname.startsWith(link.href) && link.href !== '/campaigns/new' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-zinc-400 hover:text-white">
            Sign out
          </Button>
        </div>
      </div>
    </nav>
  )
}
