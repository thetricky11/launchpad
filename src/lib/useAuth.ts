'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
}

export function useAuth(redirectTo?: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        } else if (redirectTo) {
          window.location.href = redirectTo
        }
        setLoading(false)
      })
      .catch(() => {
        if (redirectTo) window.location.href = redirectTo
        setLoading(false)
      })
  }, [redirectTo])

  return { user, loading }
}
