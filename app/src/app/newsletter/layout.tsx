
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import 'mdp/styles/globals.css'
import 'mdp/styles/gg-tr-ovrd.css'
import { Suspense } from 'react'
import { Spinner } from 'mdp/components/ui/spinner'
import GoogleTranslateLoader from 'mdp/components/ui/google-translate-loader'
import TranslateWidget from 'mdp/components/ui/translate-widget'

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
  title: 'Mike D. Pascal | Newsletter',
  description: '',
  icons: {
    icon: "/mdp-icon.png"
  }
}

export default function NewsLetterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <GoogleTranslateLoader/>
      </head>
      <body className="font-sans dark">
        <div className="flex flex-col min-h-screen bg-black">
          <div className='p-5 sticky top-0 z-10'>
            <TranslateWidget/>
          </div>
          <Suspense fallback={<Spinner />}>
            {children}
          </Suspense>
        </div>
      </body>
    </html>
  )
}
