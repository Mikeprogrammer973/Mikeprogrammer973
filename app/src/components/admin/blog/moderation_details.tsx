
'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  User,
  Calendar,
  Heart,
  Share2Icon,
  Clock
} from 'lucide-react';
import { supabase } from 'mdp/lib/supabase/client';

interface ModerationDetailsProps {
  post: {
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
  } | null;
  onModerationComplete: () => void;
}

export default function ModerationDetails({ post, onModerationComplete }: ModerationDetailsProps) {
  const [isModerating, setIsModerating] = useState(false);

  if (!post) {
    return null;
  }

  const handleApprove = async () => {
    setIsModerating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString(),
          moderated_by: user?.id,
          moderated_at: new Date().toISOString()
        })
        .eq('id', post.id);

      if (error) throw error;

      onModerationComplete();
    } catch (error) {
      console.error('Error approving post:', error);
    } finally {
      setIsModerating(false);
    }
  };

  const handleSetpendig = async () => {
    setIsModerating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          status: 'pending',
          published_at: null,
          moderated_by: user?.id,
          moderated_at: new Date().toISOString()
        })
        .eq('id', post.id);

      if (error) throw error;

      onModerationComplete()
    } catch (error) {
      console.error('Error approving post:', error);
    } finally {
      setIsModerating(false);
    }
  }

  const handleReject = async () => {
    const reason = prompt('Digite o motivo da rejeição:');
    if (!reason) return;

    setIsModerating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          status: 'rejected',
          rejection_reason: reason,
          moderated_by: user?.id,
          moderated_at: new Date().toISOString()
        })
        .eq('id', post.id);

      if (error) throw error;

      onModerationComplete();
    } catch (error) {
      console.error('Error rejecting post:', error);
    } finally {
      setIsModerating(false);
    }
  };

  return (
    <div className="bg-[hsl(var(--card))] border rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
        <div className="flex items-center space-x-4 text-sm text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{post?.author?.username}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

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
            
            {post.author && <div translate='no' className="flex items-center gap-3 mb-6 cursor-pointer">
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
                    <div className="font-semibold">{post.author?.username || 'User'}</div>
                </div>
            </div>}

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

      {post.status !== 'pending' && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Histórico de Moderação</h4>
          <div className="text-sm text-[hsl(var(--muted-foreground))]">
            {post.status === 'published' ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>Aprovado em {new Date(post.published_at!).toLocaleDateString('pt-BR')}</span>
              </div>
            ) : post.status === 'rejected' ? (
              <div>
                <div className="flex items-center text-red-600 mb-1">
                  <XCircle className="w-4 h-4 mr-1" />
                  <span>Rejeitado em {new Date(post.moderated_at!).toLocaleDateString('pt-BR')}</span>
                </div>
                {post.rejection_reason && (
                  <p className="text-red-600">Motivo: {post.rejection_reason}</p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {post.status === 'pending' && (
        <div className="flex space-x-4 pt-4 border-t">
          <button
            onClick={handleApprove}
            disabled={isModerating}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Aprovar
          </button>
          
          <button
            onClick={handleReject}
            disabled={isModerating}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Rejeitar
          </button>
        </div>
      )}
      {(post.status === 'published' || post.status === 'rejected') && (
        <div className="flex space-x-4 pt-4 border-t">
          <button
            onClick={handleSetpendig}
            disabled={isModerating}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Clock className="w-4 h-4 mr-2" />
            Colocar em pendente
          </button>
        </div>
      )}
    </div>
  );
}
