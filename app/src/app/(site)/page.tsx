
import Link from 'next/link'
import { ArrowRight, Clock, Star, TrendingUp } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { IncomingProjectCard, ProjectCard } from 'mdp/components/ui/project/cards'

// dados de teste
const featuredProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Plataforma completa de e-commerce com painel administrativo e gateway de pagamento integrado.",
    category: "Full Stack",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
    image: "/api/placeholder/400/250",
    projectUrl: "#",
    githubUrl: "#",
    featured: true,
    status: "completed"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Aplicativo de gerenciamento de tarefas com colaboração em tempo real e sincronização multiplataforma.",
    category: "Frontend",
    technologies: ["React", "Firebase", "Tailwind CSS", "Vite"],
    image: "/api/placeholder/400/250",
    projectUrl: "#",
    githubUrl: "#",
    featured: true,
    status: "completed"
  },
  {
    id: 3,
    title: "Health Tracking Dashboard",
    description: "Dashboard para monitoramento de métricas de saúde com visualizações interativas e relatórios.",
    category: "Full Stack",
    technologies: ["Vue.js", "Express", "MongoDB", "D3.js"],
    image: "/api/placeholder/400/250",
    projectUrl: "#",
    githubUrl: "#",
    featured: true,
    status: "completed"
  }
]

const incomingProjects = [
  {
    id: 4,
    title: "AI Content Generator",
    description: "Plataforma de geração de conteúdo usando inteligência artificial com interface intuitiva.",
    category: "AI/ML",
    technologies: ["Python", "FastAPI", "React", "OpenAI"],
    progress: 65,
    status: "development",
    estimatedCompletion: "Dez 2024"
  },
  {
    id: 5,
    title: "Mobile Fitness App",
    description: "Aplicativo mobile para acompanhamento de exercícios e nutrição com realidade aumentada.",
    category: "Mobile",
    technologies: ["React Native", "Firebase", "ARKit", "GraphQL"],
    progress: 30,
    status: "planning",
    estimatedCompletion: "Mar 2025"
  },
  {
    id: 6,
    title: "Blockchain Marketplace",
    description: "Mercado descentralizado para NFTs com smart contracts e integração com múltiplas blockchains.",
    category: "Web3",
    technologies: ["Solidity", "Ethers.js", "Next.js", "IPFS"],
    progress: 15,
    status: "design",
    estimatedCompletion: "Jun 2025"
  }
]

const skillsByCategory = {
  "Frontend": [
    { name: "React", level: 95, icon: "⚛️" },
    { name: "Next.js", level: 90, icon: "▲" },
    { name: "TypeScript", level: 88, icon: "📘" },
    { name: "Tailwind CSS", level: 92, icon: "🎨" }
  ],
  "Backend": [
    { name: "Node.js", level: 85, icon: "🟢" },
    { name: "PostgreSQL", level: 80, icon: "🐘" },
    { name: "Python", level: 75, icon: "🐍" },
    { name: "Redis", level: 70, icon: "🔴" }
  ],
  "Mobile": [
    { name: "React Native", level: 82, icon: "📱" },
    { name: "Flutter", level: 68, icon: "💙" },
    { name: "iOS", level: 60, icon: "🍎" },
    { name: "Android", level: 65, icon: "🤖" }
  ],
  "DevOps": [
    { name: "Docker", level: 78, icon: "🐳" },
    { name: "AWS", level: 72, icon: "☁️" },
    { name: "Git", level: 90, icon: "📝" },
    { name: "CI/CD", level: 75, icon: "🔄" }
  ]
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="flex flex-col items-center text-center py-20">
        <div className="animate-fade-in-up mb-6">
          <div className="w-32 h-32 lg:w-48 lg:h-48 p-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            <img className='w-full h-full object-cover rounded-full' src="https://pbs.twimg.com/profile_images/1474048692374196236/qCeE57B4_400x400.jpg" alt="profile" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Desenvolvedor <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Full Stack</span>
        </h1>
        
        <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Transformando ideias em experiências digitais excepcionais com tecnologias modernas
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

      <section className="py-20">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
      </section>

      <section className="py-20 bg-muted/30 rounded-3xl px-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {incomingProjects.map((project, index) => (
            <IncomingProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </section>

      <section className="py-20">
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
              <h3 className="text-xl font-semibold mb-6 text-[hsl(var(--foreground))] flex items-center">
                <span className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full mr-3"></span>
                {category}
              </h3>
              <div className="space-y-4">
                {skills.map((skill, skillIndex) => (
                  <div key={skill.name} className="flex items-center justify-between p-4 bg-[hsl(var(--card))] rounded-xl border hover-lift transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{skill.icon}</span>
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-[hsl(var(--muted-foreground))] w-8">
                        {skill.level}%
                      </span>
                    </div>
                  </div>
                ))}
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
      </section>
    </div>
  )
}
