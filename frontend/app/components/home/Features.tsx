import { CheckCircle2, Lock, Zap, BarChart3, RefreshCw, Shield } from 'lucide-react';

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Lightning Fast",
    description: "Process payments in milliseconds with our high-performance infrastructure.",
  },
  {
    icon: <Lock className="w-6 h-6 text-primary" />,
    title: "Bank-Grade Security",
    description: "Your transactions are protected with end-to-end encryption and compliance.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-primary" />,
    title: "Real-time Analytics",
    description: "Gain insights with comprehensive dashboards and reporting tools.",
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-primary" />,
    title: "Seamless Integration",
    description: "Connect with your existing tools and workflows effortlessly.",
  },
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: "Fraud Protection",
    description: "Advanced algorithms to detect and prevent fraudulent activities.",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
    title: "Easy Setup",
    description: "Get started in minutes with our developer-friendly API and documentation.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 lg:py-32">
      <div className="w-full">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage payments
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            UniPay provides a comprehensive suite of tools to streamline your payment operations.
          </p>
        </div>

        <div className="grid gap-6 mt-16 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-6 transition-all duration-200 border rounded-xl group hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
            >
              <div className="flex flex-col items-start">
                <div className="p-2 mb-4 rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
