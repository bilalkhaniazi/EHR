'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectedFrom') || '/dashboard'

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )

    const handleSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.replace(redirectTo)
      } else {
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (session) {
              router.replace(redirectTo)
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
