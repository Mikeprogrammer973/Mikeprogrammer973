
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import { supabase } from 'mdp/lib/supabase/client';
import PostCard from 'mdp/components/ui/blog/PostCard';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = (await searchParams).q as string || ''

  let { data: posts } = await supabase
    .from('blog_posts')
    .select(`*, author: authors(username), category: blog_posts_categories(name)`)
    .order('published_at', { ascending: false })

  if (query) {
    const _query = query.toLowerCase();
    const filtered = posts?.filter(post =>
        post.title.toLowerCase().includes(_query) ||
        post.excerpt?.toLowerCase().includes(_query) ||
        post.content.toLowerCase().includes(_query) ||
        post.author?.username?.toLowerCase().includes(_query) ||
        post.category.name.toLowerCase().includes(_query) ||
        post.tags.some((tag: string )=> tag.toLowerCase().includes(_query))
        ) || []

    posts = filtered
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
              {posts?.length || 0} resultado{posts?.length !== 1 ? 's' : ''} encontrado{posts?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">
              Use a barra de busca no topo da página para encontrar artigos.
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