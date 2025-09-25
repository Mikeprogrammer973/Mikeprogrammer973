
'use client';

import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  MoreVertical,
  Trash2,
  Edit3
} from 'lucide-react';
import { supabase } from 'mdp/lib/supabase/client';
import Link from 'next/link';
import getUser, { User } from 'mdp/lib/getUser';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    username: string;
    avatar_url: string;
  }
  post_id: string;
}

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser()
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (postId) {
      fetchComments()
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`*, author:authors(username, avatar_url)`)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('blog_comments')
        .insert([
          {
            post_id: postId,
            author_id: user.profile.id,
            content: newComment.trim()
          }
        ]);

      if (error) {
        throw error;
      }

      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ content: editContent.trim() })
        .eq('id', commentId);

      if (error) {
        throw error;
      }

      setEditingCommentId(null);
      setEditContent('');
      fetchComments();
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return;

    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        throw error;
      }

      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex space-x-3">
            <div className="w-10 h-10 bg-[hsl(var(--muted))] rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[hsl(var(--muted))] rounded"></div>
              <div className="h-4 bg-[hsl(var(--muted))] rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-xl font-semibold">
          Comentários ({comments.length})
        </h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="flex space-x-3">
            {user.profile.avatar_url
              ? <img
                  src={user.profile.avatar_url || ''}
                  alt={user.profile.username || 'Autor'}
                  className="w-10 h-10 rounded-full"
              />
              : <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                  {user.profile?.username?.charAt(0).toUpperCase() || 'U'}
              </div> 
            }
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Deixe seu comentário..."
                className="w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                rows={3}
                disabled={isSubmitting}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-[hsl(var(--muted))] p-4 rounded-md text-center">
          <p className="text-[hsl(var(--muted-foreground))]">
            <Link href="/blog/login" className="text-[hsl(var(--primary))] hover:underline">
              Faça login
            </Link>{' '}
            para deixar um comentário
          </p>
        </div>
      )}

      {/* comentários */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-[hsl(var(--muted-foreground))] text-center py-8">
            Seja o primeiro a comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3 group">
              {comment.author.avatar_url
                ? <img
                    src={comment.author.avatar_url || ''}
                    alt={comment.author.username || 'Autor'}
                    className="w-10 h-10 rounded-full"
                />
                : <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                    {comment.author?.username?.charAt(0).toUpperCase() || 'U'}
                </div> 
              }
              
              <div className="flex-1 min-w-0">
                {editingCommentId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-3 py-1 rounded-md text-sm hover:opacity-90"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditContent('');
                        }}
                        className="bg-[hsl(var(--muted))] px-3 py-1 rounded-md text-sm hover:bg-[hsl(var(--accent))]"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[hsl(var(--muted))] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span translate='no' className="font-semibold">{comment.author.username}</span>
                        <span className="text-[hsl(var(--muted-foreground)))] text-sm">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {false && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div>
                            <button className="p-1 hover:bg-[hsl(var(--accent))] rounded">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            <ul className="dropdown-menu bg-[hsl(var(--background))] border rounded-md shadow-lg py-1 z-10">
                              <li>
                                <button
                                  onClick={() => {
                                    setEditingCommentId(comment.id);
                                    setEditContent(comment.content);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm hover:bg-[hsl(var(--accent))] w-full text-left"
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Editar
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="flex items-center px-4 py-2 text-sm hover:bg-[hsl(var(--accent))] w-full text-left text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Excluir
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p translate='no' className="text-[hsl(var(--foreground))]">{comment.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}