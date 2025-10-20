import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { DashboardStats } from './DashboardStats';
import { CashFlowChart } from './CashFlowChart';
import { UpcomingCheques } from './UpcomingCheques';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">
      <div className="relative z-10 flex flex-col items-center mx-auto text-center max-w-7xl">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
          <span className="relative flex w-2 h-2 mr-2 rounded-full bg-primary"></span>
          The future of payment management is here
        </div>
        
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Unified Payments, <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Simplified</span>
        </h1>
        
        <p className="max-w-2xl mx-auto mt-6 text-lg leading-8 text-muted-foreground">
          Streamline your financial operations with our all-in-one payment management platform. 
          Fast, secure, and built for the modern business.
        </p>
        
        <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
          <Button size="lg" asChild className="px-8">
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#features">
              Learn More
            </Link>
          </Button>
        </div>
        
        <div className="mt-16 w-full max-w-6xl mx-auto px-4">
          <DashboardStats />
          <CashFlowChart />
          <UpcomingCheques />
        </div>
      </div>
      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[200%] -translate-x-1/2 h-[60vh] rounded-full bg-gradient-to-b from-primary/10 to-transparent blur-3xl" />
      </div>
    </section>
  );
}
