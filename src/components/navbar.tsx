'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Shield, Menu, X, Calendar, Users } from 'lucide-react'

interface NavigationProps {
  onScheduleClick: () => void
  onAdminClick: () => void
}

export const Navigation = ({ onScheduleClick, onAdminClick }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const links = [
    { label: 'Início', href: '#início' },
    { label: 'Serviços', href: '#serviços' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Contato', href: '#contato' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">DentalCare</h1>
              <p className="text-xs text-muted-foreground">Clínica Odontológica</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-foreground hover:text-primary transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onAdminClick}
              className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Users className="w-4 h-4 mr-2" />
              Admin
            </Button>
            <Button variant="medical" size="sm" onClick={onScheduleClick}>
              <Calendar className="w-4 h-4 mr-2" />
              Agendar
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="space-y-4">
              {links.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-foreground hover:text-primary hover:bg-accent transition-colors"
                >
                  {label}
                </a>
              ))}

              <div className="px-4 pt-4 space-y-3 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => {
                    onAdminClick()
                    setIsMenuOpen(false)
                  }}
                  className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Painel Admin
                </Button>
                <Button
                  variant="medical"
                  onClick={() => {
                    onScheduleClick()
                    setIsMenuOpen(false)
                  }}
                  className="w-full"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Consulta
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
