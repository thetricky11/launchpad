'use client'

import { useState } from 'react'

export default function TestPage() {
  const [count, setCount] = useState(0)
  const [selected, setSelected] = useState('')

  return (
    <div style={{ padding: '2rem', background: '#F6F7F9', minHeight: '100vh' }}>
      <h1 style={{ color: '#1C1549' }}>Button Test Page</h1>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount(c => c + 1)} style={{ padding: '1rem 2rem', background: '#FF6117', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: '1rem' }}>
        Click me ({count})
      </button>
      <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
        {['Option A', 'Option B', 'Option C'].map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => setSelected(opt)}
            style={{
              padding: '0.5rem 1rem',
              background: selected === opt ? '#FF6117' : '#F6F7F9',
              color: selected === opt ? '#fff' : '#505057',
              border: selected === opt ? 'none' : '1.5px solid #DADADE',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      <p style={{ marginTop: '1rem' }}>Selected: {selected || 'none'}</p>
    </div>
  )
}
