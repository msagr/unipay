interface ChequeItemProps {
  bank: string;
  amount: string;
  date: string;
  status: 'Upcoming' | 'Pending Confirmation' | 'Processed';
  account: string;
  daysLeft: string;
}

function ChequeItem({
  bank,
  amount,
  date,
  status,
  account,
  daysLeft,
}: ChequeItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
      <div className="flex items-center space-x-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <span className="text-xl">🏦</span>
        </div>
        <div>
          <p className="font-medium">{bank}</p>
          <p className="text-sm text-muted-foreground">{account}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">{amount}</p>
        <div className="flex items-center justify-end space-x-2">
          <span className="text-xs text-muted-foreground">{daysLeft}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            status === 'Upcoming' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : status === 'Processed'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}

export function UpcomingCheques() {
  const cheques: ChequeItemProps[] = [
    { 
      bank: 'HDFC Bank', 
      amount: '₹45,000', 
      date: '25 Oct 2023',
      status: 'Upcoming',
      account: 'Acme Corp (A/c XXXX-7890)',
      daysLeft: 'Tomorrow'
    },
    { 
      bank: 'ICICI Bank', 
      amount: '₹32,500', 
      date: '26 Oct 2023',
      status: 'Upcoming',
      account: 'Globex Inc (A/c XXXX-4567)',
      daysLeft: 'In 2 days'
    },
    { 
      bank: 'SBI', 
      amount: '₹18,750', 
      date: '28 Oct 2023',
      status: 'Pending Confirmation',
      account: 'Stark Industries (A/c XXXX-1234)',
      daysLeft: 'In 4 days'
    },
  ];

  return (
    <div className="mt-8 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Upcoming PDC Cheques</h3>
          <p className="text-sm text-muted-foreground">Next 7 days</p>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {cheques.map((cheque, i) => (
          <ChequeItem key={i} {...cheque} />
        ))}
      </div>
    </div>
  );
}
