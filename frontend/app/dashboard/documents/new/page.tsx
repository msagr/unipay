// app/new/page.tsx

import { InvoiceForm } from "../_components/InvoiceForm";
import { PaymentForm } from "../_components/PaymentForm";
import { QuotationForm } from "../_components/QuotationForm";

export default function NewPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const type = searchParams.type;

  if (!type) {
    return <div>Missing type in query</div>;
  }

  switch (type) {
    case 'quotation':
      return <QuotationForm />;
    case 'invoice':
      return <InvoiceForm />;
    case 'receipt':
      return <PaymentForm document={{
        _id: 'new-receipt',
        customer: { name: '' },
        total: 0,
        paymentRecords: []
      }} />;
    default:
      return <div>Unknown type: {type}</div>;
  }
}

