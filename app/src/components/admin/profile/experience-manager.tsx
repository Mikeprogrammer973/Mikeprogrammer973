
'use client'

import { useState } from 'react'
import { supabase } from 'mdp/lib/supabase/client'
import { Button } from 'mdp/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'mdp/components/ui/card'
import { Plus, Edit, Trash2, Briefcase, X } from 'lucide-react'
import { EmploymentType, Experience } from 'mdp/lib/supabase/types/database'

interface ExperienceManagerProps {
  experiences: Experience[]
  onUpdate: (experiences: Experience[]) => void
}

export default function ExperienceManager({ experiences, onUpdate }: ExperienceManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Experience>>({
    company: '',
    position: '',
    employment_type: 'full-time',
    location: '',
    start_date: '',
    end_date: '',
    current: false,
    description: '',
    achievements: [],
    technologies: []
  })
  const [newAchievement, setNewAchievement] = useState('')
  const [newTechnology, setNewTechnology] = useState('')

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from('experiences')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
        
        onUpdate(experiences.map(exp => 
          exp.id === editingId ? { ...exp, ...formData } as Experience : exp
        ))
      } else {
        const { data, error } = await supabase
          .from('experiences')
          .insert([formData])
          .select()

        if (error) throw error
        onUpdate([...experiences, data[0] as Experience])
      }

      setEditingId(null)
      setShowForm(false)
      setFormData({
        company: '',
        position: '',
        employment_type: 'full-time',
        location: '',
        start_date: '',
        end_date: '',
        current: false,
        description: '',
        achievements: [],
        technologies: []
      })
    } catch (error) {
      console.error('Error saving experience:', error)
      alert('Erro ao salvar experiência')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta experiência?')) return

    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id)

      if (error) throw error
      onUpdate(experiences.filter(exp => exp.id !== id))
    } catch (error) {
      console.error('Error deleting experience:', error)
      alert('Erro ao excluir experiência')
    }
  }

  const startEdit = (experience: Experience) => {
    setEditingId(experience.id)
    setFormData(experience)
    setShowForm(true)
  }

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...(formData.achievements || []), newAchievement.trim()]
      })
      setNewAchievement('')
    }
  }

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements?.filter((_, i) => i !== index) || []
    })
  }

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), newTechnology.trim()]
      })
      setNewTechnology('')
    }
  }

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter((_, i) => i !== index) || []
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setShowForm(false)
    setFormData({
      company: '',
      position: '',
      employment_type: 'full-time',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: '',
      achievements: [],
      technologies: []
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Experiência Profissional</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Experiência
        </Button>
      </div>

      {showForm && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? 'Editar Experiência' : 'Nova Experiência'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Empresa *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Cargo *</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Tipo de Emprego</label>
                <select
                  value={formData.employment_type}
                  onChange={(e) => setFormData({...formData, employment_type: e.target.value as EmploymentType})}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full-time">Tempo Integral</option>
                  <option value="part-time">Meio Período</option>
                  <option value="contract">Contrato</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Estágio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Localização</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Data de Início *</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Data de Término</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  disabled={formData.current}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={formData.current}
                onChange={(e) => setFormData({...formData, current: e.target.checked})}
                className="w-4 h-4 mr-2 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label className="text-sm font-medium text-gray-300">Emprego Atual</label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Conquistas</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder="Adicionar conquista..."
                  className="flex-1 px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button 
                  onClick={addAchievement}
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.achievements?.map((achievement, index) => (
                  <span key={index} className="flex items-center px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                    {achievement}
                    <button
                      onClick={() => removeAchievement(index)}
                      className="ml-2 text-gray-400 hover:text-gray-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Tecnologias</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Adicionar tecnologia..."
                  className="flex-1 px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button 
                  onClick={addTechnology}
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies?.map((tech, index) => (
                  <span key={index} className="flex items-center px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm">
                    {tech}
                    <button
                      onClick={() => removeTechnology(index)}
                      className="ml-2 text-blue-400 hover:text-blue-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingId ? 'Salvar Alterações' : 'Criar Experiência'}
              </Button>
              <Button 
                onClick={cancelEdit}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de experiências */}
      <div className="space-y-4">
        {experiences.map((experience) => (
          <Card key={experience.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{experience.position}</h3>
                      <p className="text-blue-400">{experience.company}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(experience.start_date).toLocaleDateString('pt-BR')} - 
                        {experience.current ? ' Presente' : ` ${new Date(experience.end_date || Date.now()).toLocaleDateString('pt-BR')}`}
                        {experience.location && ` • ${experience.location}`}
                      </p>
                      <p className="text-gray-400 text-sm capitalize">{experience.employment_type}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => startEdit(experience)}
                        variant="outline" 
                        size="sm"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDelete(experience.id)}
                        variant="outline" 
                        size="sm"
                        className="border-red-800 text-red-400 hover:bg-red-900 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {experience.description && (
                    <p className="text-gray-300 mt-3">{experience.description}</p>
                  )}

                  {experience.achievements && experience.achievements.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Conquistas:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        {experience.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Tecnologias:</h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-900 text-blue-200 rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {experiences.length === 0 && !showForm && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="w-12 h-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">Nenhuma experiência cadastrada</h3>
              <p className="text-gray-400 mb-4">Adicione sua primeira experiência profissional</p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Experiência
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
