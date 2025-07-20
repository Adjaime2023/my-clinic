'use client'

import Link from 'next/link'
import { Heart, User, Cog, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AdminDashboard from '@/components/admin-dashboard'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Heart className="text-primary w-5 h-5" />
              <h1 className="text-xl font-semibold text-neutral-800">DentAgenda</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/" passHref>
                <Button variant="secondary" className="font-medium">
                  <User className="mr-2 h-4 w-4" />
                  Cliente
                </Button>
              </Link>
              <Button className="bg-primary text-white font-medium hover:bg-blue-700">
                <Cog className="mr-2 h-4 w-4" />
                Administrador
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Admin Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-neutral-800">
              <TrendingUp className="inline mr-3 text-primary" />
              Painel Administrativo
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600">Dr. Silva</span>
              <Button variant="secondary">
                <User className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AdminDashboard />
    </div>
  )
}
