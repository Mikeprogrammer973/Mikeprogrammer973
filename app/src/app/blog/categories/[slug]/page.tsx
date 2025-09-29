'use client'

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  FileText, 
  TrendingUp,
  Users,
} from 'lucide-react';
import { supabase } from 'mdp/lib/supabase/client';
import PostCard from 'mdp/components/ui/blog/PostCard';
import { useEffect, useState } from 'react';

interface Category {
  name: string;
  slug: string;
  id: string;
}

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

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [posts, setPosts] = useState<(Post & {views: number})[] | null>(null)
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalViews: 0
  })

  useEffect(() => {
    const fetchCategory = async () => {
      const { data, error } = await supabase
        .from('blog_posts_categories')
        .select()
        .eq('slug', params.slug)
        .single();

      if (error) {
        console.error(error);
        router.push('/blog/404');
        return
      }

      setCategory(data);
    };

    fetchCategory();
  }, [params.slug]);


  useEffect(() => {
    if (!category) return; 
    const fetchPosts = async () => {
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select(`
            *,
            author:authors(username, avatar_url),
            category:blog_posts_categories(name)
        `)
        .eq('category_id', category.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setStats({
        totalPosts: posts.length,
        totalLikes: posts.reduce((acc, post) => acc + (post.likes || 0), 0),
        totalViews: posts.reduce((acc, post) => acc + (post.views || 0), 0)
      })

      setPosts(posts);
    };

    fetchPosts();
  }, [category]);
  

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="flex items-center space-x-2 text-sm text-[hsl(var(--muted-foreground))] mb-6">
              <Link href="/blog" className="hover:text-[hsl(var(--foreground))]">Blog</Link>
              <span>›</span>
              <Link href="/blog/categories" className="hover:text-[hsl(var(--foreground))]">Categorias</Link>
              <span>›</span>
              <span className="text-[hsl(var(--foreground))]"><span className='mx-1' translate="no">{category?.name}</span></span>
            </div>

            <div className="bg-[hsl(var(--card))] border rounded-xl p-8 mb-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {category?.name.charAt(0).toUpperCase()}
              </div>
              
              <h1 className="text-4xl font-bold mb-4"><span className='mx-1' translate="no">{category?.name}</span></h1>
              
              <p className="text-xl text-[hsl(var(--muted-foreground))] mb-6 max-w-2xl mx-auto">
                Explore todos os artigos sobre <span className='mx-1' translate="no">{category?.name}</span> no blog
              </p>

              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[hsl(var(--primary))] mb-1">{stats.totalPosts}</div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))] flex items-center justify-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Artigos
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{stats.totalLikes}</div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Likes
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalViews}</div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))] flex items-center justify-center">
                    <Users className="w-4 h-4 mr-1" />
                    Views
                  </div>
                </div>
              </div>
            </div>

            {/* posts */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Artigos sobre <span className='mx-1' translate="no">{category?.name}</span></h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts && posts.length === 0 &&
                    <div className='ml-10 text-[hsl(var(--muted-foreground))]'>
                        Não há nenhum artigo sobre <span className='mx-1' translate="no">{category?.name}</span> no momento.
                    </div>
                }
                {posts?.map((post) => (
                  <PostCard key={post.id} post={post} variant="featured" />
                ))}
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                href="/blog/categories"
                className="inline-flex items-center text-[hsl(var(--primary))] hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para todas as categorias
              </Link>
            </div>
          </div>

          <div className="lg:w-1/3">
            {posts && posts.length > 0 && <div className="bg-[hsl(var(--card)] border rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Populares em <span className='mx-1' translate="no">{category?.name}</span></h3>
              <div className="space-y-4">
                {posts
                  ?.sort((a, b) => (b.likes.length) - (a.likes.length))
                  .slice(0, 3)
                  .map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/posts/${post.id}`}
                      className="block group"
                    >
                      <div className="flex items-center space-x-3">
                        {post.cover_image && <div translate='no' className="w-16 h-16 bg-[hsl(var(--muted))] rounded-lg flex-shrink-0">
                            <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full rounded-lg object-cover"
                            />
                        </div>}
                        <div>
                          <h4 translate='no' className="font-medium group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2 text-sm">
                            {post.title}
                          </h4>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            {post.likes.length || 0} likes • {post.views || 0} views
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>}

            <div className="bg-[hsl(var(--card))] border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Fique por dentro</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
                Receba os melhores artigos sobre <span className='mx-1' translate="no">{category?.name}</span> diretamente no seu email.
              </p>
              <button
                  onClick={() => router.push('/newsletter')}
                  className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-2 rounded-md hover:opacity-90 text-sm"
                >
                Assinar Newsletter
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}