'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input as CustomInput } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

interface ProfileFormProps {
  initialEmail: string;
}

export function ProfileForm({ initialEmail }: ProfileFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (password) {
      if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please resolve validation errors.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password ? password.trim() : null,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Profile credentials updated successfully.');
        setPassword('');
        setConfirmPassword('');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to update credentials.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-soft-white border border-light-accent p-8 flex flex-col gap-6 max-w-xl rounded-none shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
      
      <CustomInput
        label="Administrator Email *"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
        }}
        error={errors.email}
        disabled={isLoading}
      />

      <div className="border-t border-light-accent/50 pt-5 mt-2 flex flex-col gap-1.5">
        <span className="text-[10px] text-charcoal/40 uppercase tracking-widest font-semibold block mb-2">
          Change Password (Optional)
        </span>
        
        <CustomInput
          label="New Password"
          type="password"
          placeholder="Leave blank to keep current password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
          }}
          error={errors.password}
          disabled={isLoading}
        />

        <div className="mt-2">
          <CustomInput
            label="Confirm New Password"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            error={errors.confirmPassword}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-light-accent/50 pt-6 mt-4">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
        >
          Save Profile Settings
        </Button>
      </div>

    </form>
  );
}
