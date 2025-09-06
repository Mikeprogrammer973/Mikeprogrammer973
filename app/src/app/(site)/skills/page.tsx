
'use client'

import { useEffect, useState } from 'react'
import { 
  Code, 
  Palette, 
  Database, 
  Server, 
  Smartphone, 
  Zap,
  BarChart3,
  Cloud,
  GitBranch,
  Cpu,
  ArrowRight,
  Filter,
  Search,
  Star,
  TrendingUp,
  Award,
  Target
} from 'lucide-react'
import { Button } from 'mdp/components/ui/button'
import Link from 'next/link'
import { Skill } from 'mdp/lib/supabase/types/database'
import { supabase } from 'mdp/lib/supabase/client'
import { Spinner } from 'mdp/components/ui/spinner'

interface Skills {
    frontend: Skill[]
    backend: Skill[]
    database: Skill[]
    mobile: Skill[]
    design: Skill[]
    devops: Skill[]
}

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [skills, setSkills] = useState<Skills>({
    frontend: [],
    backend: [],
    database: [],
    mobile: [],
    design: [],
    devops: []
  })

  const categories = [
    { id: 'all', label: '●●●', icon: BarChart3, color: 'bg-gray-500' },
    { id: 'frontend', label: 'Frontend', icon: Code, color: 'bg-blue-500' },
    { id: 'backend', label: 'Backend', icon: Server, color: 'bg-green-500' },
    { id: 'database', label: 'Database', icon: Database, color: 'bg-orange-500' },
    { id: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-purple-500' },
    { id: 'design', label: 'Design', icon: Palette, color: 'bg-pink-500' },
    { id: 'devops', label: 'DevOps', icon: Cloud, color: 'bg-cyan-500' }
  ]

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    setLoading(true)

    const { data, error } = await supabase
    .from('skills')
    .select('*')

    if (error) {
        console.error('Error fetching skills:', error)
        return
    }

    const skillsByCategory: Skills = {
        frontend: data.filter(skill => skill.category === 'frontend'),
        backend: data.filter(skill => skill.category === 'backend'),
        database: data.filter(skill => skill.category === 'database'),
        mobile: data.filter(skill => skill.category === 'mobile'),
        design: data.filter(skill => skill.category === 'design'),
        devops: data.filter(skill => skill.category === 'devops')
    }

    setSkills(skillsByCategory)

    setLoading(false)
}

  const allSkills = Object.values(skills).flat()
  const filteredSkills = allSkills.filter(skill => {
    const matchesCategory = activeCategory === 'all' || 
      Object.entries(skills).find(([key, value]) => 
        value.includes(skill) && key === activeCategory
      )
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const stats = [
    { icon: Code, value: '15+', label: 'Tecnologias' },
    { icon: Award, value: '20+', label: 'Projetos' },
    { icon: TrendingUp, value: '2+', label: 'Anos Exp' },
    { icon: Target, value: '90%', label: 'Satisfação' }
  ]

  if(loading) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen">
        <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-20">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Minhas Habilidades</h1>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Conheça todas as tecnologias e ferramentas que domino para criar soluções incríveis
                </p>
            </div>
        </section>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                <div key={index} className="bg-[hsl(var(--card))] rounded-2xl p-6 border border-[hsl(var(--border))] text-center">
                    <div className="w-12 h-12 bg-[hsl(var(--primary)/0.1)] rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-[hsl(var(--primary))]" />
                    </div>
                    <div className="text-2xl font-bold text-[hsl(var(--primary))] mb-1">{stat.value}</div>
                    <div className="text-sm text-[hsl(var(--muted-foreground))]">{stat.label}</div>
                </div>
                )
            })}
            </div>

            {/* filtros e busca */}
            <div className="bg-[hsl(var(--card))] rounded-2xl p-6 border border-[hsl(var(--border))] mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                <div className="relative">
                    <Search className="w-5 h-5 text-[hsl(var(--muted-foreground))] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                    type="text"
                    placeholder="Buscar habilidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] bg-[hsl(var(--background))]"
                    />
                </div>
                </div>
                <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                    const Icon = category.icon
                    return (
                    <button
                        key={category.id}
                        translate="no"
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                        activeCategory === category.id
                            ? `${category.color} text-white shadow-lg`
                            : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/0.8)]'
                        }`}
                    >
                        <Icon className="w-4 h-4 mr-2" />
                        {category.label}
                    </button>
                    )
                })}
                </div>
            </div>
            </div>

            {/* habiliades */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredSkills.map((skill, index) => {
                const Icon = categories.find(c => c.id === skill.category)?.icon || Code
                return (
                <div key={index} className="bg-[hsl(var(--card))] rounded-2xl p-6 border border-[hsl(var(--border))] hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                    <div style={{backgroundColor: `${skill.color}`}} className={`w-12 h-12 rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-[hsl(var(--primary))]">{skill.proficiency}%</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">domínio</div>
                    </div>
                    </div>

                    <h3 translate="no" className="text-xl font-semibold mb-2 group-hover:text-[hsl(var(--primary))] transition-colors">
                        {skill.name}
                    </h3>

                    <p className="text-[hsl(var(--muted-foreground))] mb-4 text-sm">
                        {skill.description}
                    </p>

                    {/* progreso */}
                    <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-2 mb-4">
                    <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                        style={{ width: `${skill.proficiency}%` }}
                    ></div>
                    </div>

                    {/*<div className="flex justify-between text-sm text-[hsl(var(--muted-foreground))]">
                        <span>{skill.years} anos</span>
                        <span>{skill.projects} projetos</span>
                    </div>*/}

                    {/* nivel */}
                    <div className="flex items-center mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= Math.ceil(skill.proficiency / 20)
                            ? 'text-yellow-400 fill-current'
                            : 'text-[hsl(var(--muted-foreground))]'
                        }`}
                        />
                    ))}
                    </div>
                </div>
                )
            })}
            </div>

            {filteredSkills.length === 0 && (
            <div className="text-center py-16">
                <div className="w-24 h-24 bg-[hsl(var(--primary)/0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhuma habilidade encontrada</h3>
                <p className="text-[hsl(var(--muted-foreground))] mb-6">
                Tente ajustar os filtros ou termos de busca
                </p>
                <Button
                onClick={() => {
                    setActiveCategory('all')
                    setSearchTerm('')
                }}
                variant="outline"
                >
                Limpar Filtros
                </Button>
            </div>
            )}

            {/* resumo */}
            <div className="bg-gradient-to-r from-[hsl(var(--primary)/0.1)] to-[hsl(var(--secondary)/0.1)] rounded-2xl p-8 border border-[hsl(var(--border))]">
            <h2 className="text-2xl font-semibold mb-6 text-center">Resumo de Competências</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Code className="w-5 h-5 text-[hsl(var(--primary))] mr-2" />
                    Competências Técnicas
                </h3>
                <div className="space-y-3">
                    {Object.entries(skills).map(([category, items]) => {
                    const categoryInfo = categories.find(c => c.id === category)
                    const Icon = categoryInfo?.icon || Code
                    return (
                        <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Icon className="w-4 h-4 text-[hsl(var(--muted-foreground))] mr-2" />
                            <span translate="no" className="text-sm">{categoryInfo?.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-[hsl(var(--primary))]">
                            {items.length} habilidades
                        </span>
                        </div>
                    )
                    })}
                </div>
                </div>

                <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 text-[hsl(var(--primary))] mr-2" />
                    Níveis de Proficiência
                </h3>
                <div className="space-y-4">
                    <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Avançado (80-100%)</span>
                        <span className="text-[hsl(var(--primary))] font-semibold">
                        {allSkills.filter(s => s.proficiency >= 80).length} habilidades
                        </span>
                    </div>
                    <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-2">
                        <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${(allSkills.filter(s => s.proficiency >= 80).length / allSkills.length) * 100}%` }}
                        ></div>
                    </div>
                    </div>

                    <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Intermediário (60-79%)</span>
                        <span className="text-[hsl(var(--primary))] font-semibold">
                        {allSkills.filter(s => s.proficiency >= 60 && s.proficiency < 80).length} habilidades
                        </span>
                    </div>
                    <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-2">
                        <div 
                        className="h-2 rounded-full bg-yellow-500"
                        style={{ width: `${(allSkills.filter(s => s.proficiency >= 60 && s.proficiency < 80).length / allSkills.length) * 100}%` }}
                        ></div>
                    </div>
                    </div>

                    <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Básico (0-59%)</span>
                        <span className="text-[hsl(var(--primary))] font-semibold">
                        {allSkills.filter(s => s.proficiency < 60).length} habilidades
                        </span>
                    </div>
                    <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-2">
                        <div 
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${(allSkills.filter(s => s.proficiency < 60).length / allSkills.length) * 100}%` }}
                        ></div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mt-10 p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Pronto para Colaborar?</h2>
            <p className="text-blue-100 mb-6">
                Estas são apenas algumas das habilidades que posso trazer para o seu projeto. 
                Vamos conversar sobre como posso ajudar a transformar suas ideias em realidade.
            </p>
            <Link
                href="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block"
            >
                Iniciar Conversa
            </Link>
            </div>
        </div>
    </div>
  )
}
