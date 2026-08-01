'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus, ArrowUpDown } from 'lucide-react';
import { ITeamMember } from '@/lib/models/TeamMember';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TeamListTableProps {
  teamMembers: ITeamMember[];
}

export function TeamListTable({ teamMembers }: TeamListTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/team/${deleteId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Team member deleted successfully.');
        setDeleteId(null);
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to delete team member.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting team member.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span
        className={cn(
          'text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 border select-none',
          isActive
            ? 'bg-green-100 text-green-700 border-green-200'
            : 'bg-charcoal/10 text-charcoal border-charcoal/20'
        )}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Create Team Member Header action */}
      <div className="flex justify-between items-center pb-6 border-b border-light-accent">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-primary-accent mb-2">
            STUDIO CREATIVE MINDS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide">
            Team Members
          </h1>
        </div>
        <Link href="/admin/team/new">
          <Button variant="primary" size="md" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </Button>
        </Link>
      </div>

      {/* Team Members List */}
      {teamMembers.length === 0 ? (
        <div className="text-center py-20 bg-soft-white border border-light-accent text-charcoal/40 font-light text-sm tracking-wider">
          No team members found. Click the button above to add team members.
        </div>
      ) : (
        <div className="bg-soft-white border border-light-accent overflow-x-auto rounded-none">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-light-accent bg-off-white text-[10px] font-bold uppercase tracking-wider text-charcoal/70">
                <th className="py-4 px-6 w-20">Photo</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Designation / Role</th>
                <th className="py-4 px-6">Order</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-accent/50 font-sans text-xs font-light text-charcoal">
              {teamMembers.map((member) => (
                <tr key={member._id as unknown as string} className="hover:bg-off-white/40 transition-colors">
                  {/* Photo */}
                  <td className="py-4 px-6">
                    <div className="relative aspect-[3/4] w-12 overflow-hidden bg-off-white border border-light-accent/30">
                      <Image
                        src={member.image?.url || '/images/team-1.jpg'}
                        alt={member.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-4 px-6 font-semibold text-deep-black text-sm">
                    {member.name}
                  </td>

                  {/* Designation */}
                  <td className="py-4 px-6 tracking-wide">
                    {member.designation}
                  </td>

                  {/* Order */}
                  <td className="py-4 px-6 font-light">
                    <div className="flex items-center gap-1.5">
                      <ArrowUpDown className="h-3.5 w-3.5 text-primary-accent stroke-[1.5]" />
                      <span>{member.order}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    {getStatusBadge(member.isActive)}
                  </td>

                  {/* Action triggers */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/team/${member._id}/edit`}>
                        <button
                          className="p-2 border border-light-accent text-charcoal/60 hover:text-primary-accent hover:border-primary-accent transition-colors cursor-pointer"
                          aria-label="Edit team member"
                        >
                          <Edit className="h-4 w-4 stroke-[1.5]" />
                        </button>
                      </Link>
                      
                      <button
                        onClick={() => setDeleteId(member._id as unknown as string)}
                        className="p-2 border border-light-accent text-charcoal/60 hover:text-red-600 hover:border-red-300 transition-colors cursor-pointer"
                        aria-label="Delete team member"
                      >
                        <Trash2 className="h-4 w-4 stroke-[1.5]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="flex flex-col gap-6">
          <p className="text-sm text-charcoal/70 font-light leading-relaxed">
            Are you sure you want to delete this team member? This will permanently remove the record and delete their profile image from Cloudinary storage.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="dark"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-soft-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
