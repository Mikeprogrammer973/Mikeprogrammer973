'use client'

import PostCard from 'mdp/components/ui/blog/PostCard';
import { Spinner } from 'mdp/components/ui/spinner';
import { supabase } from 'mdp/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Author {
    id: string;
    username: string;
    avatar_url: string;
    bio: string;
    website: string;
}

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  author: Author;
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

export default function AuthorPage() {
    const [author, setAuthor] = useState<Author>({
        id: '',
        username: '',
        avatar_url: '',
        bio: '',
        website: ''
    })
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const router = useRouter()

    useEffect(() => {
        fetchAuthor()
        fetchPosts()
    }, [])

    const fetchAuthor = async () => {
        const { data: author } = await supabase
        .from('authors')
        .select('*')
        .eq('id', params.id)
        .single();

        if (!author) {
            alert('Autor não encontrado!')
            router.push('/blog/404')
            return
        }
        setAuthor(author)
        setLoading(false)
    }

    const fetchPosts = async () => {
        const { data: posts } = await supabase
        .from('blog_posts')
        .select(`*, likes:blog_likes(id, author_id), category:blog_posts_categories(name, slug, id)`)
        .eq('author_id', params.id)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

        setPosts(posts || [])
    }
    
    if (loading) {
        return <Spinner />
    }

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
        <main className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <div translate='no' className="flex items-center justify-center">
                    {author?.avatar_url
                        ? <img
                            src={author.avatar_url || ''}
                            alt={author.username || 'Autor'}
                            className="rounded-full w-30 h-30 md:w-40 md:h-40 object-cover border-2 border-[hsl(var(--primary))] p-1"
                        />
                        : <div className="w-30 h-30 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold md:text-4xl text-white">
                            {author?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    }
                </div>
            
                <h1 translate='no' className="text-4xl font-bold mb-2">{author.username}</h1>
                
                {author?.bio && (
                    <p className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-6">
                    {author.bio}
                    </p>
                )}
                
                <div className="flex justify-center space-x-6 text-sm text-[hsl(var(--muted-foreground))]">
                    <div>
                    <span className="font-semibold text-[hsl(var(--foreground))]">{posts?.length || 0}</span>
                    <span> Artigos</span>
                    </div>
                    <div>
                    <span className="font-semibold text-[hsl(var(--foreground))]">{posts?.reduce((sum, post) => sum + post.likes.length, 0) || 0}</span>
                    <span> Likes</span>
                    </div>
                    {author?.website && (
                    <a
                        href={author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[hsl(var(--primary))] hover:underline"
                    >
                        Website
                    </a>
                    )}
                </div>
            </div>

            <section>
            <h2 className="text-2xl font-bold mb-8">Artigos Publicados</h2>
            
            {posts && posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostCard key={post.id} post={{ ...post, author }} />
                ))}
                </div>
            ) : (
                <div className="text-center py-12">
                <p className="text-[hsl(var(--muted-foreground))]">
                    Este autor ainda não publicou nenhum artigo.
                </p>
                </div>
            )}
            </section>
        </main>
        </div>
    );
}