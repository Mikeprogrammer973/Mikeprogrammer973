
import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-muted py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold">MeuPortfólio</h3>
            <p className="text-muted-foreground mt-2">
              Desenvolvido com Next.js e Supabase
            </p>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              href="https://github.com" 
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={24} />
            </Link>
            <Link 
              href="https://linkedin.com" 
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin size={24} />
            </Link>
            <Link 
              href="mailto:seu@email.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail size={24} />
            </Link>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MeuPortfólio. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}