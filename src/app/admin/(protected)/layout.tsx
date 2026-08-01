import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { Sidebar } from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  // Layout level strict JWT signature verification
  if (!token) {
    redirect('/admin/login');
  }

  const payload = verifyToken(token);
  if (!payload) {
    redirect('/admin/login');
  }

  return (
    <div className="flex-1 flex  bg-off-white min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-off-white p-8 md:p-12">
        {children}
      </main>
    </div>
  );
}
