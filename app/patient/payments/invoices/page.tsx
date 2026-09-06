import { redirect } from 'next/navigation';

export default function InvoicesIndexPage() {
  redirect('/patient/payments/invoices/pending');
}