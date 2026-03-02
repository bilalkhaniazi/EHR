'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type UserRoles = "student" | "admin" | "faculty"

interface UserContextType {
  user: any;
  role: UserRoles | null;
  isAdmin: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  role: null,
  isAdmin: false,
  loading: true,
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<UserRoles | null>(null)
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      if (typeof window !== 'undefined') {
        const cachedRole = window.localStorage.getItem('role')
        if (cachedRole) setRole(cachedRole as UserRoles)
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user)
        const newRole = user.user_metadata?.role || null
        if (newRole && typeof window !== 'undefined') {
          window.localStorage.setItem('role', newRole)
          setRole(newRole)
        }
      }
      setLoading(false)
    }
    loadUser();
  }, [])

  const value = {
    user,
    role,
    isAdmin: role === "admin",
    loading,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
