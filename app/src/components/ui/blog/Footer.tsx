'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail,
  Heart,
  Instagram
} from 'lucide-react';
import Logo from '../logo';
import { Button } from '../button';

export default function BlogFooter() {
  const currentYear = new Date().getFullYear();
  const router = useRouter()

  const footerLinks = {
    navigation: [
      { name: 'Início', href: '/blog' },
      { name: 'Artigos', href: '/blog/posts' },
      { name: 'Categorias', href: '/blog/categories' },
      { name: 'Autores', href: '/blog/authors' },
      { name: 'Sobre', href: '/blog/about' },
    ],
    legal: [
      { name: 'Privacidade', href: '/blog/privacy' },
      { name: 'Termos de Uso', href: '/blog/terms' }
    ],
    social: [
        {
            name: 'GitHub',
            icon: Github,
            href: 'https://github.com/Mikeprogrammer973',
            color: 'hover:text-gray-700 dark:hover:text-gray-300'
        },
        {
        name: 'LinkedIn',
        icon: Linkedin,
        href: 'https://linkedin.com/in/mike-pascal-280927247',
        color: 'hover:text-blue-600 dark:hover:text-blue-400'
        },
        {
        name: 'Twitter',
        icon: Twitter,
        href: 'https://x.com/IlSognatore007',
        color: 'hover:text-blue-400 dark:hover:text-blue-300'
        },
        {
        name: 'Instagram',
        icon: Instagram,
        href: 'https://instagram.com',
        color: 'hover:text-pink-600 dark:hover:text-pink-400'
        },
        {
        name: 'Email',
        icon: Mail,
        href: 'mailto:mikepascal.delta@gmail.com',
        color: 'hover:text-red-600 dark:hover:text-red-400'
        }
    ],
  };

  return (
    <footer className="bg-[hsl(var(--muted))]/10 border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2">
                <Logo link='/blog' />
                <span className="text-xl font-bold">Blog</span>
            </div>
            <p className="text-[hsl(var(--muted-foreground))]/90 my-6">
              Compartilhando conhecimento sobre desenvolvimento web, design e tecnologia.
            </p>
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-[hsl(var(--input))] rounded-lg transition-all duration-300 transform hover:-translate-y-1 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-[hsl(var(--muted-foreground))] mb-4">
              Inscreva-se para receber as últimas atualizações.
            </p>
            <Button
                onClick={() => router.push("/newsletter")}
                className="whitespace-nowrap w-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                Inscrever-se na minha newsletter
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[hsl(var(--border))] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center text-sm text-[hsl(var(--muted-foreground))]">
            <span>© {currentYear} </span>
            <Link href="/" className="mx-1 font-medium hover:text-[hsl(var(--foreground))] transition-colors">
              Mike D. Pascal
            </Link>
            <span>. Todos os direitos reservados.</span>
          </div>
          
          <div className="flex items-center justify-center text-sm">
            <div className="relative inline-flex items-center group">
              <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold tracking-wide">
                Código elegante, experiências excepcionais
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 group-hover:w-full"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}