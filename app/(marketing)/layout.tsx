import Link from 'next/link'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Resumeably.ai</span>
          </Link>
          
          <nav className="ml-auto flex items-center space-x-4 text-sm font-medium">
            <Link
              href="/pricing"
              className="transition-colors hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="transition-colors hover:text-primary"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </>
  )
}