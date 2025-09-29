
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Grid3X3, 
  List, 
  X,
  FileText
} from 'lucide-react';
import PostCard from 'mdp/components/ui/blog/PostCard';
import { supabase } from 'mdp/lib/supabase/client';

type SortOption = 'newest' | 'oldest' | 'popular' | 'trending';
type ViewMode = 'grid' | 'list';

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
  },
  tags?: string[];
  views?: number;
}

interface Category {
  name: string;
  slug: string;
  id: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<(Category & { count: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
 
  useEffect(() => {
    fetchPostsAndCategories();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const fetchPostsAndCategories = async () => {
    try {
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:authors(username, avatar_url),
          comments:blog_comments(count),
          likes:blog_likes(id, author_id),
          category:blog_posts_categories(id, name, slug)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      const { data: categoriesData } = await supabase
        .from('blog_posts_categories')
        .select('*')

      const categoryCounts = categoriesData?.reduce((acc: { [key: string]: (Category & { count: number }) }, category: Category) => {
        acc[category.name] = {
            name: category.name,
            slug: category.slug,
            id: category.id,
            count: 0
        }

        postsData?.forEach((post: Post) => {
          if (post.category.id === category.id) {
            acc[category.name].count++;
          }
        });

        return acc;
      }, []);

      setPosts(postsData || []);

      setCategories(Object.values(categoryCounts));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortPosts = () => {
    let filtered = [...posts];

    // por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category.name === selectedCategory);
    }

    // por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.author.username?.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        post.category.name.toLowerCase().includes(query)
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        case 'oldest':
          return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
        case 'popular':
          return (b.likes.length || 0) - (a.likes.length || 0);
        case 'trending':
          const aScore = (a.likes.length || 0) + (a.views || 0) / 10;
          const bScore = (b.likes.length || 0) + (b.views || 0) / 10;
          return bScore - aScore;
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || sortBy !== 'newest';

  // Paginação
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'newest': return 'Mais Recentes';
      case 'oldest': return 'Mais Antigos';
      case 'popular': return 'Mais Populares';
      case 'trending': return 'Em Alta';
      default: return 'Mais Recentes';
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[hsl(var(--primary))]/10 rounded-full mb-4">
            <FileText className="w-8 h-8 text-[hsl(var(--primary))]" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Todos os Artigos</h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Explore a coleção completa de artigos, tutoriais e insights
          </p>
        </div>

        <div className="bg-[hsl(var(--card)] border rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              >
                <option className='bg-[hsl(var(--primary-foreground))]' value="all">Todas as categorias</option>
                {categories.map((category: (Category & { count: number })) => (
                  <option className='bg-[hsl(var(--primary-foreground))]' translate='no' key={category.id} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              >
                <option className='bg-[hsl(var(--primary-foreground))]' value="newest">Mais Recentes</option>
                <option className='bg-[hsl(var(--primary-foreground))]' value="oldest">Mais Antigos</option>
                <option className='bg-[hsl(var(--primary-foreground))]' value="popular">Mais Populares</option>
                <option className='bg-[hsl(var(--primary-foreground))]' value="trending">Em Alta</option>
              </select>
             
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'hover:[hsl(var(--bg-accent))]'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'hover:[hsl(var(--bg-accent))]'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-[hsl(var(--muted-foreground))]">Filtros:</span>
              
              {searchQuery && (
                <span className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-3 py-1 rounded-full text-sm flex items-center">
                  Busca: &quot;{searchQuery}&quot;
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-[hsl(var(--primary))]/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {selectedCategory !== 'all' && (
                <span className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-3 py-1 rounded-full text-sm flex items-center">
                  Categoria: <span translate='no' className="mx-1">{selectedCategory}</span>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="ml-2 hover:text-[hsl(var(--primary))]/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {sortBy !== 'newest' && (
                <span className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-3 py-1 rounded-full text-sm flex items-center">
                  Ordenação: {getSortLabel(sortBy)}
                  <button
                    onClick={() => setSortBy('newest')}
                    className="ml-2 hover:text-[hsl(var(--primary))]/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              <button
                onClick={clearFilters}
                className="text-sm text-[hsl(var(--muted-foreground))] hover:[hsl(var(--text-foreground))] flex items-center"
              >
                <X className="w-3 h-3 mr-1" />
                Limpar todos
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-[hsl(var(--muted-foreground))]">
            Mostrando {currentPosts.length} de {filteredPosts.length} artigo{filteredPosts.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' (filtrados)'}
          </div>
          
          <div className="text-sm text-[hsl(var(--muted-foreground))]">
            Ordenado por: <span className="font-medium">{getSortLabel(sortBy)}</span>
          </div>
        </div>

        {/* posts */}
        {isLoading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-[hsl(var(--card))] border rounded-xl p-6">
                <div className="h-48 bg-[hsl(var(--muted))] rounded-lg mb-4"></div>
                <div className="h-4 bg-[hsl(var(--muted))] rounded mb-2"></div>
                <div className="h-4 bg-[hsl(var(--muted))] rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-[hsl(var(--muted))] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {hasActiveFilters ? 'Nenhum resultado encontrado' : 'Nenhum artigo publicado'}
            </h3>
            <p className="text-[hsl(var(--muted-foreground))] mb-6 max-w-md mx-auto">
              {hasActiveFilters
                ? 'Tente ajustar seus filtros de busca ou explore outras categorias.'
                : 'Volte em breve para conferir nossos primeiros artigos!'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-2 rounded-lg hover:opacity-90"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={`grid gap-6 mb-12 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {currentPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  variant={viewMode === 'list' ? 'featured' : 'default'}
                />
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border rounded-lg hover:bg-[hsl(var(--accent))] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-3 py-2 border rounded-lg min-w-10 ${
                          currentPage === pageNumber
                            ? 'bg-primary text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))]'
                            : 'hover:bg-[hsl(var(--accent))]'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <span key={pageNumber} className="px-2">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border rounded-lg hover:bg-[hsl(var(--accent))] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}

        {!isLoading && filteredPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Categorias Populares</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories
                .sort((a, b) => b.count - a.count)
                .slice(0, 8)
                .map((category) => (
                  <Link
                    translate='no'
                    key={category.slug}
                    href={`/blog/categories/${category.slug}`}
                    className="bg-[hsl(var(--card))] border px-4 py-2 rounded-lg hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-colors"
                  >
                    {category.name} <span className="text-[hsl(var(--muted-foreground))]">({category.count})</span>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}