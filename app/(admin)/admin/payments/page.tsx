import { createServiceRoleClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { DollarSign, CreditCard, CheckCircle, XCircle } from 'lucide-react'

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: { status?: string; type?: string }
}) {
  const supabase = await createServiceRoleClient()
  
  // Build query
  let query = supabase
    .from('payments')
    .select('*, profiles(email, full_name)')
    .order('created_at', { ascending: false })
    .limit(100)
  
  // Apply filters
  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status)
  }
  
  if (searchParams.type && searchParams.type !== 'all') {
    query = query.eq('type', searchParams.type)
  }
  
  const { data: payments } = await query
  
  // Calculate totals
  const { data: allSuccessfulPayments } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'succeeded')
  
  const totalRevenue = allSuccessfulPayments?.reduce((sum, p) => sum + p.amount, 0) || 0
  
  // Get monthly recurring revenue
  const { data: activeSubscriptions } = await supabase
    .from('profiles')
    .select('*')
    .eq('subscription_status', 'premium')
  
  const mrr = (activeSubscriptions?.length || 0) * 2700 // $27 per subscription

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Payment Management</h1>
      
      {/* Revenue Overview */}
      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <DollarSign className="h-10 w-10 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${(totalRevenue / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <CreditCard className="h-10 w-10 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Monthly Recurring</p>
              <p className="text-2xl font-bold">${(mrr / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-10 w-10 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              <p className="text-2xl font-bold">{activeSubscriptions?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <form className="flex gap-2" action="/admin/payments">
          <select
            name="status"
            defaultValue={searchParams.status || 'all'}
            className="rounded-lg border bg-background px-4 py-2 text-sm"
            onChange={(e) => e.target.form?.submit()}
          >
            <option value="all">All Status</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          
          <select
            name="type"
            defaultValue={searchParams.type || 'all'}
            className="rounded-lg border bg-background px-4 py-2 text-sm"
            onChange={(e) => e.target.form?.submit()}
          >
            <option value="all">All Types</option>
            <option value="one_time">One-time</option>
            <option value="subscription">Subscription</option>
          </select>
        </form>
      </div>
      
      {/* Payments Table */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4 text-sm font-medium">Date</th>
                <th className="p-4 text-sm font-medium">Customer</th>
                <th className="p-4 text-sm font-medium">Amount</th>
                <th className="p-4 text-sm font-medium">Type</th>
                <th className="p-4 text-sm font-medium">Status</th>
                <th className="p-4 text-sm font-medium">Stripe ID</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((payment) => (
                <tr key={payment.id} className="border-b">
                  <td className="p-4 text-sm">{formatDate(payment.created_at)}</td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium">{payment.profiles?.email}</p>
                      {payment.profiles?.full_name && (
                        <p className="text-xs text-muted-foreground">{payment.profiles.full_name}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium">
                    ${(payment.amount / 100).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      payment.type === 'subscription' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {payment.type === 'subscription' ? 'Subscription' : 'One-time'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {payment.status === 'succeeded' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : payment.status === 'failed' ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-yellow-500" />
                      )}
                      <span className="text-sm capitalize">{payment.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <a
                      href={`https://dashboard.stripe.com/test/payments/${payment.stripe_payment_intent_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {payment.stripe_payment_intent_id.slice(0, 20)}...
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!payments?.length && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No payments found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}