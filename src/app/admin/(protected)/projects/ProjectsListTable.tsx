'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus, Calendar, MapPin } from 'lucide-react';
import { IProject } from '@/lib/models/Project';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface ProjectsListTableProps {
  projects: IProject[];
}

export function ProjectsListTable({ projects }: ProjectsListTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${deleteId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Project and associated assets deleted successfully.');
        setDeleteId(null);
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to delete project.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting the project.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: 'Draft' | 'Published' | 'Archived') => {
    const styles = {
      Draft: 'bg-charcoal/10 text-charcoal border-charcoal/20',
      Published: 'bg-green-100 text-green-700 border-green-200',
      Archived: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return (
      <span
        className={cn(
          'text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 border select-none',
          styles[status]
        )}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Create Project Header action */}
      <div className="flex justify-between items-center pb-6 border-b border-light-accent">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-primary-accent mb-2">
            MANAGE WORKS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide">
            Projects Portfolio
          </h1>
        </div>
        <Link href="/admin/projects/new">
          <Button variant="primary" size="md" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Project</span>
          </Button>
        </Link>
      </div>

      {/* Projects Grid/Table List */}
      {projects.length === 0 ? (
        <div className="text-center py-20 bg-soft-white border border-light-accent text-charcoal/40 font-light text-sm tracking-wider">
          No projects found. Click the button above to create your first premium portfolio design.
        </div>
      ) : (
        <div className="bg-soft-white border border-light-accent overflow-x-auto rounded-none">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-light-accent bg-off-white text-[10px] font-bold uppercase tracking-wider text-charcoal/70">
                <th className="py-4 px-6 w-24">Thumbnail</th>
                <th className="py-4 px-6">Project Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Completed</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-accent/50 font-sans text-xs font-light text-charcoal">
              {projects.map((project) => (
                <tr key={project.slug} className="hover:bg-off-white/40 transition-colors">
                  {/* Thumbnail */}
                  <td className="py-4 px-6">
                    <div className="relative aspect-[4/3] w-16 overflow-hidden bg-off-white border border-light-accent/30">
                      <Image
                        src={project.featuredImage.url}
                        alt={project.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  </td>

                  {/* Title */}
                  <td className="py-4 px-6 font-semibold text-deep-black text-sm">
                    {project.title}
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6 tracking-wide">
                    {project.category}
                  </td>

                  {/* Location */}
                  <td className="py-4 px-6 font-light">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary-accent stroke-[1.5]" />
                      <span>{project.location}</span>
                    </div>
                  </td>

                  {/* Completed date */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-charcoal/40 stroke-[1.5]" />
                      <span>{formatDate(project.completedDate)}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    {getStatusBadge(project.status)}
                  </td>

                  {/* Action triggers */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/projects/${project._id}/edit`}>
                        <button
                          className="p-2 border border-light-accent text-charcoal/60 hover:text-primary-accent hover:border-primary-accent transition-colors"
                          aria-label="Edit project"
                        >
                          <Edit className="h-4 w-4 stroke-[1.5]" />
                        </button>
                      </Link>
                      
                      <button
                        onClick={() => setDeleteId(project._id as unknown as string)}
                        className="p-2 border border-light-accent text-charcoal/60 hover:text-red-600 hover:border-red-300 transition-colors"
                        aria-label="Delete project"
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
            Are you sure you want to delete this project? This will permanently delete all associated assets from Cloudinary storage first, then remove the record from the database.
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
