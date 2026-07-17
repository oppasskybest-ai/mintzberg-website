'use client'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/app/admin/layout'

/**
 * useAuthFetch — wraps fetch() with the admin Bearer token and handles
 * 401 responses globally: clears the stale session and redirects to
 * /admin/login instead of silently failing / showing empty data.
 * Matches duff-site's lib/hooks/useAuthFetch.ts.
 */
export function useAuthFetch() {
  const { token, logout } = useAdmin()
  const router = useRouter()

  return useCallback(
    async (input: string, init: RequestInit = {}): Promise<Response> => {
      const headers = {
        ...(init.headers || {}),
        Authorization: `Bearer ${token}`,
        ...(init.body && !(init.headers as Record<string, string> | undefined)?.['Content-Type']
          ? { 'Content-Type': 'application/json' }
          : {}),
      }

      const res = await fetch(input, { ...init, headers })

      if (res.status === 401) {
        sessionStorage.removeItem('admin_token')
        logout()
        router.replace('/admin/login')
      }

      return res
    },
    [token, logout, router]
  )
}
