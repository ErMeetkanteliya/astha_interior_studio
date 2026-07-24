'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input as CustomInput } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Logged in successfully.');
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setErrorMsg(data.error || 'Invalid credentials.');
        toast.error(data.error || 'Failed to authenticate.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-off-white min-h-[80vh] py-20 px-4">
      <Container className="max-w-md">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center select-none mb-10 text-center">
          <span className="font-serif text-3xl tracking-[0.25em] font-light text-deep-black uppercase">
            ASTHA
          </span>
          <span className="font-sans text-[8px] tracking-[0.45em] font-semibold text-charcoal/40 uppercase -mt-0.5">
            Interior Studio
          </span>
          <div className="w-12 h-[1px] bg-primary-accent mt-4" />
        </div>

        {/* Login form card */}
        <div className="bg-soft-white border border-light-accent p-8 sm:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <h2 className="font-serif text-2xl font-light text-deep-black text-center mb-6 tracking-wide">
            Admin Panel Login
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <CustomInput
              label="Email Address"
              type="email"
              placeholder="admin@asthainterior.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <CustomInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            {errorMsg && (
              <p className="text-[10px] text-red-500 tracking-[0.1em] text-center border border-red-200/50 bg-red-50 p-2.5">
                {errorMsg}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center select-none">
          <Link href="/" className="text-[9px] uppercase tracking-widest text-charcoal/45 hover:text-primary-accent transition-colors font-semibold">
            ← Return to Public Website
          </Link>
        </div>
      </Container>
    </div>
  );
}

// Import Link helper since it's used at the bottom
import Link from 'next/link';
