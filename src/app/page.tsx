import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 text-indigo-400 text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          AI-Powered Influencer Marketing
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Launch campaigns that
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"> actually convert</span>
        </h1>
        
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          LaunchPad uses AI to find the perfect creators, score their fit, 
          generate campaign briefs, and send personalized outreach — all in minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-6 text-lg rounded-xl">
              Start for free →
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-8 py-6 text-lg rounded-xl">
              Sign in
            </Button>
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          {[
            { label: 'Creators indexed', value: '2M+' },
            { label: 'Campaigns generated', value: '12K+' },
            { label: 'Avg. ROI improvement', value: '3.2x' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-zinc-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
