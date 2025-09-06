
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Grid, 
  List,
  ExternalLink,
  Github,
  Star
} from 'lucide-react'
import { supabase } from 'mdp/lib/supabase/client'
import { Spinner } from 'mdp/components/ui/spinner'

interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  image_url: string | null
  technologies: string[]
  project_url: string | null
  github_url: string | null
  category: string | null
  status: string
  featured: boolean
  created_at: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'created_at' | 'title'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterAndSortProjects()
  }, [projects, searchTerm, categoryFilter, sortBy, sortOrder])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setProjects(data || [])
      
      // Extrair categorias únicas
      const uniqueCategories = Array.from(
        new Set(data?.map(project => project.category).filter(Boolean) as string[])
      )
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProjects = () => {
    let filtered = projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => 
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.category === categoryFilter)
    }

    filtered.sort((a, b) => {
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

    setFilteredProjects(filtered)
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
     <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Meus Projetos</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Explore meus trabalhos mais recentes e descubra como posso ajudar no seu próximo projeto
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* filtros e busca */}
        <div className="bg-[hsl(var(--card))] rounded-2xl p-6 border border-[hsl(var(--border))] shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="w-5 h-5 text-[hsl(var(--muted-foreground))] absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar projetos por título, descrição ou tecnologias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg pl-10 pr-4 py-3 text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all"
            >
              <option value="all">Todas as categorias</option>
              {categories.map(category => (
                <option translate='no' key={category} value={category}>{category}</option>
              ))}
            </select>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md' 
                      : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md' 
                      : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'created_at' | 'title')}
                className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg px-3 py-2 text-[hsl(var(--foreground))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all"
              >
                <option value="created_at">Data</option>
                <option value="title">Título</option>
              </select>
            </div>
          </div>
        </div>

        {/* projetos Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className={"bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group" + (project.status === 'draft' ? ' border-dashed border-2' : '')}>
                {project.image_url && (
                  <div translate='no' className="relative h-48 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    {project.category && (
                      <span translate='no' className="px-3 py-1.5 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-xs font-medium">
                        {project.category}
                      </span>
                    )}
                    {project.featured && (
                      <span translate='no' className="px-3 py-1.5 bg-amber-200 text-amber-600 rounded-full text-xs font-medium">
                        <Star className="w-4 h-4 mr-1" />
                      </span>
                    )}
                  </div>

                  <h3 translate='no' className="text-xl font-semibold mb-2 group-hover:text-[hsl(var(--primary))] transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-[hsl(var(--muted-foreground))] mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span
                          translate='no'
                          key={index}
                          className="px-2.5 py-1 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2.5 py-1 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] rounded-full text-xs">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 text-sm font-medium transition-colors"
                    >
                      Ver detalhes →
                    </Link>
                    
                    <div className="flex items-center space-x-2">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors rounded-lg hover:bg-[hsl(var(--secondary))]"
                          title="Ver projeto online"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors rounded-lg hover:bg-[hsl(var(--secondary))]"
                          title="Ver código no GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4 mb-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className={"bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-6 hover:shadow-md transition-all" + (project.status === 'draft' ? ' border-dashed border-2' : '')}>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {project.image_url && (
                    <div className="w-full md:w-48 h-32 overflow-hidden rounded-lg">
                      <img
                        translate='no'
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {project.category && (
                        <span translate='no' className="px-3 py-1.5 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-xs font-medium">
                          {project.category}
                        </span>
                      )}
                      {project.featured && (
                        <span className="px-3 py-1.5 bg-amber-200 text-amber-600 rounded-full text-xs font-medium">
                          <Star className="w-4 h-4 mr-1" />
                        </span>
                      )}
                    </div>

                    <h3 translate='no' className="text-xl font-semibold mb-2 hover:text-[hsl(var(--primary))] transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-[hsl(var(--muted-foreground))] mb-3">{project.description}</p>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                          <span
                            translate='no'
                            key={index}
                            className="px-2.5 py-1 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] rounded-full text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 text-sm font-medium transition-colors"
                      >
                        Ver detalhes →
                      </Link>
                      
                      <div className="flex items-center space-x-2">
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors rounded-lg hover:bg-[hsl(var(--secondary))]"
                            title="Ver projeto online"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors rounded-lg hover:bg-[hsl(var(--secondary))]"
                            title="Ver código no GitHub"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-[hsl(var(--muted))]/50 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[hsl(var(--primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
              <p className="text-[hsl(var(--muted-foreground))] mb-4">
                {categoryFilter === 'all' 
                  ? 'Ainda não há projetos publicados.' 
                  : (<span>Nenhum projeto na categoria<span translate='no'> {categoryFilter}.</span></span>)
                }
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('all')
                }}
                className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 font-medium"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Pronto para começar seu projeto?</h2>
          <p className="text-blue-100 mb-6">
            Vamos transformar suas ideias em realidade
          </p>
          <Link
            href="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block"
          >
            Entrar em Contato
          </Link>
        </div>
      </main>
    </div>
  )
}
