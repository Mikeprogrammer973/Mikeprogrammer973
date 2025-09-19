
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from 'mdp/lib/supabase/client'
import BlogHeader from 'mdp/components/ui/blog/Header';
import RichTextEditor from 'mdp/components/ui/blog/PostEditor';
import BlogFooter from 'mdp/components/ui/blog/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/blog/login');
        return;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([
          {
            title,
            content,
            excerpt,
            category,
            tags: tags.split(',').map(tag => tag.trim()),
            author_id: user.id,
            status: 'draft'
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      router.push('/blog/dashboard');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <BlogHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex gap-4 items-center">
            <Link title='Voltar' href={'/blog/manage'} className='py-1 mr-2 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--muted))]'>
                <ArrowLeft className='w-10' />
            </Link>
            <span>Criar Novo Post</span>
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Título
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                required
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                Resumo
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                Conteúdo
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Categoria
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                  required
                >
                  <option className='bg-[hsl(var(--primary-foreground))]' value="">Selecione uma categoria</option>
                  <option className='bg-[hsl(var(--primary-foreground))]' value="React">React</option>
                  <option className='bg-[hsl(var(--primary-foreground))]' value="Next.js">Next.js</option>
                  <option className='bg-[hsl(var(--primary-foreground))]' value="CSS">CSS</option>
                  <option className='bg-[hsl(var(--primary-foreground))]' value="JavaScript">JavaScript</option>
                  <option className='bg-[hsl(var(--primary-foreground))]' value="TypeScript">TypeScript</option>
                  <option className='bg-[hsl(var(--primary-foreground))]' value="Banco de Dados">Banco de Dados</option>
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-2">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                  placeholder="react, nextjs, tutorial"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar como Rascunho'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  // Lógica para publicar diretamente
                }}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <BlogFooter />
    </div>
  );
}
