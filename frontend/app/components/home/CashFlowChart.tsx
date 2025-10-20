'use client';

import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type TimeRange = '7days' | '30days' | '1year';

const generateRandomData = (count: number, min: number, max: number) => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

const timeRangeOptions = [
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '1year', label: 'This Year' },
];

export function CashFlowChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');

  const { labels, receivedData, dueData } = useMemo(() => {
    switch (timeRange) {
      case '7days':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          receivedData: generateRandomData(7, 20000, 80000),
          dueData: generateRandomData(7, 10000, 60000),
        };
      case '1year':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          receivedData: generateRandomData(12, 50000, 200000),
          dueData: generateRandomData(12, 30000, 180000),
        };
      case '30days':
      default:
        return {
          labels: Array.from({ length: 30 }, (_, i) => (i + 1).toString()),
          receivedData: generateRandomData(30, 10000, 90000),
          dueData: generateRandomData(30, 5000, 75000),
        };
    }
  }, [timeRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 20,
          color: 'hsl(var(--muted-foreground))',
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--background))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--muted-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ₹${context.raw.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          maxRotation: 45,
          minRotation: 45,
          maxTicksLimit: timeRange === '30days' ? 10 : undefined,
        },
      },
      y: {
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          callback: (value: any) => `₹${value >= 1000 ? (value / 1000) + 'k' : value}`,
        },
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        tension: 0.3,
        borderWidth: 2,
      },
      point: {
        radius: 3,
        hoverRadius: 6,
        hoverBorderWidth: 2,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Received',
        data: receivedData,
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        fill: true,
        pointBackgroundColor: 'hsl(var(--primary))',
        pointBorderColor: 'hsl(var(--background))',
      },
      {
        label: 'Pending',
        data: dueData,
        borderColor: 'hsl(var(--warning))',
        backgroundColor: 'hsl(var(--warning) / 0.1)',
        fill: true,
        pointBackgroundColor: 'hsl(var(--warning))',
        pointBorderColor: 'hsl(var(--background))',
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Cash Flow Overview</h3>
          <p className="text-sm text-muted-foreground">
            {timeRange === '7days' 
              ? 'Weekly performance' 
              : timeRange === '30days' 
                ? 'Monthly performance' 
                : 'Yearly performance'}
          </p>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="mt-2 sm:mt-0 text-sm border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="h-80 w-full">
        <Line options={options} data={data} />
      </div>
      
      <div className="mt-4 flex justify-center space-x-6 text-xs text-muted-foreground">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-primary mr-1.5"></div>
          <span>Received</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-warning mr-1.5"></div>
          <span>Pending</span>
        </div>
      </div>
    </div>
  );
}
