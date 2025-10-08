'use client';

import { useRef, useEffect } from 'react';
import parse from 'html-react-parser';
import { Bold, Code, ImageIcon, Italic, Link, Redo, Undo } from 'lucide-react';

interface WysiwygEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function PostEditor({ value, onChange }: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateHtml();
  };

  const updateHtml = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Digite a URL:');
    if (url) exec('createLink', url);
  };

  const insertImage = () => {
    const url = prompt('Digite a URL da imagem:');
    if (url) exec('insertImage', url);
  };

  const changeFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    exec('fontSize', '7');
    const fontElements = document.getElementsByTagName('font');
    for (let i = 0; i < fontElements.length; i++) {
      if (fontElements[i].size === '7') {
        fontElements[i].removeAttribute('size');
        fontElements[i].style.fontSize = size;
      }
    }
    updateHtml();
  };

  const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    exec('foreColor', newColor);
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap items-center gap-2 border-b pb-2">
        <button type="button" onClick={() => exec('bold')} className="p-1 rounded-lg text-[hsl(var(--muted))] hover:bg-[hsl(var(--foreground))]/80 bg-[hsl(var(--muted-foreground))]">
            <Bold className='w-5 h-5' />
        </button>
        <button type="button" onClick={() => exec('italic')} className="p-1 rounded-lg text-[hsl(var(--muted))] hover:bg-[hsl(var(--foreground))]/80 bg-[hsl(var(--muted-foreground))]">
            <Italic className='w-5 h-5' />
        </button>
        <button type="button" onClick={insertLink} className="p-1 rounded-lg text-[hsl(var(--muted))] hover:bg-[hsl(var(--foreground))]/80 bg-[hsl(var(--muted-foreground))]">
            <Link className='w-5 h-5' />
        </button>
        <button type="button" onClick={insertImage} className="p-1 rounded-lg text-[hsl(var(--muted))] hover:bg-[hsl(var(--foreground))]/80 bg-[hsl(var(--muted-foreground))]">
            <ImageIcon className='w-5 h-5' />
        </button>
        <button type="button" onClick={() => exec('formatBlock', '<pre>')} className="p-1 rounded-lg text-[hsl(var(--muted))] hover:bg-[hsl(var(--foreground))]/80 bg-[hsl(var(--muted-foreground))]">
            <Code className='w-5 h-5' />
        </button>

        <select
          defaultValue="16px"
          onChange={changeFontSize}
          className="text-sm border border-[hsl(var(--border))] px-2 py-1 rounded"
        >
          <option className='bg-[hsl(var(--primary-foreground))]' value="12px">12px</option>
          <option className='bg-[hsl(var(--primary-foreground))]' value="14px">14px</option>
          <option className='bg-[hsl(var(--primary-foreground))]' value="16px">16px</option>
          <option className='bg-[hsl(var(--primary-foreground))]' value="18px">18px</option>
          <option className='bg-[hsl(var(--primary-foreground))]' value="24px">24px</option>
          <option className='bg-[hsl(var(--primary-foreground))]' value="32px">32px</option>
          <option className='bg-[hsl(var(--primary-foreground))]' value="40px">40px</option>
          <option className='bg-[hsl(var(--primary-foreground))]' value="48px">48px</option>
          <option className='bg-[hsl(var(--primary-foreground))]' value="60px">60px</option>
          <option className='bg-[hsl(var(--primary-foreground))]' value="64px">64px</option>
          <option className='bg-[hsl(var(--primary-foreground))]' value="72px">72px</option>
          <option className='bg-[hsl(var(--primary-foreground))]' value="96px">96px</option>
        </select>

        <input
          type="color"
          onChange={changeColor}
          title="Cor do texto"
          className="w-8 h-8 border rounded"
        />

        <button type="button" onClick={() => exec('undo')} className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70">
            <Undo className='w-5 h-5' />
        </button>
        <button type="button" onClick={() => exec('redo')} className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70">
            <Redo className='w-5 h-5' />
        </button>
      </div>

      <div translate='no' className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          ref={editorRef}
          contentEditable
          className="border border-[hsl(var(--ring))] outline-none p-4 min-h-[200px] bg-[hsl(var(--foreground))]/5 text-[hsl(var(--foreground))]] rounded overflow-auto"
          onInput={updateHtml}
          suppressContentEditableWarning={true}
        />

        <div className="border p-4 min-h-[200px] bg-[hsl(var(--foreground))]/10 rounded prose max-w-none">
          <h3 translate='yes' className="text-sm text-[hsl(var(--foreground))]/50 mb-2">Pré-visualização:</h3>
          {parse(value)}
        </div>
      </div>
    </div>
  );
}
