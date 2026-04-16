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

export default function GeneratingPage() {
  const params = useParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const generate = async () => {
      try {
        // Progress through steps while API runs
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
  }, [params.id])

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {!done ? (
          <>
            <motion.div
              className="text-7xl mb-8"
              animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}>
              🚀
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Building your campaign</h1>
            <p className="text-zinc-400 mb-10">This takes about 30–60 seconds. Grab a coffee ☕</p>

            <div className="space-y-3 text-left">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all
                    ${i < currentStep ? 'bg-emerald-500/10 border-emerald-500/30' :
                      i === currentStep ? 'bg-indigo-500/10 border-indigo-500/30' :
                      'bg-zinc-900 border-zinc-800'}`}>
                  <div className="text-2xl">
                    {i < currentStep ? '✅' : step.icon}
                  </div>
                  <div>
                    <div className={`font-medium ${i <= currentStep ? 'text-white' : 'text-zinc-500'}`}>{step.label}</div>
                    <div className="text-sm text-zinc-500">{step.desc}</div>
                  </div>
                  {i === currentStep && (
                    <motion.div
                      className="ml-auto w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="text-7xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-white mb-2">Campaign ready!</h1>
            <p className="text-zinc-400">Redirecting you now...</p>
          </motion.div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
            <strong>Error:</strong> {error}
            <br />
            <button onClick={() => router.push(`/campaigns/${params.id}`)} className="mt-2 underline">
              Continue to campaign anyway →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
