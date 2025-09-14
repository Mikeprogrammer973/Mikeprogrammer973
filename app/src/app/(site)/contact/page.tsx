
'use client'

import { useEffect, useState } from 'react'
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Briefcase, 
  Users, 
  HelpCircle,
  Quote,
  Send,
  CheckCircle,
} from 'lucide-react'
import { Button } from 'mdp/components/ui/button'
import { supabase } from 'mdp/lib/supabase/client'
import { Spinner } from 'mdp/components/ui/spinner'
import Link from 'next/link'
import { Message, Profile } from 'mdp/lib/supabase/types/database'
import { EmailService } from 'mdp/lib/email/service'
import EmailVerification from 'mdp/components/EmailVerification'
import { useEmailVerification } from 'mdp/hooks/useEmailVerification'
import { useClientIp } from 'mdp/hooks/useClientIp'

type ContactType = 'general' | 'quote' | 'project' | 'collaboration' | 'question'

export default function ContactPage() {
  const [selectedType, setSelectedType] = useState<ContactType>('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile>()
  const {ip} = useClientIp()
  const [data, setData] = useState<Message>(
    {
      name: '',
      email: '',
      phone: '',
      company: '',
      type: 'general',
      subject: '',
      message: '',
      budget: '',
      deadline: '',
      read: false,
      archived: false,
      ip_address: ip,
      user_agent: ''
    }
  )

  const {
    isVerifying,
    verificationEmail,
    startVerification,
    handleVerificationComplete,
    handleSendCode
  } = useEmailVerification({
    onVerificationSuccess: async () => {
      console.log('Verificação bem-sucedida')
      
      try {
        const { error } = await supabase
          .from('messages')
          .insert([data])

        if (error) throw error
        
        setIsSubmitted(true)

        await EmailService.sendContactConfirmation(
          {
            name: data.name,
            email: data.email
          }
        )
      } catch (error) {
        console.error('Error sending message:', error)
        alert('Erro ao enviar mensagem. Tente novamente. 》》' + error?.message)
      } finally {
        setIsSubmitting(false)
      }
    },
    onVerificationFailure: () => {
      console.log('Falha na verificação do email')
      setIsSubmitting(false)
      alert('Falha na verificação do email. Tente novamente.')
    }
  })

  useEffect(() => {
    fetchProfile()
  })

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').single()
      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  fetchProfile()


  const contactTypes = [
    {
      id: 'general',
      label: 'Mensagem Geral',
      icon: MessageSquare,
      description: 'Dúvidas, comentários ou informações gerais'
    },
    {
      id: 'quote',
      label: 'Pedido de Orçamento',
      icon: Quote,
      description: 'Solicitar orçamento para um projeto'
    },
    {
      id: 'project',
      label: 'Falar de Projeto',
      icon: Briefcase,
      description: 'Discutir detalhes de um projeto específico'
    },
    {
      id: 'collaboration',
      label: 'Colaboração',
      icon: Users,
      description: 'Proposta de parceria ou colaboração'
    },
    {
      id: 'question',
      label: 'Perguntas Técnicas',
      icon: HelpCircle,
      description: 'Dúvidas técnicas sobre desenvolvimento'
    }
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    setData((prev) =>{
      return {
        ...prev,
        ...Object.fromEntries(formData),
        type: selectedType,
        user_agent: window.navigator.userAgent
      }
    })

    startVerification(formData.get('email') as string)
  }

  if (isVerifying) {
    return (
      <div className='min-h-screen p-10 flex items-center justify-center'>
        <EmailVerification
          email={verificationEmail}
          onVerificationComplete={handleVerificationComplete}
          onResendCode={handleSendCode}
          className="max-w-md mx-auto"
        />
      </div>
    )
  }

  if(isSubmitting || loading) {
    return <Spinner />
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-[hsl(var(--primary))]" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Mensagem Enviada!</h1>
            <p className="text-xl text-[hsl(var(--muted-foreground))] mb-8 max-w-2xl mx-auto">
              Obrigado por ter me contatado. Retornarei sua mensagem o mais breve possível.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="rounded-full"
                variant="outline"
              >
                Enviar outra mensagem
              </Button>
              <Button asChild className="rounded-full text-white">
                <Link href="/">
                  Voltar ao início
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Vamos Trabalhar Juntos</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Entre em contato comigo para discutir seu projeto, solicitar um orçamento ou simplesmente conversar sobre ideias
          </p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* contatos */}
          <div className="lg:col-span-1">
            <div className="bg-[hsl(var(--card))] rounded-2xl p-8 border border-[hsl(var(--border))] shadow-sm h-full">
              <h2 className="text-2xl font-semibold mb-8">Informações de Contato</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[hsl(var(--primary))]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-[hsl(var(--muted-foreground))]">{profile?.email}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]/80">Resposta em até 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[hsl(var(--primary))]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Telefone</h3>
                    <p className="text-[hsl(var(--muted-foreground))]">{profile?.phone}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]/80">Seg a Sex, 9h-18h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[hsl(var(--primary))]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Localização</h3>
                    <p className="text-[hsl(var(--muted-foreground))]">{profile?.address}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]/80">Atendimento remoto worldwide</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-[hsl(var(--border))]">
                <h3 className="font-semibold mb-4">Por que me escolher?</h3>
                <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--primary))] mr-2" />
                    Resposta rápida e profissional
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--primary))] mr-2" />
                    Orçamentos transparentes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--primary))] mr-2" />
                    Desenvolvimento de qualidade
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--primary))] mr-2" />
                    Suporte contínuo
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* form de contato */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <h2 className="text-2xl font-semibold mb-8">Envie sua Mensagem</h2>

              {/* seletor de tipo de contato */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {contactTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id as ContactType)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedType === type.id
                          ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]'
                          : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))]/50'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <h3 className="font-semibold text-sm mb-1">{type.label}</h3>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{type.description}</p>
                    </button>
                  )
                })}
              </div>

              {/*formulário */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent bg-[hsl(var(--background))]"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent bg-[hsl(var(--background))]"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Telefone/WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent bg-[hsl(var(--background))]"
                      placeholder="(514) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Empresa/Projeto
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent bg-[hsl(var(--background))]"
                      placeholder="Nome da empresa ou projeto"
                    />
                  </div>
                </div>

                {(selectedType === 'quote' || selectedType === 'project') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedType === 'quote' && (
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium mb-2">
                          Orçamento Previsto
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent bg-[hsl(var(--background))]"
                        >
                          <option value="">Selecione uma faixa</option>
                          <option value="1-5k">USD 1.000 - 5.000</option>
                          <option value="5-10k">USD 5.000 - 10.000</option>
                          <option value="10-20k">USD 10.000 - 20.000</option>
                          <option value="20-50k">USD 20.000 - 50.000</option>
                          <option value="50k+">Acima de USD 50.000</option>
                          <option value="undefined">A definir</option>
                        </select>
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="deadline" className="block text-sm font-medium mb-2">
                        Prazo Desejado
                      </label>
                      <select
                        id="deadline"
                        name="deadline"
                        className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent bg-[hsl(var(--background))]"
                      >
                        <option value="">Selecione um prazo</option>
                        <option value="urgent">Urgente (1-2 semanas)</option>
                        <option value="2-4 weeks">2-4 semanas</option>
                        <option value="1-2 months">1-2 meses</option>
                        <option value="2-4 months">2-4 meses</option>
                        <option value="flexible">Prazo flexível</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Assunto *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent bg-[hsl(var(--background))]"
                    placeholder="Resumo do assunto"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent bg-[hsl(var(--background))] resize-none"
                    placeholder="Descreva em detalhes sua solicitação, projeto ou dúvida..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white rounded-full py-6 text-lg font-semibold"
                >
                    Enviar
                    <Send className="w-5 h-5 ml-2 inline-block" />
                </Button>
              </form>
            </div>

            <div className="mt-8 bg-[hsl(var(--primary))]/5 rounded-2xl p-6 border border-[hsl(var(--primary))]/10">
              <h3 className="font-semibold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-[hsl(var(--primary))] mr-2" />
                O que acontece depois do envio?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-8 h-8 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-[hsl(var(--primary))] font-semibold">1</span>
                  </div>
                  <p className="text-[hsl(var(--muted-foreground))]">Confirmação de recebimento em até 2h</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-[hsl(var(--primary))] font-semibold">2</span>
                  </div>
                  <p className="text-[hsl(var(--muted-foreground))]">Análise detalhada da sua solicitação</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-[hsl(var(--primary))] font-semibold">3</span>
                  </div>
                  <p className="text-[hsl(var(--muted-foreground))]">Resposta completa em até 24h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
