
//import { UserProvider } from 'mdp/lib/contexts/UserContext';
import { ThemeProvider } from 'mdp/components/theme/theme-provider';
import GoogleTranslateLoader from 'mdp/components/ui/google-translate-loader'
import 'mdp/styles/globals.css';
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
    //<UserProvider>
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
                  {children}
                </Suspense>
            </main>
        </ThemeProvider>
      </body>
      </html>
    //</UserProvider>
  );
}
