
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ALLOWED_ORIGINS = [
  'https://mikedp.vercel.app',
  'http://localhost:3000'
]
