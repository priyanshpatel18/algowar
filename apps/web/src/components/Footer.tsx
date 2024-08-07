import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-background px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            &copy; 2024 <span className='font-bold'>algowar</span>. All rights reserved.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
