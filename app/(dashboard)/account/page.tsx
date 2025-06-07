'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Download, Trash2, AlertTriangle, Loader2, Shield, Database, FileDown } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  
  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const response = await fetch('/api/export-data')
      if (!response.ok) throw new Error('Export failed')
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resumeably-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }
  
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return
    
    setIsDeleting(true)
    try {
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Deletion failed')
      
      // Redirect to homepage after successful deletion
      router.push('/')
    } catch (error) {
      console.error('Deletion error:', error)
      alert('Failed to delete account. Please try again or contact support.')
      setIsDeleting(false)
    }
  }
  
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      {/* Privacy & Data Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy & Data Management
        </h2>
        
        <div className="space-y-4">
          {/* Data Export */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Export Your Data
                </h3>
                <p className="text-sm text-muted-foreground">
                  Download all your personal data including profile information, resume analyses, and payment history in JSON format.
                </p>
              </div>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4" />
                    Export Data
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Cookie Preferences */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium mb-2">Cookie Preferences</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your cookie settings and privacy preferences.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('cookie-consent')
                window.location.reload()
              }}
              className="text-sm text-primary hover:underline"
            >
              Reset Cookie Preferences
            </button>
          </div>
        </div>
      </div>
      
      {/* Account Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
        
        <div className="space-y-4">
          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full rounded-lg border bg-card p-4 text-left hover:bg-accent transition-colors"
          >
            <h3 className="font-medium mb-1">Sign Out</h3>
            <p className="text-sm text-muted-foreground">
              Sign out of your account on this device
            </p>
          </button>
        </div>
      </div>
      
      {/* Danger Zone */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </h2>
        
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Account
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-background p-4 border border-destructive/20">
                <p className="text-sm font-medium mb-2">
                  ⚠️ This will permanently delete:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Your profile and account information</li>
                  <li>All resume analyses and generated documents</li>
                  <li>Payment history and active subscriptions</li>
                  <li>All uploaded files</li>
                </ul>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Type <strong>DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  placeholder="Type DELETE to confirm"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Permanently Delete Account'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText('')
                  }}
                  className="px-4 py-2 rounded-lg border hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}