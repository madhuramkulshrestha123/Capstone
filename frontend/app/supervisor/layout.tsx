import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Supervisor Dashboard | Job Portal',
  description: 'Supervisor Dashboard for managing projects, workers, and attendance',
};

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}