import React from 'react';
import connectDB from '@/lib/db';
import StudioInfo from '@/lib/models/StudioInfo';
import { StudioInfoForm } from './StudioInfoForm';

export const revalidate = 0;

export default async function AdminStudioInfoPage() {
  let studioData = {} as any;

  try {
    await connectDB();
    const info = await StudioInfo.findOne().lean();
    if (info) {
      studioData = JSON.parse(JSON.stringify(info));
    }
  } catch (err) {
    console.error('Failed to load studio info settings for admin panel:', err);
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Page Header */}
      <div className="flex flex-col items-start border-b border-light-accent pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-primary-accent mb-2">
          CONFIGURATION PANEL
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide">
          Studio Information
        </h1>
      </div>

      <StudioInfoForm initialData={studioData} />
    </div>
  );
}
