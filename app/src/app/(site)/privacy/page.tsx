// app/privacy/page.tsx
'use client'

import { useState } from 'react'
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Cookie, 
  User,
  Mail,
  Database,
  Server,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function PrivacyPage() {
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({
    introduction: true,
    dataCollection: false,
    dataUsage: false,
    dataSharing: false,
    cookies: false,
    security: false,
    rights: false,
    changes: false
  })

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const lastUpdated = "4 de Setembro de 2025"

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--muted)/0.3)]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[hsl(var(--primary)/0.1)] rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-[hsl(var(--primary))]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.6)] bg-clip-text text-transparent">
            Termos de Privacidade
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))]">
            Última atualização: {lastUpdated}
          </p>
        </div>

        <div className="bg-[hsl(var(--card))] rounded-2xl p-6 border border-[hsl(var(--border))] mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 text-[hsl(var(--primary))] mr-2" />
            Navegação Rápida
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'introduction', label: 'Introdução', icon: FileText },
              { id: 'dataCollection', label: 'Coleta de Dados', icon: Database },
              { id: 'dataUsage', label: 'Uso de Dados', icon: Eye },
              { id: 'dataSharing', label: 'Compartilhamento', icon: Server },
              { id: 'cookies', label: 'Cookies', icon: Cookie },
              { id: 'security', label: 'Segurança', icon: Lock },
              { id: 'rights', label: 'Seus Direitos', icon: User },
              { id: 'changes', label: 'Alterações', icon: Clock }
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="flex items-center p-3 bg-[hsl(var(--secondary))] rounded-lg text-sm hover:bg-[hsl(var(--secondary)/0.8)] transition-colors"
                >
                  <Icon className="w-4 h-4 mr-2 text-[hsl(var(--primary))]" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-[hsl(var(--card))] rounded-2xl p-8 border border-[hsl(var(--border))]">
          <section id="introduction" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <FileText className="w-6 h-6 text-[hsl(var(--primary))] mr-2" />
                1. Introdução
              </h2>
              <button
                onClick={() => toggleSection('introduction')}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg"
              >
                {openSections.introduction ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            
            {openSections.introduction && (
              <div className="prose prose-lg max-w-none text-[hsl(var(--foreground))]">
                <p className="mb-4">
                  Bem-vindo aos Termos de Privacidade do meu Portfolio. Estou comprometido em proteger 
                  sua privacidade e garantir que suas informações pessoais sejam coletadas e usadas de 
                  forma transparente, segura e em conformidade com a legislação aplicável.
                </p>
                <p className="mb-4">
                  Estes Termos de Privacidade explicam como coleto, uso, compartilho e protego 
                  suas informações quando você visita o meu site ou utiliza os meus serviços.
                </p>
                <p>
                  Ao acessar ou usar o meu site, você concorda com os termos descritos nesta política. 
                  Recomendo que você leia atentamente este documento para entender as minhas práticas 
                  de privacidade.
                </p>
              </div>
            )}
          </section>

          <section id="dataCollection" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <Database className="w-6 h-6 text-[hsl(var(--primary))] mr-2" />
                2. Coleta de Informações
              </h2>
              <button
                onClick={() => toggleSection('dataCollection')}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg"
              >
                {openSections.dataCollection ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            
            {openSections.dataCollection && (
              <div className="prose prose-lg max-w-none text-[hsl(var(--foreground))]">
                <h3 className="text-lg font-semibold mb-3">2.1. Informações que Coleto</h3>
                <p className="mb-4">
                  Coleto diferentes tipos de informações para fornecer e melhorar os meus serviços:
                </p>
                
                <div className="bg-[hsl(var(--secondary))] rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2">Informações Pessoais:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Nome completo</li>
                    <li>Endereço de e-mail</li>
                    <li>Número de telefone (quando fornecido)</li>
                    <li>Informações de contato</li>
                  </ul>
                </div>

                <div className="bg-[hsl(var(--secondary))] rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2">Informações Técnicas:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Endereço de IP</li>
                    <li>Tipo de navegador e versão</li>
                    <li>Páginas visitadas e tempo gasto</li>
                    <li>Dispositivo utilizado</li>
                    <li>Dados de localização aproximada</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold mb-3">2.2. Como Coleto</h3>
                <p className="mb-4">
                  Coleto informações através de:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Formulários de contato preenchidos por você</li>
                  <li><span translate='no'>Cookies</span> e tecnologias similares</li>
                  <li>Registros automáticos do serviodr/navegador</li>
                  <li>Ferramentas de analytics</li>
                </ul>
              </div>
            )}
          </section>

          <section id="dataUsage" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <Eye className="w-6 h-6 text-[hsl(var(--primary))] mr-2" />
                3. Uso das Informações
              </h2>
              <button
                onClick={() => toggleSection('dataUsage')}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg"
              >
                {openSections.dataUsage ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            
            {openSections.dataUsage && (
              <div className="prose prose-lg max-w-none text-[hsl(var(--foreground))]">
                <p className="mb-4">
                  Utilizo as suas informações pessoais para os seguintes propósitos:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <Mail className="w-6 h-6 text-[hsl(var(--primary))] mb-2" />
                    <h4 className="font-semibold mb-2">Comunicação</h4>
                    <p className="text-sm">Responder a consultas e fornecer suporte</p>
                  </div>
                  
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <Server className="w-6 h-6 text-[hsl(var(--primary))] mb-2" />
                    <h4 className="font-semibold mb-2">Melhoria de Serviços</h4>
                    <p className="text-sm">Otimizar e personalizar a experiência do usuário</p>
                  </div>
                  
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <Shield className="w-6 h-6 text-[hsl(var(--primary))] mb-2" />
                    <h4 className="font-semibold mb-2">Segurança</h4>
                    <p className="text-sm">Proteger contra atividades fraudulentas</p>
                  </div>
                  
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <Database className="w-6 h-6 text-[hsl(var(--primary))] mb-2" />
                    <h4 className="font-semibold mb-2">Analytics</h4>
                    <p className="text-sm">Analisar tendências e uso do site</p>
                  </div>
                </div>

                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  <strong>Base legal:</strong> Todo processamento de dados é baseado em fundamentos legais 
                  adequados, incluindo seu consentimento, execução de contrato ou interesses legítimos.
                </p>
              </div>
            )}
          </section>

          <section id="dataSharing" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <Server className="w-6 h-6 text-[hsl(var(--primary))] mr-2" />
                4. Compartilhamento de Dados
              </h2>
              <button
                onClick={() => toggleSection('dataSharing')}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg"
              >
                {openSections.dataSharing ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            
            {openSections.dataSharing && (
              <div className="prose prose-lg max-w-none text-[hsl(var(--foreground))]">
                <p className="mb-4">
                  Seus dados pessoais podem ser compartilhados com:
                </p>
                
                <div className="bg-[hsl(var(--secondary))] rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-3">Prestadores de Serviço</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Hospedagem e Infraestrutura</span>
                      <span className="text-[hsl(var(--primary))]">AWS, Vercel</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Análise de Dados</span>
                      <span className="text-[hsl(var(--primary))]">Google Analytics</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Comunicação</span>
                      <span className="text-[hsl(var(--primary))]">Email providers</span>
                    </li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold mb-3">4.1. Requisitos Legais</h3>
                <p className="mb-4">
                  Posso divulgar suas informações pessoais quando exigido por lei, regulamento, 
                  processo legal ou solicitação governamental.
                </p>

                <h3 className="text-lg font-semibold mb-3">4.2. Transferências Internacionais</h3>
                <p>
                  Seus dados podem ser transferidos e processados em diversos países. 
                  Garanto que todas as transferências internacionais cumprem com as leis de 
                  proteção de dados aplicáveis.
                </p>
              </div>
            )}
          </section>

          <section id="cookies" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <Cookie className="w-6 h-6 text-[hsl(var(--primary))] mr-2" />
                5. <span translate='no'>Cookies</span> e Tecnologias Similares
              </h2>
              <button
                onClick={() => toggleSection('cookies')}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg"
              >
                {openSections.cookies ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            
            {openSections.cookies && (
              <div className="prose prose-lg max-w-none text-[hsl(var(--foreground))]">
                <p className="mb-4">
                  Utilizo <span translate='no'>cookies</span> e tecnologias similares para melhorar sua experiência:
                </p>
                
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[hsl(var(--secondary))]">
                        <th className="p-3 text-left">Tipo de <span translate='no'> Cookie</span></th>
                        <th className="p-3 text-left">Finalidade</th>
                        <th className="p-3 text-left">Duração</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[hsl(var(--border))]">
                        <td className="p-3 font-medium">Essenciais</td>
                        <td className="p-3">Funcionalidade básica do site</td>
                        <td className="p-3">Sessão</td>
                      </tr>
                      <tr className="border-b border-[hsl(var(--border))]">
                        <td className="p-3 font-medium">Analíticos</td>
                        <td className="p-3">Análise de uso e desempenho</td>
                        <td className="p-3">2 anos</td>
                      </tr>
                      <tr className="border-b border-[hsl(var(--border))]">
                        <td className="p-3 font-medium">Funcionais</td>
                        <td className="p-3">Lembrar preferências</td>
                        <td className="p-3">1 ano</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold mb-3">5.1. Controle de <span translate='no'>Cookies</span></h3>
                <p className="mb-4">
                  Você pode controlar e gerenciar <span translate='no'>cookies</span> através das configurações do seu navegador. 
                  No entanto, a desativação de <span translate='no'>cookies</span> essenciais pode afetar a funcionalidade do site.
                </p>

                <div className="bg-blue-200  border border-blue-700 rounded-lg p-4">
                  <p className="text-blue-700 text-sm">
                    <strong>💡 Dica:</strong> Acesse as configurações do seu navegador para gerenciar 
                    suas preferências de <span translate='no'>cookies</span>.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section id="security" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <Lock className="w-6 h-6 text-[hsl(var(--primary))] mr-2" />
                6. Segurança de Dados
              </h2>
              <button
                onClick={() => toggleSection('security')}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg"
              >
                {openSections.security ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            
            {openSections.security && (
              <div className="prose prose-lg max-w-none text-[hsl(var(--foreground))]">
                <p className="mb-4">
                  Implemento medidas de segurança robustas para proteger suas informações:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🔒 Criptografia</h4>
                    <p className="text-sm">Dados transmitidos via SSL/TLS</p>
                  </div>
                  
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🛡️ Proteção</h4>
                    <p className="text-sm">Firewalls e sistemas de detecção</p>
                  </div>
                  
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <h4 className="font-semibold mb-2">📋 Controles</h4>
                    <p className="text-sm">Acesso restrito aos dados</p>
                  </div>
                  
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🔄 Backup</h4>
                    <p className="text-sm">Cópias de segurança regulares</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3">6.1. Retenção de Dados</h3>
                <p className="mb-4">
                  Mantenho suas informações pessoais apenas pelo tempo necessário para cumprir 
                  as finalidades descritas nesta política, como exigido por lei.
                </p>

                <div className="bg-yellow-200  border-yellow-700 rounded-lg p-4">
                  <p className="text-yellow-700 text-sm">
                    <strong>⚠️ Importante:</strong> Embora implemento medidas de segurança robustas, 
                    nenhum sistema é 100% seguro. Recomendo que você também tome precauções para 
                    proteger suas informações.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section id="rights" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <User className="w-6 h-6 text-[hsl(var(--primary))] mr-2" />
                7. Seus Direitos
              </h2>
              <button
                onClick={() => toggleSection('rights')}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg"
              >
                {openSections.rights ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            
            {openSections.rights && (
              <div className="prose prose-lg max-w-none text-[hsl(var(--foreground))]">
                <p className="mb-4">
                  De acordo com a LGPD e outras leis de proteção de dados, você tem os seguintes direitos:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <h4 className="font-semibold mb-2">👁️ Acesso</h4>
                    <p className="text-sm">Solicitar cópia dos seus dados</p>
                  </div>
                  
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <h4 className="font-semibold mb-2">✏️ Correção</h4>
                    <p className="text-sm">Retificar dados imprecisos</p>
                  </div>
                  
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🗑️ Exclusão</h4>
                    <p className="text-sm">Solicitar exclusão de dados</p>
                  </div>
                  
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <h4 className="font-semibold mb-2">⏸️ Limitação</h4>
                    <p className="text-sm">Restringir processamento</p>
                  </div>
                  
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <h4 className="font-semibold mb-2">📤 Portabilidade</h4>
                    <p className="text-sm">Receber dados em formato estruturado</p>
                  </div>
                  
                  <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🚫 Oposição</h4>
                    <p className="text-sm">Opor-se ao processamento</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3">7.1. Como Exercer Seus Direitos</h3>
                <p className="mb-4">
                  Para exercer qualquer um desses direitos, entre em contato comigo através do 
                  email: <strong>technopro.net@gmail.com</strong>.
                </p>

                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Responderei a todas as solicitações legítimas dentro de 30 dias. 
                  Posso solicitar informações adicionais para verificar sua identidade.
                </p>
              </div>
            )}
          </section>

          <section id="changes">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <Clock className="w-6 h-6 text-[hsl(var(--primary))] mr-2" />
                8. Alterações nesta Política
              </h2>
              <button
                onClick={() => toggleSection('changes')}
                className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg"
              >
                {openSections.changes ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            
            {openSections.changes && (
              <div className="prose prose-lg max-w-none text-[hsl(var(--foreground))]">
                <p className="mb-4">
                  Eu posso atualizar esta Política de Privacidade periodicamente para refletir 
                  mudanças nas minhas práticas ou por outros motivos operacionais, legais ou regulatórios.
                </p>

                <p className="mb-4">
                  Quando eu fizer alterações significativas, notificarei você através do email 
                  fornecido ou por meio de um aviso no site. A data da última atualização 
                  será revisada no topo desta política.
                </p>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    <strong>📅 Recomendação:</strong> Reveja esta política periodicamente para 
                    estar ciente de como protego suas informações.
                  </p>
                </div>
              </div>
            )}
          </section>

          <div className="mt-12 pt-8 border-t border-[hsl(var(--border))]">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Mail className="w-6 h-6 text-[hsl(var(--primary))] mr-2" />
              Entre em Contato
            </h2>
            <p className="mb-4">
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como trato
              suas informações pessoais, entre em contato comigo:
            </p>
            
            <div className="bg-[hsl(var(--secondary))] rounded-lg p-4">
              <p className="mb-2">
                <strong>Email:</strong> technopro.net@gmail.com
              </p>
              <p>
                <strong>Horário de Atendimento:</strong> Segunda a Sexta, 9h às 18h
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="bg-[hsl(var(--card))] rounded-2xl p-6 border border-[hsl(var(--border))]">
            <p className="text-[hsl(var(--muted-foreground))]">
              Ao usar o site, você reconhece que leu e compreendeu esta Política de Privacidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}