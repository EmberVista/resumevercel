'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User as UserIcon, LogOut, FileText, CreditCard, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import MobileNav from '@/components/ui/mobile-nav'

interface DashboardNavProps {
  user: User
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="text-xl font-bold">
            Resumeably.ai
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="flex items-center text-sm font-medium transition-colors hover:text-primary"
            >
              <FileText className="mr-2 h-4 w-4" />
              My Resumes
            </Link>
            <Link
              href="/dashboard/billing"
              className="flex items-center text-sm font-medium transition-colors hover:text-primary"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </Link>
            <Link
              href="/account"
              className="flex items-center text-sm font-medium transition-colors hover:text-primary"
            >
              <Settings className="mr-2 h-4 w-4" />
              Account
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {user.email}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
          
          <div className="md:hidden">
            <MobileNav isAuthenticated />
          </div>
        </div>
      </div>
    </header>
  )
}