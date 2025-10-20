import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'warning';
  icon: string;
  description: string;
  bgGradient: string;
  borderColor: string;
}

export function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  description,
  bgGradient,
  borderColor,
}: StatCardProps) {
  return (
    <div 
      className={cn(
        'relative p-5 rounded-2xl border bg-gradient-to-br backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        borderColor,
        bgGradient
      )}
    >
      <div className="flex justify-between items-start">
        <div className="p-2 rounded-lg bg-white/80 dark:bg-white/10 shadow-sm">
          <span className="text-2xl">{icon}</span>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
          trend === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {change}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}

export function DashboardStats() {
  const stats = [
    { 
      title: 'Cash Received', 
      value: '₹1,85,420', 
      change: '+15.2%', 
      trend: 'up' as const,
      icon: '💵',
      description: 'This month',
      bgGradient: 'from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/5',
      borderColor: 'border-green-100 dark:border-green-900/30'
    },
    { 
      title: 'Payments Due', 
      value: '₹62,350', 
      change: '3 days', 
      trend: 'warning' as const,
      icon: '⏳',
      description: 'Overdue',
      bgGradient: 'from-amber-50 to-amber-50/50 dark:from-amber-900/20 dark:to-amber-900/5',
      borderColor: 'border-amber-100 dark:border-amber-900/30'
    },
    { 
      title: 'Cheque Amount', 
      value: '₹2,45,780', 
      change: '+8.7%', 
      trend: 'up' as const,
      icon: '🏦',
      description: 'In clearing',
      bgGradient: 'from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/5',
      borderColor: 'border-blue-100 dark:border-blue-900/30'
    },
    { 
      title: 'PDC Cheques', 
      value: '24', 
      change: '5 pending', 
      trend: 'down' as const,
      icon: '📅',
      description: 'This month',
      bgGradient: 'from-purple-50 to-purple-50/50 dark:from-purple-900/20 dark:to-purple-900/5',
      borderColor: 'border-purple-100 dark:border-purple-900/30'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
