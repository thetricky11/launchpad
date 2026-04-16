'use client'

import { useState } from 'react'
import { Nav } from '@/components/nav'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'

const PLANS = [
  {
    name: 'Starter',
    price: 99,
    description: 'Perfect for small brands getting started',
    features: [
      '3 campaigns per month',
      '50 creator searches',
      'AI campaign generation',
      'Email outreach',
      'Basic analytics',
    ],
    color: 'border-zinc-700',
    button: 'border-zinc-700 text-zinc-300 hover:bg-zinc-800',
    badge: null,
  },
  {
    name: 'Growth',
    price: 299,
    description: 'For growing brands running multiple campaigns',
    features: [
      'Unlimited campaigns',
      '500 creator searches',
      'AI campaign generation',
      'Email outreach + bulk send',
      'Advanced analytics',
      'Contract generation',
      'Priority support',
    ],
    color: 'border-indigo-500',
    button: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 799,
    description: 'For agencies and large-scale campaigns',
    features: [
      'Everything in Growth',
      'Unlimited creator searches',
      'White-label reports',
      'Dedicated account manager',
      'Custom integrations',
      'Team collaboration',
      'SLA guarantee',
    ],
    color: 'border-purple-500',
    button: 'bg-purple-600 hover:bg-purple-500 text-white',
    badge: 'Best Value',
  },
]

export default function BillingPage() {
  const supabase = createSupabaseBrowserClient()
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null)
  const [cardNum, setCardNum] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleCheckout = async () => {
    setProcessing(true)
    await new Promise(r => setTimeout(r, 2000)) // Simulate processing
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: brand } = await supabase.from('brands').select('id').eq('user_id', user.id).single()
      if (brand) {
        await supabase.from('brands').update({ plan: selectedPlan!.name.toLowerCase() }).eq('id', brand.id)
      }
      toast.success(`🎉 Welcome to ${selectedPlan!.name} plan!`)
      setSelectedPlan(null)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Billing & Plans</h1>
            <p className="text-zinc-400 mt-1">Upgrade to unlock more features</p>
          </div>
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs ml-auto">
            🎭 Demo Mode — No real charges
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div key={plan.name}
              className={`bg-zinc-900 border-2 rounded-2xl p-6 relative flex flex-col ${plan.color}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white
                    ${plan.name === 'Growth' ? 'bg-indigo-600' : 'bg-purple-600'}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-zinc-400 text-sm mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-zinc-400">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(feat => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => setSelectedPlan(plan)}
                variant={plan.name === 'Starter' ? 'outline' : 'default'}
                className={`w-full ${plan.button}`}>
                Get {plan.name}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-zinc-500 text-sm mt-8">
          🔒 All plans include a 14-day money-back guarantee. Cancel anytime.
        </p>
      </main>

      {/* Checkout modal */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Checkout — {selectedPlan?.name} Plan
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Demo</Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-amber-400 text-sm mb-4">
            🎭 This is a demo. No real payment will be processed.
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Cardholder name</Label>
              <Input value={name} onChange={e => setName(e.target.value)}
                placeholder="John Smith" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Card number</Label>
              <Input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 '))}
                placeholder="4242 4242 4242 4242" maxLength={19}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Expiry</Label>
                <Input value={expiry} onChange={e => setExpiry(e.target.value)}
                  placeholder="MM/YY" maxLength={5}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 font-mono" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">CVV</Label>
                <Input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="123" maxLength={4} type="password"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">{selectedPlan?.name} Plan</span>
                <span className="text-white">${selectedPlan?.price}/mo</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Total today</span>
                <span className="text-white font-bold">${selectedPlan?.price}</span>
              </div>
            </div>

            <Button onClick={handleCheckout} disabled={processing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 text-lg">
              {processing ? 'Processing...' : `Pay $${selectedPlan?.price} (Demo)`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
