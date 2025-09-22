
import { UserProvider } from 'mdp/lib/contexts/User';
import { ThemeProvider } from 'mdp/components/theme/theme-provider';
import GoogleTranslateLoader from 'mdp/components/ui/google-translate-loader'
import 'mdp/styles/globals.css';
import 'mdp/styles/gg-tr-ovrd.css'
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Mike D. Pascal | Blog',
  description: '',
  icons: {
    icon: "/mdp-icon.png"
  }
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="pt-BR" suppressHydrationWarning className="font-sans">
      <head>
        <GoogleTranslateLoader/>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <main>
                <Suspense>
                  <UserProvider>
                    {children}
                  </UserProvider>
                </Suspense>
            </main>
        </ThemeProvider>
      </body>
      </html>
  );
}
