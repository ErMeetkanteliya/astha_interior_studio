'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input as CustomInput } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface StudioInfoFormProps {
  initialData: any;
}

export function StudioInfoForm({ initialData }: StudioInfoFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'general' | 'seo'>('general');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || '',
    logo: initialData?.logo || null,
    heroImage: initialData?.heroImage || null,
    heroTitle: initialData?.heroTitle || '',
    heroSubtitle: initialData?.heroSubtitle || '',
    aboutTitle: initialData?.aboutTitle || '',
    aboutSubtitle: initialData?.aboutSubtitle || '',
    aboutDescription: initialData?.aboutDescription || '',
    aboutImage: initialData?.aboutImage || null,
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    googleMapsUrl: initialData?.googleMapsUrl || '',
    instagram: initialData?.instagram || '',
    facebook: initialData?.facebook || '',
    pinterest: initialData?.pinterest || '',
    linkedin: initialData?.linkedin || '',
    footerCopyright: initialData?.footerCopyright || '',

    // SEO
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    seoKeywords: initialData?.seoKeywords || '',
    openGraphImage: initialData?.openGraphImage || null,
    favicon: initialData?.favicon || null,

    // Statistics
    stat1Value: initialData?.stat1Value || '',
    stat1Label: initialData?.stat1Label || '',
    stat2Value: initialData?.stat2Value || '',
    stat2Label: initialData?.stat2Label || '',
    stat3Value: initialData?.stat3Value || '',
    stat3Label: initialData?.stat3Label || '',
    stat4Value: initialData?.stat4Value || '',
    stat4Label: initialData?.stat4Label || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (name: string, val: any) => {
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.heroTitle.trim()) newErrors.heroTitle = 'Hero title is required';
    if (!formData.heroSubtitle.trim()) newErrors.heroSubtitle = 'Hero subtitle is required';
    if (!formData.aboutTitle.trim()) newErrors.aboutTitle = 'About title is required';
    if (!formData.aboutSubtitle.trim()) newErrors.aboutSubtitle = 'About subtitle is required';
    if (!formData.aboutDescription.trim()) newErrors.aboutDescription = 'About description is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.googleMapsUrl.trim()) newErrors.googleMapsUrl = 'Google Maps URL is required';
    if (!formData.footerCopyright.trim()) newErrors.footerCopyright = 'Footer Copyright is required';

    // SEO validations
    if (!formData.seoTitle.trim()) newErrors.seoTitle = 'SEO Title is required';
    if (!formData.seoDescription.trim()) newErrors.seoDescription = 'SEO Description is required';
    if (!formData.seoKeywords.trim()) newErrors.seoKeywords = 'SEO Keywords are required';

    // Stats validations
    if (!formData.stat1Value.trim()) newErrors.stat1Value = 'Stat 1 Value is required';
    if (!formData.stat1Label.trim()) newErrors.stat1Label = 'Stat 1 Label is required';
    if (!formData.stat2Value.trim()) newErrors.stat2Value = 'Stat 2 Value is required';
    if (!formData.stat2Label.trim()) newErrors.stat2Label = 'Stat 2 Label is required';
    if (!formData.stat3Value.trim()) newErrors.stat3Value = 'Stat 3 Value is required';
    if (!formData.stat3Label.trim()) newErrors.stat3Label = 'Stat 3 Label is required';
    if (!formData.stat4Value.trim()) newErrors.stat4Value = 'Stat 4 Value is required';
    if (!formData.stat4Label.trim()) newErrors.stat4Label = 'Stat 4 Label is required';

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
    try {
      const res = await fetch('/api/admin/studio-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Studio information updated successfully.');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to update studio info.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 max-w-4xl">
      
      {/* Tabs */}
      <div className="flex border-b border-light-accent gap-2">
        <button
          onClick={() => setActiveTab('general')}
          className={cn(
            'text-xs font-semibold tracking-widest uppercase px-6 py-3 border-b-2 -mb-[2px] transition-luxury cursor-pointer select-none',
            activeTab === 'general'
              ? 'border-primary-accent text-deep-black'
              : 'border-transparent text-charcoal/50 hover:text-deep-black'
          )}
        >
          General Information
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={cn(
            'text-xs font-semibold tracking-widest uppercase px-6 py-3 border-b-2 -mb-[2px] transition-luxury cursor-pointer select-none',
            activeTab === 'seo'
              ? 'border-primary-accent text-deep-black'
              : 'border-transparent text-charcoal/50 hover:text-deep-black'
          )}
        >
          SEO Settings
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-soft-white border border-light-accent p-8 flex flex-col gap-8 rounded-none">
        
        {activeTab === 'general' ? (
          <div className="flex flex-col gap-8">
            
            {/* General Header */}
            <div>
              <h3 className="font-serif text-lg font-medium text-deep-black tracking-wide mb-1 border-b border-light-accent pb-2">
                Brand & Studio Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <CustomInput
                  label="Company Name *"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={errors.companyName}
                  disabled={isLoading}
                />
                <ImageUpload
                  label="Studio Logo"
                  value={formData.logo}
                  onChange={(val) => handleImageChange('logo', val)}
                  folder="logo"
                />
              </div>
            </div>

            {/* Hero Section settings */}
            <div>
              <h3 className="font-serif text-lg font-medium text-deep-black tracking-wide mb-1 border-b border-light-accent pb-2">
                Hero Section Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <CustomInput
                  label="Hero Title *"
                  name="heroTitle"
                  value={formData.heroTitle}
                  onChange={handleChange}
                  error={errors.heroTitle}
                  disabled={isLoading}
                />
                <CustomInput
                  label="Hero Subtitle *"
                  name="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={handleChange}
                  error={errors.heroSubtitle}
                  disabled={isLoading}
                />
              </div>
              <div className="mt-6">
                <ImageUpload
                  label="Hero Background Image (1920x1080)"
                  value={formData.heroImage}
                  onChange={(val) => handleImageChange('heroImage', val)}
                  folder="hero"
                />
              </div>
            </div>

            {/* About Section Settings */}
            <div>
              <h3 className="font-serif text-lg font-medium text-deep-black tracking-wide mb-1 border-b border-light-accent pb-2">
                About Story Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <CustomInput
                  label="About Section Title *"
                  name="aboutTitle"
                  value={formData.aboutTitle}
                  onChange={handleChange}
                  error={errors.aboutTitle}
                  disabled={isLoading}
                />
                <CustomInput
                  label="About Section Subtitle *"
                  name="aboutSubtitle"
                  value={formData.aboutSubtitle}
                  onChange={handleChange}
                  error={errors.aboutSubtitle}
                  disabled={isLoading}
                />
              </div>
              <div className="mt-6">
                <Textarea
                  label="About Story Description *"
                  name="aboutDescription"
                  value={formData.aboutDescription}
                  onChange={handleChange}
                  error={errors.aboutDescription}
                  rows={4}
                  disabled={isLoading}
                />
              </div>
              <div className="mt-6">
                <ImageUpload
                  label="About Showcase Image"
                  value={formData.aboutImage}
                  onChange={(val) => handleImageChange('aboutImage', val)}
                  folder="about"
                />
              </div>
            </div>

            {/* Contact Details Settings */}
            <div>
              <h3 className="font-serif text-lg font-medium text-deep-black tracking-wide mb-1 border-b border-light-accent pb-2">
                Contact & Footer Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <CustomInput
                  label="Contact Phone *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  disabled={isLoading}
                />
                <CustomInput
                  label="Contact Email *"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <CustomInput
                  label="Studio Address *"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                  disabled={isLoading}
                />
                <CustomInput
                  label="Footer Copyright Statement *"
                  name="footerCopyright"
                  value={formData.footerCopyright}
                  onChange={handleChange}
                  error={errors.footerCopyright}
                  disabled={isLoading}
                />
              </div>
              <div className="mt-6">
                <CustomInput
                  label="Google Maps Embed Src URL *"
                  name="googleMapsUrl"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  value={formData.googleMapsUrl}
                  onChange={handleChange}
                  error={errors.googleMapsUrl}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="font-serif text-lg font-medium text-deep-black tracking-wide mb-1 border-b border-light-accent pb-2">
                Social Profile Handles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <CustomInput
                  label="Instagram Username (or Link URL)"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <CustomInput
                  label="Facebook Username (or Link URL)"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <CustomInput
                  label="Pinterest Username (or Link URL)"
                  name="pinterest"
                  value={formData.pinterest}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <CustomInput
                  label="LinkedIn Link URL"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Studio Statistics */}
            <div>
              <h3 className="font-serif text-lg font-medium text-deep-black tracking-wide mb-1 border-b border-light-accent pb-2">
                Studio Statistics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput
                    label="Stat 1 Value *"
                    name="stat1Value"
                    placeholder="e.g. 15+"
                    value={formData.stat1Value}
                    onChange={handleChange}
                    error={errors.stat1Value}
                    disabled={isLoading}
                  />
                  <CustomInput
                    label="Stat 1 Label *"
                    name="stat1Label"
                    placeholder="e.g. Years Experience"
                    value={formData.stat1Label}
                    onChange={handleChange}
                    error={errors.stat1Label}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput
                    label="Stat 2 Value *"
                    name="stat2Value"
                    placeholder="e.g. 150+"
                    value={formData.stat2Value}
                    onChange={handleChange}
                    error={errors.stat2Value}
                    disabled={isLoading}
                  />
                  <CustomInput
                    label="Stat 2 Label *"
                    name="stat2Label"
                    placeholder="e.g. Projects Done"
                    value={formData.stat2Label}
                    onChange={handleChange}
                    error={errors.stat2Label}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput
                    label="Stat 3 Value *"
                    name="stat3Value"
                    placeholder="e.g. 25+"
                    value={formData.stat3Value}
                    onChange={handleChange}
                    error={errors.stat3Value}
                    disabled={isLoading}
                  />
                  <CustomInput
                    label="Stat 3 Label *"
                    name="stat3Label"
                    placeholder="e.g. Creative Designers"
                    value={formData.stat3Label}
                    onChange={handleChange}
                    error={errors.stat3Label}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput
                    label="Stat 4 Value *"
                    name="stat4Value"
                    placeholder="e.g. 98%"
                    value={formData.stat4Value}
                    onChange={handleChange}
                    error={errors.stat4Value}
                    disabled={isLoading}
                  />
                  <CustomInput
                    label="Stat 4 Label *"
                    name="stat4Label"
                    placeholder="e.g. Client Satisfaction"
                    value={formData.stat4Label}
                    onChange={handleChange}
                    error={errors.stat4Label}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* SEO Section Configuration */}
            <div>
              <h3 className="font-serif text-lg font-medium text-deep-black tracking-wide mb-1 border-b border-light-accent pb-2">
                Meta Details (SEO optimization)
              </h3>
              
              <div className="grid grid-cols-1 gap-6 mt-6">
                <CustomInput
                  label="SEO Meta Title *"
                  name="seoTitle"
                  placeholder="e.g. Astha Interior Studio | Luxury Interior Designers Ahmedabad"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  error={errors.seoTitle}
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 mt-6">
                <Textarea
                  label="SEO Meta Description *"
                  name="seoDescription"
                  placeholder="Brief 150-160 character description summarizing the website content for search result cards..."
                  value={formData.seoDescription}
                  onChange={handleChange}
                  error={errors.seoDescription}
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 mt-6">
                <CustomInput
                  label="SEO Meta Keywords (Comma-separated) *"
                  name="seoKeywords"
                  placeholder="e.g. interior designer Ahmedabad, luxury home design, architectural styling"
                  value={formData.seoKeywords}
                  onChange={handleChange}
                  error={errors.seoKeywords}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* SEO Visual Assets */}
            <div>
              <h3 className="font-serif text-lg font-medium text-deep-black tracking-wide mb-1 border-b border-light-accent pb-2">
                SEO Media Assets
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <ImageUpload
                  label="Open Graph Image (1200 x 630 Landscape)"
                  value={formData.openGraphImage}
                  onChange={(val) => handleImageChange('openGraphImage', val)}
                  folder="seo"
                />
                <ImageUpload
                  label="Website Favicon (.png / .ico)"
                  value={formData.favicon}
                  onChange={(val) => handleImageChange('favicon', val)}
                  folder="seo"
                />
              </div>
            </div>

          </div>
        )}

        {/* Form Submission trigger */}
        <div className="flex justify-end border-t border-light-accent/50 pt-6 mt-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
          >
            Save Information Settings
          </Button>
        </div>
        
      </form>
    </div>
  );
}
