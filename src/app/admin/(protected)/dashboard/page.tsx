import React from 'react';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import ContactMessage from '@/lib/models/ContactMessage';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { FolderKanban, Globe, FileEdit, MailWarning } from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const stats = {
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    unreadMessages: 0,
  };

  try {
    await connectDB();
    stats.totalProjects = await Project.countDocuments();
    stats.publishedProjects = await Project.countDocuments({ status: 'Published' });
    stats.draftProjects = await Project.countDocuments({ status: 'Draft' });
    stats.unreadMessages = await ContactMessage.countDocuments({ read: false });
  } catch (err) {
    console.error('Failed to load dashboard metrics:', err);
  }

  const cards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      description: 'Total design works stored',
      icon: FolderKanban,
      color: 'text-primary-accent',
    },
    {
      title: 'Published Projects',
      value: stats.publishedProjects,
      description: 'Active on public portfolio',
      icon: Globe,
      color: 'text-green-600',
    },
    {
      title: 'Draft Projects',
      value: stats.draftProjects,
      description: 'Unpublished concepts',
      icon: FileEdit,
      color: 'text-charcoal/50',
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      description: 'Pending client inquiries',
      icon: MailWarning,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Title */}
      <div className="flex flex-col items-start border-b border-light-accent pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-primary-accent mb-2">
          OVERVIEW Metrics
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide">
          Dashboard
        </h1>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="flex flex-col justify-between py-8 px-6 bg-soft-white border border-light-accent rounded-none">
              <CardHeader className="flex flex-row items-center justify-between mb-4 pb-0">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/80">
                  {card.title}
                </span>
                <Icon className={`h-5 w-5 ${card.color} stroke-[1.5]`} />
              </CardHeader>
              <CardContent className="flex flex-col items-start mt-2">
                <span className="font-serif text-4xl sm:text-5xl font-light text-deep-black mb-2">
                  {card.value}
                </span>
                <span className="text-[10px] font-light text-charcoal/50 tracking-wider">
                  {card.description}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Access Client Note */}
      <div className="border border-light-accent bg-off-white/50 p-6 flex flex-col gap-2 mt-4 max-w-xl">
        <h4 className="font-serif text-sm font-semibold tracking-wide text-deep-black">
          Welcome back, Administrator
        </h4>
        <p className="text-xs text-charcoal/60 leading-relaxed font-light">
          Use the navigation links on the sidebar to create, edit, or delete portfolio projects, update the main landing page content, change search-optimization parameters, and review client inquiries.
        </p>
      </div>
    </div>
  );
}
