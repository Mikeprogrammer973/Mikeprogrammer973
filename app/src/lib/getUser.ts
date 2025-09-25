import { User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "./supabase/client"

export type User = SupabaseUser & {
    profile: {
        id: string
        username: string
        email: string
        avatar_url: string
        website: string
        bio: string
        created_at: string
    }
}

export default async function getUser(): Promise<User | null>
{
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) return null

    const { data: profile, error: profileError } = await supabase
        .from('authors')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (profileError) return null

    return { ...user, profile }
}