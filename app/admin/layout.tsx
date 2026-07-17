'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

const AdminCtx = createContext<{ token: string; logout: () => void }>({ token: '', logout: () => {} })
export const useAdmin = () => useContext(AdminCtx)

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    const t = sessionStorage.getItem('admin_token')
    if (t) setToken(t)
    setReady(true)
  }, [])

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    sessionStorage.removeItem('admin_token')
    setToken(null)
    router.replace('/admin/login')
  }

  // middleware.ts is the single source of truth for whether a request is
  // allowed past /admin/*: if a request reached this layout for a
  // non-login path, the cookie was already verified. This layout just
  // supplies the Bearer token (from sessionStorage, written by the login
  // page) to admin pages.
  if (isLoginPage) {
    return <>{children}</>
  }

  if (!ready) {
    return <div style={{ minHeight: '100vh', background: '#12181f' }} />
  }

  return (
    <AdminCtx.Provider value={{ token: token ?? '', logout }}>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#12181f', fontFamily: '"Inter", sans-serif' }}>
        <Sidebar onLogout={logout} />
        <div style={{ marginLeft: '220px', flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </AdminCtx.Provider>
  )
}
