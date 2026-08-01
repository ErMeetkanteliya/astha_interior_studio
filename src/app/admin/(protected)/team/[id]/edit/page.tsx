import React from 'react';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import TeamMember from '@/lib/models/TeamMember';
import { TeamForm } from '@/components/admin/TeamForm';

interface EditTeamMemberPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let memberData = null;

  try {
    await connectDB();
    const member = await TeamMember.findById(id).lean();
    if (!member) {
      notFound();
    }
    memberData = JSON.parse(JSON.stringify(member));
  } catch (err) {
    console.error('Failed to load team member details for editing:', err);
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col items-start border-b border-light-accent pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-primary-accent mb-2">
          STUDIO CREATIVE MINDS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide">
          Edit Team Member Settings
        </h1>
      </div>

      <TeamForm initialData={memberData} isEdit={true} />
    </div>
  );
}
