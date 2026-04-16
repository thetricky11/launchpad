'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      toast.success('Signed in!')
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-white">🚀 LaunchPad</Link>
          <p className="text-zinc-400 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input
                id="email" type="email" placeholder="admin@launchpad.app"
                value={email} onChange={e => setEmail(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <Input
                id="password" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6">
              {loading ? 'Signing in...' : 'Sign in →'}
            </Button>
          </form>
        </div>

        <p className="text-center text-zinc-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
