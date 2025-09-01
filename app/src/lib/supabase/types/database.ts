
export enum Status {
  Draft = 'Rascunho',
  Published = 'Publicado',
  Archived = 'Arquivado'
}

export interface Project {
  id?: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  image_url: string | null;
  technologies: string[];
  project_url: string | null;
  github_url: string | null;
  featured: boolean;
  category: string | null;
  status: Status;
  priority?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  proficiency: number;
  description: string | null;
  icon: string | null;
  color: string;
  show_in_homepage: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  archived: boolean;
  category: 'general' | 'work' | 'question' | 'other';
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author: string;
  tags: string[];
  category: string | null;
  status: Status;
  featured: boolean;
  read_time: number | null;
  views: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: 'project' | 'skill' | 'blog';
  color: string;
  priority: number;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  description: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}