
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  User, 
  Heart,
  MessageCircle
} from 'lucide-react';

interface Author {
  username: string | null;
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
  category: {
    name: string;
    slug: string;
    id: string;
  }
}

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured';
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  const readTime = post.read_time || Math.ceil((post.excerpt?.split(' ').length || 0) / 200);
  
  if (variant === 'featured') {
    return (
      <article translate='no' className="bg-[hsl(var(--card))] rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
        {post.cover_image && (
          <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${post.cover_image})` }} />
        )}
        <div className="p-6">
          <div className="flex items-center text-sm text-[hsl(var(--muted-foreground))] mb-3">
            <span className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-2 py-1 rounded-full text-xs text-center">
              {post.category.name}
            </span>
            <span className="mx-2">•</span>
            <div translate='yes' className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
            <span className="mx-2">•</span>
            <div translate='yes' className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{readTime} min de leitura</span>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-3 hover:text-[hsl(var(--primary))] transition-colors">
            <Link href={`/blog/posts/${post.id}`}>
              {post.title}
            </Link>
          </h3>
          
          {post.excerpt && (
            <p className="text-[hsl(var(--muted-foreground))] mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-[hsl(var(--muted-foreground))]">
                <User className="w-4 h-4 mr-1" />
                {<span>{post.author.username}</span>}
              </div>
              
              <div className="flex items-center text-sm text-[hsl(var(--muted-foreground))]">
                <Heart className="w-4 h-4 mr-1" />
                <span>{post.likes}</span>
              </div>
              
              {post.comments_count !== undefined && (
                <div className="flex items-center text-sm text-[hsl(var(--muted-foreground))]">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span>{post.comments_count}</span>
                </div>
              )}
            </div>
            
            <Link 
              translate='yes'
              href={`/blog/posts/${post.id}`}
              className="text-[hsl(var(--primary))] hover:underline font-medium"
            >
              Ler mais
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article translate='no' className="bg-[hsl(var(--card))] rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
      {post.cover_image && (
        <Link href={`/blog/posts/${post.id}`}>
          <div 
            className="h-48 bg-cover bg-center hover:opacity-90 transition-opacity" 
            style={{ backgroundImage: `url(${post.cover_image})` }}
          />
        </Link>
      )}
      
      <div className="p-4">
        <div className="flex items-center text-xs text-[hsl(var(--muted-foreground))] mb-2">
          <span className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-2 py-1 rounded-full">
            {post.category.name}
          </span>
          <span className="mx-2">•</span>
          <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 hover:text-[hsl(var(--primary))] transition-colors">
          <Link href={`/blog/posts/${post.id}`}>
            {post.title}
          </Link>
        </h3>
        
        {post.excerpt && (
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3 line-clamp-2">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {<span>{post.author.username}</span>}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              <span>{post.likes}</span>
            </div>
            
            {post.comments_count !== undefined && (
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>{post.comments_count}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}