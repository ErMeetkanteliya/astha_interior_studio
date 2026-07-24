'use client';

import React, { useState } from 'react';
import { Input as CustomInput } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

const PROJECT_TYPES = [
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

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = 'Phone number must be at least 8 digits';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 5) {
      newErrors.message = 'Message must be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setIsSuccess(true);
        toast.success('Your design consultation request has been submitted.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: 'Residential',
          message: '',
        });
      } else {
        toast.error(data.error || 'Failed to submit form.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-off-white border border-primary-accent/40 p-8 sm:p-12 text-center flex flex-col items-center">
        <span className="text-[10px] tracking-[0.25em] font-semibold text-primary-accent uppercase mb-4">
          Submission Successful
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-light text-deep-black tracking-wide leading-tight mb-4">
          Thank You For Reaching Out
        </h3>
        <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light max-w-md mb-8">
          We have recorded your details. Our principal designer will review your spatial guidelines and contact you within 24 business hours.
        </p>
        <Button variant="secondary" size="md" onClick={() => setIsSuccess(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CustomInput
          label="Your Name *"
          name="name"
          placeholder="e.g. Vikram Shah"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />
        <CustomInput
          label="Email Address *"
          name="email"
          type="email"
          placeholder="e.g. vikram@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CustomInput
          label="Phone Number *"
          name="phone"
          type="tel"
          placeholder="e.g. +91 98765 43210"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />
        
        {/* Project Type dropdown */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-charcoal/80">
            Project Type *
          </label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="w-full bg-soft-white border border-light-accent px-4 py-3 text-sm text-deep-black focus:outline-none focus:border-primary-accent transition-all duration-300 font-sans font-light select-none cursor-pointer"
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Textarea
        label="Tell us about your project *"
        name="message"
        placeholder="Describe the space, your goals, approximate size, and style preferences..."
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        rows={5}
      />

      <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="mt-2">
        Submit Request
      </Button>
    </form>
  );
}
