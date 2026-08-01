import React from 'react';
import connectDB from '@/lib/db';
import TeamMember from '@/lib/models/TeamMember';
import { TeamListTable } from './TeamListTable';

export const revalidate = 0;

export default async function AdminTeamPage() {
  let teamMembersList = [] as any[];

  try {
    await connectDB();
    const members = await TeamMember.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    teamMembersList = JSON.parse(JSON.stringify(members));
  } catch (err) {
    console.error('Failed to fetch team members for admin panel:', err);
  }

  return <TeamListTable teamMembers={teamMembersList} />;
}
