import { Metadata } from 'next'
import Link from 'next/link'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Sign Up - Resumeably.ai',
  description: 'Create your Resumeably.ai account',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">Resumeably.ai</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-semibold">Create your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started with premium resume optimization
          </p>
        </div>

        <RegisterForm />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account?</span>{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}