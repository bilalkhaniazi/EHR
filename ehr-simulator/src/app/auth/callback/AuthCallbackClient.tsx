'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

function normalizeRedirect(path: string | null): string {
  if (!path || !path.startsWith('/')) {
    return '/admin'
  }
  return path
}

export default function AuthCallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawRedirect = searchParams.get('redirectedFrom')
  const redirectTo = normalizeRedirect(rawRedirect)
  const error = searchParams.get('error')

  useEffect(() => {
    if (error) {
      const params = new URLSearchParams()
      if (redirectTo && redirectTo !== '/admin') {
        params.set('redirectedFrom', redirectTo)
      }
      const query = params.toString()
      router.replace(`/auth/login${query ? `?${query}` : ''}`)
      return
    }

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
        return
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (newSession) {
          router.replace(redirectTo)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    handleSession()
  }, [router, redirectTo, error])

  return <p>Signing you in…</p>
}
