
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from 'mdp/lib/supabase/client';
import { Search, Filter, X } from 'lucide-react';
import Link from 'next/link';
import BlogHeader from 'mdp/components/ui/blog/Header';
import BlogFooter from 'mdp/components/ui/blog/Footer';
import CategoryMenu from 'mdp/components/ui/blog/CategoryMenu';
import PostCard from 'mdp/components/ui/blog/PostCard';

interface Author {
  username: string;
  avatar_url: string | null;
}

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  author: Author;
  created_at: string;
  likes: number;
  comments_count?: number;
  read_time?: number;
  category: string;
  content: string;
  tags: string[]
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const searchParams = useSearchParams();

  // Buscar posts e categorias
  useEffect(() => {
    fetchPostsAndCategories();
  }, []);

  // Processar parâmetros de busca da URL
  useEffect(() => {
    const search = searchParams.get('q');
    const category = searchParams.get('category');
    
    if (search) setSearchQuery(search);
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  // Filtrar posts quando searchQuery ou selectedCategory mudar
  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, selectedCategory]);

  const fetchPostsAndCategories = async () => {
    try {
      // Buscar posts publicados
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(username, avatar_url)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      // Buscar categorias
      const { data: categoriesData } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('status', 'published');

      const categoryCounts = categoriesData?.reduce((acc: Record<string, number>, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
      }, {});

      setPosts(postsData || []);
      setCategories(categoryCounts || {});
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered?.filter(post => post.category === selectedCategory) || [];
    }

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered?.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.username.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some((tag: string )=> tag.toLowerCase().includes(query))
      ) || []
    }

    setFilteredPosts(filtered || []);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all';

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <BlogHeader />
      
      <main className="container mx-auto px-4 py-8">
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Blog de Desenvolvimento</h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-10">
            Artigos, tutoriais e insights sobre desenvolvimento web, design e tecnologia.
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))] w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar artigos, tutoriais, autores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] text-lg"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {searchQuery && (
                <span className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-3 py-1 rounded-full text-sm flex items-center">
                  Busca: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-[hsl(var(--primary))]/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-3 py-1 rounded-full text-sm flex items-center">
                  Categoria: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="ml-2 hover:text-[hsl(var(--primary))]/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] text-sm flex items-center"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>
          )}
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">
                {hasActiveFilters ? 'Resultados da Busca' : 'Artigos Recentes'}
              </h2>
              
              {filteredPosts.length > 0 && (
                <span className="text-[hsl(var(--muted-foreground))]">
                  {filteredPosts.length} artigo{filteredPosts.length !== 1 ? 's' : ''} encontrado{filteredPosts.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Lista de Posts */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-[hsl(var(--card))] border rounded-xl p-6">
                    <div className="h-48 bg-[hsl(var(--muted))] rounded-lg mb-4"></div>
                    <div className="h-4 bg-[hsl(var(--muted))] rounded mb-2"></div>
                    <div className="h-4 bg-[hsl(var(--muted))] rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {hasActiveFilters ? 'Nenhum resultado encontrado' : 'Nenhum artigo publicado'}
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] mb-6">
                  {hasActiveFilters
                    ? 'Tente ajustar seus filtros de busca ou explore outras categorias.'
                    : 'Volte em breve para conferir nossos primeiros artigos!'
                  }
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-2 rounded-md hover:opacity-90"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-1/3">
            <CategoryMenu categories={categories} />
            
            {/* Filtro de Categoria */}
            <div className="bg-card p-6 rounded-lg border my-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtrar por Categoria
              </h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              >
                <option value="all">Todas as categorias</option>
                {Object.keys(categories).map((category) => (
                  <option key={category} value={category}>
                    {category} ({categories[category]})
                  </option>
                ))}
              </select>
            </div>

            {/* Posts Populares */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">Artigos Populares</h3>
              <div className="space-y-4">
                {posts
                  .sort((a, b) => b.likes - a.likes)
                  .slice(0, 3)
                  .map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/post/${post.id}`}
                      className="block group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 bg-[hsl(var(--muted))] rounded-lg flex-shrink-0"></div>
                        <div>
                          <h4 className="font-medium group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            {post.likes} likes
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}