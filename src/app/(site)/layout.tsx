import '@/styles/globals.css'
import type { ReactNode } from 'react'
export const metadata = {
  title: 'Mike Pascal — Frontend Developer',
}

export default function RootLayout({ children }: { children: ReactNode }){
  return (
    <html lang="en">
      <body className="scroll-smooth bg-bgDark">
        {children}
      </body>
    </html>
  )
}
