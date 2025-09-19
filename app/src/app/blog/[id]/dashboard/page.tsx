
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from 'mdp/lib/supabase/client';
import { 
  FileText, 
  User, 
  BarChart3,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Edit3,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import BlogHeader from 'mdp/components/ui/blog/Header';
import BlogFooter from 'mdp/components/ui/blog/Footer';

interface Post {
  id: string;
  title: string;
  status: 'draft' | 'pending' | 'published';
  created_at: string;
  likes: number;
  views: number;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalLikes: 0,
    totalViews: 0
  });
  const router = useRouter()

  const menuItems = [
    { id: 'posts', label: 'Meus Posts', icon: FileText },
    { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
    { id: 'profile', label: 'Perfil', icon: User }
  ];

  // Buscar posts do usuário
  const fetchUserPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/blog/login');
        return;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, status, created_at, likes, views')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPosts(data || []);

      // Calcular estatísticas
      const publishedPosts = data?.filter(post => post.status === 'published').length || 0;
      const totalLikes = data?.reduce((sum, post) => sum + post.likes, 0) || 0;
      const totalViews = data?.reduce((sum, post) => sum + post.views, 0) || 0;

      setUserStats({
        totalPosts: data?.length || 0,
        publishedPosts,
        totalLikes,
        totalViews
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        throw error;
      }

      // Recarregar posts
      fetchUserPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'draft':
        return <Edit3 className="w-4 h-4 text-gray-600" />;
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
      case 'draft':
        return 'Rascunho';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      
      <div className="flex">
        <aside className={`
          fixed md:static w-64 bg-card h-screen flex-shrink-0 z-40
          transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
            
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/blog');
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Overlay para mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6 md:hidden">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-accent"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="w-9"></div> 
          </div>

          {activeTab === 'posts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Meus Posts</h2>
                <button
                  onClick={() => router.push('/blog/post/create')}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 flex items-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Novo Post</span>
                </button>
              </div>

              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-card border rounded-lg p-4">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece criando seu primeiro post!
                  </p>
                  <button
                    onClick={() => router.push('/blog/post/create')}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90"
                  >
                    Criar Primeiro Post
                  </button>
                </div>
              ) : (
                <div className="bg-card border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-4 font-semibold bg-muted p-4">
                    <div>Título</div>
                    <div>Status</div>
                    <div>Estatísticas</div>
                    <div>Ações</div>
                  </div>
                  
                  {posts.map((post) => (
                    <div key={post.id} className="grid grid-cols-1 md:grid-cols-4 p-4 border-b last:border-b-0 items-center">
                      <div className="font-medium truncate">{post.title}</div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(post.status)}
                        <span>{getStatusText(post.status)}</span>
                      </div>
                      
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        <span>❤️ {post.likes}</span>
                        <span>👁️ {post.views}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/blog/post/${post.id}`)}
                          className="p-2 hover:bg-accent rounded"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/blog/post/edit/${post.id}`)}
                          className="p-2 hover:bg-accent rounded"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 hover:bg-accent rounded text-red-600"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Estatísticas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {userStats.totalPosts}
                  </div>
                  <div className="text-muted-foreground">Total de Posts</div>
                </div>
                
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {userStats.publishedPosts}
                  </div>
                  <div className="text-muted-foreground">Posts Publicados</div>
                </div>
                
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {userStats.totalLikes}
                  </div>
                  <div className="text-muted-foreground">Total de Likes</div>
                </div>
                
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {userStats.totalViews}
                  </div>
                  <div className="text-muted-foreground">Total de Visualizações</div>
                </div>
              </div>

              {/* Gráficos de estatísticas */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Desempenho dos Posts</h3>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Gráficos de estatísticas serão implementados aqui</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <ProfileEditor />
          )}
        </main>
      </div>

      <BlogFooter />
    </div>
  );
}

// Componente de Edição de Perfil
function ProfileEditor() {
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    website: '',
    avatar_url: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Buscar perfil do usuário
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('authors')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile({
            username: data.username || '',
            bio: data.bio || '',
            website: data.website || '',
            avatar_url: data.avatar_url || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('authors')
        .update({
          username: profile.username,
          bio: profile.bio,
          website: profile.website,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erro ao atualizar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-2xl font-semibold mb-6">Editar Perfil</h2>
        <div className="space-y-4">
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Editar Perfil</h2>
      
      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nome de Usuário</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Biografia</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Conte um pouco sobre você..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Website</label>
          <input
            type="url"
            value={profile.website}
            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://exemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Foto de Perfil</label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              className="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
            >
              Alterar Foto
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}
