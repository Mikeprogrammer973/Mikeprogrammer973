
'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun, Menu, X } from 'lucide-react'
import Logo from './logo'
import TranslateWidget from './translate-widget'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const is_Selected = (href: string) => pathname === href

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const navItems = [
    { name: 'Início', href: '/' },
    { name: 'Sobre mim', href: '/about' },
    { name: 'Habilidades', href: '/skills' },
    { name: 'Projetos', href: '/projects' },
    { name: 'Contato', href: '/contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[hsl(var(--background))]/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />
        {/* Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={"transition-colors relative group" + (is_Selected(item.href) ? ' text-[hsl(var(--primary))]/70 hover:[hsl(var(--primary))]' : ' text-[hsl(var(--foreground))]/70 hover:text-[hsl(var(--foreground))] ')}
              aria-current={is_Selected(item.href)}
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <TranslateWidget/>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-[hsl(var(--accent))] transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-[hsl(var(--accent))] transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[hsl(var(--background))]/95 border-b shadow-md animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={"transition-colors py-2 font-medium" + (is_Selected(item.href) ? ' text-[hsl(var(--primary))]/70 hover:[hsl(var(--primary))]' : ' text-[hsl(var(--foreground))]/70 hover:text-[hsl(var(--foreground))]')}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}