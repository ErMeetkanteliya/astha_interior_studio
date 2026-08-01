import React from 'react';
import { TeamForm } from '@/components/admin/TeamForm';

export default function NewTeamMemberPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col items-start border-b border-light-accent pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-primary-accent mb-2">
          STUDIO CREATIVE MINDS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide">
          Add New Team Member
        </h1>
      </div>

      <TeamForm isEdit={false} />
    </div>
  );
}
