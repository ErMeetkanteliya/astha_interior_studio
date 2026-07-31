'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, MailOpen, Trash2, Calendar, Phone, User, Compass, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface MessagesInboxProps {
  messages: any[];
}

export function MessagesInbox({ messages }: MessagesInboxProps) {
  const router = useRouter();
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format timestamp helper
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleOpenMessage = async (msg: any) => {
    setSelectedMessage(msg);

    // If message is unread, hit PUT endpoint to mark as read
    if (!msg.read) {
      try {
        const res = await fetch(`/api/admin/messages/${msg._id}`, {
          method: 'PUT',
        });
        if (res.ok) {
          router.refresh();
          // Update local unread state immediately to refresh UI state
          setSelectedMessage((prev: any) =>
            prev ? { ...prev, read: true, viewedAt: new Date().toISOString() } : prev
          );
        }
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/messages/${deleteId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Message deleted successfully.');
        // If the open message is the deleted one, close it
        if (selectedMessage?._id === deleteId) {
          setSelectedMessage(null);
        }
        setDeleteId(null);
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to delete message.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting the message.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col items-start pb-6 border-b border-light-accent">
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-primary-accent mb-2">
          CLIENT INQUIRIES
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-deep-black tracking-wide">
          Contact Messages
        </h1>
      </div>

      {/* Grid listing messages */}
      {messages.length === 0 ? (
        <div className="text-center py-20 bg-soft-white border border-light-accent text-charcoal/40 font-light text-sm tracking-wider">
          Inbox is empty. Submit a contact form from the public website to test.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Messages List */}
          <div className="lg:col-span-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
            {messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => handleOpenMessage(msg)}
                className={cn(
                  'border p-5 text-left transition-all duration-300 cursor-pointer flex flex-col gap-3 relative select-none',
                  selectedMessage?._id === msg._id
                    ? 'border-primary-accent bg-off-white shadow-sm'
                    : 'border-light-accent bg-soft-white hover:border-charcoal/40',
                  !msg.read && 'border-l-4 border-l-primary-accent font-semibold'
                )}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-2.5">
                    {msg.read ? (
                      <MailOpen className="h-4 w-4 text-charcoal/30 shrink-0" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary-accent shrink-0 animate-pulse" />
                    )}
                    <span className="text-xs sm:text-sm font-serif font-medium text-deep-black line-clamp-1">
                      {msg.name}
                    </span>
                  </div>
                  <span className="text-[9px] text-charcoal/40 font-light uppercase tracking-wider shrink-0 mt-0.5">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <span className="text-[10px] tracking-wider uppercase text-charcoal/60 bg-off-white border border-light-accent/40 px-2 py-0.5">
                    {msg.projectType}
                  </span>
                  <span className="text-[9px] text-charcoal/40 font-light font-mono">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-charcoal/70 line-clamp-2 font-light leading-relaxed">
                  {msg.message}
                </p>

                {/* Quick Delete option directly on card */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(msg._id);
                  }}
                  className="absolute bottom-4 right-4 text-charcoal/30 hover:text-red-600 transition-colors p-1"
                  aria-label="Delete message"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Right panel: Focused Message details preview */}
          <div className="lg:col-span-6 sticky top-0">
            {selectedMessage ? (
              <div className="bg-soft-white border border-light-accent p-8 flex flex-col gap-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
                
                {/* Meta details list */}
                <div className="flex flex-col gap-4 border-b border-light-accent pb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-primary-accent font-semibold">
                      Focused Inquiry
                    </span>
                    <button
                      onClick={() => setDeleteId(selectedMessage._id)}
                      className="text-charcoal/40 hover:text-red-600 transition-colors flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest cursor-pointer select-none"
                    >
                      <Trash2 className="h-4 w-4 stroke-[1.5]" />
                      <span>Delete</span>
                    </button>
                  </div>
                  
                  <h3 className="font-serif text-2xl font-light text-deep-black tracking-wide mt-2">
                    {selectedMessage.name}
                  </h3>
                </div>

                <div className="flex flex-col gap-4 text-xs font-sans font-light text-charcoal">
                  
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-primary-accent shrink-0" />
                    <span className="font-semibold text-deep-black">Email:</span>
                    <a href={`mailto:${selectedMessage.email}`} className="hover:text-primary-accent transition-colors font-mono">
                      {selectedMessage.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary-accent shrink-0" />
                    <span className="font-semibold text-deep-black">Phone:</span>
                    <a href={`tel:${selectedMessage.phone}`} className="hover:text-primary-accent transition-colors font-mono">
                      {selectedMessage.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Compass className="h-4 w-4 text-primary-accent shrink-0" />
                    <span className="font-semibold text-deep-black">Project Area:</span>
                    <span className="text-[10px] tracking-wider uppercase text-charcoal/70 bg-off-white border border-light-accent/40 px-2.5 py-0.5">
                      {selectedMessage.projectType}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-primary-accent shrink-0" />
                    <span className="font-semibold text-deep-black">Received:</span>
                    <span>{formatDate(selectedMessage.createdAt)} at {formatTime(selectedMessage.createdAt)}</span>
                  </div>

                  {selectedMessage.viewedAt && (
                    <div className="flex items-center gap-3 text-green-700/80 bg-green-50/50 p-2.5 border border-green-100/50">
                      <Eye className="h-4 w-4 shrink-0" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Viewed First On:</span>
                      <span className="text-[10px] font-mono">{formatDate(selectedMessage.viewedAt)} at {formatTime(selectedMessage.viewedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Message Body */}
                <div className="bg-off-white/70 border border-light-accent p-6 flex flex-col gap-2 mt-2">
                  <span className="text-[9px] uppercase tracking-widest text-charcoal/45 font-semibold">Message Description</span>
                  <p className="text-xs sm:text-sm text-charcoal/80 font-light leading-relaxed whitespace-pre-line">
                    {selectedMessage.message}
                  </p>
                </div>

              </div>
            ) : (
              <div className="bg-off-white/40 border border-dashed border-light-accent/60 p-12 text-center flex flex-col items-center justify-center min-h-[40vh] gap-3 text-charcoal/40 font-light text-xs">
                <Eye className="h-8 w-8 stroke-[1.2] text-charcoal/30 mb-1" />
                <span>Select a contact message from the inbox listing to view details.</span>
              </div>
            )}
          </div>

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
            Are you sure you want to delete this message? This action is permanent and cannot be undone.
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
