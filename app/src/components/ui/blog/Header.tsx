
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from 'mdp/lib/supabase/client';
import { useTheme } from 'next-themes';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Search,
  LogOut,
  HomeIcon,
  MenuSquare,
  Users,
} from 'lucide-react';
import Logo from '../logo';
import getUser, { User } from 'mdp/lib/getUser';

export default function BlogHeader() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true)
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser()
      setUser(user)
    }
    fetchUser()
  }, []);

  if (!mounted) return null

  const navigation = [
    { name: 'Início', href: '/blog', icon: HomeIcon },
    { name: 'Categorias', href: '/blog/categories', icon: MenuSquare },
    { name: 'Autores', href: '/blog/authors', icon: Users },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/blog/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/blog';
  };

  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--background))]/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Logo link='/blog' />
            <span className="text-xl font-bold">Blog</span>
          </div>

          {/* Desktop nav*/}
          <nav className="hidden md:flex items-center space-x-8 mx-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`hover:text-[hsl(var(--foreground))] transition-colors ${
                  pathname === item.href ? 'text-[hsl(var(--foreground))] font-bold' : 'text-[hsl(var(--foreground))]/70'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))] w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-[hsl(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            {/*<button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md hover:bg-[hsl(var(--accent))]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>*/}

            {user ? (
              <div className="relative">
                <button
                  translate="no"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-[hsl(var(--accent))]"
                >
                  {user.profile.avatar_url
                    ? <img
                        src={user.profile.avatar_url || ''}
                        alt={user.profile.username || 'Autor'}
                        className="w-10 h-10 p-[0.5px] border border-[hsl(var(--primary))] rounded-full"
                    />
                    : <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        {user.profile?.username?.charAt(0).toUpperCase() || 'U'}
                    </div> 
                  }
                </button>

                {isUserMenuOpen && (
                  <div className="absolute bg-[hsl(var(--background))]/95 right-0 mt-2 w-48 bg-popover border rounded-md shadow-lg py-1 z-50">
                    <Link
                      href={"/blog/manage"}
                      className="block px-4 py-2 text-sm hover:bg-[hsl(var(--accent))]"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-[hsl(var(--accent))] flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/blog/login"
                  className="px-4 py-2 rounded-md text-sm font-medium hover:bg-[hsl(var(--accent))]"
                >
                  Logar-se
                </Link>
                <Link
                  href="/blog/register"
                  className="px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md text-sm font-medium hover:opacity-90"
                >
                  Registrar-se
                </Link>
              </div>
            )}

            {/* Mobile menu btn*/}
            <button
              className="md:hidden p-2 rounded-md hover:bg-[hsl(var(--accent))]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-2 flex gap-2 py-1 hover:bg-[hsl(var(--accent))] rounded-md ${
                    pathname === item.href ? 'text-[hsl(var(--foreground))] font-bold' : 'text-[hsl(var(--foreground))]/70'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className='w-4' />
                  {item.name}
                </Link>
              ))}

              <form onSubmit={handleSearch} className="px-2 pt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))] w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar artigos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-[hal(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                  />
                </div>
              </form>

              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link
                    href="/blog/login"
                    className="px-2 py-2 text-center rounded-md hover:bg-[hsl(var(--accent))]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Logar-se
                  </Link>
                  <Link
                    href="/blog/register"
                    className="px-2 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-center rounded-md hover:opacity-90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrar-se
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
