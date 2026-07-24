import React from 'react';
import { ProjectForm } from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col items-start border-b border-light-accent pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-primary-accent mb-2">
          MANAGE PORTFOLIO
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide">
          Create New Project
        </h1>
      </div>

      <ProjectForm isEdit={false} />
    </div>
  );
}
