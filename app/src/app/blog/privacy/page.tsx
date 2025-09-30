
import Link from 'next/link';
import { Shield, Mail } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      title: "Informações Coletadas",
      content: "Coleto informações que você fornece diretamente, como nome, endereço de e-mail, informações de perfil e conteúdo que você cria ou publica na plataforma."
    },
    {
      title: "Uso das Informações",
      content: "Utilizo suas informações para fornecer, manter e melhorar os serviços, desenvolver novos recursos, e comunicar com você sobre atualizações e novidades da plataforma."
    },
    {
      title: "Compartilhamento de Informações",
      content: "Não vendo suas informações pessoais. Posso compartilhar informações em circunstâncias específicas, como com seu consentimento ou para cumprir obrigações legais."
    },
    {
      title: "Segurança de Dados",
      content: "Implemento medidas de segurança para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição não autorizada."
    },
    {
      title: "Seus Direitos",
      content: "Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Você também pode optar por não receber comunicações promocionais a qualquer momento."
    },
    {
      title: "Cookies e Tecnologias Similares",
      content: "Utilizo cookies e tecnologias similares para fornecer, proteger e melhorar os serviços, personalizar conteúdo e analisar o tráfego do site."
    }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Política de Privacidade
          </div>
          <h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-3xl mx-auto">
            Última atualização: {new Date(Date.parse('9/30/2025')).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-[hsl(var(--card))] border rounded-xl p-8 mb-8">
            <p className="text-[hsl(var(--muted-foreground))] text-lg">
              Esta Política de Privacidade descreve como suas informações são coletadas, 
              usadas e compartilhadas quando você usa o Blog.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <section key={index} className="bg-[hsl(var(--card))] border rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-[hsl(var(--primary))]" />
                  {section.title}
                </h2>
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          <div className="bg-[hsl(var(--card))] border rounded-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Contato</h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-4">
              Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato comigo:
            </p>
            <div className="flex items-center font-medium text-[hsl(var(--muted-foreground))]">
              <Mail className="w-5 h-5 mr-3" />
              <span>technopro.net@gmail.com</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <Link 
              href="/blog/about" 
              className="px-6 py-3 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
            >
              Sobre o Blog
            </Link>
            <Link 
              href="/blog/terms" 
              className="px-6 py-3 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
            >
              Termos de Uso
            </Link>
            <Link 
              href="/blog" 
              className="px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg hover:opacity-90"
            >
              Voltar ao Blog
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
