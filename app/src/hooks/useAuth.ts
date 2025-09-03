'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from 'mdp/lib/supabase/client'
import type { Session } from '@supabase/supabase-js'

export function useAuth(redirectIfNotAuth = true) {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Erro ao verificar sessão:', error)
      }

      setSession(session)
      setLoading(false)

      if (redirectIfNotAuth && !session) {
        router.push('/admin/login')
      }
    }

    checkSession()

    // Ouve alterações na sessão
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session && redirectIfNotAuth) {
        router.push('/admin/login')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [redirectIfNotAuth, router])

  return { session, loading }
}
