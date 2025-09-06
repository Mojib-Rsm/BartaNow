import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to generate a slug from a title
export const generateNonAiSlug = (title: string) => {
    if (!title) return '';
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\u0980-\u09FF\s-]/g, '') // Allow bengali, alphanumeric, spaces, and hyphens
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/-+/g, '-'); // Replace multiple - with single -
};

// Helper for category colors
const categoryColorMap: Record<string, string> = {
    'রাজনীতি': '#E53935', // Red
    'খেলা': '#43A047',    // Green
    'প্রযুক্তি': '#1E88E5', // Blue
    'বিনোদন': '#8E24AA', // Purple
    'অর্থনীতি': '#FB8C00', // Orange
    'আন্তর্জাতিক': '#00838F', // Cyan
};

export const getCategoryColor = (category: string) => {
    return categoryColorMap[category] || '#6C757D'; // Default muted gray
};
