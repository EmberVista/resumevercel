import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'

export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Use service role client for admin operations
    const serviceSupabase = await createServiceRoleClient()
    
    // Get user profile to check for Stripe customer
    const { data: profile } = await serviceSupabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single()
    
    // Cancel any active Stripe subscriptions
    if (profile?.stripe_customer_id) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: profile.stripe_customer_id,
          status: 'active'
        })
        
        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.cancel(subscription.id)
        }
      } catch (stripeError) {
        console.error('Error cancelling Stripe subscriptions:', stripeError)
      }
    }
    
    // Delete user files from storage
    try {
      const { data: files } = await serviceSupabase
        .storage
        .from('resumes')
        .list(user.id)
      
      if (files && files.length > 0) {
        const filePaths = files.map(file => `${user.id}/${file.name}`)
        await serviceSupabase
          .storage
          .from('resumes')
          .remove(filePaths)
      }
    } catch (storageError) {
      console.error('Error deleting user files:', storageError)
    }
    
    // Delete user data from all tables (cascade will handle most)
    // Note: Deleting from auth.users will cascade to profiles and related tables
    const { error: deleteError } = await serviceSupabase.auth.admin.deleteUser(user.id)
    
    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      )
    }
    
    // Sign out the user
    await supabase.auth.signOut()
    
    return NextResponse.json({
      success: true,
      message: 'Account successfully deleted'
    })
  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}