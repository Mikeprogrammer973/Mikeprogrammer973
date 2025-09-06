
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
import { Spinner } from 'mdp/components/ui/spinner'

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
  status: string
  dev_stage: string
  stage_progress: number
  pro_date: string
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
  const [dev_stage, setDev_stage] = useState<number[]>([1, 0])
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

      switch (projectData?.dev_stage) {
        case 'planning_structure':
          setDev_stage([1, (projectData?.stage_progress / 500) * 100])
          break
        case 'planning_design':
          setDev_stage([2, ((100 + projectData?.stage_progress) / 500) * 100])
          break
        case 'development':
          setDev_stage([3, ((200 + projectData?.stage_progress) / 500) * 100])
          break
        case 'testing':
          setDev_stage([4, ((300 + projectData?.stage_progress) / 500) * 100])
          break
        case 'production_setup':
          setDev_stage([5, ((400 + projectData?.stage_progress) / 500) * 100])
          break
      }

      const { data: relatedData, error: relatedError } = await supabase
        .from('projects')
        .select('id, title, slug, description, image_url, category')
        .eq('status', project?.status)
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
    return <Spinner />
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Projeto não encontrado</h1>
          <Link href="/projects" className="text-blue-400 hover:text-blue-300">
            Voltar para projetos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <header className="relative overflow-hidden">
        <div className="p-6">
          <div className="container mx-auto">
            <Link
              href="/projects"
              className="inline-flex items-center text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para projetos
            </Link>
            
            <h1 translate='no' className="text-4xl md:text-5xl font-bold mb-4 flex gap-2 items-center">
              {project.image_url && (
                <img
                  src={project.image_url || ''}
                  alt={project.title}
                  className="hidden sm:flex w-10 h-10 md:w-12 md:h-12 rounded-full"
                />
              )}
              {project.title}
            </h1>
            
            <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-3xl">
              {project.description}
            </p>

            <div className="mt-10 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">Progresso Geral</span>
                <span className="text-sm font-bold text-[hsl(var(--primary))]">{dev_stage[1].toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-2.5">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-1000" style={{width: `${dev_stage[1]}%`}}></div>
              </div>
            </div>

            {/* Timeline de fases */}
            <div className="space-y-4">
              {/*<!-- Fase 1: Planejamento -->*/}
              <div className="flex items-center">
                <div className="flex-shrink-0 relative">
                  {dev_stage[0] === 1
                    ? (<><div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </div><div className="absolute -bottom-6 left-4 w-0.5 h-6 bg-[hsl(var(--border))]"></div></>)
                    : (<><div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div><div className="absolute -bottom-6 left-4 w-0.5 h-6 bg-green-500"></div></>)
                  }
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-[hsl(var(--foreground))]">Planejamento</h4>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Definição de requisitos e escopo</p>
                  {dev_stage[0] === 1 && <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-1.5 mt-1">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{width: `${project.stage_progress}%`}}></div>
                  </div>}
                </div>
                {dev_stage[0] === 1 ? <span className="text-sm text-blue-500 font-medium">{project.stage_progress}%</span> : <span className="text-sm text-green-500 font-medium">Concluído</span>}
              </div>

              {/*<!-- Fase 2: Design -->*/}
              <div className="flex items-center">
                <div className="flex-shrink-0 relative">
                  {dev_stage[0] === 2
                    ? (<><div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </div><div className="absolute -bottom-6 left-4 w-0.5 h-6 bg-[hsl(var(--border))]"></div></>)
                    : (dev_stage[0] > 2
                      ? (<><div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div><div className="absolute -bottom-6 left-4 w-0.5 h-6 bg-green-500"></div></>)
                      : (<><div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div><div className="absolute -bottom-6 left-4 w-0.5 h-6 bg-[hsl(var(--border))]"></div></>)
                    )
                  }
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-[hsl(var(--foreground))]">Design</h4>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Criação de interfaces e UX</p>
                  {dev_stage[0] === 2 && <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-1.5 mt-1">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{width: `${project.stage_progress}%`}}></div>
                  </div>}
                </div>
                {dev_stage[0] === 2 ? <span className="text-sm text-blue-500 font-medium">{project.stage_progress}%</span> : (dev_stage[0] > 2 ? <span className="text-sm text-green-500 font-medium">Concluído</span> : <span className="text-sm text-[hsl(var(--muted-foreground))]">Pendente</span>)}
              </div>

              {/*<!-- Fase 3: Desenvolvimento -->*/}
              <div className="flex items-center">
                <div className="flex-shrink-0 relative">
                  {dev_stage[0] === 3
                    ? (<><div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </div><div className="absolute -bottom-6 left-4 w-0.5 h-6 bg-[hsl(var(--border))]"></div></>)
                    : (dev_stage[0] > 3
                      ? (<><div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div><div className="absolute -bottom-6 left-4 w-0.5 h-6 bg-green-500"></div></>)
                      : (<><div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div><div className="absolute -bottom-6 left-4 w-0.5 h-6 bg-[hsl(var(--border))]"></div></>)
                    )
                  }
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-[hsl(var(--foreground))]">Desenvolvimento</h4>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Implementação das funcionalidades</p>
                  {dev_stage[0] === 3 && <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-1.5 mt-1">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{width: `${project.stage_progress}%`}}></div>
                  </div>}
                </div>
                {dev_stage[0] === 3 ? <span className="text-sm text-blue-500 font-medium">{project.stage_progress}%</span> : (dev_stage[0] > 3 ? <span className="text-sm text-green-500 font-medium">Concluído</span> : <span className="text-sm text-[hsl(var(--muted-foreground))]">Pendente</span>)}
              </div>

              {/*<!-- Fase 4: Teste -->*/}
              <div className="flex items-center">
                <div className="flex-shrink-0 relative">
                  {dev_stage[0] === 4
                    ? (<><div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </div><div className="absolute -bottom-6 left-4 w-0.5 h-6 bg-[hsl(var(--border))]"></div></>)
                    : (dev_stage[0] > 4
                      ? (<><div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div><div className="absolute -bottom-6 left-4 w-0.5 h-6 bg-green-500"></div></>)
                      : (<><div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div><div className="absolute -bottom-6 left-4 w-0.5 h-6 bg-[hsl(var(--border))]"></div></>)
                    )
                  }
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-[hsl(var(--muted-foreground))]">Teste</h4>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Testes de qualidade e validação</p>
                  {dev_stage[0] === 4 && <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-1.5 mt-1">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{width: `${project.stage_progress}%`}}></div>
                  </div>}
                </div>
                {dev_stage[0] === 4 ? <span className="text-sm text-blue-500 font-medium">{project.stage_progress}%</span> : (dev_stage[0] > 4 ? <span className="text-sm text-green-500 font-medium">Concluído</span> : <span className="text-sm text-[hsl(var(--muted-foreground))]">Pendente</span>)}
              </div>

              {/*<!-- Fase 5: Revisão Final -->*/}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {dev_stage[0] === 5
                    ? (<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </div>)
                    : (<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>)
                  }
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-[hsl(var(--muted-foreground))]">Revisão Final</h4>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Ajustes finais e preparação para lançamento</p>
                {dev_stage[0] === 5 && <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-1.5 mt-1">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{width: `${project.stage_progress}%`}}></div>
                  </div>}
                </div>
                {dev_stage[0] === 5 ? <span className="text-sm text-blue-500 font-medium">{project.stage_progress}%</span> : <span className="text-sm text-[hsl(var(--muted-foreground))]">Pendente</span>}
              </div>
            </div>

          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(project.created_at)}
          </div>
          
          {project.category && (
            <span translate='no' className="px-3 py-1 bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))] rounded-full">
              {project.category}
            </span>
          )}

          <button
            onClick={shareProject}
            className="flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </button>
        </div>

        {/* conteudo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <article className="prose prose-invert prose-lg max-w-none">
              <div 
                className="text-[hsl(var(--muted-foreground))] leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: project.content || '<p>Conteúdo em breve...</p>' 
                }}
              />
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* techs */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="bg-[hsl(var(--card))] rounded-2xl p-6 border border-[hsl(var(--border))]">
                <h3 className="text-lg font-semibold mb-4">Tecnologias</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      translate='no'
                      key={index}
                      className="px-3 py-1 bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))] rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="bg-[hsl(var(--card))] rounded-2xl p-6 border border-[hsl(var(--border))]">
              <h3 translate='no' className="text-lg font-semibold mb-4">Links</h3>
              <div className="space-y-3">
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-[hsl(var(--secondary))] rounded-lg hover:bg-[hsl(var(--secondary)/0.8)] transition-colors"
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
                    className="flex items-center justify-between p-3 bg-[hsl(var(--secondary))] rounded-lg hover:bg-[hsl(var(--secondary)/0.8)] transition-colors"
                  >
                    <span>Ver código no GitHub</span>
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* detalhes */}
            <div className="bg-[hsl(var(--card))] rounded-2xl p-6 border border-[hsl(var(--border))]">
              <h3 className="text-lg font-semibold mb-4">Detalhes</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-[hsl(var(--muted-foreground))]">Categoria</dt>
                  <dd translate='no' className="text-[hsl(var(--foreground))]">{project.category || '...'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[hsl(var(--muted-foreground))]">
                    {!(project.status === 'draft') ? 'Data de publicação' : 'Data de criação'}
                  </dt>
                  <dd className="text-[hsl(var(--foreground))]">{formatDate(project.created_at)}</dd>
                </div>
                {project.status === 'draft' && <div>
                  <dt className="text-sm text-[hsl(var(--muted-foreground))]">
                    Previsão de conclusão
                  </dt>
                  <dd className="text-[hsl(var(--primary))]">{formatDate(project.pro_date)}</dd>
                </div>}
                <div>
                  <dt className="text-sm text-[hsl(var(--muted-foreground))]">Última atualização</dt>
                  <dd className="text-[hsl(var(--foreground))]">{formatDate(project.updated_at)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* projetos relacionados */}
        {relatedProjects.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Projetos Relacionados</h2>
              <Link 
                href="/projects"
                className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary)/0.8)] text-sm"
              >
                Ver todos
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.slug}`}
                  className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden hover:border-[hsl(var(--primary))] transition-colors group"
                >
                  {relatedProject.image_url && (
                    <img
                      translate='no'
                      src={relatedProject.image_url}
                      alt={relatedProject.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="p-6">
                    {relatedProject.category && (
                      <span translate='no' className="inline-block px-2 py-1 bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))] rounded-full text-xs mb-3">
                        {relatedProject.category}
                      </span>
                    )}
                    <h3 translate='no' className="text-lg font-semibold mb-2 group-hover:text-[hsl(var(--primary))] transition-colors">
                      {relatedProject.title}
                    </h3>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm line-clamp-2">
                      {relatedProject.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Gostou deste projeto?</h2>
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
