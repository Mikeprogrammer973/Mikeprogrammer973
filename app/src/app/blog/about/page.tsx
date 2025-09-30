
import BlogHeader from '@/components/blog/Header';
import BlogFooter from '@/components/blog/Footer';
import Link from 'next/link';
import { 
  Code, 
  Heart, 
  Users, 
  BookOpen,
  Github,
  ExternalLink,
  Mail,
  FileText,
  Shield,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Tecnologias Modernas",
      description: "Desenvolvido com Next.js 14, Tailwind CSS, Supabase e TypeScript"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Comunidade Aberta",
      description: "Plataforma aberta para todos os desenvolvedores compartilharem conhecimento"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Conteúdo Colaborativo",
      description: "Qualquer desenvolvedor autenticado pode publicar artigos e tutoriais"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Moderação Transparente",
      description: "Sistema de moderação para garantir qualidade do conteúdo"
    }
  ];

  const techStack = [
    { name: "Next.js 14", description: "App Router e React Server Components" },
    { name: "Tailwind CSS", description: "Estilização utilitária e design system" },
    { name: "Supabase", description: "Backend como serviço com PostgreSQL" },
    { name: "TypeScript", description: "Tipagem estática para melhor desenvolvimento" },
    { name: "Tiptap", description: "Editor de texto rico para criação de posts" },
    { name: "Autenticação", description: "Sistema completo de login e registro" }
  ];

  const stats = [
    { number: "100%", label: "Open Source" },
    { number: "Completo", label: "Sistema Full-Stack" },
    { number: "Moderado", label: "Conteúdo Comunitário" },
    { number: "Moderno", label: "Tecnologias Atuais" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Code className="w-4 h-4 mr-2" />
            Blog Comunitário de Desenvolvimento
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Sobre o Blog</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Uma plataforma open source para desenvolvedores compartilharem conhecimento, 
            tutoriais e experiências sobre desenvolvimento web e tecnologia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/blog/posts" 
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Explorar Artigos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link 
              href="/blog/register" 
              className="inline-flex items-center px-6 py-3 border border-border rounded-lg hover:bg-accent"
            >
              <Users className="w-4 h-4 mr-2" />
              Juntar-se à Comunidade
            </Link>
          </div>
        </section>

        {/* Sobre o Projeto */}
        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Sobre Este Projeto</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Este blog é uma plataforma comunitária desenvolvida para conectar 
                  desenvolvedores e facilitar o compartilhamento de conhecimento. 
                  Acreditamos que a melhor maneira de aprender é ensinando.
                </p>
                <p>
                  O sistema foi construído com tecnologias modernas e é totalmente open source. 
                  Qualquer desenvolvedor pode se registrar, escrever artigos, compartilhar 
                  experiências e participar da comunidade.
                </p>
                <p>
                  Nosso objetivo é criar um espaço inclusivo onde desenvolvedores de todos 
                  os níveis possam aprender, ensinar e crescer juntos.
                </p>
              </div>
            </div>
            <div className="bg-card border rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Características</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Funcionalidades */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Funcionalidades do Sistema</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Um sistema completo de blog com todas as funcionalidades que você espera de uma plataforma moderna
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tecnologias Utilizadas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Desenvolvido com as tecnologias mais modernas do ecossistema web
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <div key={index} className="bg-card border rounded-xl p-6 text-center">
                <h3 className="font-semibold mb-2">{tech.name}</h3>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center py-16">
          <div className="bg-card border rounded-2xl p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Junte-se à Comunidade</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Registre-se agora e comece a compartilhar seu conhecimento com outros desenvolvedores
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/blog/register" 
                className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-lg"
              >
                <Users className="w-5 h-5 mr-2" />
                Criar Conta
              </Link>
              <Link 
                href="/blog/posts" 
                className="inline-flex items-center px-8 py-4 border border-border rounded-lg hover:bg-accent text-lg"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Ler Artigos
              </Link>
            </div>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
}
