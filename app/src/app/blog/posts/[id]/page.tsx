'use client'

import { Share2Icon } from 'lucide-react';
import Comments from 'mdp/components/ui/blog/Comments';
import BlogFooter from 'mdp/components/ui/blog/Footer';
import BlogHeader from 'mdp/components/ui/blog/Header';
import { supabase } from 'mdp/lib/supabase/client';
import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react';


interface Post {
    id: string;
    title: string;
    excerpt: string | null;
    content: string;
    author: {
        username: string | null;
        avatar_url: string | null;
        bio: string | null;
    };
    cover_image: string | null;
    created_at: string;
    likes: number;
    comments_count?: number;
    read_time?: number;
    category: string;
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
        created_at: '',
        likes: 0,
        category: '',
        author: {
            username: '',
            avatar_url: '',
            bio: ''
        },
        tags: []
    })

    useEffect(()=>{
        fetchPost()
    }, [])
    
    const fetchPost = async () => {
        const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', params.id)
        .eq('status', 'published')
        .single();

        if (!post) {
        notFound();
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
        <BlogHeader />
        
        <main className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
            <header className="mb-8">
            <h1 translate='no' className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-[hsl(var(--muted-foreground))] mb-4">
                <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                <span>•</span>
                <span>{Math.ceil(post.content.split(' ').length / 200)} min de leitura</span>
            </div>
            
            <div translate='no' className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                <div className="font-semibold">{post.author?.username || 'Autor'}</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">{post.author?.bio}</div>
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
                <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 p-2 rounded-md hover:bg-[hsl(var(--muted))]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{post.likes || 0}</span>
                </button>
                
                <button translate='yes' className="flex items-center gap-2 p-2 rounded-md hover:bg-[hsl(var(--muted))]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Comentar</span>
                </button>
                </div>

                <button onClick={() => share_post()} className="flex items-center gap-2 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] p-3">
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

        <BlogFooter />
    </div>
    );
}