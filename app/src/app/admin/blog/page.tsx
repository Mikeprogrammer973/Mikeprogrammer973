
'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle,
  XCircle,
  Eye,
  Search,
  AlertCircle,
  Clock,
  XIcon,
  Trash2Icon
} from 'lucide-react';
import { supabase } from 'mdp/lib/supabase/client';
import { Spinner } from 'mdp/components/ui/spinner';
import ModerationDetails from 'mdp/components/admin/blog/moderation_details';
import { useAuth } from 'mdp/hooks/useAuth';

interface Post {
  id: string;
  title: string;
  cover_image?: string;
  tags: string[];
  excerpt: string;
  content: string;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  created_at: string;
  published_at?: string;
  author: {
    username: string;
    email: string;
    avatar_url?: string;
    id: string;
  };
  views: number;
  category: {
    name: string;
  }
  likes: {
    author_id: string;
  }[]
  moderated_by?: string;
  moderated_at?: string;
  rejection_reason?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [details, setDetails] = useState<{ visible: boolean, post: Post | null}>({ visible: false, post: null });
  const [stats, setStats] = useState({
    pending: 0,
    published: 0,
    rejected: 0,
    total: 0
  });
  const {loading, session} = useAuth(true)

  const tabs = [
    { id: 'pending', label: 'Pendentes', count: stats.pending },
    { id: 'published', label: 'Publicados', count: stats.published },
    { id: 'rejected', label: 'Rejeitados', count: stats.rejected },
    { id: 'all', label: 'Todos', count: stats.total }
  ];

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:authors(username, email),
          category:blog_posts_categories(name)
        `, { count: 'exact' });

      // por status
      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }

      // Buscar com ordenação
      const { data, error, count } = await query
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts(data || []);

      // Buscar estatísticas
      fetchStats();
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('status', { count: 'exact' });

      if (error) throw error;

      const stats = {
        pending: data.filter(post => post.status === 'pending').length,
        published: data.filter(post => post.status === 'published').length,
        rejected: data.filter(post => post.status === 'rejected').length,
        total: data.length
      };

      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post permanentemente?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'pending':
        return 'Pendente';
      case 'rejected':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  if (isLoading || loading) {
    return <Spinner />
  }

  if (details.visible) {
    return (
        <div>
            <div className='my-10 w-10 flex items-center justify-center p-1 rounded-lg bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-pointer hover:text-[hsl(var(--primary))]'>
                <XIcon onClick={() => setDetails({ visible: false, post: null })} className="w-6 h-6 cursor-pointer" />
            </div>
           <ModerationDetails post={details.post} onModerationComplete={() => {
                setDetails({ visible: false, post: null });
                fetchPosts();
           }} />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blog</h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              Moderação e gerenciamento de conteúdo
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))] w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              />
            </div>
            
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[hsl(var(--card))] border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
            <div className="text-[hsl(var(--muted-foreground))]">Total Posts</div>
          </div>
          
          <div className="bg-[hsl(var(--card))] border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pending}</div>
            <div className="text-[hsl(var(--muted-foreground))]">Pendentes</div>
          </div>
          
          <div className="bg-[hsl(var(--card))] border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.published}</div>
            <div className="text-[hsl(var(--muted-foreground))]">Publicados</div>
          </div>
          
          <div className="bg-[hsl(var(--card))] border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.rejected}</div>
            <div className="text-[hsl(var(--muted-foreground))]">Rejeitados</div>
          </div>
        </div>

        <div className="border-b mb-6">
          <nav className="flex flex-wrap gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                    : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-[hsl(var(--muted))] rounded-full px-2 py-1 text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* posts */}
        <div className="bg-[hsl(var(--card))] border rounded-lg overflow-hidden">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                {activeTab === 'pending' 
                  ? 'Não há posts pendentes de aprovação'
                  : 'Nenhum post corresponde aos filtros'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-[hsl(var(--muted))]/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {post.title.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[hsl(var(--foreground))]">
                              {post.title}
                            </div>
                            <div className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-1">
                              {post.excerpt}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[hsl(var(--foreground))]">{post?.author?.username}</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">{post?.author?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {post.category?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(post.status)}
                          <span className="ml-2 text-sm">{getStatusText(post.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--muted-foreground))]">
                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setDetails({ visible: true, post })}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Excluir"
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {filteredPosts.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              Mostrando {filteredPosts.length} de {posts.length} posts
            </div>
            
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded-md text-sm hover:bg-[hsl(var(--accent))] disabled:opacity-50">
                Anterior
              </button>
              <button className="px-3 py-1 border rounded-md text-sm hover:bg-[hsl(var(--accent))] disabled:opacity-50">
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
