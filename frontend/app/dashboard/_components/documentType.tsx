'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Receipt, FileDigit, FileCheck } from 'lucide-react';

const documentTypes = [
  { 
    value: 'invoice', 
    label: 'Invoice',
    icon: FileText 
  },
  { 
    value: 'receipt', 
    label: 'Receipt',
    icon: Receipt 
  },
  { 
    value: 'quotation', 
    label: 'Quotation',
    icon: FileDigit 
  },
];

interface DocumentTypeProps {
  onSelect: (type: string) => void;
  className?: string;
}

export function DocumentType({ onSelect, className = '' }: DocumentTypeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  const selectedDocument = documentTypes.find(doc => doc.value === selectedType);

  return (
    <div className={`flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border ${className}`}>
      <div className="flex-1">
        <Select 
          value={selectedType} 
          onValueChange={setSelectedType}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            {documentTypes.map(({ value, label, icon: Icon }) => (
              <SelectItem key={value} value={value} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={() => {
          if (selectedType) {
            onSelect(selectedType);
            setSelectedType(''); // Reset selection after creating
          }
        }}
        disabled={!selectedType}
        className="gap-2 whitespace-nowrap"
      >
        <Plus className="h-4 w-4" />
        Create {selectedDocument?.label || 'Document'}
      </Button>
    </div>
  );
}