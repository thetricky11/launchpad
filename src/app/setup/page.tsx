'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function SetupPage() {
  const [sql, setSql] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{success?: boolean; error?: string; message?: string} | null>(null)

  useEffect(() => {
    fetch('/api/setup').then(r => r.json()).then(d => setSql(d.sql || ''))
  }, [])

  const runMigration = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Database Setup</h1>
      <p className="text-zinc-400 mb-8">Run migrations to create the required tables</p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Option 1: Auto-migrate (requires DB password)</h2>
        <p className="text-zinc-400 text-sm mb-4">Find your DB password in Supabase Dashboard → Settings → Database</p>
        <div className="flex gap-3">
          <Input value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Your Supabase DB password" type="password"
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
          <Button onClick={runMigration} disabled={loading || !password} className="bg-indigo-600 hover:bg-indigo-500 text-white whitespace-nowrap">
            {loading ? 'Running...' : 'Run Migrations'}
          </Button>
        </div>
        {result && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${result.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {result.message || result.error}
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Option 2: Manual SQL (Supabase SQL Editor)</h2>
        <p className="text-zinc-400 text-sm mb-4">
          Copy this SQL and paste it into your{' '}
          <a href="https://supabase.com/dashboard/project/ehgfmkqxyqwlsoytfzgv/sql/new" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">
            Supabase SQL Editor
          </a>
        </p>
        <div className="relative">
          <pre className="bg-zinc-800 rounded-lg p-4 text-xs text-zinc-300 overflow-auto max-h-80 font-mono">{sql}</pre>
          <button
            onClick={() => navigator.clipboard.writeText(sql).then(() => alert('Copied!'))}
            className="absolute top-2 right-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs px-3 py-1 rounded">
            Copy
          </button>
        </div>
      </div>

      <Link href="/signup">
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
          Continue to App →
        </Button>
      </Link>
    </div>
  )
}
