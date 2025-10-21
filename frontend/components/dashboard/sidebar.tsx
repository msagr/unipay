'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PanelLeft, Home, Users, FileText, CreditCard, Settings, Menu } from 'lucide-react';

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
  },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: FileText,
  },
  {
    name: 'Payments',
    href: '/dashboard/payments',
    icon: CreditCard,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();


  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <PanelLeft className="h-6 w-6" />
            <span className="text-lg">UniPay</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3 py-2">
          <nav className="grid items-start gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
                  pathname === item.href ? 'bg-muted text-foreground' : ''
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <PanelLeft className="h-6 w-6" />
            <span className="text-lg">UniPay</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3 py-2">
          <nav className="grid items-start gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
                  pathname === item.href ? 'bg-muted text-foreground' : ''
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
