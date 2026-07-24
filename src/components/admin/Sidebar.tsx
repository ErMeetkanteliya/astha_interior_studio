'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Info, Mail, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { name: 'Studio Information', href: '/admin/studio-info', icon: Info },
    { name: 'Contact Messages', href: '/admin/messages', icon: Mail },
    { name: 'Profile Settings', href: '/admin/profile', icon: User },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        toast.success('Logged out successfully.');
        router.push('/admin/login');
        router.refresh();
      } else {
        toast.error('Logout failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to log out.');
    }
  };

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-charcoal text-soft-white flex flex-col justify-between shrink-0 border-r border-light-accent/10 min-h-screen sticky top-0">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-8 border-b border-light-accent/10 flex flex-col justify-center select-none">
          <span className="font-serif text-2xl tracking-[0.2em] font-light text-soft-white uppercase">
            ASTHA
          </span>
          <span className="font-sans text-[7px] tracking-[0.45em] font-semibold text-soft-white/40 uppercase -mt-0.5">
            Admin Panel
          </span>
        </div>

        {/* Menu Links */}
        <nav className="p-6 flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 font-sans text-xs font-semibold tracking-wider uppercase transition-colors duration-300',
                  active
                    ? 'bg-primary-accent text-deep-black'
                    : 'text-soft-white/60 hover:text-soft-white hover:bg-soft-white/5'
                )}
              >
                <Icon className="h-4.5 w-4.5 stroke-[1.5]" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout trigger */}
      <div className="p-6 border-t border-light-accent/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-3 font-sans text-xs font-semibold tracking-wider uppercase text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors duration-300 cursor-pointer text-left"
        >
          <LogOut className="h-4.5 w-4.5 stroke-[1.5]" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
