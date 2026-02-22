import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function Home() {
  // In a real app, you would check the user's role from the token
  // For now, we'll redirect to the admin dashboard
  redirect('/admin/dashboard');
}
