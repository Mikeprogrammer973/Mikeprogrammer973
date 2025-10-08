
import Link from 'next/link';
import { 
  Folder, 
  FileText, 
  ArrowRight, 
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import { supabase } from 'mdp/lib/supabase/client';
import BlogHeader from 'mdp/components/ui/blog/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorias'
}

interface Stats {
  count: number;
  totalLikes: number;
  totalViews: number;
  latestPost: Date;
  slug: string;
}

export default async function CategoriesPage() {
  
  const { data: posts } = await supabase
    .from('blog_posts')
    .select(`*, category:blog_posts_categories(id, name, slug), likes:blog_likes(id)`)
    .eq('status', 'published');

  // estatísticas por categoria
  const { data: categoriesData } = await supabase
    .from('blog_posts_categories')
    .select('*');

  const categoryStats: Record<string, Stats> = categoriesData?.reduce((acc, category) => {
    acc[category.name] = {
      count: 0,
      totalLikes: 0,
      totalViews: 0,
      latestPost: null,
      slug: category.slug,
    };
    posts?.forEach((post) => {
      if (post.category.id === category.id) {
        acc[category.name].count++;
        acc[category.name].totalLikes += post.likes.length;
        acc[category.name].totalViews += post.views;
        acc[category.name].latestPost = new Date(post.published_at);
      }
    });
    return acc;
  }, {});

  const categories = Object.entries(categoryStats).map(([name, stats]) => ({
    name,
    slug: stats.slug,
    count: stats.count,
    totalLikes: stats.totalLikes,
    totalViews: stats.totalViews,
    latestPost: stats.latestPost,
  })).sort((a, b) => b.count - a.count);

  const { data: recentPosts } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_posts_categories(id, name, slug),
      author:authors(username)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <BlogHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-[hsl(var(--primary))]/10 rounded-full mb-4">
                <Folder className="w-8 h-8 text-[hsl(var(--primary))]" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Categorias</h1>
              <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
                Explore todos os tópicos e áreas de conhecimento do blog
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-[hsl(var(--card))] border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[hsl(var(--primary))] mb-1">
                  {categories.length}
                </div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Categorias</div>
              </div>
              
              <div className="bg-[hsl(var(--card))] border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {posts?.length || 0}
                </div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Artigos Publicados</div>
              </div>
              
              <div className="bg-[hsl(var(--card))] border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {categories.reduce((sum, cat) => sum + cat.totalLikes, 0)}
                </div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Total de Likes</div>
              </div>
              
              <div className="bg-[hsl(var(--card))] border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {categories.reduce((sum, cat) => sum + cat.totalViews, 0)}
                </div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Visualizações</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={category.name}
                  href={`/blog/categories/${category.slug}`}
                  className="group bg-[hsl(var(--card))] border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-[hsl(var(--primary))]/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div translate='no' className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                        index % 4 === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        index % 4 === 1 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        index % 4 === 2 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                        'bg-gradient-to-r from-orange-500 to-orange-600'
                      }`}>
                        {category.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 translate='no' className="font-semibold text-lg group-hover:text-[hsl(var(--primary))] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                          {category.count} artigo{category.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-xs text-[hsl(var(--muted-foreground))] mb-3">
                    <div className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      <span>{category.count} artigos</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span>{category.totalLikes} likes</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{category.totalViews} views</span>
                    </div>
                  </div>
                  
                  {category.latestPost !== null && <div className="flex items-center text-xs text-[hsl(var(--muted-foreground))]">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Último artigo: {category.latestPost.toLocaleDateString('pt-BR')}</span>
                  </div>}
                </Link>
              ))}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-12">
                <Folder className="w-16 h-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma categoria encontrada</h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Ainda não há artigos publicados no blog.
                </p>
              </div>
            )}
          </div>

          <div className="lg:w-1/3">
            {recentPosts && recentPosts.length > 0 && <div className="bg-[hsl(var(--card))] border rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Artigos Recentes</h3>
              <div className="space-y-3">
                {recentPosts?.map((post) => (
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
                        {post.author && <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          <span translate='no'>{post.author.username}</span>
                        </p>}
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          {new Date(post.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>}

            {categories.length > 0 && <div className="bg-[hsl(var(--card))] border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Categorias Populares</h3>
              <div className="space-y-2">
                {categories.slice(0, 5).map((category) => (
                  <Link
                    translate="no"
                    key={category.name}
                    href={`/blog/categories/${category.slug}`}
                    className="flex items-center justify-between py-2 hover:text-[hsl(var(--primary))] transition-colors"
                  >
                    <span className="flex items-center">
                      <Folder className="w-4 h-4 mr-2 text-[hsl(var(--muted-foreground))]" />
                      {category.name}
                    </span>
                    <span className="bg-[hsl(var(--muted))] px-2 py-1 rounded-full text-xs">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>}
          </div>
        </div>
      </main>
    </div>
  );
}
