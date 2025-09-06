
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  X,
  Save,
  Trash2
} from 'lucide-react'
import { supabase } from 'mdp/lib/supabase/client'
import { DevStage, Status } from 'mdp/lib/supabase/types/database'
import { useAuth } from 'mdp/hooks/useAuth'

export default function EditProject() {
  const [_loading, setLoading] = useState(true)
  const { session, loading } = useAuth(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    technologies: [] as string[],
    project_url: '',
    github_url: '',
    featured: false,
    category: '',
    status: 'draft',
    dev_stage: 'planning_structure',
    stage_progress: 0,
    pro_date:  '',
    image_url: ''
  })
  const [techInput, setTechInput] = useState('')
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) throw error
      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          description: data.description || '',
          content: data.content || '',
          technologies: data.technologies || [],
          project_url: data.project_url || '',
          github_url: data.github_url || '',
          featured: data.featured || false,
          category: data.category || '',
          status: data.status || 'draft',
          dev_stage: data.dev_stage || null,
          stage_progress: data.stage_progress || 0,
          pro_date: data.pro_date || null,
          image_url: data.image_url || ''
        })
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      alert('Erro ao carregar projeto')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('projects')
        .update(formData)
        .eq('id', projectId)

      if (error) throw error

      router.push('/admin/projects')
      router.refresh()
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Erro ao atualizar projeto')
    } finally {
      setSaving(false)
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
      const fileName = `${generateSlug(formData.title)}_${Math.random()}.${fileExt}`
      const filePath = `projects/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
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

  const deleteProject = async () => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      if(formData.image_url)
      {
        const { error: deleteImageError } = await supabase.storage
          .from('images')
          .remove([formData.image_url])

        if (deleteImageError) throw deleteImageError
      }

      router.push('/admin/projects')
      router.refresh()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Erro ao excluir projeto')
    }
  }

  if (loading || _loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/projects"
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
          <h1 className="text-2xl font-bold">Editar Projeto</h1>
        </div>
        
        <button
          onClick={deleteProject}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Excluir</span>
        </button>
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
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
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