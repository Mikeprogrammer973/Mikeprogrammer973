
'use client';

import { useState } from 'react';
import { X, Send, User } from 'lucide-react';
import { Button } from 'mdp/components/ui/button';
import { EmailService } from 'mdp/lib/email/service';
import { Message } from 'mdp/lib/supabase/types/database';

interface ComposeEmailModalProps {
  message: Message | null;
  onClose: () => void;
  onSend: () => void;
}

export default function ComposeEmailModal({ message, onClose, onSend }: ComposeEmailModalProps) {
  const [formData, setFormData] = useState({
    to: message?.email || '',
    subject: `Re: ${message?.subject}`,
    title: '',
    message: '',
    ctaText: '',
    ctaUrl: '',
    additionalContent: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await EmailService.sendGeneralEmail(
        {
          name: message?.name || 'Cliente',
          email: formData.to
        },
        {
          subject: formData.subject,
          title: formData.title || formData.subject,
          message: formData.message,
          cta: formData.ctaText ? {
            text: formData.ctaText,
            url: formData.ctaUrl
          } : undefined,
          additionalContent: formData.additionalContent
        }
      );

      onSend();
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      alert('Erro ao enviar email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Enviar Email</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Para</label>
            <div className="flex items-center space-x-3 bg-gray-800 rounded-lg p-3">
              <User className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-white">{message?.name || 'Cliente'}</p>
                <p className="text-gray-400 text-sm">{formData.to}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Assunto *</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Assunto do email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Título *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título do email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mensagem *</label>
            <textarea
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Escreva sua mensagem aqui..."
            />
          </div>

          {/* CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Texto do Botão (opcional)</label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Ver Projeto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL do Botão (opcional)</label>
              <input
                type="url"
                value={formData.ctaUrl}
                onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: https://mikedp.vercel.app"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Conteúdo Adicional (opcional)</label>
            <textarea
              rows={3}
              value={formData.additionalContent}
              onChange={(e) => setFormData({ ...formData, additionalContent: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Conteúdo adicional em HTML..."
            />
          </div>

          {/* Ações */}
          <div className="flex space-x-4 pt-6 border-t border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isLoading ? 'Enviando...' : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Email
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}