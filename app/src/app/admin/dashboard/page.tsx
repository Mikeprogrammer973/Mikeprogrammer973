
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Briefcase,
  Code2,
  MessageSquare,
  FileText,
  Eye,
  TrendingUp,
  Calendar,
  Plus,
  Search
} from 'lucide-react'
import { supabase } from 'mdp/lib/supabase/client'

interface Stats {
  projects: number
  skills: number
  messages: number
  blogPosts: number
  unreadMessages: number
}

interface RecentActivity {
  id: string
  type: string
  title: string
  description: string
  time: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> 
  color: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    messages: 0,
    blogPosts: 0,
    unreadMessages: 0
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
    }
  }

  const fetchData = async () => {
    try {
      // Fetch dados
      const [
        { count: projects },
        { count: skills },
        { count: messages },
        { count: blogPosts },
        { count: unreadMessages }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('read', false)
      ])

      setStats({
        projects: projects || 0,
        skills: skills || 0,
        messages: messages || 0,
        blogPosts: blogPosts || 0,
        unreadMessages: unreadMessages || 0
      })

      // teste recent activities
      setRecentActivities([
        {
          id: '1',
          type: 'project',
          title: 'Novo projeto criado',
          description: 'E-commerce Platform foi adicionado',
          time: '2 horas atrás',
          icon: Briefcase,
          color: 'text-blue-400'
        },
        {
          id: '2',
          type: 'message',
          title: 'Nova mensagem',
          description: 'De: joao@email.com - Solicitação de orçamento',
          time: '5 horas atrás',
          icon: MessageSquare,
          color: 'text-green-400'
        },
        {
          id: '3',
          type: 'skill',
          title: 'Habilidade atualizada',
          description: 'React - 95% de proficiency',
          time: '1 dia atrás',
          icon: Code2,
          color: 'text-purple-400'
        },
        {
          id: '4',
          type: 'blog',
          title: 'Novo post publicado',
          description: 'Como otimizar performance no Next.js',
          time: '2 dias atrás',
          icon: FileText,
          color: 'text-orange-400'
        }
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      <header className="bg-gray-900 border-b border-gray-800 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Bem-vindo de volta, Administrador</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{stats.projects}</h3>
            <p className="text-gray-400">Projetos</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-green-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Code2 className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{stats.skills}</h3>
            <p className="text-gray-400">Habilidades</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-orange-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">{stats.unreadMessages}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">{stats.messages}</h3>
            <p className="text-gray-400">Mensagens</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-purple-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{stats.blogPosts}</h3>
            <p className="text-gray-400">Posts do Blog</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent atividades */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Atividade Recente</h2>
              <button className="text-blue-400 hover:text-blue-300 text-sm">
                Ver tudo
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                  <div className={`p-2 rounded-lg ${activity.color} bg-opacity-10`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{activity.title}</h4>
                    <p className="text-gray-400 text-sm">{activity.description}</p>
                    <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-6">Ações Rápidas</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/admin/projects/new')}
                className="flex items-center space-x-3 p-4 rounded-lg bg-blue-600/10 border border-blue-500/20 hover:border-blue-500 transition-colors group"
              >
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-white group-hover:text-blue-300">Novo Projeto</h4>
                  <p className="text-gray-400 text-sm">Adicionar projeto</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/admin/blog/new')}
                className="flex items-center space-x-3 p-4 rounded-lg bg-purple-600/10 border border-purple-500/20 hover:border-purple-500 transition-colors group"
              >
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-white group-hover:text-purple-300">Novo Post</h4>
                  <p className="text-gray-400 text-sm">Criar artigo</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/admin/skills/new')}
                className="flex items-center space-x-3 p-4 rounded-lg bg-green-600/10 border border-green-500/20 hover:border-green-500 transition-colors group"
              >
                <div className="p-2 bg-green-500 rounded-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-white group-hover:text-green-300">Nova Skill</h4>
                  <p className="text-gray-400 text-sm">Adicionar habilidade</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/admin/messages')}
                className="flex items-center space-x-3 p-4 rounded-lg bg-orange-600/10 border border-orange-500/20 hover:border-orange-500 transition-colors group"
              >
                <div className="p-2 bg-orange-500 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-white group-hover:text-orange-300">Ver Mensagens</h4>
                  <p className="text-gray-400 text-sm">{stats.unreadMessages} não lidas</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Estatísticas do Site</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Últimos 30 dias</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-800/50 rounded-lg">
              <div className="text-3xl font-bold text-blue-400 mb-2">1.2K</div>
              <p className="text-gray-400">Visitantes</p>
            </div>
            <div className="text-center p-6 bg-gray-800/50 rounded-lg">
              <div className="text-3xl font-bold text-green-400 mb-2">84%</div>
              <p className="text-gray-400">Taxa de Retenção</p>
            </div>
            <div className="text-center p-6 bg-gray-800/50 rounded-lg">
              <div className="text-3xl font-bold text-purple-400 mb-2">2.4m</div>
              <p className="text-gray-400">Tempo de Sessão</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}