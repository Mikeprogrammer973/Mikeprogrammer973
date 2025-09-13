
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from 'mdp/lib/supabase/client';
import { ArrowLeft, Search, Mail, User, Trash2, Download } from 'lucide-react';
import { useAuth } from 'mdp/hooks/useAuth';
import { Spinner } from 'mdp/components/ui/spinner';
import { EmailService } from 'mdp/lib/email/service';

interface NewsletterSubscription {
  id: string;
  email: string;
  name: string | null;
  subscribed: boolean;
  subscription_date: string;
  unsubscribe_date: string | null;
  unsubscribe_reason: string | null;
  created_at: string;
}

export default function AdminNewsletterPage() {
  const { loading} =  useAuth(true)
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [__loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'subscribed' | 'unsubscribed'>('all');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    filterSubscriptions();
  }, [subscriptions, searchTerm, statusFilter]);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSubscriptions = () => {
    let filtered = subscriptions.filter(sub =>
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => 
        statusFilter === 'subscribed' ? sub.subscribed : !sub.subscribed
      );
    }

    setFilteredSubscriptions(filtered);
  };

  const deleteSubscription = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta inscrição?')) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('id', id)

        // enviar email de cancelamento
        await EmailService.sendUnsubscribeConfirmation(
            {
                email: subscriptions.find(sub => sub.id === id)?.email || '',
                name: subscriptions.find(sub => sub.id === id)?.name || ''
            }
        )

      if (error) throw error;
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert('Erro ao excluir inscrição');
    }
  };

  const exportCSV = () => {
    const headers = ['Email', 'Nome', 'Status', 'Data Inscrição', 'Data Cancelamento', 'Motivo'];
    const csvData = filteredSubscriptions.map(sub => [
      sub.email,
      sub.name || '',
      sub.subscribed ? 'Inscrito' : 'Cancelado',
      new Date(sub.subscription_date).toLocaleDateString('pt-BR'),
      sub.unsubscribe_date ? new Date(sub.unsubscribe_date).toLocaleDateString('pt-BR') : '',
      sub.unsubscribe_reason || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || __loading) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-3xl font-bold">Gerenciar Newsletter</h1>
          </div>
          
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </button>
        </div>

        {/* filtros */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Buscar</label>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por email ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="subscribed">Inscritos</option>
                <option value="unsubscribed">Cancelados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-white">
              {subscriptions.length}
            </div>
            <div className="text-gray-400">Total de Inscrições</div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-white">
              {subscriptions.filter(s => s.subscribed).length}
            </div>
            <div className="text-gray-400">Inscritos Ativos</div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-white">
              {subscriptions.filter(s => !s.subscribed).length}
            </div>
            <div className="text-gray-400">Inscritos Cancelados</div>
          </div>
        </div>

        {/* Subscriptions Lista */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Data Inscrição</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-sm text-white">{subscription.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{subscription.name || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscription.subscribed
                          ? 'bg-green-900 text-green-300'
                          : 'bg-red-900 text-red-300'
                      }`}>
                        {subscription.subscribed ? 'Ativo' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {new Date(subscription.subscription_date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteSubscription(subscription.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Excluir inscrição"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Nenhuma inscrição encontrada
              </h3>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Ainda não há inscrições na newsletter'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}