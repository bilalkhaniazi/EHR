'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom') || '/admin'

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.replace(redirectedFrom)
      }
    }

    checkSession()
  }, [router, redirectedFrom, supabase])

  const handleSignIn = async () => {
    const redirectTo = `${window.location.origin}/auth/callback?redirectedFrom=${encodeURIComponent(
      redirectedFrom
    )}`

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-semibold">Sign in with Google</h1>
      <button
        onClick={handleSignIn}
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        Continue with Google
      </button>
    </div>
  )
}
