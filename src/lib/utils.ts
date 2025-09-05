
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
