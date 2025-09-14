
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useEmailVerification } from 'mdp/hooks/useEmailVerification';
import EmailVerification from 'mdp/components/EmailVerification';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const {
    isVerifying,
    verificationEmail,
    startVerification,
    handleVerificationComplete,
    handleSendCode
  } = useEmailVerification(
    {
      onVerificationSuccess: async () => {
        try {
          const response = await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name }),
          });

          const data = await response.json();

          if (data.success) {
            setMessage({
              type: 'success',
              text: 'Inscrição realizada com sucesso! Verifique seu email para confirmar.'
            });
            setEmail('');
            setName('');
          } else {
            setMessage({
              type: 'error',
              text: data.error || 'Erro ao realizar inscrição. Tente novamente.'
            });
          }
        } catch (error) {
          setMessage({
            type: 'error',
            text: 'Erro de conexão. Tente novamente.'
          });
        } finally {
          setIsLoading(false);
        }
      },
      onVerificationFailure() {
        console.log('Falha na verificação do email')
        alert('Falha na verificação do email. Tente novamente.')
      },
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    startVerification(email)
  };

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

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm hover:scale-105 transition-transform duration-300">
              <span translate='no' className="font-mono tracking-tighter">mdp</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-4">
            Newsletter
          </h1>
          <p className="text-gray-400">
            Receba atualizações sobre novos projetos, artigos e novidades.
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Nome (opcional)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-900/20 border border-green-800 text-green-400' 
                  : 'bg-red-900/20 border border-red-800 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Inscrevendo...' : 'Inscrever-se'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-400 text-center">
              Ao se inscrever, você concorda em receber emails sobre atualizações do portfólio. 
              Você pode cancelar a qualquer momento.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link 
            href="/"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}