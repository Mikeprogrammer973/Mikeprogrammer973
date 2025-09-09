'use client'

import { useState } from 'react'
import {
  Download,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Linkedin,
  Github,
  Users,
  Globe,
  Code,
  MessageSquareIcon
} from 'lucide-react'
import { Button } from 'mdp/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'bio' | 'education' | 'experience'>('bio')

  const personalInfo = {
    name: "Mike Pascal",
    fullName: "Mike Dervensky Pascal",
    title: "Desenvolvedor Full Stack",
    location: "Montréal, Canadá",
    email: "mikepascal.delta@gmail.com",
    experience: "2+ anos de experiência",
    photo: "https://pbs.twimg.com/profile_images/1474048692374196236/qCeE57B4_400x400.jpg",
    bio: "Sou um desenvolvedor full stack apaixonado por criar experiências digitais excepcionais. Combinando habilidades técnicas sólidas com sensibilidade design, transformo ideias em produtos funcionais e visualmente impressionantes."
  }

  const education = [
    {
      degree: "Bacharelado em Ciência da Computação",
      institution: "Universidade de São Paulo (USP)",
      period: "2016-2020",
      description: "Formação com ênfase em engenharia de software e inteligência artificial."
    },
    {
      degree: "Pós-graduação em UX/UI Design",
      institution: "FIAP",
      period: "2021-2022",
      description: "Especialização em design de interfaces e experiência do usuário."
    },
    {
      degree: "Certificação AWS Solutions Architect",
      institution: "Amazon Web Services",
      period: "2022",
      description: "Certificação profissional em arquitetura de soluções na nuvem."
    }
  ]

  const experience = [
    {
      position: "Desenvolvedor Full Stack Sênior",
      company: "TechSolutions Inc.",
      period: "2022 - Presente",
      description: "Liderança no desenvolvimento de aplicações web e mobile para clientes internacionais.",
      achievements: ["Equipe de 5 desenvolvedores", "+15 projetos entregues", "95% satisfação do cliente"]
    },
    {
      position: "Desenvolvedor Front-end",
      company: "Digital Agency Brasil",
      period: "2020 - 2022",
      description: "Desenvolvimento de interfaces modernas e responsivas para diversos clientes.",
      achievements: ["+30 projetos", "Design system próprio", "Prêmio de melhor interface 2021"]
    },
    {
      position: "Estagiário em Desenvolvimento",
      company: "StartUp Paulista",
      period: "2019 - 2020",
      description: "Primeira experiência profissional desenvolvendo features para aplicação web.",
      achievements: ["Promovido a júnior em 6 meses", "Feature award", "Melhor estagiário do ano"]
    }
  ]

  const stats = [
    { number: "20+", label: "Projetos Concluídos" },
    { number: "25+", label: "Clientes Satisfeitos" },
    { number: "3", label: "Prêmios de Design" },
    { number: "100%", label: "Entregas no Prazo" }
  ]

  return (
    <div className="min-h-screen">
        <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-20">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Sobre Mim</h1>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Conheça minha jornada, experiências e paixão por criar soluções digitais incríveis
                </p>
            </div>
        </section>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {/* perfil */}
            <div className="lg:col-span-1">
                <div className="bg-[hsl(var(--card))]/80 backdrop-blur-xl rounded-3xl p-8 border border-[hsl(var(--border))] shadow-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-500 text-center">
                <div className="relative w-64 h-64 mx-auto mb-6">
                    <img
                    src={personalInfo.photo}
                    alt={personalInfo.name}
                    className="rounded-3xl object-cover shadow-lg border border-[hsl(var(--border))]"
                    />
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-25 blur-2xl"></div>
                </div>

                <h2 className="text-3xl font-bold mb-2">{personalInfo.fullName}</h2>
                <p className="text-[hsl(var(--primary))] font-semibold mb-4 text-lg">{personalInfo.title}</p>

                <div className="space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
                    <div className="flex items-center justify-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {personalInfo.location}
                    </div>
                    <div className="flex items-center justify-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {personalInfo.experience}
                    </div>
                    <div className="flex items-center justify-center">
                    <MessageSquareIcon className="w-4 h-4 mr-2" />
                    {personalInfo.email}
                    </div>
                </div>

                {/* Botões sociais */}
                <div className="flex justify-center space-x-4 mt-6">
                    <Button size="sm" variant="outline" className="rounded-full hover:scale-105 transition-transform">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full hover:scale-105 transition-transform">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                    </Button>
                </div>

                <Button className="w-full mt-6 rounded-full text-lg py-6 hover:scale-[1.02] transition-transform">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar meu CV
                </Button>
                </div>
            </div>

            {/* historia e stats */}
            <div className="lg:col-span-2">
                <div className="bg-[hsl(var(--card))]/80 backdrop-blur-lg rounded-3xl p-8 border border-[hsl(var(--border))] shadow-lg mb-8">
                <h2 className="text-2xl font-semibold mb-6">Minha História</h2>
                <p className="text-lg text-[hsl(var(--foreground))] leading-relaxed mb-6">
                    {personalInfo.bio}
                </p>
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                    Minha jornada na tecnologia começou aos 15 anos, criando meus primeiros sites. Desde então, venho me especializando em desenvolvimento full stack, sempre buscando unir o melhor da tecnologia com design excepcional.
                </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                    key={index}
                    className="bg-[hsl(var(--card))]/70 backdrop-blur-xl rounded-xl p-6 border border-[hsl(var(--border))] text-center hover:scale-[1.05] hover:shadow-xl transition-all duration-300"
                    >
                    <div className="text-3xl font-extrabold text-[hsl(var(--primary))] mb-2">{stat.number}</div>
                    <div className="text-sm text-[hsl(var(--muted-foreground))]">{stat.label}</div>
                    </div>
                ))}
                </div>
            </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {['bio', 'education', 'experience'].map((tab) => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-6 py-3 rounded-full font-medium transition-all shadow-sm ${
                    activeTab === tab
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-lg'
                    : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/0.8)]'
                }`}
                >
                {tab === 'bio' && 'Biografia'}
                {tab === 'education' && 'Educação'}
                {tab === 'experience' && 'Experiência'}
                </button>
            ))}
            </div>

            <div className="bg-[hsl(var(--card))]/80 backdrop-blur-xl rounded-3xl p-8 border border-[hsl(var(--border))] shadow-lg">
            {/* Educação */}
            {activeTab === 'education' && (
                <div className="space-y-8">
                <h2 className="text-2xl font-semibold mb-6">Formação Acadêmica</h2>
                {education.map((item, index) => (
                    <div key={index} className="flex group">
                    <div className="flex flex-col items-center mr-6">
                        <div className="w-12 h-12 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        {index < education.length - 1 && (
                        <div className="w-1 bg-[hsl(var(--border))] flex-grow my-2"></div>
                        )}
                    </div>
                    <div className="flex-1 pb-6">
                        <h3 className="text-lg font-semibold mb-2">{item.degree}</h3>
                        <p className="text-[hsl(var(--primary))] font-medium mb-2">{item.institution}</p>
                        <div className="flex items-center text-sm text-[hsl(var(--muted-foreground))] mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        {item.period}
                        </div>
                        <p className="text-[hsl(var(--foreground))]">{item.description}</p>
                    </div>
                    </div>
                ))}
                </div>
            )}

            {/* Experiência */}
            {activeTab === 'experience' && (
                <div className="space-y-8">
                <h2 className="text-2xl font-semibold mb-6">Experiência Profissional</h2>
                {experience.map((exp, index) => (
                    <div key={index} className="flex group">
                    <div className="flex flex-col items-center mr-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        {index < experience.length - 1 && (
                        <div className="w-1 bg-[hsl(var(--border))] flex-grow my-2"></div>
                        )}
                    </div>
                    <div className="flex-1 pb-8">
                        <h3 className="text-lg font-semibold mb-2">{exp.position}</h3>
                        <p className="text-[hsl(var(--primary))] font-medium mb-2">{exp.company}</p>
                        <div className="flex items-center text-sm text-[hsl(var(--muted-foreground))] mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        {exp.period}
                        </div>
                        <p className="text-[hsl(var(--foreground))] mb-4">{exp.description}</p>
                        <div className="flex flex-wrap gap-2">
                        {exp.achievements.map((achievement, i) => (
                            <span
                            key={i}
                            className="px-3 py-1 bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] rounded-full text-sm"
                            >
                            {achievement}
                            </span>
                        ))}
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}

            {/* Biografia */}
            {activeTab === 'bio' && (
                <div className="space-y-8">
                <h2 className="text-2xl font-semibold mb-6">Minha Jornada</h2>
                <div className="prose prose-lg max-w-none text-[hsl(var(--foreground))]">
                    <p className="text-lg leading-relaxed">
                    Sou um desenvolvedor full stack com mais de 5 anos de experiência criando
                    soluções digitais inovadoras. Minha paixão por tecnologia começou cedo,
                    e desde então venho me dedicando a criar experiências que unem funcionalidade
                    e design excepcional.
                    </p>
                    <h3 className="text-xl font-semibold mt-8 mb-4">Minha Filosofia</h3>
                    <p className="leading-relaxed">
                    Acredito que o desenvolvimento de software vai além de escrever código —
                    é sobre entender pessoas, resolver problemas reais e criar valor através
                    da tecnologia.
                    </p>
                    <h3 className="text-xl font-semibold mt-8 mb-4">O Que Me Motiva</h3>
                    <ul className="list-disc list-inside space-y-2 text-[hsl(var(--foreground))]">
                    <li>Resolver problemas complexos de forma elegante</li>
                    <li>Criar produtos que fazem a diferença na vida das pessoas</li>
                    <li>Aprender novas tecnologias e metodologias continuamente</li>
                    <li>Trabalhar em equipe para alcançar resultados extraordinários</li>
                    </ul>
                    <div className="bg-gradient-to-r from-[hsl(var(--primary)/0.1)] to-[hsl(var(--secondary)/0.1)] rounded-2xl p-6 mt-8 border border-[hsl(var(--border))]">
                    <h4 className="font-semibold mb-3 flex items-center">
                        <Award className="w-5 h-5 text-[hsl(var(--primary))] mr-2" />
                        Meus Valores
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ValueItem icon={Code} label="Qualidade técnica acima de tudo" color="blue" />
                        <ValueItem icon={Users} label="Colaboração e trabalho em equipe" color="green" />
                        <ValueItem icon={Globe} label="Inovação constante" color="purple" />
                        <ValueItem icon={Heart} label="Paixão pelo que faço" color="amber" />
                    </div>
                    </div>
                </div>
                </div>
            )}
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mt-10 p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 text-white">Vamos Trabalhar Juntos?</h2>
                <p className="text-blue-100 mb-6">
                    Estou sempre aberto a discutir novos projetos, oportunidades de colaboração
                    ou simplesmente conversar sobre tecnologia e inovação.
                </p>
                <Link
                    href="/contact"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block"
                >
                    Entrar em Contato
                </Link>
            </div>
        </div>
    </div>
  )
}

function ValueItem({ icon: Icon, label, color }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; color: string }) {
  return (
    <div className="flex items-center">
      <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center mr-3`}>
        <Icon className={`w-4 h-4 text-${color}-600`} />
      </div>
      <span>{label}</span>
    </div>
  )
}

function Heart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}
