
'use client'

import { supabase } from "mdp/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Admin()
{
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/admin/login')
        }
        router.push('/admin/dashboard')
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    )
}