import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format raw numbers/currencies or simple utility dates
 */
export function formatDate(date: string | Date | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formats a category slug back to human readable text
 */
export function formatCategory(cat: string): string {
  if (!cat) return '';
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}
