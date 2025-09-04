
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Grid,
  List,
  ArrowUpDown
} from 'lucide-react'
import { supabase } from 'mdp/lib/supabase/client'
import { useAuth } from 'mdp/hooks/useAuth'
import { Spinner } from 'mdp/components/ui/spinner'

interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  image_url: string | null
  category: string | null
  status: string
  featured: boolean
  created_at: string
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [_loading, setLoading] = useState(true)
  const { session, loading } = useAuth(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'created_at' | 'title'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setProjects(projects.filter(project => project.id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Erro ao excluir projeto')
    }
  }

  const filteredProjects = projects
    .filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(project => 
      statusFilter === 'all' || project.status === statusFilter
    )
    .sort((a, b) => {
      if (sortBy === 'created_at') {
        return sortOrder === 'asc' 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      }
    })

  if (loading || _loading) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Projetos</h1>
          <p className="text-gray-400">{projects.length} projetos encontrados</p>
        </div>
        
        <Link
          href="/admin/projects/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </Link>
      </div>

      {/* filtros e busca */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os status</option>
            <option value="published">Publicado</option>
            <option value="draft">Rascunho</option>
            <option value="archived">Arquivado</option>
          </select>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ordenar por */}
        <div className="flex items-center space-x-4 mt-4">
          <span className="text-gray-400">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'created_at' | 'title')}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="created_at">Data de criação</option>
            <option value="title">Título</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-blue-500 transition-colors">
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === 'published' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {project.status === 'published' ? 'Publicado' :
                   project.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                </span>
                {project.featured && (
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                    Destaque
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {project.description || 'Sem descrição'}
              </p>

              {project.category && (
                <span className="inline-block px-2 py-1 bg-gray-800 text-gray-400 rounded-full text-xs mb-4">
                  {project.category}
                </span>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push(`/admin/projects/edit/${project.id}`)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                
                <button
                  onClick={() => router.push(`/projects/${project.slug}`)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-gray-700 hover:bg-gray-600 py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Visualizar</span>
                </button>
                
                <button
                  onClick={() => deleteProject(project.id)}
                  className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* list */
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-4 text-left text-gray-400">Projeto</th>
                <th className="p-4 text-left text-gray-400">Categoria</th>
                <th className="p-4 text-left text-gray-400">Status</th>
                <th className="p-4 text-left text-gray-400">Data</th>
                <th className="p-4 text-left text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      {project.image_url && (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <div className="font-medium">{project.title}</div>
                        <div className="text-gray-400 text-sm line-clamp-1">
                          {project.description || 'Sem descrição'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {project.category && (
                      <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded-full text-xs">
                        {project.category}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.status === 'published' ? 'bg-green-500/20 text-green-400' :
                      project.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {project.status === 'published' ? 'Publicado' :
                       project.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                    </span>
                    {project.featured && (
                      <span className="ml-2 px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                        Destaque
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(project.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/admin/projects/edit/${project.id}`)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/projects/${project.slug}`)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">Nenhum projeto encontrado</div>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeiro Projeto</span>
          </Link>
        </div>
      )}
    </div>
  )
}