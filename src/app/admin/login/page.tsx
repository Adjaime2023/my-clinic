'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    const isAuth = typeof window !== 'undefined' && localStorage.getItem('admin_logged') === 'true'
    if (!isAuth) {
      router.push('/admin/login')
    }
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Painel Administrativo</h1>
      {/* Conteúdo protegido */}
    </div>
  )
}