import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function GoiKhamDetailRedirect() {
  redirect('/landing/dat-lich');
}
