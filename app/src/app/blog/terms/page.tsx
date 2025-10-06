
import Link from 'next/link';
import { FileText, AlertTriangle, Users, BookOpen, BrainCircuit, ShieldBan, BanIcon, Edit3Icon } from 'lucide-react';
import BlogHeader from 'mdp/components/ui/blog/Header';

export default function TermsPage() {
  const sections = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Uso da Plataforma",
      content: "Ao usar a plataforma, você concorda em cumprir estes Termos de Uso. Você é responsável por seu uso da plataforma e por qualquer conteúdo que publicar."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Conta do Usuário",
      content: "Para acessar alguns recursos da plataforma, você precisará criar uma conta. Você é responsável por manter a confidencialidade de sua conta e senha."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Conteúdo do Usuário",
      content: "Você mantém os direitos sobre o conteúdo que criar e publicar. Ao publicar conteúdo, você me concede uma licença para exibir, distribuir e modificar esse conteúdo na plataforma."
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Conduta do Usuário",
      content: "Você concorda em não publicar conteúdo que seja ilegal, ofensivo, difamatório, ou que viole direitos de terceiros. Me reservo o direito de remover conteúdo que viole estes termos."
    },
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: "Propriedade Intelectual",
      content: "A plataforma e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva do blog e seus licenciadores."
    },
    {
      icon: <ShieldBan className="w-6 h-6" />,
      title: "Moderações de Conteúdo",
      content: "Implementei um sistema de moderação para garantir a qualidade do conteúdo. Posso revisar, editar ou remover conteúdo que, a meu critério, viole estas políticas."
    },
    {
      icon: <BanIcon className="w-6 h-6" />,
      title: "Limitação de Responsabilidade",
      content: "A plataforma é fornecida 'no estado em que se encontra'. Não me responsabilizo por danos indiretos, incidentais ou consequenciais resultantes do uso da plataforma."
    },
    {
      icon: <Edit3Icon className="w-6 h-6" />,
      title: "Alterações nos Termos",
      content: "Posso atualizar estes Termos de Uso periodicamente. Notificarei os usuários sobre mudanças significativas através da plataforma ou por e-mail."
    }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <BlogHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4 mr-2" />
            Termos de Uso
          </div>
          <h1 className="text-4xl font-bold mb-4">Termos de Uso</h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-3xl mx-auto">
            Última atualização: {new Date(Date.parse('9/30/2025')).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Aviso Importante</h3>
                <p className="text-yellow-700 text-sm">
                  Ao usar a plataforma, você concorda com estes Termos de Uso. 
                  Leia-os cuidadosamente antes de criar uma conta ou publicar conteúdo.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <section key={index} className="bg-[hsl(var(--card))] border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                  {section.icon && <span className="mr-3 text-[hsl(var(--primary))]">{section.icon}</span>}
                  {section.title}
                </h2>
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          <div className="bg-[hsl(var(--card))] border rounded-xl p-8 mt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Aceitação dos Termos</h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">
              Ao criar uma conta ou usar a plataforma, você confirma que leu, 
              compreendeu e concorda em ficar vinculado por estes Termos de Uso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/blog/register" 
                className="px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg hover:opacity-90"
              >
                Concordo e Quero Criar Conta
              </Link>
              <Link 
                href="/blog" 
                className="px-6 py-3 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))]"
              >
                Voltar ao Blog
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <Link 
              href="/blog/privacy" 
              className="px-6 py-3 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
            >
              Privacidade
            </Link>
            <Link 
              href="/blog/about" 
              className="px-6 py-3 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
            >
              Sobre o Blog
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
