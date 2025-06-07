import { createServiceRoleClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Search, Filter } from 'lucide-react'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string }
}) {
  const supabase = await createServiceRoleClient()
  
  // Build query
  let query = supabase
    .from('profiles')
    .select('*, resume_analyses(count), resume_generations(count), payments(count)')
    .order('created_at', { ascending: false })
  
  // Apply filters
  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('subscription_status', searchParams.status)
  }
  
  if (searchParams.search) {
    query = query.or(`email.ilike.%${searchParams.search}%,full_name.ilike.%${searchParams.search}%`)
  }
  
  const { data: users } = await query

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form className="flex gap-2" action="/admin/users">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              name="search"
              placeholder="Search by email or name..."
              defaultValue={searchParams.search}
              className="w-full rounded-lg border bg-background pl-10 pr-4 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Search
          </button>
        </form>
        
        <form className="flex gap-2" action="/admin/users">
          <select
            name="status"
            defaultValue={searchParams.status || 'all'}
            className="rounded-lg border bg-background px-4 py-2 text-sm"
            onChange={(e) => e.target.form?.submit()}
          >
            <option value="all">All Users</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
            <option value="pro">Pro</option>
          </select>
        </form>
      </div>
      
      {/* Users Table */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4 text-sm font-medium">User</th>
                <th className="p-4 text-sm font-medium">Status</th>
                <th className="p-4 text-sm font-medium">Analyses</th>
                <th className="p-4 text-sm font-medium">Generations</th>
                <th className="p-4 text-sm font-medium">Payments</th>
                <th className="p-4 text-sm font-medium">Joined</th>
                <th className="p-4 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium">{user.email}</p>
                      {user.full_name && (
                        <p className="text-xs text-muted-foreground">{user.full_name}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      user.subscription_status === 'premium' ? 'bg-green-100 text-green-700' :
                      user.subscription_status === 'pro' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.subscription_status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{user.resume_analyses?.[0]?.count || 0}</td>
                  <td className="p-4 text-sm">{user.resume_generations?.[0]?.count || 0}</td>
                  <td className="p-4 text-sm">{user.payments?.[0]?.count || 0}</td>
                  <td className="p-4 text-sm">{formatDate(user.created_at)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <a
                        href={`/admin/users/${user.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View
                      </a>
                      {user.stripe_customer_id && (
                        <a
                          href={`https://dashboard.stripe.com/test/customers/${user.stripe_customer_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Stripe
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!users?.length && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No users found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}