'use client'

import { Navigation } from '@/components/navbar'

export function Header() {
  const handleAdminClick = () => {
    window.location.href = '/admin/login'
  }

  const handleScheduleClick = () => {
    const el = document.querySelector('#agendamento')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Navigation
      onAdminClick={handleAdminClick}
      onScheduleClick={handleScheduleClick}
    />
  )
}