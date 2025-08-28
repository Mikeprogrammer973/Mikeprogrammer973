import { Link, ExternalLink, Github } from "lucide-react";
import { Button } from "../button";
import { Card, CardHeader, CardTitle, CardContent } from "../card";

function ProjectCard({ project, index }: { project: { title: string; description: string; category: string; technologies: string[]; projectUrl: string; githubUrl: string }; index: number }) {
  return (
    <div className="group relative animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
      <Card className="overflow-hidden border-1 transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/20">
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              project.category === "Full Stack" ? "bg-blue-100 text-blue-600" :
              project.category === "Frontend" ? "bg-green-100 text-green-600" :
              project.category === "Backend" ? "bg-orange-100 text-orange-600" :
              "bg-purple-100 text-purple-600"
            }`}>
              {project.category}
            </span>
          </div>
        </div>
        
        <CardHeader>
          <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
            {project.title}
          </CardTitle>
          <p className="text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map((tech: string) => (
              <span key={tech} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={project.projectUrl}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Demo
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="px-3">
              <Link href={project.githubUrl}>
                <Github className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function IncomingProjectCard({ project, index }: { project: {category: string, status: string, title: string, description: string, progress: number, technologies: string[], estimatedCompletion: string}; index: number }) {
  const statusConfig = {
    development: { color: "bg-blue-100 text-blue-600", label: "Em Desenvolvimento" },
    planning: { color: "bg-yellow-100 text-yellow-600", label: "Planejamento" },
    design: { color: "bg-purple-100 text-purple-600", label: "Design" }
  }

  const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.development

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
      <Card className="border-2 border-dashed hover-lift transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              {project.category}
            </span>
          </div>
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <p className="text-muted-foreground">
            {project.description}
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Barrinha de progresso */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Techs usados */}
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 3).map((tech: string) => (
                <span key={tech} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                  {tech}
                </span>
              ))}
            </div>

            {/* Previsão de conclusão */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Previsão de conclusão</span>
              <span className="font-medium">{project.estimatedCompletion}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { ProjectCard, IncomingProjectCard }