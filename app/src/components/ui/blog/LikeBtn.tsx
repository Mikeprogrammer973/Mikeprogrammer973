
'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from 'mdp/lib/supabase/client';
import getUser, { User } from 'mdp/lib/getUser';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  postId: string
}

interface Like {
  id: string;
  author_id: string;
}

export default function LikeButton({ postId }: LikeButtonProps) {
  const [likes, setLikes] = useState<Like[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    fetchLikes();
  }, []);

  useEffect(() => {
    checkUserLike();
  }, [user, postId]);

  const fetchLikes = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_likes')
        .select('id, author_id')
        .eq('post_id', postId);

      if (error) {
        throw error;
      }

      setLikes(data || []);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };


  const checkUserLike = async () => {
    if (!user) {
      setIsLiked(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('author_id', user.profile.id)
        .single();

      setIsLiked(!!data);
    } catch (error) {
      setIsLiked(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      router.push('/blog/login');
      return;
    }

    setIsLoading(true);

    try {
      if (isLiked) {
        // tirar
        const { error } = await supabase
          .from('blog_likes')
          .delete()
          .eq('post_id', postId)
          .eq('author_id', user.profile.id);

        if (!error) {
          await fetchLikes()
          setIsLiked(false);
        }
      } else {
        // dar
        const { error } = await supabase
          .from('blog_likes')
          .insert([
            {
              post_id: postId,
              author_id: user.profile.id
            }
          ]);

        if (!error) {
          await fetchLikes()
          setIsLiked(true);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
        isLiked
          ? 'text-[hsl(var(--primary))] hover:bg-[hsl(var(--accent))]'
          : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'
      } disabled:opacity-50`}
      aria-label={isLiked ? 'Descurtir' : 'Curtir'}
    >
      <Heart
        className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
      />
      <span className="font-medium">{likes.length}</span>
    </button>
  );
}