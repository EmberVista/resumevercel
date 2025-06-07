import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Check if user is authenticated and is admin
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-card border-r">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-primary">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Resumeably.ai</p>
        </div>
        <nav className="px-4 pb-6">
          <ul className="space-y-2">
            <li>
              <a href="/admin" className="flex items-center rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
                Overview
              </a>
            </li>
            <li>
              <a href="/admin/users" className="flex items-center rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
                Users
              </a>
            </li>
            <li>
              <a href="/admin/analytics" className="flex items-center rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
                Analytics
              </a>
            </li>
            <li>
              <a href="/admin/payments" className="flex items-center rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
                Payments
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}