'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectedFrom') || '/user/profile'

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )

    console.log('Auth callback page loaded, checking session...')
    const handleSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const role = session.user?.user_metadata?.role as string | undefined
        if (typeof window !== 'undefined' && role) {
          try {
            window.localStorage.setItem('role', role)
          } catch {
            // ignore storage errors
          }
        }

        const destination = role === 'admin' ? '/admin' : '/user/profile'
        router.replace(destination)
      } else {
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (_event, sess) => {
            if (sess) {
              const role = sess.user?.user_metadata?.role as string | undefined
              if (typeof window !== 'undefined' && role) {
                try {
                  window.localStorage.setItem('role', role)
                } catch {}
              }
              const destination = role === 'admin' ? '/admin' : '/user/profile'
              router.replace(destination)
            }
          })
        return () => {
          authListener.subscription.unsubscribe()
        }
      }
    }
    handleSession()
  }, [router, redirectTo])

  return <p>Signing you in…</p>
}
