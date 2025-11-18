import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export default function Home() {
  // Get the token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  
  // If no token, redirect to auth page
  if (!token) {
    redirect('/auth');
  }
  
  try {
    // Decode the token to get user role
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback_secret') as any;
    const role = decoded.role || 'supervisor'; // Default to supervisor if not in token
    
    // Redirect based on user role
    if (role === 'admin') {
      redirect('/admin/dashboard');
    } else if (role === 'supervisor') {
      redirect('/supervisor');
    } else {
      // For other roles or if no role specified, redirect to public dashboard
      redirect('/dashboard');
    }
  } catch (error) {
    // If token verification fails, redirect to auth page
    redirect('/auth');
  }
}