
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  X,
  Save
} from 'lucide-react'
import { supabase } from 'mdp/lib/supabase/client'
import { DevStage, Project, Status } from 'mdp/lib/supabase/types/database'
import { useAuth } from 'mdp/hooks/useAuth'
import { Spinner } from 'mdp/components/ui/spinner'
import { getNewsletterSubs } from 'mdp/lib/utils'
import { EmailService } from 'mdp/lib/email/service'

export default function NewProject() {
  const [_loading, setLoading] = useState(false)
  const { session, loading } = useAuth(true)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<Project>({
    title: '',
    slug: '',
    description: '',
    content: '',
    technologies: [] as string[],
    project_url: '',
    github_url: '',
    image_url: '',
    featured: false,
    category: '',
    status: Status.Draft,
    dev_stage: null,
    stage_progress: 0,
    pro_date: null
  })
  const [techInput, setTechInput] = useState('')
  const router = useRouter()

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('projects')
        .insert([{
          ...formData,
          slug: formData.slug || generateSlug(formData.title)
        }])

      if (error) throw error

      const { data: subs } = await getNewsletterSubs()

      if(formData.status as string === 'published' && subs) {
        subs.forEach(async sub => {
          await EmailService.sendNewProjectNotification({
            email: sub.email,
            name: sub.name || 'amigo(a)'
          }, {
            name: formData.title,
            description: formData.description || '',
            url: formData.project_url || '',
            image: formData.image_url || ''
          })
        })
      }

      router.push('/admin/projects')
      router.refresh()
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Erro ao criar projeto')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Selecione uma imagem para upload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${generateSlug(formData.title)}_${Date.now()}.${fileExt}`
      const filePath = `projects/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: true
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath)

      setFormData({ ...formData, image_url: publicUrl })
    } catch (error) {
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    })
  }

  if (loading || _loading) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex items-center space-x-4 mb-8">
        <Link
          href="/admin/projects"
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </Link>
        <h1 className="text-2xl font-bold">Novo Projeto</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ 
                ...formData, 
                title: e.target.value,
                slug: formData.slug || generateSlug(e.target.value)
              })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome do projeto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="slug-do-projeto"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descrição *
          </label>
          <textarea
            required
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descrição breve do projeto"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Conteúdo
          </label>
          <textarea
            rows={6}
            value={formData.content || ''}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Conteúdo detalhado do projeto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL do Projeto
            </label>
            <input
              type="url"
              value={formData.project_url || ''}
              onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://projeto.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL do GitHub
            </label>
            <input
              type="url"
              value={formData.github_url || ''}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://github.com/usuario/projeto"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tecnologias
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite uma tecnologia e pressione Enter"
            />
            <button
              type="button"
              onClick={addTechnology}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="ml-2 text-blue-600 hover:text-blue-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Imagem do Projeto
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Fazendo upload...' : 'Selecionar imagem'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {formData.image_url && (
              <div className="w-16 h-16 bg-cover bg-center rounded border border-gray-700" style={{ backgroundImage: `url(${formData.image_url})` }} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoria
            </label>
            <input
              type="text"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Web Development"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => {setFormData({ ...formData, status: e.target.value as Status })}}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300">Projeto em Destaque</span>
            </label>
          </div>
        </div>

        {(formData.status as string) === 'draft' && <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dev Stage
            </label>
            <select
              value={formData.dev_stage || ''}
              onChange={(e) => setFormData({ ...formData, dev_stage: e.target.value as DevStage })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="planning_structure">Planejamento</option>
              <option value="planning_design">Design</option>
              <option value="development">Desenvolvimento</option>
              <option value="testing">Teste</option>
              <option value="production_setup">Configurar Produção</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Progresso
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.stage_progress || 0}
              onChange={(e) => setFormData({ ...formData, stage_progress: parseInt(e.target.value) })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Data de Conclusão
            </label>
            <input
              type="date"
              value={formData.pro_date || ''}
              onChange={(e) => setFormData({ ...formData, pro_date: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Web Development"
            />
          </div>
        </div>}

        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Salvando...' : 'Salvar Projeto'}</span>
          </button>

          <Link
            href="/admin/projects"
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <span>Cancelar</span>
          </Link>
        </div>
      </form>
    </div>
  )
}