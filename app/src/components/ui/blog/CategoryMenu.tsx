
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryMenuProps {
  categories: {
    id: string
    name: string
    count: number
    slug: string
  }[]
  maxItems?: number
}

export default function CategoryMenu({ categories }: CategoryMenuProps) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">Categorias</h3>
      
      <div className="space-y-2">
        {categories.map((category) => (
          <Link
            translate='no'
            key={category.name}
            href={`/blog/categories/${encodeURIComponent(category.slug)}`}
            className="flex items-center justify-between py-2 hover:text-[hsl(var(--primary))] transition-colors"
          >
            <span className="capitalize">{category.name}</span>
            <span className="text-[hsl(var(--muted-foreground))] text-sm bg-[hsl(var(--muted))] px-2 py-1 rounded-full">
              {category.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}