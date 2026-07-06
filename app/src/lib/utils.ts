
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabase/client"
import { PostgrestResponse } from "@supabase/supabase-js"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ALLOWED_ORIGINS = [
  'https://mikedp.zyther.dev',
  'http://localhost:3000'
]

export async function getNewsletterSubs(): Promise<PostgrestResponse<{name: string, email: string}>>
{
  return (await supabase.from('newsletter_subscriptions').select('name, email').eq('subscribed', true).order('subscription_date', { ascending: false })) as PostgrestResponse<{name: string, email: string}>
}
