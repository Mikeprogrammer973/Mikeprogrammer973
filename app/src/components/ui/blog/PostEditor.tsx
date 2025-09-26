'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
} from 'lucide-react';
import { cn } from 'mdp/lib/utils'; // se tiver helper para juntar classes

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Escreva seu conteúdo aqui...',
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  // botão padrão com estados
  const btnClass = (active?: boolean) =>
    cn(
      'p-2 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent/50',
      active
        ? 'bg-accent text-accent-foreground'
        : 'hover:bg-accent/70 hover:text-accent-foreground text-muted-foreground'
    );

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50 backdrop-blur">
        <button
          title="Negrito"
          aria-label="Negrito"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          title="Itálico"
          aria-label="Itálico"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          title="Título 1"
          aria-label="Título 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={btnClass(editor.isActive('heading', { level: 1 }))}
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          title="Título 2"
          aria-label="Título 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive('heading', { level: 2 }))}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          title="Lista não ordenada"
          aria-label="Lista não ordenada"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          title="Lista ordenada"
          aria-label="Lista ordenada"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          title="Citação"
          aria-label="Citação"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive('blockquote'))}
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="flex-grow" />

        <button
          title="Desfazer"
          aria-label="Desfazer"
          onClick={() => editor.chain().focus().undo().run()}
          className={btnClass()}
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          title="Refazer"
          aria-label="Refazer"
          onClick={() => editor.chain().focus().redo().run()}
          className={btnClass()}
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none"
      />
    </div>
  );
}
