
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
  Plus,
  Bell
} from 'lucide-react'
import { supabase } from 'mdp/lib/supabase/client'
import { useAuth } from 'mdp/hooks/useAuth'
import { Spinner } from 'mdp/components/ui/spinner'

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
  const [_loading, setLoading] = useState(true)
  const { session, loading } = useAuth(true)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

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

      //
      const [
        { data: __projects },
        { data: __skills },
        { data: __messages },
        { data: __blogPosts },
        { data: __unreadMessages }
      ] = await Promise.all([
        supabase.from('projects').select('*').limit(5),
        supabase.from('skills').select('*').limit(5),
        supabase.from('messages').select('*').limit(5),
        supabase.from('blog_posts').select('*').limit(5),
        supabase.from('messages').select('*').limit(5)
      ])
      setRecentActivities([
        ...(__projects || []).map((project) => ({
          id: project.id,
          type: 'project',
          title: project.title,
          description: project.description,
          time: `${((new Date().getTime() - new Date(project.created_at).getTime()) / 1000 / 60 / 60).toFixed(0)} horas atrás`,
          icon: Briefcase,
          color: 'text-blue-400'
        })),
        ...(__skills || []).map((skill) => ({
          id: skill.id,
          type: 'skill',
          title: skill.name,
          description: `${skill.category} - ${skill.proficiency}% de proficiency`,
          time: `${((new Date().getTime() - new Date(skill.created_at).getTime()) / 1000 / 60 / 60).toFixed(0)} horas atrás`,
          icon: Code2,
          color: 'text-green-400'
        })),
        ...(__messages || []).map((message) => ({
          id: message.id,
          type: 'message',
          title: message.name,
          description: `${message.type} - ${message.subject}`,
          time: `${((new Date().getTime() - new Date(message.created_at).getTime()) / 1000 / 60 / 60).toFixed(0)} horas atrás`,
          icon: MessageSquare,
          color: 'text-orange-400'
        })),
        ...(__blogPosts || []).map((blogPost) => ({
          id: blogPost.id,
          type: 'blog',
          title: blogPost.title,
          description: blogPost.excerpt,
          time: `${((new Date().getTime() - new Date(blogPost.created_at).getTime()) / 1000 / 60 / 60).toFixed(0)} horas atrás`,
          icon: FileText,
          color: 'text-purple-400'
        }))
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading ||_loading) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      <header className="border-b border-gray-800 p-6">
        <div>
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
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

        <div className="grid grid-cols-1 gap-6">
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
                onClick={() => router.push('/admin/newsletter')}
                className="flex items-center space-x-3 p-4 rounded-lg bg-purple-600/10 border border-purple-500/20 hover:border-purple-500 transition-colors group"
              >
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-white group-hover:text-purple-300">Newsletter</h4>
                  <p className="text-gray-400 text-sm">Ver inscrições</p>
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

          {/* Recent atividades */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Atividade Recente</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </main>
    </div>
  )
}
