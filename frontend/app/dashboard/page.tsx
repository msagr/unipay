'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users,
  FileText,
  DollarSign,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { useState } from 'react';
import PaymentHistory from './_components/paymentHistory';

// Mock data - Replace with your actual data fetching logic
const mockPayments = [
  {
    _id: '1',
    paidBy: 'John Doe',
    datePaid: '2023-10-21T10:30:00Z',
    amountPaid: 1250.00,
    paymentMethod: 'Credit Card',
    status: 'completed' as const
  },
  {
    _id: '2',
    paidBy: 'Jane Smith',
    datePaid: '2023-10-20T14:45:00Z',
    amountPaid: 850.50,
    paymentMethod: 'Bank Transfer',
    status: 'completed' as const
  },
  {
    _id: '3',
    paidBy: 'Acme Corp',
    datePaid: '2023-10-19T09:15:00Z',
    amountPaid: 2200.00,
    paymentMethod: 'PayPal',
    status: 'pending' as const
  }
];

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Customers",
      value: "1,248",
      icon: <Users className="h-5 w-5 text-primary" />,
      change: "+12.5%",
      changeType: "increase" as const
    },
    {
      title: "Total Documents",
      value: "342",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      change: "+5.2%",
      changeType: "increase" as const
    },
    {
      title: "Expected Income",
      value: "$24,850",
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      change: "+8.1%",
      changeType: "increase" as const
    },
    {
      title: "Cash Received",
      value: "$18,750",
      icon: <CreditCard className="h-5 w-5 text-purple-500" />,
      change: "+15.3%",
      changeType: "increase" as const
    }
  ];

  const statuses = [
    {
      title: "Paid",
      value: "128",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      description: "Fully paid documents"
    },
    {
      title: "Partially Paid",
      value: "42",
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      description: "Pending payments"
    },
    {
      title: "Overdue",
      value: "18",
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      description: "Past due date"
    },
    {
      title: "Unpaid",
      value: "27",
      icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
      description: "Awaiting payment"
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="p-2 rounded-md bg-primary/10">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
                    {stat.change} {stat.changeType === 'increase' ? '↑' : '↓'}
                  </span>{' '}
                  from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status Overview */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {statuses.map((status, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {status.title}
                </CardTitle>
                {status.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status.value}</div>
                <p className="text-xs text-muted-foreground">
                  {status.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Transactions */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-semibold">Recent Transactions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  View and manage your payment transactions
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <PaymentHistory payments={mockPayments} isLoading={false} itemsPerPage={5} />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                Create New Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Add New Customer
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <DollarSign className="h-4 w-4" />
                Record Payment
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment Received</p>
                    <p className="text-sm text-muted-foreground">
                      $1,250.00 from John Doe
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8">
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}