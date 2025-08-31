
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import 'mdp/styles/globals.css'
import AdminSidebar from 'mdp/components/admin/sidebar'
import { supabase } from 'mdp/lib/supabase/client'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Admin Panel - Mikeprogrammer973',
  description: '',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const { data: { session } } = await supabase.auth.getSession()

    return (
        <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
            <head>
            </head>
            <body className="font-sans">
                <div className="min-h-screen flex flex-row bg-black text-white">
                  
                 {session && <AdminSidebar />}

                  <main className="flex-grow px-6 py-4 overflow-y-auto">
                      {children}
                  </main>
              </div>
            </body>
        </html>
    )
}
