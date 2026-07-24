import React from 'react';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import { ProjectsListTable } from './ProjectsListTable';

export const revalidate = 0;

export default async function AdminProjectsPage() {
  let projectsList = [] as any[];

  try {
    await connectDB();
    const projects = await Project.find()
      .sort({ completedDate: -1 })
      .lean();
    
    projectsList = JSON.parse(JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to fetch projects for admin panel:', err);
  }

  return <ProjectsListTable projects={projectsList} />;
}
