
'use client'

import { useState } from 'react'
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

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', label: 'Todas', icon: BarChart3, color: 'bg-gray-500' },
    { id: 'frontend', label: 'Frontend', icon: Code, color: 'bg-blue-500' },
    { id: 'backend', label: 'Backend', icon: Server, color: 'bg-green-500' },
    { id: 'database', label: 'Database', icon: Database, color: 'bg-orange-500' },
    { id: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-purple-500' },
    { id: 'design', label: 'Design', icon: Palette, color: 'bg-pink-500' },
    { id: 'devops', label: 'DevOps', icon: Cloud, color: 'bg-cyan-500' }
  ]

  const skills = {
    frontend: [
      { name: 'React', level: 95, icon: Code, years: 2, projects: 25, color: 'bg-blue-500', description: 'Desenvolvimento de interfaces modernas e responsivas' },
      { name: 'Next.js', level: 90, icon: Code, years: 3, projects: 18, color: 'bg-black', description: 'Aplicações full-stack com React' },
      { name: 'TypeScript', level: 88, icon: Code, years: 3, projects: 20, color: 'bg-blue-600', description: 'JavaScript tipado para melhor desenvolvimento' },
      { name: 'Tailwind CSS', level: 92, icon: Palette, years: 3, projects: 22, color: 'bg-cyan-500', description: 'Framework CSS utilitário' },
      { name: 'Vue.js', level: 78, icon: Code, years: 2, projects: 8, color: 'bg-green-500', description: 'Framework progressivo JavaScript' },
      { name: 'Angular', level: 72, icon: Code, years: 2, projects: 6, color: 'bg-red-500', description: 'Framework para aplicações web' }
    ],
    backend: [
      { name: 'Node.js', level: 88, icon: Server, years: 2, projects: 20, color: 'bg-green-600', description: 'JavaScript no servidor' },
      { name: 'Python', level: 85, icon: Server, years: 3, projects: 15, color: 'bg-yellow-500', description: 'Desenvolvimento back-end e automação' },
      { name: 'Express.js', level: 86, icon: Server, years: 2, projects: 18, color: 'bg-gray-600', description: 'Framework web para Node.js' },
      { name: 'NestJS', level: 80, icon: Server, years: 2, projects: 10, color: 'bg-red-600', description: 'Framework Node.js progressivo' },
      { name: 'PHP', level: 75, icon: Server, years: 3, projects: 12, color: 'bg-purple-500', description: 'Linguagem para desenvolvimento web' }
    ],
    database: [
      { name: 'PostgreSQL', level: 85, icon: Database, years: 2, projects: 16, color: 'bg-blue-700', description: 'Banco de dados relacional' },
      { name: 'MongoDB', level: 82, icon: Database, years: 3, projects: 14, color: 'bg-green-700', description: 'Banco de dados NoSQL' },
      { name: 'Redis', level: 78, icon: Database, years: 2, projects: 8, color: 'bg-red-600', description: 'Armazenamento em cache' },
      { name: 'MySQL', level: 80, icon: Database, years: 3, projects: 12, color: 'bg-orange-600', description: 'Sistema de gerenciamento de banco de dados' }
    ],
    mobile: [
      { name: 'React Native', level: 84, icon: Smartphone, years: 3, projects: 10, color: 'bg-blue-400', description: 'Desenvolvimento mobile cross-platform' },
      { name: 'Flutter', level: 75, icon: Smartphone, years: 2, projects: 6, color: 'bg-cyan-600', description: 'UI toolkit para aplicações nativas' },
      { name: 'iOS', level: 70, icon: Smartphone, years: 2, projects: 4, color: 'bg-gray-800', description: 'Desenvolvimento para Apple' },
      { name: 'Android', level: 72, icon: Smartphone, years: 2, projects: 5, color: 'bg-green-600', description: 'Desenvolvimento para Android' }
    ],
    design: [
      { name: 'Figma', level: 90, icon: Palette, years: 2, projects: 25, color: 'bg-purple-600', description: 'Design de interfaces e prototipagem' },
      { name: 'Adobe XD', level: 85, icon: Palette, years: 3, projects: 18, color: 'bg-pink-600', description: 'Design e prototipagem' },
      { name: 'UI/UX', level: 88, icon: Palette, years: 2, projects: 22, color: 'bg-orange-500', description: 'Design de experiência do usuário' },
      { name: 'Photoshop', level: 80, icon: Palette, years: 3, projects: 15, color: 'bg-blue-500', description: 'Edição e manipulação de imagens' }
    ],
    devops: [
      { name: 'Docker', level: 82, icon: Cloud, years: 3, projects: 12, color: 'bg-blue-500', description: 'Containerização de aplicações' },
      { name: 'AWS', level: 78, icon: Cloud, years: 2, projects: 8, color: 'bg-orange-500', description: 'Serviços em nuvem da Amazon' },
      { name: 'Git', level: 90, icon: GitBranch, years: 2, projects: 25, color: 'bg-orange-600', description: 'Controle de versão' },
      { name: 'CI/CD', level: 80, icon: Zap, years: 3, projects: 10, color: 'bg-green-500', description: 'Integração e entrega contínua' },
      { name: 'Linux', level: 85, icon: Cpu, years: 2, projects: 15, color: 'bg-yellow-600', description: 'Sistema operacional' }
    ]
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
    { icon: Award, value: '50+', label: 'Projetos' },
    { icon: TrendingUp, value: '2+', label: 'Anos Exp' },
    { icon: Target, value: '95%', label: 'Satisfação' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--muted)/0.3)]">
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
                const Icon = skill.icon
                return (
                <div key={index} className="bg-[hsl(var(--card))] rounded-2xl p-6 border border-[hsl(var(--border))] hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${skill.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-[hsl(var(--primary))]">{skill.level}%</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">domínio</div>
                    </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-2 group-hover:text-[hsl(var(--primary))] transition-colors">
                    {skill.name}
                    </h3>

                    <p className="text-[hsl(var(--muted-foreground))] mb-4 text-sm">
                    {skill.description}
                    </p>

                    {/* progreso */}
                    <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-2 mb-4">
                    <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                    ></div>
                    </div>

                    <div className="flex justify-between text-sm text-[hsl(var(--muted-foreground))]">
                    <span>{skill.years} anos</span>
                    <span>{skill.projects} projetos</span>
                    </div>

                    {/* nivel */}
                    <div className="flex items-center mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= Math.ceil(skill.level / 20)
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
                            <span className="text-sm">{categoryInfo?.label}</span>
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
                        {allSkills.filter(s => s.level >= 80).length} habilidades
                        </span>
                    </div>
                    <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-2">
                        <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${(allSkills.filter(s => s.level >= 80).length / allSkills.length) * 100}%` }}
                        ></div>
                    </div>
                    </div>

                    <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Intermediário (60-79%)</span>
                        <span className="text-[hsl(var(--primary))] font-semibold">
                        {allSkills.filter(s => s.level >= 60 && s.level < 80).length} habilidades
                        </span>
                    </div>
                    <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-2">
                        <div 
                        className="h-2 rounded-full bg-yellow-500"
                        style={{ width: `${(allSkills.filter(s => s.level >= 60 && s.level < 80).length / allSkills.length) * 100}%` }}
                        ></div>
                    </div>
                    </div>

                    <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Básico (0-59%)</span>
                        <span className="text-[hsl(var(--primary))] font-semibold">
                        {allSkills.filter(s => s.level < 60).length} habilidades
                        </span>
                    </div>
                    <div className="w-full bg-[hsl(var(--secondary))] rounded-full h-2">
                        <div 
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${(allSkills.filter(s => s.level < 60).length / allSkills.length) * 100}%` }}
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