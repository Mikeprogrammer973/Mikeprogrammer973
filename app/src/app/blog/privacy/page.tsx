
import BlogHeader from '@/components/blog/Header';
import BlogFooter from '@/components/blog/Footer';
import Link from 'next/link';
import { Shield, Mail, User, Database } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      title: "Informações Coletadas",
      content: "Coletamos informações que você nos fornece diretamente, como nome, endereço de e-mail, informações de perfil e conteúdo que você cria ou publica em nossa plataforma."
    },
    {
      title: "Uso das Informações",
      content: "Utilizamos suas informações para fornecer, manter e melhorar nossos serviços, desenvolver novos recursos, e comunicar-nos com você sobre atualizações e novidades da plataforma."
    },
    {
      title: "Compartilhamento de Informações",
      content: "Não vendemos suas informações pessoais. Podemos compartilhar informações em circunstâncias específicas, como com seu consentimento ou para cumprir obrigações legais."
    },
    {
      title: "Segurança de Dados",
      content: "Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição não autorizada."
    },
    {
      title: "Seus Direitos",
      content: "Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Você também pode optar por não receber comunicações promocionais a qualquer momento."
    },
    {
      title: "Cookies e Tecnologias Similares",
      content: "Utilizamos cookies e tecnologias similares para fornecer, proteger e melhorar nossos serviços, personalizar conteúdo e analisar o tráfego do site."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Política de Privacidade
          </div>
          <h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Introdução */}
          <div className="bg-card border rounded-xl p-8 mb-8">
            <p className="text-muted-foreground text-lg">
              Esta Política de Privacidade descreve como suas informações são coletadas, 
              usadas e compartilhadas quando você usa nossa plataforma de blog comunitário.
            </p>
          </div>

          {/* Seções de Conteúdo */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <section key={index} className="bg-card border rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-primary" />
                  {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          {/* Informações de Contato */}
          <div className="bg-card border rounded-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Contato</h2>
            <p className="text-muted-foreground mb-4">
              Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco:
            </p>
            <div className="flex items-center text-muted-foreground">
              <Mail className="w-5 h-5 mr-3" />
              <span>privacidade@blog.com</span>
            </div>
          </div>

          {/* Links Úteis */}
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <Link 
              href="/blog/terms" 
              className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Termos de Uso
            </Link>
            <Link 
              href="/blog" 
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Voltar ao Blog
            </Link>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
