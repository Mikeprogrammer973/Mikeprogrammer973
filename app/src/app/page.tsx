
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="flex flex-col items-center text-center py-20">
        <div className="animate-fade-in-up mb-6">
          <div className="w-32 h-32 p-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            <img className="w-full h-full rounded-full" src="https://pbs.twimg.com/profile_images/1474048692374196236/qCeE57B4_400x400.jpg" alt="profile" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Desenvolvedor <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Full Stack</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Criando experiências digitais excepcionais com React, Next.js e Node.js
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/projects">
              Ver Projetos <ArrowRight className="ml-2 h-4 w-4 inline-block" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/contact">
              Entrar em Contato
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Projetos em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Projeto 1 */}
          <div className="group relative overflow-hidden rounded-2xl bg-card border transition-all hover:shadow-lg hover-lift">
            <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">E-commerce Platform</h3>
              <p className="text-muted-foreground mb-4">Plataforma completa de e-commerce com painel administrativo.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Next.js</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Node.js</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">PostgreSQL</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button asChild>
                <Link href="/projects/ecommerce-platform">
                  Ver Detalhes
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Projeto 2 */}
          <div className="group relative overflow-hidden rounded-2xl bg-card border transition-all hover:shadow-lg hover-lift">
            <div className="h-48 bg-gradient-to-r from-green-400 to-green-600"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Task Management App</h3>
              <p className="text-muted-foreground mb-4">Aplicativo de gerenciamento de tarefas com colaboração em tempo real.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">React</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Firebase</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Tailwind</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button asChild>
                <Link href="/projects/task-management-app">
                  Ver Detalhes
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Projeto 3 */}
          <div className="group relative overflow-hidden rounded-2xl bg-card border transition-all hover:shadow-lg hover-lift">
            <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Health Tracking Dashboard</h3>
              <p className="text-muted-foreground mb-4">Dashboard para monitoramento de métricas de saúde e fitness.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Vue.js</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Express</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">MongoDB</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button asChild>
                <Link href="/projects/health-tracking-dashboard">
                  Ver Detalhes
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/projects">
              Ver Todos os Projetos
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Habilidades</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { name: 'React', level: 90 },
            { name: 'Next.js', level: 85 },
            { name: 'TypeScript', level: 80 },
            { name: 'Node.js', level: 75 },
            { name: 'PostgreSQL', level: 70 },
            { name: 'Tailwind CSS', level: 85 },
            { name: 'GraphQL', level: 65 },
            { name: 'AWS', level: 60 },
          ].map((skill, index) => (
            <div key={index} className="bg-card p-4 rounded-xl border text-center animate-fade-in-up" 
                 style={{ animationDelay: `${index * 0.1}s` }}>
              <h3 className="font-semibold mb-2">{skill.name}</h3>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/skills">
              Ver Todas as Habilidades
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}