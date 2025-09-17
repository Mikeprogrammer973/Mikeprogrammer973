
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryMenuProps {
  categories: Record<string, number>;
  maxItems?: number;
}

export default function CategoryMenu({ categories, maxItems = 10 }: CategoryMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Converter o objeto em array e ordenar por quantidade
  const categoryArray = Object.entries(categories)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  // Separar entre itens principais e itens extras
  const mainCategories = categoryArray.slice(0, maxItems);
  const extraCategories = categoryArray.slice(maxItems);
  
  const hasExtraCategories = extraCategories.length > 0;

  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">Categorias</h3>
      
      <div className="space-y-2">
        {mainCategories.map((category) => (
          <Link
            key={category.name}
            href={`/blog/category/${encodeURIComponent(category.name)}`}
            className="flex items-center justify-between py-2 hover:text-[hsl(var(--primary))] transition-colors"
          >
            <span className="capitalize">{category.name}</span>
            <span className="text-[hsl(var(--muted-foreground))] text-sm bg-[hsl(var(--muted))] px-2 py-1 rounded-full">
              {category.count}
            </span>
          </Link>
        ))}
        
        {hasExtraCategories && isExpanded && extraCategories.map((category) => (
          <Link
            key={category.name}
            href={`/blog/category/${encodeURIComponent(category.name)}`}
            className="flex items-center justify-between py-2 hover:text-[hsl(var(--primary))] transition-colors"
          >
            <span className="capitalize">{category.name}</span>
            <span className="text-[hsl(var(--muted-foreground))] text-sm bg-[hsl(var--muted)] px-2 py-1 rounded-full">
              {category.count}
            </span>
          </Link>
        ))}
      </div>
      
      {hasExtraCategories && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-[hsl(var(--primary))] mt-4 text-sm hover:underline"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Ver menos
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Ver mais ({extraCategories.length})
            </>
          )}
        </button>
      )}
    </div>
  );
}