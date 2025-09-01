
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Calendar,
  Share2
} from 'lucide-react'
import { supabase } from 'mdp/lib/supabase/client'

interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  image_url: string | null
  technologies: string[]
  project_url: string | null
  github_url: string | null
  category: string | null
  created_at: string
  updated_at: string
}

interface RelatedProject {
  id: string
  title: string
  slug: string
  description: string | null
  image_url: string | null
  category: string | null
}

export default function ProjectPage() {
  const [project, setProject] = useState<Project | null>(null)
  const [relatedProjects, setRelatedProjects] = useState<RelatedProject[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  useEffect(() => {
    fetchProject()
  }, [slug])

  const fetchProject = async () => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

      if (projectError) throw projectError
      if (!projectData) {
        router.push('/projects')
        return
      }

      setProject(projectData)

      const { data: relatedData, error: relatedError } = await supabase
        .from('projects')
        .select('id, title, slug, description, image_url, category')
        .eq('status', 'published')
        .neq('slug', slug)
        .eq('category', projectData.category)
        .limit(3)
        .order('created_at', { ascending: false })

      if (!relatedError) {
        setRelatedProjects(relatedData || [])
      }

      // Registrar visualização
      await supabase.rpc('increment_blog_view', { post_id: projectData.id })

    } catch (error) {
      console.error('Error fetching project:', error)
      router.push('/projects')
    } finally {
      setLoading(false)
    }
  }

  const shareProject = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.title,
          text: project?.description || '',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Projeto não encontrado</h1>
          <Link href="/projects" className="text-blue-400 hover:text-blue-300">
            Voltar para projetos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="relative h-96 overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-4xl font-bold text-white">
              {project.title.charAt(0)}
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <Link
              href="/projects"
              className="inline-flex items-center text-sm text-gray-300 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para projetos
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
            
            <p className="text-xl text-gray-300 max-w-3xl">
              {project.description}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(project.created_at)}
          </div>
          
          {project.category && (
            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full">
              {project.category}
            </span>
          )}

          <button
            onClick={shareProject}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <article className="prose prose-invert prose-lg max-w-none">
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: project.content || '<p>Conteúdo em breve...</p>' 
                }}
              />
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Tecnologias</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <div className="space-y-3">
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <span>Ver projeto online</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <span>Ver código no GitHub</span>
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Detalhes</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-400">Categoria</dt>
                  <dd className="text-white">{project.category || 'Não especificado'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Publicado em</dt>
                  <dd className="text-white">{formatDate(project.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Última atualização</dt>
                  <dd className="text-white">{formatDate(project.updated_at)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Projetos Relacionados</h2>
              <Link 
                href="/projects"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Ver todos
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.slug}`}
                  className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-blue-500 transition-colors group"
                >
                  {relatedProject.image_url && (
                    <img
                      src={relatedProject.image_url}
                      alt={relatedProject.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="p-6">
                    {relatedProject.category && (
                      <span className="inline-block px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs mb-3">
                        {relatedProject.category}
                      </span>
                    )}
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                      {relatedProject.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {relatedProject.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Gostou deste projeto?</h2>
          <p className="text-blue-100 mb-6">
            Vamos trabalhar juntos no seu próximo projeto!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Entrar em Contato
            </Link>
            <Link
              href="/projects"
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Ver Mais Projetos
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}