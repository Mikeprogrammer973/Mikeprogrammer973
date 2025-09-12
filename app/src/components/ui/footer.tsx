'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Github, Linkedin, Mail, Twitter, Instagram, Heart, ArrowUp } from 'lucide-react'
import { Button } from '../../components/ui/button'
import Logo from './logo'

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear())

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = [
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
  ]

  const footerSections = [
    {
      title: 'Navegação',
      links: [
        { name: 'Início', href: '/' },
        { name: 'Perfil', href: '/about' },
        { name: 'Habilidades', href: '/skills' },
        { name: 'Projetos', href: '/projects' },
        { name: 'Contato', href: '/contact' }
      ]
    },
    {
      title: 'Projetos',
      links: [
        { name: 'Desenvolvimento Web', href: '/projects?category=web' },
        { name: 'Aplicativos Mobile', href: '/projects?category=mobile' },
        { name: 'Aplicativos Console', href: '/projects?category=console' },
        { name: 'Aplicativos Desktop', href: '/projects?category=desktop' },      
        { name: 'Código Aberto', href: '/projects?category=opensource' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Termos de Privacidade', href: '/privacy' }
      ]
    }
  ]

  return (
    <footer className="relative bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--muted))]/50 border-t mt-20">
      <Button
        onClick={scrollToTop}
        variant="outline"
        size="icon"
        className="absolute -top-15 left-1/2 transform -translate-x-1/2 rounded-full w-10 h-10 shadow-lg border-[hsl(var(--muted-foreground))]/20 hover:border-[hsl(var(--primary))] transition-all duration-300"
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="py-2">
              <Logo />
            </div>
            <p className="text-[hsl(var(--muted-foreground))] mb-6 max-w-md">
              Desenvolvedor full-stack apaixonado por criar experiências digitais excepcionais 
              com React, Next.js e tecnologias modernas.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-[hsl(var(--muted))] rounded-lg transition-all duration-300 transform hover:-translate-y-1 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4 text-[hsl(var(--foreground))]">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-[hsl(var(--muted-foreground))] rounded-full mr-2 group-hover:bg-[hsl(var(--primary))] group-hover:animate-pulse"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="font-semibold mb-2">Fique por dentro das novidades</h3>
              <p className="text-[hsl(var(--muted-foreground))] text-sm">
                Receba atualizações sobre novos projetos e artigos.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              {/*<input
                type="email"
                placeholder="Seu melhor email"
                className="px-4 py-2 text-center border border-[hsl(var(--muted-foreground))]30 rounded-lg focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]/10 bg-[hsl(var(--background))] flex-1 min-w-0"
              />*/}
              <Button className="whitespace-nowrap text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                Inscrever-se na minha newsletter
              </Button>
            </div>
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

      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </footer>
  )
}
