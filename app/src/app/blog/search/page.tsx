'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import { supabase } from 'mdp/lib/supabase/client';
import PostCard from 'mdp/components/ui/blog/PostCard';
import { useSearchParams } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  author: {
    username: string | null;
    avatar_url: string | null;
  };
  published_at: string;
  likes: {
    id: string;
    author_id: string;
  }[]
  comments_count?: number;
  read_time?: number;
  category: {
    name: string;
    slug: string;
    id: string;
  }
}

export default function SearchPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const query = useSearchParams().get('q') || ''

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        
        const { data: postsData, error } = await supabase
          .from('blog_posts')
          .select(`*, author: authors(username), category: blog_posts_categories(name)`)
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) {
          console.error('Error fetching posts:', error);
          return;
        }

        if (query && postsData) {
          const _query = query.toLowerCase();
          const filtered = postsData.filter(post =>
            post.title.toLowerCase().includes(_query) ||
            post.excerpt?.toLowerCase().includes(_query) ||
            post.content.toLowerCase().includes(_query) ||
            post.author?.username?.toLowerCase().includes(_query) ||
            post.category.name.toLowerCase().includes(_query) ||
            post.tags.some((tag: string) => tag.toLowerCase().includes(_query))
          ) || [];
          
          setPosts(filtered);
        } else {
          setPosts(postsData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))] mx-auto mb-4"></div>
              <p className="text-[hsl(var(--muted-foreground))]">Carregando...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 text-sm text-[hsl(var(--muted-foreground))] mb-6">
          <Link href="/blog" className="hover:text-[hsl(var(--foreground))]">Blog</Link>
          <span>›</span>
          <span className="text-[hsl(var(--foreground))]">Busca</span>
        </div>

        <div className="flex items-center space-x-3 mb-8">
          <Search className="w-8 h-8 text-[hsl(var(--primary))]" />
          <div>
            <h1 className="text-3xl font-bold">Resultados da Busca</h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              {query && (
                <><span translate='no' className='mr-1'>&quot;{query}&quot;</span> - </>
              )}
              {posts.length} resultado{posts.length !== 1 ? 's' : ''} encontrado{posts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {query ? 'Nenhum resultado encontrado' : 'Nenhum artigo disponível'}
            </h3>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">
              {query 
                ? 'Use a barra de busca no topo da página para encontrar artigos.'
                : 'Não há artigos publicados no momento.'
              }
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center text-[hsl(var(--primary))] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o blog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}