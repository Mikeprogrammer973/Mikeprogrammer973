
import Link from 'next/link';
import { 
  Users, 
  Award,
  Star
} from 'lucide-react';
import { supabase } from 'mdp/lib/supabase/client';
import BlogHeader from 'mdp/components/ui/blog/Header';

export default async function AuthorsPage() {
  
  const { data: authors } = await supabase
    .from('authors')
    .select(`*`)
    .order('id', { ascending: true });

  const { data: posts } = await supabase
    .from('blog_posts')
    .select(`*, likes: blog_likes(*)`)
    .eq('status', 'published')
    .order('id', { ascending: true });

  // estatísticas
  const authhorsWithStats = authors?.map(author => {
    const authorPosts = posts?.filter(post => post.author_id === author.id);
    const totalLikes = authorPosts?.reduce((sum, post) => sum + post.likes.length, 0);
    const totalViews = authorPosts?.reduce((sum, post) => sum + post.views, 0);
    return {
      ...author,
      postCount: authorPosts?.length,
      totalLikes,
      totalViews
    };
  });

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <BlogHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[hsl(var(--primary))]/10 rounded-full mb-4">
            <Users className="w-8 h-8 text-[hsl(var(--primary))]" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Nossos Autores</h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Conheça os escritores e especialistas que compartilham conhecimento no blog
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[hsl(var(--card))] border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[hsl(var(--primary))] mb-1">
              {authors?.length || 0}
            </div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Autores</div>
          </div>
          
          <div className="bg-[hsl(var(--card))] border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {posts?.length || 0}
            </div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Artigos Publicados</div>
          </div>
          
          <div className="bg-[hsl(var(--card))] border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {posts?.reduce((sum, post) => sum + post.likes.length, 0) || 0}
            </div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Total de Likes</div>
          </div>
          
          <div className="bg-[hsl(var(--card))] border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {posts?.reduce((sum, post) => sum + post.views, 0) || 0}
            </div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Visualizações</div>
          </div>
        </div>

        {/* autores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authhorsWithStats?.map((author, index) => (
            <Link
              key={author.id}
              href={`/blog/authors/${author.id}`}
              className="group bg-[hsl(var(--card))] border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-[hsl(var(--primary))]/50"
            >
              <div className="text-center mb-4">
                {author.avatar_url ?
                    (<img
                        translate='no'
                        src={author.avatar_url}
                        alt={author.username}
                        className="w-24 h-24 p-1 border border-[hsl(var(--primary))] object-cover rounded-full mx-auto mb-3"
                    />)
                    : <div translate='no' className="w-22 h-22 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                        {author.username.charAt(0).toUpperCase()}
                    </div>
                }
                
                <h3 translate='no' className="font-semibold text-lg group-hover:text-[hsl(var(--primary))] transition-colors mb-2">
                  {author.username}
                </h3>
                
                {author.bio && (
                  <p translate='no' className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2 mb-3">
                    {author.bio}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div>
                  <div className="font-bold text-[hsl(var(--primary))]">{author.postCount}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">Artigos</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">{author.totalLikes}</div>
                  <div translate='no' className="text-xs text-[hsl(var(--muted-foreground))]">Likes</div>
                </div>
                <div>
                  <div className="font-bold text-blue-600">{author.totalViews}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">Views</div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-2">
                {author.postCount >= 10 && (
                  <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Produtivo
                  </span>
                )}
                {author.totalLikes >= 100 && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {authors?.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum autor encontrado</h3>
            <p className="text-[hsl(var(--muted-foreground))]">
              Ainda não há autores com artigos publicados.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}