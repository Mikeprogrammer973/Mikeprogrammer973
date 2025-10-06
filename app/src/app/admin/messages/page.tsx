
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from 'mdp/lib/supabase/client';
import { Button } from 'mdp/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'mdp/components/ui/card';
import { 
  Search, 
  Mail, 
  Eye, 
  EyeOff, 
  Archive, 
  Trash2, 
  Reply,
  Send,
  User,
  Clock,
  Phone,
  Building
} from 'lucide-react';
import ComposeEmailModal from 'mdp/components/admin/ComposeEmailModal';
import { Spinner } from 'mdp/components/ui/spinner';
import { useAuth } from 'mdp/hooks/useAuth';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  budget: string | null;
  deadline: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  archived: boolean;
  type: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export default function AdminMessagesPage() {
  const {} = useAuth(true)
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'general' | 'quote' | 'project' | 'collaboration' | 'question'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, statusFilter, typeFilter]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages.filter(msg =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(msg => {
        if (statusFilter === 'unread') return !msg.read;
        if (statusFilter === 'read') return msg.read;
        if (statusFilter === 'archived') return msg.archived;
        return true;
      });
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(msg => msg.type === typeFilter);
    }

    setFilteredMessages(filtered);
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.map(msg =>
        msg.id === id ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: false })
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.map(msg =>
        msg.id === id ? { ...msg, read: false } : msg
      ));
    } catch (error) {
      console.error('Error marking as unread:', error);
    }
  };

  const archiveMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ archived: true })
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.map(msg =>
        msg.id === id ? { ...msg, archived: true } : msg
      ));
    } catch (error) {
      console.error('Error archiving message:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center flex-wrap gap-4 justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Mensagens</h1>
          </div>
          
          <Button 
            onClick={() => setShowCompose(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Email
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-white">
                {messages.length}
              </div>
              <div className="text-gray-400">Total</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <EyeOff className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-white">
                {messages.filter(m => !m.read).length}
              </div>
              <div className="text-gray-400">Não Lidas</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-white">
                {messages.filter(m => m.read).length}
              </div>
              <div className="text-gray-400">Lidas</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Archive className="w-6 h-6 text-gray-500" />
              </div>
              <div className="text-2xl font-bold text-white">
                {messages.filter(m => m.archived).length}
              </div>
              <div className="text-gray-400">Arquivadas</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Buscar</label>
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar mensagens..."
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
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'unread' | 'read' | 'archived' )}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="unread">Não lidas</option>
                    <option value="read">Lidas</option>
                    <option value="archived">Arquivadas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Tipo</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as 'all' | 'general' | 'quote' | 'project' | 'collaboration' | 'question')}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="general">Geral</option>
                    <option value="quote">Orçamento</option>
                    <option value="project">Projeto</option>
                    <option value="collaboration">Colaboração</option>
                    <option value="question">Pergunta</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* mensagens */}
            <div className="mt-6 space-y-2">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.read) markAsRead(message.id);
                  }}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id
                      ? 'bg-blue-600/20 border border-blue-500'
                      : message.read
                      ? 'bg-gray-800 hover:bg-gray-700'
                      : 'bg-gray-900 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${!message.read ? 'text-white' : 'text-gray-300'}`}>
                        {message.name}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">{message.email}</p>
                      {message.subject && (
                        <p className="text-sm text-gray-500 mt-1 truncate">{message.subject}</p>
                      )}
                    </div>
                    {!message.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(message.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}

              {filteredMessages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma mensagem encontrada</p>
                </div>
              )}
            </div>
          </div>

          {/* visualização da mensagem */}
          <div className="lg:col-span-3">
            {selectedMessage ? (
              <Card className="bg-gray-900 border-gray-800 h-full">
                <CardHeader>
                  <div className="flex items-center flex-wrap gap-4 justify-between">
                    <CardTitle>{selectedMessage.subject || 'Sem assunto'}</CardTitle>
                    <div className="flex flex-wrap gap-4 space-x-2">
                      {selectedMessage.read ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsUnread(selectedMessage.id)}
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          <EyeOff className="w-4 h-4 mr-1" />
                          Marcar como não lida
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(selectedMessage.id)}
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Marcar como lida
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => archiveMessage(selectedMessage.id)}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <Archive className="w-4 h-4 mr-1" />
                        Arquivar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="border-red-800 text-red-400 hover:bg-red-900"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Remetente</h4>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-white">{selectedMessage.name}</p>
                          <p className="text-gray-400 text-sm">{selectedMessage.email}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Informações</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300">
                          <Clock className="w-4 h-4 inline mr-2" />
                          {new Date(selectedMessage.created_at).toLocaleString('pt-BR')}
                        </p>
                        {selectedMessage.phone && (
                          <p className="text-gray-300">
                            <Phone className="w-4 h-4 inline mr-2" />
                            {selectedMessage.phone}
                          </p>
                        )}
                        {selectedMessage.company && (
                          <p className="text-gray-300">
                            <Building className="w-4 h-4 inline mr-2" />
                            {selectedMessage.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {(selectedMessage.budget || selectedMessage.deadline) && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Detalhes do Orçamento</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedMessage.budget && (
                          <div>
                            <span className="text-sm text-gray-400">Orçamento:</span>
                            <p className="text-white">{selectedMessage.budget}</p>
                          </div>
                        )}
                        {selectedMessage.deadline && (
                          <div>
                            <span className="text-sm text-gray-400">Prazo:</span>
                            <p className="text-white">{selectedMessage.deadline}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Mensagem</h4>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex space-x-4 pt-4 border-t border-gray-800">
                    <Button
                      onClick={() => setShowCompose(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Responder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-900 border-gray-800 h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Selecione uma mensagem</h3>
                  <p className="text-gray-400">Escolha uma mensagem da lista para visualizar seu conteúdo</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {showCompose && (
          <ComposeEmailModal
            message={selectedMessage}
            onClose={() => setShowCompose(false)}
            onSend={() => {
              setShowCompose(false);
              // envio
            }}
          />
        )}
      </div>
    </div>
  );
}
