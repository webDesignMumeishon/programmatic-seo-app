import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Welcome to Programmatic SEO App
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Boost your website's visibility with our powerful SEO automation tools.
        </p>
        <Link href="/login" passHref>
          <Button size="lg" className="font-semibold">
            Get Started
          </Button>
        </Link>
      </main>
      <footer className="mt-16 text-sm text-muted-foreground">
        © 2024 Programmatic SEO App. All rights reserved.
      </footer>
    </div>
  )
}