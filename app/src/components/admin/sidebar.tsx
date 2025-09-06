
'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Code2,
  MessageSquare,
  FileText,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { supabase } from 'mdp/lib/supabase/client'

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> 
  submenu?: { name: string; href: string }[]
}

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const pathname = usePathname()
  const router = useRouter()

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard
    },
    {
      name: 'Projetos',
      href: '/admin/projects',
      icon: Briefcase,
      submenu: [
        { name: 'Todos', href: '/admin/projects' },
        { name: 'Novo', href: '/admin/projects/new' },
        { name: 'Categorias', href: '/admin/projects/categories' }
      ]
    },
    {
      name: 'Habilidades',
      href: '/admin/skills',
      icon: Code2,
      submenu: [
        { name: 'Todas', href: '/admin/skills' },
        { name: 'Nova', href: '/admin/skills/new' },
        { name: 'Categorias', href: '/admin/skills/categories' }
      ]
    },
    {
      name: 'Mensagens',
      href: '/admin/messages',
      icon: MessageSquare
    },
    {
      name: 'Blog',
      href: '/admin/blog',
      icon: FileText,
      submenu: [
        { name: 'Todos os Posts', href: '/admin/blog' },
        { name: 'Novo Post', href: '/admin/blog/new' },
        { name: 'Categorias', href: '/admin/blog/categories' }
      ]
    },
    {
      name: 'Configurações',
      href: '/admin/settings',
      icon: Settings,
      submenu: [
        { name: 'Geral', href: '/admin/settings/general' },
        { name: 'Aparência', href: '/admin/settings/appearance' },
        { name: 'Usuários', href: '/admin/settings/users' }
      ]
    }
  ]

  const toggleSubmenu = (itemName: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName)
    } else {
      newExpanded.add(itemName)
    }
    setExpandedItems(newExpanded)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile fundo */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 min-h-screen bg-gray-900 border-r border-gray-800 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0
          w-80
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">mdp</span>
            </div>
            <span className="text-white font-bold text-lg">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {menuItems.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isExpanded = expandedItems.has(item.name)
            const isItemActive = isActive(item.href) || (hasSubmenu && item.submenu!.some(sub => isActive(sub.href)))

            return (
              <div key={item.name}>
                <button
                  onClick={() => hasSubmenu ? toggleSubmenu(item.name) : router.push(item.href)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
                    ${isItemActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {hasSubmenu && (
                    isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  )}
                </button>

                {hasSubmenu && isExpanded && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu!.map((subItem) => (
                      <button
                        key={subItem.name}
                        onClick={() => router.push(subItem.href)}
                        className={`
                          w-full flex items-center p-2 rounded-lg transition-all duration-200
                          ${isActive(subItem.href)
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:text-white'
                          }
                        `}
                      >
                        <span className="text-sm">{subItem.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">Administrador</p>
              <p className="text-gray-400 text-xs truncate">admin@exemplo.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 p-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {!isOpen && <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-600/60 hover:text-indigo-200 p-2 rounded-lg text-indigo-500"
      >
        <Menu className="w-6 h-6" />
      </button>}
    </>
  )
}
