
import BlogHeader from '@/components/blog/Header';
import BlogFooter from '@/components/blog/Footer';
import Link from 'next/link';
import { FileText, AlertTriangle, Users, BookOpen } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Uso da Plataforma",
      content: "Ao usar nossa plataforma, você concorda em cumprir estes Termos de Uso. Você é responsável por seu uso da plataforma e por qualquer conteúdo que publicar."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Conta do Usuário",
      content: "Para acessar alguns recursos da plataforma, você precisará criar uma conta. Você é responsável por manter a confidencialidade de sua conta e senha."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Conteúdo do Usuário",
      content: "Você mantém os direitos sobre o conteúdo que criar e publicar. Ao publicar conteúdo, você nos concede uma licença para exibir, distribuir e modificar esse conteúdo na plataforma."
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Conduta do Usuário",
      content: "Você concorda em não publicar conteúdo que seja ilegal, ofensivo, difamatório, ou que viole direitos de terceiros. Reservamo-nos o direito de remover conteúdo que viole estes termos."
    },
    {
      title: "Propriedade Intelectual",
      content: "A plataforma e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva do blog e seus licenciadores."
    },
    {
      title: "Moderações de Conteúdo",
      content: "Implementamos um sistema de moderação para garantir a qualidade do conteúdo. Podemos revisar, editar ou remover conteúdo que, a nosso critério, viole estas políticas."
    },
    {
      title: "Limitação de Responsabilidade",
      content: "A plataforma é fornecida 'no estado em que se encontra'. Não nos responsabilizamos por danos indiretos, incidentais ou consequenciais resultantes do uso da plataforma."
    },
    {
      title: "Alterações nos Termos",
      content: "Podemos atualizar estes Termos de Uso periodicamente. Notificaremos os usuários sobre mudanças significativas através da plataforma ou por e-mail."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4 mr-2" />
            Termos de Uso
          </div>
          <h1 className="text-4xl font-bold mb-4">Termos de Uso</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Aviso Importante */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Aviso Importante</h3>
                <p className="text-yellow-700 text-sm">
                  Ao usar nossa plataforma, você concorda com estes Termos de Uso. 
                  Leia-os cuidadosamente antes de criar uma conta ou publicar conteúdo.
                </p>
              </div>
            </div>
          </div>

          {/* Seções de Conteúdo */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <section key={index} className="bg-card border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                  {section.icon && <span className="mr-3 text-primary">{section.icon}</span>}
                  {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          {/* Aceitação dos Termos */}
          <div className="bg-card border rounded-xl p-8 mt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Aceitação dos Termos</h2>
            <p className="text-muted-foreground mb-6">
              Ao criar uma conta ou usar nossa plataforma, você confirma que leu, 
              compreendeu e concorda em ficar vinculado por estes Termos de Uso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/blog/register" 
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Concordo e Quero Criar Conta
              </Link>
              <Link 
                href="/blog" 
                className="px-6 py-3 border border-border rounded-lg hover:bg-accent"
              >
                Voltar ao Blog
              </Link>
            </div>
          </div>

          {/* Links Úteis */}
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <Link 
              href="/blog/privacy" 
              className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link 
              href="/blog/about" 
              className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Sobre o Blog
            </Link>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
