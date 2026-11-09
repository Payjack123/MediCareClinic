import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function GoiKhamRedirect() {
  redirect('/landing/dat-lich');
}
