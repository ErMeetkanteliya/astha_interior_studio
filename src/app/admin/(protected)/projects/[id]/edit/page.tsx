import React from 'react';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import { ProjectForm } from '@/components/admin/ProjectForm';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let projectData = null;

  try {
    await connectDB();
    const project = await Project.findById(id).lean();
    if (!project) {
      notFound();
    }
    projectData = JSON.parse(JSON.stringify(project));
  } catch (err) {
    console.error('Failed to load project details for editing:', err);
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col items-start border-b border-light-accent pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-primary-accent mb-2">
          MANAGE PORTFOLIO
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide">
          Edit Project Settings
        </h1>
      </div>

      <ProjectForm initialData={projectData} isEdit={true} />
    </div>
  );
}
