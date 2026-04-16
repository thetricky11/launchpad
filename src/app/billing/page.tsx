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
    popular: false,
    bestValue: false,
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
    popular: true,
    bestValue: false,
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
    popular: false,
    bestValue: true,
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
    await new Promise(r => setTimeout(r, 2000))
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
    <div style={{ minHeight: '100vh', background: '#F6F7F9' }}>
      <Nav />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1C1549 0%, #35288A 100%)',
          borderRadius: 20,
          padding: '2.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>Billing & plans</h1>
            <p style={{ color: '#BBB4EC', fontSize: '0.95rem' }}>Upgrade to unlock more features and scale your campaigns</p>
          </div>
          <span style={{ background: 'rgba(255,191,8,0.2)', border: '1px solid rgba(255,191,8,0.4)', color: '#FFBF08', padding: '0.4rem 1rem', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600 }}>
            🎭 Demo mode — no real charges
          </span>
        </div>

        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {PLANS.map(plan => (
            <div
              key={plan.name}
              style={{
                background: '#fff',
                border: plan.popular ? '2px solid #FF6117' : '1.5px solid #DADADE',
                borderRadius: 20,
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: plan.popular ? '0 8px 32px rgba(255,97,23,0.15)' : '0 2px 8px rgba(28,21,73,0.04)',
              }}
            >
              {plan.popular && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}>
                  <span style={{ background: '#FF6117', color: '#fff', padding: '0.3rem 1.2rem', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    ⭐ Most Popular
                  </span>
                </div>
              )}
              {plan.bestValue && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}>
                  <span style={{ background: '#5240CC', color: '#fff', padding: '0.3rem 1.2rem', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    💎 Best Value
                  </span>
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1C1549', marginBottom: 4 }}>{plan.name}</h3>
                <p style={{ color: '#7B7B84', fontSize: '0.875rem' }}>{plan.description}</p>
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: plan.popular ? '#FF6117' : '#1C1549' }}>${plan.price}</span>
                  <span style={{ color: '#9C9CA3', fontSize: '0.9rem' }}>/month</span>
                </div>
              </div>

              <ul style={{ flex: 1, marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {plan.features.map(feat => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', color: '#505057' }}>
                    <span style={{ color: '#2AE5B0', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedPlan(plan)}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: plan.popular ? '#FF6117' : plan.bestValue ? '#5240CC' : '#F6F7F9',
                  color: plan.popular || plan.bestValue ? '#fff' : '#1C1549',
                  border: plan.popular || plan.bestValue ? 'none' : '1.5px solid #DADADE',
                  borderRadius: 10,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: plan.popular ? '0 4px 16px rgba(255,97,23,0.3)' : 'none',
                }}
              >
                Get {plan.name}
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#9C9CA3', fontSize: '0.85rem' }}>
          🔒 All plans include a 14-day money-back guarantee. Cancel anytime.
        </p>
      </main>

      {/* Checkout modal */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent style={{ background: '#fff', border: '1px solid #DADADE', maxWidth: 440 }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#1C1549', display: 'flex', alignItems: 'center', gap: 8 }}>
              Checkout — {selectedPlan?.name} Plan
              <Badge style={{ background: 'rgba(255,191,8,0.15)', color: '#A37000', border: '1px solid rgba(255,191,8,0.3)', fontSize: '0.7rem' }}>Demo</Badge>
            </DialogTitle>
          </DialogHeader>

          <div style={{ background: 'rgba(255,191,8,0.08)', border: '1px solid rgba(255,191,8,0.3)', borderRadius: 8, padding: '0.75rem 1rem', color: '#A37000', fontSize: '0.85rem', marginBottom: '1rem' }}>
            🎭 This is a demo. No real payment will be processed.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <Label style={{ color: '#1F1F21', fontWeight: 600, fontSize: '0.875rem' }}>Cardholder name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="John Smith"
                style={{ marginTop: 6, background: '#F6F7F9', border: '1.5px solid #DADADE', color: '#1F1F21' }} />
            </div>
            <div>
              <Label style={{ color: '#1F1F21', fontWeight: 600, fontSize: '0.875rem' }}>Card number</Label>
              <Input value={cardNum}
                onChange={e => setCardNum(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 '))}
                placeholder="4242 4242 4242 4242" maxLength={19}
                style={{ marginTop: 6, background: '#F6F7F9', border: '1.5px solid #DADADE', color: '#1F1F21', fontFamily: 'monospace' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <Label style={{ color: '#1F1F21', fontWeight: 600, fontSize: '0.875rem' }}>Expiry</Label>
                <Input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5}
                  style={{ marginTop: 6, background: '#F6F7F9', border: '1.5px solid #DADADE', color: '#1F1F21', fontFamily: 'monospace' }} />
              </div>
              <div>
                <Label style={{ color: '#1F1F21', fontWeight: 600, fontSize: '0.875rem' }}>CVV</Label>
                <Input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ''))} placeholder="123" maxLength={4} type="password"
                  style={{ marginTop: 6, background: '#F6F7F9', border: '1.5px solid #DADADE', color: '#1F1F21' }} />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #ECECEE', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem' }}>
                <span style={{ color: '#7B7B84' }}>{selectedPlan?.name} Plan</span>
                <span style={{ color: '#1C1549', fontWeight: 600 }}>${selectedPlan?.price}/mo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: '#7B7B84' }}>Total today</span>
                <span style={{ color: '#1C1549', fontWeight: 800 }}>${selectedPlan?.price}</span>
              </div>
            </div>

            <Button onClick={handleCheckout} disabled={processing}
              style={{ background: processing ? '#FFD7C5' : '#FF6117', color: '#fff', border: 'none', padding: '0.875rem', fontWeight: 700, fontSize: '1rem', cursor: processing ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(255,97,23,0.3)' }}
              className="w-full">
              {processing ? 'Processing…' : `Pay $${selectedPlan?.price} (Demo)`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
