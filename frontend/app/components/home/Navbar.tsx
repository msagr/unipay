import Link from 'next/link';
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl w-full flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            UniPay
          </span>
        </Link>
        
        {/* <nav className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 space-x-6 text-sm font-medium">
          <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Features
          </Link>
          <Link href="#how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">
            How It Works
          </Link>
          <Link href="#testimonials" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Testimonials
          </Link>
        </nav> */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
