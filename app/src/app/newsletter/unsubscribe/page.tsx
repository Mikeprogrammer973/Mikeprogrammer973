
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, reason }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        alert(data.error || 'Erro ao cancelar inscrição');
      }
    } catch (error) {
      alert('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Inscrição Cancelada</h1>
          
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 max-w-md mx-auto">
            <p className="text-gray-300 mb-6">
              Sua inscrição foi cancelada com sucesso. Você não receberá mais emails da minha newsletter.
            </p>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400">
                💡 Se foi um engano, você pode se reinscrever a qualquer momento visitando minha página de newsletter.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Voltar ao Início
              </Link>
              <Link
                href="/newsletter"
                className="border border-gray-700 text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Inscrever-se Novamente
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm hover:scale-105 transition-transform duration-300">
              <span className="font-mono tracking-tighter">mdp</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-4">
            Cancelar Inscrição
          </h1>
          <p className="text-gray-400">
            Sentirei sua falta! Digite seu email para cancelar a inscrição.
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
                Motivo (opcional)
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um motivo...</option>
                <option value="too-many-emails">Recebo muitos emails</option>
                <option value="not-relevant">Conteúdo não é relevante</option>
                <option value="other">Outro motivo</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Cancelando...' : 'Cancelar Inscrição'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-400 text-center">
              Ao cancelar, você não receberá mais atualizações sobre novos projetos e artigos.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link 
            href="/newsletter"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Voltar para inscrição
          </Link>
        </div>
      </div>
    </div>
  );
}