'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: 'How is the cash flow data calculated?',
    answer: 'The cash flow data is calculated by analyzing all incoming and outgoing transactions in your account. Received amounts are shown in green, while pending amounts are shown in amber.'
  },
  {
    question: 'What time periods can I view?',
    answer: 'You can view your cash flow data for the last 7 days, last 30 days, or the entire year. Simply use the dropdown menu to switch between different time periods.'
  },
  {
    question: 'Why do I see pending amounts?',
    answer: 'Pending amounts represent transactions that have been initiated but not yet cleared. This typically includes cheques that are in the clearing process or scheduled payments that are yet to be processed.'
  },
  {
    question: 'How often is the data updated?',
    answer: 'The data is updated in real-time. Any new transactions or changes to existing ones will be reflected immediately in the cash flow overview.'
  },
  {
    question: 'Can I export this data?',
    answer: 'Yes, you can export your cash flow data by clicking the "Export" button (coming soon) in the top-right corner of the chart. This will allow you to download the data in CSV or Excel format.'
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-12 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <p className="text-muted-foreground mt-2">Find answers to common questions about your cash flow</p>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border-b border-border/50 last:border-0 pb-4 last:pb-0"
          >
            <button
              className="flex items-center justify-between w-full text-left py-3 focus:outline-none group"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-${index}`}
            >
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                {faq.question}
              </span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </button>
            <div 
              id={`faq-${index}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}
              aria-hidden={openIndex !== index}
            >
              <div className="pb-4 text-muted-foreground">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Still have questions?{' '}
          <a 
            href="#" 
            className="text-primary hover:underline font-medium"
            onClick={(e) => {
              e.preventDefault();
              // You can add a contact form or support email link here
              window.location.href = 'mailto:support@unipay.com';
            }}
          >
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
}
