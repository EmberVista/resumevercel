import { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Login - Resumeably.ai',
  description: 'Login to your Resumeably.ai account',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">Resumeably.ai</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-semibold">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Login to access your dashboard and resume history
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account?</span>{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}