'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  { id: 1, icon: '🔍', label: 'Searching creators', desc: 'Finding influencers that match your brief...' },
  { id: 2, icon: '🤖', label: 'AI scoring', desc: 'Analyzing fit scores for each creator...' },
  { id: 3, icon: '📋', label: 'Building strategy', desc: 'Generating campaign brief and strategy...' },
  { id: 4, icon: '✉️', label: 'Writing outreach', desc: 'Crafting personalized emails for top creators...' },
  { id: 5, icon: '✅', label: 'Finalizing', desc: 'Saving everything to your campaign...' },
]

const LogoIcon = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 28, height: 28 }}>
    <circle cx="6" cy="6" r="3" fill="currentColor"/>
    <circle cx="18" cy="6" r="3" fill="currentColor"/>
    <circle cx="30" cy="6" r="3" fill="currentColor"/>
    <circle cx="6" cy="18" r="3" fill="currentColor"/>
    <circle cx="18" cy="18" r="3" fill="currentColor"/>
    <circle cx="30" cy="18" r="3" fill="currentColor"/>
    <circle cx="6" cy="30" r="3" fill="currentColor"/>
    <circle cx="18" cy="30" r="3" fill="currentColor"/>
    <circle cx="30" cy="30" r="3" fill="currentColor"/>
  </svg>
)

export default function GeneratingPage() {
  const params = useParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const generate = async () => {
      try {
        const stepInterval = setInterval(() => {
          setCurrentStep(s => Math.min(s + 1, STEPS.length - 1))
        }, 3000)

        const res = await fetch('/api/campaigns/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ campaignId: params.id }),
        })

        clearInterval(stepInterval)
        setCurrentStep(STEPS.length - 1)

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Generation failed')
        }

        setDone(true)
        await new Promise(r => setTimeout(r, 1500))
        router.push(`/campaigns/${params.id}`)
      } catch (err: unknown) {
        setError((err as Error).message || 'Something went wrong')
      }
    }

    generate()
  }, [params.id, router])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #35288A 0%, #1C1549 50%, #4333B0 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#FF7B3E', marginBottom: '3rem' }}>
        <LogoIcon />
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', lineHeight: 1.1 }}>LaunchPad</div>
          <div style={{ color: '#8E82E2', fontSize: '0.6rem', letterSpacing: '0.08em' }}>BY CREATORDB</div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 520, textAlign: 'center' }}>
        {!done && !error && (
          <>
            {/* Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTop: '3px solid #FF7B3E',
                margin: '0 auto 2rem',
              }}
            />

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
              Building your campaign
            </h1>
            <p style={{ color: '#BBB4EC', marginBottom: '3rem', fontSize: '1rem', lineHeight: 1.6 }}>
              Our AI is working hard. This takes about 30 seconds.
            </p>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
              {STEPS.map((step, i) => {
                const isActive = i === currentStep
                const isDone = i < currentStep

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: i <= currentStep ? 1 : 0.35, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      background: isActive ? 'rgba(255,123,62,0.15)' : isDone ? 'rgba(42,229,176,0.08)' : 'rgba(255,255,255,0.05)',
                      border: isActive ? '1px solid rgba(255,123,62,0.4)' : isDone ? '1px solid rgba(42,229,176,0.25)' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 12,
                      padding: '1rem 1.25rem',
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDone ? '#2AE5B0' : isActive ? '#FF6117' : 'rgba(255,255,255,0.1)',
                      fontSize: isDone ? '1rem' : '1.1rem',
                      color: '#fff',
                    }}>
                      {isDone ? '✓' : step.icon}
                    </div>
                    <div>
                      <div style={{ color: isActive ? '#FF7B3E' : isDone ? '#2AE5B0' : '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                        {step.label}
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{ color: '#BBB4EC', fontSize: '0.8rem', marginTop: 2 }}
                        >
                          {step.desc}
                        </motion.div>
                      )}
                    </div>
                    {isActive && (
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#FF7B3E', flexShrink: 0 }}
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </>
        )}

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>Campaign ready!</h2>
              <p style={{ color: '#D2CDF3' }}>Redirecting you to your campaign…</p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div style={{ background: 'rgba(241,64,42,0.15)', border: '1px solid rgba(241,64,42,0.4)', borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>⚠️</div>
            <h2 style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>Generation failed</h2>
            <p style={{ color: '#F1402A', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</p>
            <button
              onClick={() => router.back()}
              style={{ background: '#FF6117', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}
            >
              Go back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
