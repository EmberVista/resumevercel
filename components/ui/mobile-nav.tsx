'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, FileText, DollarSign, Mail, Shield } from 'lucide-react'

interface MobileNavProps {
  isAuthenticated?: boolean
}

export default function MobileNav({ isAuthenticated }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const publicLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/pricing', label: 'Pricing', icon: DollarSign },
    { href: '/privacy', label: 'Privacy', icon: Shield },
    { href: '/terms', label: 'Terms', icon: FileText },
  ]

  const authLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: FileText },
    { href: '/account', label: 'Account', icon: Mail },
  ]

  const links = isAuthenticated ? [...authLinks, ...publicLinks.slice(2)] : publicLinks

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-accent"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-background shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-4">
              <ul className="space-y-2">
                {links.map((link) => {
                  const Icon = link.icon
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium hover:bg-accent"
                      >
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {/* Auth Buttons */}
              {!isAuthenticated && (
                <div className="mt-6 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full rounded-lg border bg-background px-4 py-2 text-center text-sm font-medium hover:bg-accent"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}