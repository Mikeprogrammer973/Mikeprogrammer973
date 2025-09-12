"use client"

import Link from 'next/link'
import { ArrowRight, Clock, Cloud, Code, Database, Palette, Server, Smartphone, Star, TrendingUp } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { IncomingProjectCard, ProjectCard } from 'mdp/components/ui/project/cards'
import { supabase } from 'mdp/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Profile, Project, Skill } from 'mdp/lib/supabase/types/database'
import { Spinner } from 'mdp/components/ui/spinner'

interface Skills {
    frontend: Skill[]
    backend: Skill[]
    database: Skill[]
    mobile: Skill[]
    design: Skill[]
    devops: Skill[]
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [incomingProjects, setIncomingProjects] = useState<Project[]>([])
  const [skillsByCategory, setSkillsByCategory] = useState<Skills>({
    frontend: [],
    backend: [],
    database: [],
    mobile: [],
    design: [],
    devops: []
  })
  const [profile, setProfile] = useState<Profile>()

  const categories = [
    { id: 'frontend', label: 'Frontend', icon: Code, color: 'bg-blue-500' },
    { id: 'backend', label: 'Backend', icon: Server, color: 'bg-green-500' },
    { id: 'database', label: 'Database', icon: Database, color: 'bg-orange-500' },
    { id: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-purple-500' },
    { id: 'design', label: 'Design', icon: Palette, color: 'bg-pink-500' },
    { id: 'devops', label: 'DevOps', icon: Cloud, color: 'bg-cyan-500' }
  ]

  useEffect(() => {
    fetchProfile()
    fetchFeaturedProjects()
    fetchIncomingProjects()
    fetchSkills()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*').single()

      if (error) throw error

      setProfile(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchFeaturedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      setFeaturedProjects(data || [])
    } catch (error) {
      console.error('Error fetching featured projects:', error)
    }
  }

  const fetchIncomingProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'draft')
        .order('created_at', { ascending: false })

      if (error) throw error

      setIncomingProjects(data || [])
    } catch (error) {
      console.error('Error fetching incoming projects:', error)
    }
  }

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('featured', true)

      if (error) throw error

      const skillsByCategory: Skills = {
        frontend: data.filter(skill => skill.category === 'frontend'),
        backend: data.filter(skill => skill.category === 'backend'),
        database: data.filter(skill => skill.category === 'database'),
        mobile: data.filter(skill => skill.category === 'mobile'),
        design: data.filter(skill => skill.category === 'design'),
        devops: data.filter(skill => skill.category === 'devops')
      }

      setSkillsByCategory(skillsByCategory)
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="flex flex-col items-center text-center py-20">
        <div className="animate-fade-in-up mb-6">
          <div className="w-32 h-32 lg:w-48 lg:h-48 p-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            <img className='w-full h-full object-cover rounded-full' src={profile?.photo_url} alt="profile" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {profile?.title.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">{profile?.title.slice(profile?.title.split(' ')[0].length)}</span>
        </h1>
        
        <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {profile?.slogans[1]}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Button asChild size="lg" className="rounded-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Link href="/projects">
              Explorar Projetos <ArrowRight className="ml-2 h-4 w-4 inline-block" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full border-2">
            <Link href="/contact">
              Entrar em Contato
            </Link>
          </Button>
        </div>
      </section>

      {featuredProjects.length > 0 && <section className="py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 mr-2" />
            Projetos em Destaque
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trabalhos Recentes</h2>
          <p className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Confira alguns dos projetos que demonstram minha expertise em desenvolvimento full-stack
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" className="rounded-full border-2" size="lg">
            <Link href="/projects">
              Ver Todos os Projetos
              <ArrowRight className="ml-2 h-4 w-4 inline-block" />
            </Link>
          </Button>
        </div>
      </section>}

      {incomingProjects.length > 0 && <section className="py-20 bg-muted/30 rounded-3xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
            <Clock className="w-4 h-4 mr-2" />
            Em Desenvolvimento
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Próximos Projetos</h2>
          <p className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Confira o que estou construindo atualmente e os projetos que estão por vir
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {incomingProjects.map((project, index) => (
            <IncomingProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </section>}

      {Object.values(skillsByCategory).flat().length > 0 && <section className="py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1 bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Habilidades Técnicas
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tecnologias que Domino</h2>
          <p className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Conjunto de habilidades técnicas que utilizo para criar soluções robustas e escaláveis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {Object.entries(skillsByCategory).map(([category, skills], categoryIndex) => (
            <div key={category} className="animate-fade-in-up" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
              <h3 translate="no" className="text-xl font-semibold mb-6 text-[hsl(var(--foreground))] flex items-center">
                <span className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full mr-3"></span>
                {categories.find(c => c.id === category)?.label}
              </h3>
              <div className="space-y-4">
                {skills.map((skill: Skill) => {
                  const Icon = categories.find(c => c.id === skill.category)?.icon || Code
                  return (
                    <div key={skill.name} className="flex items-center justify-between p-4 bg-[hsl(var(--card))] rounded-xl border hover-lift transition-all duration-300">
                      <div className="flex items-center space-x-3">
                        <div style={{backgroundColor: `${skill.color}`}} className={`w-12 h-12 rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span translate="no" className="font-medium">{skill.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000" 
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-[hsl(var(--muted-foreground))] w-8">
                          {skill.proficiency}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="rounded-full border-2">
            <Link href="/skills">
              Ver Todas as Habilidades
              <ArrowRight className="ml-2 h-4 w-4 inline-block" />
            </Link>
          </Button>
        </div>
      </section>}
    </div>
  )
}
