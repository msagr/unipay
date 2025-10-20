import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Github, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background/50 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="space-y-5 md:col-span-2">
            <h3 className="text-lg font-semibold">UniPay</h3>
            <p className="text-sm text-muted-foreground">
              The unified payment management platform for modern businesses.
            </p>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://github.com/yourusername/unipay" target="_blank">
                  <Github className="w-5 h-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://twitter.com/yourhandle" target="_blank">
                  <Twitter className="w-5 h-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-3 sm:grid-cols-3">
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:underline">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:underline">How It Works</Link></li>
                <li><Link href="#pricing" className="hover:underline">Pricing</Link></li>
                <li><Link href="#testimonials" className="hover:underline">Testimonials</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:underline">About Us</Link></li>
                <li><Link href="/blog" className="hover:underline">Blog</Link></li>
                <li><Link href="/careers" className="hover:underline">Careers</Link></li>
                <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:underline">Security</Link></li>
                <li><Link href="/compliance" className="hover:underline">Compliance</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between md:flex-row space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} UniPay. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-foreground">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
