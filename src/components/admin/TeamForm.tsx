'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input as CustomInput } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from './ImageUpload';
import { ICloudinaryImage } from '@/lib/models/Project';
import { ITeamMember } from '@/lib/models/TeamMember';
import { toast } from 'sonner';

interface TeamFormProps {
  initialData?: ITeamMember | null;
  isEdit?: boolean;
}

export function TeamForm({ initialData, isEdit = false }: TeamFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    designation: initialData?.designation || '',
    image: initialData?.image || (null as ICloudinaryImage | null),
    order: initialData?.order ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'order') {
      setFormData((prev) => ({ ...prev, order: parseInt(value, 10) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (val: ICloudinaryImage | null) => {
    setFormData((prev) => ({ ...prev, image: val }));
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation / Role is required';
    if (!formData.image) newErrors.image = 'Profile image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please resolve validation errors first.');
      return;
    }

    setIsLoading(true);

    const payload = {
      name: formData.name.trim(),
      designation: formData.designation.trim(),
      image: formData.image,
      order: Number(formData.order) || 0,
      isActive: Boolean(formData.isActive),
    };

    try {
      const url = isEdit
        ? `/api/admin/team/${initialData?._id}`
        : '/api/admin/team';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(isEdit ? 'Team member updated successfully.' : 'Team member created successfully.');
        router.push('/admin/team');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to submit team member.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full max-w-4xl bg-soft-white border border-light-accent p-8 rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
      
      {/* 2 Column Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CustomInput
          label="Full Name *"
          name="name"
          placeholder="e.g. Astha Patel"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={isLoading}
        />

        <CustomInput
          label="Designation / Role *"
          name="designation"
          placeholder="e.g. Principal Designer & Founder"
          value={formData.designation}
          onChange={handleChange}
          error={errors.designation}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CustomInput
          label="Display Order (Number)"
          name="order"
          type="number"
          placeholder="e.g. 1"
          value={formData.order.toString()}
          onChange={handleChange}
          disabled={isLoading}
        />

        <div className="w-full flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-[0.25em] font-semibold text-charcoal/80">
            Active Status *
          </label>
          <select
            name="isActive"
            value={formData.isActive ? 'true' : 'false'}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, isActive: e.target.value === 'true' }));
            }}
            disabled={isLoading}
            className="w-full bg-soft-white border border-light-accent px-4 py-3 text-sm text-deep-black focus:outline-none focus:border-primary-accent transition-all duration-300 font-sans font-light select-none cursor-pointer"
          >
            <option value="true">Active (Visible on About Page)</option>
            <option value="false">Inactive (Hidden)</option>
          </select>
        </div>
      </div>

      {/* Image Uploader */}
      <div className="border-t border-light-accent/50 pt-6">
        <ImageUpload
          label="Profile Image (Portrait) *"
          value={formData.image}
          onChange={handleImageChange}
          folder="about"
        />
        {errors.image && (
          <span className="text-[10px] text-red-500 tracking-[0.1em] mt-1 block">
            {errors.image}
          </span>
        )}
      </div>

      {/* Form Submission triggers */}
      <div className="flex justify-end gap-3 border-t border-light-accent/50 pt-6 mt-4">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => router.push('/admin/team')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
        >
          {isEdit ? 'Save Changes' : 'Create Team Member'}
        </Button>
      </div>
    </form>
  );
}
