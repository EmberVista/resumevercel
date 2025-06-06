import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Resumeably.ai</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered resume optimization to help you land your dream job.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact
            </h4>
            <a
              href="mailto:support@resumeably.ai"
              className="inline-flex items-center text-sm hover:text-primary transition-colors"
            >
              <Mail className="mr-2 h-4 w-4" />
              support@resumeably.ai
            </a>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Resumeably.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}