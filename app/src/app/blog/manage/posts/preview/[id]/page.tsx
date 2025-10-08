
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'
import { 
  Eye, 
  CheckCircle, 
  Edit, 
  ArrowLeft,
  FileText,
  Send,
  Share2Icon,
  Heart,
  XCircleIcon
} from 'lucide-react';
import { supabase } from 'mdp/lib/supabase/client';
import getUser, { User } from 'mdp/lib/getUser';
import { Spinner } from 'mdp/components/ui/spinner';
import BlogHeader from 'mdp/components/ui/blog/Header';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image: string;
  status: string;
  tags: string[];
  published_at: string;
  author: {
    id: string;
    username: string;
    avatar_url: string;
  };
  category: {
    id: string;
    name: string;
  };
  rejection_reason: string;
}

export default function UserPreviewPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const user = await getUser()

            if (!user) {
            router.push('/blog/login')
            return
            }

            setUser(user)
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if(user) fetchPost();
  }, [params.id, user]);

  useEffect(() => {
    document.getElementsByTagName('title')[0].setAttribute('translate', 'no')
    document.title = `MDP Blog | Preview | ${post?.title}`
  }, [post])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:authors(id, username, avatar_url),
          category:blog_posts_categories(id, name)
        `)
        .eq('id', params.id)
        .eq('author_id', user?.profile.id)
        .single();

      if (error) throw error;

      if (!data) {
        // router.push('/blog/manage');
        return;
      }

      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      // router.push('/blog/manage');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!post) return;

    setIsPublishing(true);
    
    try {
      if (!user) return;

      const requiresModeration = false
      const newStatus = requiresModeration ? 'pending' : 'published';

      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          status: newStatus,
          ...(newStatus === 'published' && { published_at: new Date().toISOString() })
        })
        .eq('id', post.id)
        .eq('author_id', user.profile.id);

      if (error) throw error;

      router.push('/blog/manage')
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Erro ao publicar post. Tente novamente.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!post) return;

    try {
      if (!user) return;

      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          status: 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id)
        .eq('author_id', user.profile.id);

      if (error) throw error;

      router.push('/blog/manage');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Erro ao salvar rascunho. Tente novamente.');
    }
  };

  if (isLoading) {
    return <Spinner />
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <div className="text-center">
          <Eye className="w-16 h-16 text-[hsl(var(--muted-foreground)] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Artigo não encontrado</h2>
          <p className="text-[hsl(var(--muted-foreground)] mb-4">
            O artigo que você está tentando visualizar não existe ou você não tem permissão para acessá-lo.
          </p>
          <button
            onClick={() => router.push('/blog/manage')}
            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-2 rounded-md hover:opacity-90"
          >
            Voltar para o dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <BlogHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/blog/manage')}
            className="flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para o dashboard
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              Preview
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              post.status === 'draft' ? 'bg-gray-100 text-gray-800' :
              post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              post.status === 'published' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {post.status === 'draft' ? 'Rascunho' : post.status === 'pending' ? 'Pendente' : post.status === 'published' ? 'Publicado' : 'Rejeitado'}
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Preview */}
          <article className="max-w-3xl mx-auto my-5">
            <header className="mb-8">
            <h1 translate='no' className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-[hsl(var(--muted-foreground))] mb-4">
                <span translate='no' className="text-[hsl(var(--primary))]">{post.category.name}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString('pt-BR')}</span>
                <span>•</span>
                <span>{Math.ceil(post.content.split(' ').length / 200)} min de leitura</span>
            </div>
            
            <div onClick={() => router.push(`/blog/authors/${post.author?.id}`)} translate='no' className="flex items-center gap-3 mb-6 cursor-pointer">
                {post.author && post.author.avatar_url
                    ? <img
                        src={post.author.avatar_url || ''}
                        alt={post.author.username || 'Autor'}
                        className="w-10 h-10 rounded-full"
                    />
                    : <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                    </div> 
                }
                <div>
                    <div className="font-semibold">{post.author?.username || 'Autor'}</div>
                </div>
            </div>

            {post.cover_image && (
                <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
                />
            )}
            </header>

            <div
            translate='no'
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Rodapé */}
            <footer translate='no' className="mt-12 pt-8 border-t">
              <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags?.map((tag: string) => (
                  <span
                      key={tag}
                      className="px-3 py-1 bg-[hsl(var(--muted))] rounded-full text-sm"
                  >
                      #{tag}
                  </span>
                  ))}
              </div>

              <div className="flex items-center justify-between">
                  <div>
                    <Heart className='w-5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]' />
                  </div>

                  <button translate='yes' className="flex items-center gap-2 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] p-3">
                      <Share2Icon className='w-5 text-[hsl(var(--primary))]' />
                      <span>Compartilhar</span>
                  </button>
              </div>
            </footer>
          </article>

            <div className="bg-[hsl(var(--card))] border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Ações do Artigo
            </h3>
            
            <p className="text-[hsl(var(--muted-foreground)))] mb-6">
              Esta é uma prévia de como seu post aparecerá para os leitores. 
              Revise o conteúdo antes de publicar.
            </p>

            {post.status !== 'pending' && <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push(`/blog/manage/posts/edit/${post.id}`)}
                className="flex items-center justify-center px-6 py-3 border-2 border-[hsl(var(--primary))] text-[hsl(var(--primary))] rounded-lg hover:bg-[hsl(var(--primary))]/10 transition-colors"
              >
                <Edit className="w-5 h-5 mr-2" />
                Editar Artigo
              </button>

             {post.status !== 'rejected' && <><button
                onClick={handleSaveDraft}
                className="flex items-center justify-center px-6 py-3 border-2 border-[hsl(var(--foreground))] text-[hsl(var(--foreground))] rounded-lg hover:bg-[hsl(var(--foreground))]/20 transition-colors"
              >
                <FileText className="w-5 h-5 mr-2" />
                Salvar como Rascunho
              </button>

              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex items-center justify-center px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                    Publicando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Publicar o Artigo
                  </>
                )}
              </button></>}
            </div>}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              {post.status !== 'rejected' 
                ? <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Processo de Publicação</h4>
                      <p className="text-blue-800 text-sm">
                        Seu artigo será revisado pelo administrador do blog antes de ser publicado. 
                        Você receberá uma notificação quando ele for aprovado.
                      </p>
                    </div>
                </div>
                : <div className="flex items-start">
                    <XCircleIcon className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-900 mb-1">O seu artigo foi rejeitado!</h4>
                      <p className="text-red-700 text-lg my-4">
                        Motivo: <span translate='no'>{post.rejection_reason}</span>
                      </p>
                    </div>
                </div>
              }
            </div>
          </div>

          <div className="mt-6 bg-[hsl(var(--muted))] border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Checklist de Revisão</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Título atrativo</span>
                  <p className="text-[hsl(var(--muted-foreground)))]">Seu título chama atenção?</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Imagem de capa</span>
                  <p className="text-[hsl(var(--muted-foreground)))]">A imagem está adequada?</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Conteúdo formatado</span>
                  <p className="text-[hsl(var(--muted-foreground)))]">O texto está bem organizado?</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Tags relevantes</span>
                  <p className="text-[hsl(var(--muted-foreground)))]">As tags são apropriadas?</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Sem erros ortográficos</span>
                  <p className="text-[hsl(var(--muted-foreground)))]">Revisou a ortografia?</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Categoria correta</span>
                  <p className="text-[hsl(var(--muted-foreground)))]">A categoria está apropriada?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}