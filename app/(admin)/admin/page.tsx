import { createServiceRoleClient } from '@/lib/supabase/server'
import { Users, FileText, CreditCard, TrendingUp, DollarSign, Clock } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createServiceRoleClient()
  
  // Fetch statistics
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
  
  const { count: premiumUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'premium')
  
  const { count: totalAnalyses } = await supabase
    .from('resume_analyses')
    .select('*', { count: 'exact', head: true })
  
  const { count: totalGenerations } = await supabase
    .from('resume_generations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
  
  // Fetch recent revenue
  const { data: recentPayments } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'succeeded')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  
  const monthlyRevenue = recentPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0
  
  // Fetch recent activity
  const { data: recentAnalyses } = await supabase
    .from('resume_analyses')
    .select('*, profiles(email)')
    .order('created_at', { ascending: false })
    .limit(5)
  
  const { data: recentSignups } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{totalUsers || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <CreditCard className="h-10 w-10 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Premium Users</p>
              <p className="text-2xl font-bold">{premiumUsers || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <FileText className="h-10 w-10 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Analyses</p>
              <p className="text-2xl font-bold">{totalAnalyses || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <DollarSign className="h-10 w-10 text-yellow-600" />
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold">${(monthlyRevenue / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Analyses */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Analyses</h2>
          <div className="space-y-3">
            {recentAnalyses?.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{analysis.original_filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {analysis.profiles?.email || 'Anonymous'} • Score: {analysis.ats_score}
                  </p>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
            {!recentAnalyses?.length && (
              <p className="text-sm text-muted-foreground">No recent analyses</p>
            )}
          </div>
        </div>
        
        {/* Recent Signups */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Signups</h2>
          <div className="space-y-3">
            {recentSignups?.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.subscription_status} • {user.created_at && new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
            {!recentSignups?.length && (
              <p className="text-sm text-muted-foreground">No recent signups</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}