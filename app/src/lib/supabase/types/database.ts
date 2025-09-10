
export enum Status {
  Draft = 'Rascunho',
  Published = 'Publicado',
  Archived = 'Arquivado'
}

export enum DevStage {
  Planning_Structure = 'Planejamento',
  Planning_Design = 'Design',
  Development = 'Desenvolvimento',
  Testing = 'Teste',
  Production_Setup = "Configuração de Produção"
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
  dev_stage?: DevStage | null;
  stage_progress?: number;
  priority?: number;
  pro_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id?: string;
  name: string;
  slug?: string;
  category: string;
  proficiency: number;
  description?: string | null;
  icon: string | null;
  color: string;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

export interface Profile {
  id: string;
  full_name: string;
  title: string;
  description?: string;
  about?: string;
  history?: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  photo_url?: string;
  resume_url?: string;
  social_links: SocialLinks;
  slogans: string[];
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  profile_id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description?: string;
  grade?: string;
  activities?: string;
  created_at: string;
  updated_at: string;
}

export type EmploymentType = 
  | 'full-time' 
  | 'part-time' 
  | 'contract' 
  | 'freelance' 
  | 'internship';

export interface Experience {
  id: string;
  profile_id: string;
  company: string;
  position: string;
  employment_type: EmploymentType;
  location?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description?: string;
  achievements: string[];
  technologies: string[];
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

export interface Setting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}