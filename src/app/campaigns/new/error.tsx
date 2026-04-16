'use client'

export default function CampaignNewError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: '2rem', background: '#FFF6F2', border: '2px solid #F1402A', borderRadius: 12, margin: '2rem', color: '#1F1F21' }}>
      <h2 style={{ color: '#F1402A', marginBottom: '0.5rem' }}>Campaign Page Error</h2>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', background: '#fff', padding: '1rem', borderRadius: 8, marginBottom: '1rem' }}>
        {error.message}
        {error.stack}
      </pre>
      <button onClick={reset} style={{ background: '#FF6117', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  )
}
