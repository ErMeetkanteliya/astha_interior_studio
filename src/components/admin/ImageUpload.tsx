'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { ICloudinaryImage } from '@/lib/models/Project';
import { toast } from 'sonner';

interface ImageUploadProps {
  label: string;
  value?: ICloudinaryImage | null;
  onChange: (val: ICloudinaryImage | null) => void;
  folder?: 'logo' | 'hero' | 'projects' | 'about' | 'seo';
}

export function ImageUpload({
  label,
  value,
  onChange,
  folder = 'projects',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 2MB
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size exceeds the 2MB limit.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onChange({ url: data.url, publicId: data.publicId });
        toast.success('Image uploaded successfully.');
      } else {
        toast.error(data.error || 'Failed to upload image.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during file upload.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-charcoal/80">
        {label}
      </span>

      {value?.url ? (
        <div className="relative aspect-[16/10] w-full max-w-sm border border-light-accent overflow-hidden bg-off-white">
          <Image
            src={value.url}
            alt={label}
            fill
            sizes="300px"
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-deep-black/60 text-soft-white hover:bg-deep-black p-1.5 transition-colors cursor-pointer"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-light-accent/60 hover:border-primary-accent bg-off-white/40 h-32 w-full max-w-sm flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-1.5 text-charcoal/50">
              <Loader2 className="h-6 w-6 animate-spin text-primary-accent" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-charcoal/50">
              <Upload className="h-6 w-6 stroke-[1.5]" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">Upload Image</span>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

interface MultiImageUploadProps {
  label: string;
  values: ICloudinaryImage[];
  onChange: (vals: ICloudinaryImage[]) => void;
  folder?: 'logo' | 'hero' | 'projects' | 'about' | 'seo';
}

export function MultiImageUpload({
  label,
  values,
  onChange,
  folder = 'projects',
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedImages = [...values];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check size limit: 2MB
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error(`File "${file.name}" exceeds 2MB and was skipped.`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        if (res.ok && data.success) {
          uploadedImages.push({ url: data.url, publicId: data.publicId });
        } else {
          toast.error(data.error || `Failed to upload "${file.name}".`);
        }
      }
      // DEBUG: Trace gallery images before calling parent onChange
      console.log('[DEBUG MULTI] uploadedImages before onChange:', JSON.stringify(uploadedImages));
      console.log('[DEBUG MULTI] uploadedImages length:', uploadedImages.length);
      onChange(uploadedImages);
      toast.success('Gallery images updated.');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during gallery upload.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (idx: number) => {
    const updated = values.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-charcoal/80">
        {label}
      </span>

      {/* Grid Previews */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {values.map((img, idx) => (
          <div
            key={img.publicId || idx}
            className="relative aspect-square w-full border border-light-accent overflow-hidden bg-off-white"
          >
            <Image
              src={img.url}
              alt={`Gallery Image ${idx + 1}`}
              fill
              sizes="150px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-2 right-2 bg-deep-black/60 text-soft-white hover:bg-deep-black p-1.5 transition-colors cursor-pointer"
              aria-label="Remove image"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        ))}

        {/* Upload Trigger card */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-light-accent/60 hover:border-primary-accent bg-off-white/40 aspect-square w-full flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-1.5 text-charcoal/50">
              <Loader2 className="h-5 w-5 animate-spin text-primary-accent" />
              <span className="text-[9px] uppercase tracking-wider font-semibold">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-charcoal/50">
              <Upload className="h-5 w-5 stroke-[1.5]" />
              <span className="text-[9px] uppercase tracking-wider font-semibold text-center px-2">Upload Files</span>
            </div>
          )}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
