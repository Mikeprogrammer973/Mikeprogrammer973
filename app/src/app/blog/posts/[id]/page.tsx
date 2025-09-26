'use client'

import { Share2Icon } from 'lucide-react';
import Comments from 'mdp/components/ui/blog/Comments';
import LikeButton from 'mdp/components/ui/blog/LikeBtn';
import getUser, { User } from 'mdp/lib/getUser';
import { supabase } from 'mdp/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';


interface Post {
    id: string;
    title: string;
    excerpt: string | null;
    content: string;
    author: {
        username: string | null;
        avatar_url: string | null;
        id: string
    };
    category: {
        id: string;
        name: string;
    };
    cover_image: string | null;
    published_at: string;
    tags: string[];
}

export default function PostPage() {
    const params = useParams()
    const [post, setPost] = useState<Post>({
        id: params.id as string,
        title: '',
        excerpt: '',
        content: '',
        cover_image: '',
        published_at: '',
        author: {
            username: '',
            avatar_url: '',
            id: ''
        },
        category: {
            id: '',
            name: ''
        },
        tags: []
    })
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()
    
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

    useEffect(()=>{
        fetchPost()
    }, [])
    
    const fetchPost = async () => {
        const { data: post } = await supabase
        .from('blog_posts')
        .select(`*, author:authors(username, avatar_url, id), category:blog_posts_categories(id, name)`)
        .eq('id', params.id)
        .eq('status', 'published')
        .single();

        if (!post) {
            alert('Artigo não encontrado!')
            router.push('/blog/404');
            return;
        }

        // Incrementar views
        await supabase
        .from('blog_posts')
        .update({ views: (post.views || 0) + 1 })
        .eq('id', params.id);

        setPost(post)
    }

    const share_post = async () => {
    if (navigator.share) {
        try {
        await navigator.share({
            title: post?.title,
            text: post?.excerpt || '',
            url: window.location.href,
        })
        } catch (error) {
        console.log('Error sharing:', error)
        }
    } else {
        navigator.clipboard.writeText(window.location.href)
        alert('Link copiado para a área de transferência!')
    }
    }

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            <main className="container mx-auto px-4 py-8">
            <article className="max-w-3xl mx-auto">
                <header className="mb-8">
                <h1 translate='no' className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 text-[hsl(var(--muted-foreground))] mb-4">
                    <span className="text-[hsl(var(--primary))]">{post.category.name}</span>
                    <span>•</span>
                    <span>{new Date(post.published_at).toLocaleDateString('pt-BR')}</span>
                    <span>•</span>
                    <span>{Math.ceil(post.content.split(' ').length / 200)} min de leitura</span>
                </div>
                
                <div onClick={() => router.push(`/blog/authors/${post.author?.id}`)} translate='no' className="flex items-center gap-3 mb-6 cursor-pointer">
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
                        <div className="font-semibold">{post.author?.username || 'Autor'}</div>
                    </div>
                </div>

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
                    <LikeButton postId={post.id} />

                    <button translate='yes' onClick={() => share_post()} className="flex items-center gap-2 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] p-3">
                        <Share2Icon className='w-5 text-[hsl(var(--primary))]' />
                        <span>Compartilhar</span>
                    </button>
                </div>
                </footer>
            </article>

            <section className="max-w-3xl mx-auto mt-16">
                <Comments postId={post.id} />
            </section>
            </main>
        </div>
    );
}