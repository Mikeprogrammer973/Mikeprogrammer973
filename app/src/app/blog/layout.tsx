
import { ThemeProvider } from 'mdp/components/theme/theme-provider';
import GoogleTranslateLoader from 'mdp/components/ui/google-translate-loader'
import 'mdp/styles/globals.css'
import 'mdp/styles/gg-tr-ovrd.css'
import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogFooter from 'mdp/components/ui/blog/Footer';

export const metadata: Metadata = {
  title:{
    template: "MDP Blog | %s",
    default: "MDP Blog"
  },
  description: 'Blog de informática sobre desenvolvimento web, design e tecnologia. Creado por Mike Dervensky Pascal, aliás Mikeprogrammer973',
  keywords: ['blog', 'it', 'desenvolvimento web', 'design', 'tecnologia', 'mike pascal', 'mike dervensky', 'mikeprogrammer973', 'mike dp', 'mike dervensky pascal', 'mike d pascal'],
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
      <body className="dark">
        {/*<ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >*/}
          <main>
              <Suspense>
                {children}
              </Suspense>
          </main>
          <BlogFooter />
        {/*</ThemeProvider>*/}
      </body>
      </html>
  );
}
