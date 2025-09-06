"use client"

import { ExternalLink, Github } from "lucide-react";
import { Button } from "../button";
import { Card, CardHeader, CardTitle, CardContent } from "../card";
import { Project } from "mdp/lib/supabase/types/database";
import Link from "next/link";
import { useRouter } from "next/navigation";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const router = useRouter()

  return (
    <div onClick={(e) => {e.stopPropagation()}} className="group relative animate-fade-in-up max-w-xl" style={{ animationDelay: `${index * 0.1}s` }}>
      <Card className="overflow-hidden border-1 transition-all duration-300 group-hover:shadow-xl group-hover:border-[hsl(var(--primary))]/20">
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {project.image_url && <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />}
          <div className="absolute top-4 left-4">
            <span translate="no" className={`px-3 py-1 rounded-full text-xs font-medium ${
              project.category === "web" ? "bg-blue-100 text-blue-600" :
              project.category === "mobile" ? "bg-green-100 text-green-600" :
              project.category === "open source" ? "bg-orange-100 text-orange-600" :
              "bg-purple-100 text-purple-600"
            }`}>
              {project.category}
            </span>
          </div>
        </div>
        
        <CardHeader className="cursor-pointer" onClick={() => router.push(`/projects/${project.slug}`)}>
          <CardTitle translate="no" className="text-xl group-hover:text-[hsl(var(--primary))] transition-colors duration-300">
            {project.title}
          </CardTitle>
          <p className="text-[hsl(var(--muted-foreground))] line-clamp-2">
            {project.description}
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map((tech: string) => (
              <span translate="no" key={tech} className="px-2 py-1 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] text-xs rounded-full">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] text-xs rounded-full">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            {project.project_url && <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={project.project_url}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Demo
              </Link>
            </Button>}
            {project.github_url && <Button asChild variant="ghost" size="sm" className="px-3">
              <Link href={project.github_url}>
                <Github className="w-4 h-4" />
              </Link>
            </Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function IncomingProjectCard({ project, index }: { project: Project; index: number }) {
  const router = useRouter()

  const statusConfig = {
    development: { color: "bg-blue-100 text-blue-600", label: "Em Desenvolvimento" },
    planning_structure: { color: "bg-yellow-100 text-yellow-600", label: "Planejamento" },
    planning_design: { color: "bg-purple-100 text-purple-600", label: "Design" },
    testing: { color: "bg-green-100 text-green-600", label: "Teste" },
    production_setup: { color: "bg-indigo-100 text-indigo-600", label: "Revisão Final" },
  }

  const status = statusConfig[(project.dev_stage as string )as keyof typeof statusConfig] || statusConfig.development

  return (
    <div className="animate-fade-in-up max-w-xl" style={{ animationDelay: `${index * 0.1}s` }}>
      <Card onClick={() => router.push(`/projects/${project.slug}`)} className="cursor-pointer border-2 border-dashed hover-lift transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
            <span translate="no" className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              {project.category}
            </span>
          </div>
          <CardTitle translate="no" className="text-xl">{project.title}</CardTitle>
          <p className="text-[hsl(var(--muted-foreground))]">
            {project.description}
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Barrinha de progresso */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[hsl(var(--muted-foreground))]">Progresso</span>
                <span className="font-medium">{project.stage_progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${project.stage_progress}%` }}
                ></div>
              </div>
            </div>

            {/* Techs usados */}
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 3).map((tech: string) => (
                <span translate="no" key={tech} className="px-2 py-1 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] text-xs rounded-full">
                  {tech}
                </span>
              ))}
            </div>

            {/* Previsão de conclusão */}
            <div className="flex items-center justify-between text-sm text-[hsl(var(--muted-foreground))]">
              <span>Previsão de conclusão</span>
              <span className="font-medium">{new Date(project.pro_date as string).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { ProjectCard, IncomingProjectCard }
