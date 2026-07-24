import React from 'react';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { ProfileForm } from './ProfileForm';

export default async function AdminProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  
  let currentEmail = 'admin@asthainterior.com';

  if (token) {
    const payload = verifyToken(token);
    if (payload?.email) {
      currentEmail = payload.email;
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex flex-col items-start border-b border-light-accent pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-primary-accent mb-2">
          SECURITY CONTROLS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide">
          Profile Settings
        </h1>
      </div>

      <ProfileForm initialEmail={currentEmail} />
    </div>
  );
}
