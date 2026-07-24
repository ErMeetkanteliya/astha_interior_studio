import React from 'react';
import connectDB from '@/lib/db';
import ContactMessage from '@/lib/models/ContactMessage';
import { MessagesInbox } from './MessagesInbox';

export const revalidate = 0;

export default async function AdminMessagesPage() {
  let messagesList = [] as any[];

  try {
    await connectDB();
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean();
    
    messagesList = JSON.parse(JSON.stringify(messages));
  } catch (err) {
    console.error('Failed to load contact messages for admin panel:', err);
  }

  return <MessagesInbox messages={messagesList} />;
}
