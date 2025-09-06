
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import 'mdp/styles/globals.css'
import 'mdp/styles/gg-tr-ovrd.css'
import { ThemeProvider } from '../../components/theme/theme-provider'
import Navbar from '../../components/ui/navbar'
import Footer from '../../components/ui/footer'
import GoogleTranslateLoader from '../../components/ui/google-translate-loader'

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
  title: 'Mike D. Pascal',
  description: '',
  icons: {
    icon: "/mdp-icon.png"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/*<link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-8lYjz6jVwU3ZpWyEtH3u7L3Ho9kKnNkn6u25oLzXdxzRDN0xsnXJYpP5OSdJ2D3FvAv7wOiJjZ1B2dP04+zG8A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />*/}
        <GoogleTranslateLoader/>
      </head>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
