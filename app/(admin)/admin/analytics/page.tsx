import { createServiceRoleClient } from '@/lib/supabase/server'
import { TrendingUp, Users, FileText, DollarSign, Activity } from 'lucide-react'

export default async function AdminAnalyticsPage() {
  const supabase = await createServiceRoleClient()
  
  // Get date ranges
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  
  // Fetch metrics for different time periods
  const { count: usersToday } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString())
  
  const { count: usersThisWeek } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thisWeek.toISOString())
  
  const { count: usersThisMonth } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thisMonth.toISOString())
  
  const { count: analysesToday } = await supabase
    .from('resume_analyses')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString())
  
  const { count: analysesThisWeek } = await supabase
    .from('resume_analyses')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thisWeek.toISOString())
  
  const { count: analysesThisMonth } = await supabase
    .from('resume_analyses')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thisMonth.toISOString())
  
  // Revenue calculations
  const { data: paymentsThisMonth } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'succeeded')
    .gte('created_at', thisMonth.toISOString())
  
  const { data: paymentsLastMonth } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'succeeded')
    .gte('created_at', lastMonth.toISOString())
    .lt('created_at', thisMonth.toISOString())
  
  const revenueThisMonth = paymentsThisMonth?.reduce((sum, p) => sum + p.amount, 0) || 0
  const revenueLastMonth = paymentsLastMonth?.reduce((sum, p) => sum + p.amount, 0) || 0
  
  // Conversion metrics
  const { count: freeUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'free')
  
  const { count: paidUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .neq('subscription_status', 'free')
  
  const conversionRate = freeUsers && paidUsers ? ((paidUsers / (freeUsers + paidUsers)) * 100).toFixed(1) : '0'
  
  // Average ATS scores
  const { data: recentScores } = await supabase
    .from('resume_analyses')
    .select('ats_score')
    .gte('created_at', thisMonth.toISOString())
  
  const avgScore = recentScores?.length 
    ? (recentScores.reduce((sum, r) => sum + r.ats_score, 0) / recentScores.length).toFixed(0)
    : 0

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold">${(revenueThisMonth / 100).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {revenueThisMonth > revenueLastMonth ? '+' : ''}
                {((revenueThisMonth - revenueLastMonth) / 100).toFixed(2)} vs last month
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                {paidUsers} of {(freeUsers || 0) + (paidUsers || 0)} users
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg ATS Score</p>
              <p className="text-2xl font-bold">{avgScore}/100</p>
              <p className="text-xs text-muted-foreground mt-1">
                This month
              </p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{usersThisWeek || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Past 7 days
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>
      
      {/* Activity Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Growth */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">User Growth</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Today</span>
              <span className="font-medium">{usersToday || 0} new users</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">This Week</span>
              <span className="font-medium">{usersThisWeek || 0} new users</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">This Month</span>
              <span className="font-medium">{usersThisMonth || 0} new users</span>
            </div>
          </div>
        </div>
        
        {/* Analysis Activity */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Analysis Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Today</span>
              <span className="font-medium">{analysesToday || 0} analyses</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">This Week</span>
              <span className="font-medium">{analysesThisWeek || 0} analyses</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">This Month</span>
              <span className="font-medium">{analysesThisMonth || 0} analyses</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Popular Features */}
      <div className="mt-6 rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Platform Health</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Free to Paid Conversion</p>
            <p className="text-xl font-semibold">{conversionRate}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Active Users</p>
            <p className="text-xl font-semibold">{usersThisMonth || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Revenue Growth</p>
            <p className="text-xl font-semibold">
              {revenueLastMonth > 0 
                ? `${(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100).toFixed(1)}%`
                : 'N/A'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}