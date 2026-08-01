'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input as CustomInput } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload, MultiImageUpload } from './ImageUpload';
import { ICloudinaryImage, IProject } from '@/lib/models/Project';
import { toast } from 'sonner';

interface ProjectFormProps {
  initialData?: IProject | null;
  isEdit?: boolean;
}

const CATEGORIES = [
  'Residential',
  'Commercial',
  'Office',
  'Villa',
  'Apartment',
  'Restaurant',
  'Hotel',
  'Renovation',
  'Custom',
];

const STATUSES = ['Draft', 'Published', 'Archived'];

export function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Completed date formatting helper: YYYY-MM-DD
  const formatInputDate = (dateStr?: Date | string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'Residential',
    location: initialData?.location || '',
    shortDescription: initialData?.shortDescription || '',
    fullDescription: initialData?.fullDescription || '',
    featuredImage: initialData?.featuredImage || (null as ICloudinaryImage | null),
    galleryImages: initialData?.galleryImages || ([] as ICloudinaryImage[]),
    servicesUsed: initialData?.servicesUsed?.join(', ') || '',
    status: initialData?.status || 'Draft',
    completedDate: formatInputDate(initialData?.completedDate),
    clientName: initialData?.clientName || '',
    area: initialData?.area || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFeaturedImageChange = (val: ICloudinaryImage | null) => {
    setFormData((prev) => ({ ...prev, featuredImage: val }));
    if (errors.featuredImage) {
      setErrors((prev) => ({ ...prev, featuredImage: '' }));
    }
  };

  const handleGalleryImagesChange = (vals: ICloudinaryImage[]) => {
    setFormData((prev) => ({ ...prev, galleryImages: vals }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }
    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = 'Full description is required';
    }
    if (!formData.featuredImage) {
      newErrors.featuredImage = 'Featured image is required';
    }
    if (!formData.servicesUsed.trim()) {
      newErrors.servicesUsed = 'Services delivered is required';
    }
    if (!formData.completedDate) {
      newErrors.completedDate = 'Completed Date is required';
    }

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

    // Parse comma-separated services
    const parsedServices = formData.servicesUsed
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      ...formData,
      servicesUsed: parsedServices,
      clientName: formData.clientName.trim() || null,
      area: formData.area.trim() || null,
    };

    try {
      const url = isEdit
        ? `/api/admin/projects/${initialData?._id}`
        : '/api/admin/projects';
      
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(isEdit ? 'Project updated successfully.' : 'Project created successfully.');
        router.push('/admin/projects');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to submit project.');
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
          label="Project Title *"
          name="title"
          placeholder="e.g. Luxury Penthouse Ahmedabad"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          disabled={isLoading}
        />

        <div className="w-full flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-[0.25em] font-semibold text-charcoal/80">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full bg-soft-white border border-light-accent px-4 py-3 text-sm text-deep-black focus:outline-none focus:border-primary-accent transition-all duration-300 font-sans font-light select-none cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CustomInput
          label="Location *"
          name="location"
          placeholder="e.g. Bodakdev, Ahmedabad"
          value={formData.location}
          onChange={handleChange}
          error={errors.location}
          disabled={isLoading}
        />

        <CustomInput
          label="Completed Date *"
          name="completedDate"
          type="date"
          value={formData.completedDate}
          onChange={handleChange}
          error={errors.completedDate}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CustomInput
          label="Client Name (Optional)"
          name="clientName"
          placeholder="e.g. Mr. Rajesh Patel"
          value={formData.clientName}
          onChange={handleChange}
          disabled={isLoading}
        />

        <CustomInput
          label="Project Size / Area (Optional)"
          name="area"
          placeholder="e.g. 4,500 Sq. Ft."
          value={formData.area}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CustomInput
          label="Services Delivered (Comma-separated) *"
          name="servicesUsed"
          placeholder="e.g. Space Curation, Lighting Consultation, Cabinet Layouts"
          value={formData.servicesUsed}
          onChange={handleChange}
          error={errors.servicesUsed}
          disabled={isLoading}
        />

        <div className="w-full flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-[0.25em] font-semibold text-charcoal/80">
            Project Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full bg-soft-white border border-light-accent px-4 py-3 text-sm text-deep-black focus:outline-none focus:border-primary-accent transition-all duration-300 font-sans font-light select-none cursor-pointer"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CustomInput
        label="Short Description *"
        name="shortDescription"
        placeholder="Brief summary sentence that displays on cards (e.g. A warm minimalist penthouse overlooking Sabarmati riverfront)."
        value={formData.shortDescription}
        onChange={handleChange}
        error={errors.shortDescription}
        disabled={isLoading}
      />

      <Textarea
        label="Full Project Description *"
        name="fullDescription"
        placeholder="Provide the complete story of the project, including structural constraints, textures, materials choice, and detailed curation information..."
        value={formData.fullDescription}
        onChange={handleChange}
        error={errors.fullDescription}
        rows={6}
        disabled={isLoading}
      />

      {/* Image Uploaders */}
      <div className="border-t border-light-accent/50 pt-6">
        <ImageUpload
          label="Featured Image (1600 x 900 Landscape) *"
          value={formData.featuredImage}
          onChange={handleFeaturedImageChange}
          folder="projects"
        />
        {errors.featuredImage && (
          <span className="text-[10px] text-red-500 tracking-[0.1em] mt-1 block">
            {errors.featuredImage}
          </span>
        )}
      </div>

      <div className="border-t border-light-accent/50 pt-6">
        <MultiImageUpload
          label="Gallery Images (1600 x 1200 Grid)"
          values={formData.galleryImages}
          onChange={handleGalleryImagesChange}
          folder="projects"
        />
      </div>

      {/* Form Submission triggers */}
      <div className="flex justify-end gap-3 border-t border-light-accent/50 pt-6 mt-4">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => router.push('/admin/projects')}
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
          {isEdit ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
