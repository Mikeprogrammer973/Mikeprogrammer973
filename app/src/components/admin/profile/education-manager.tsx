
'use client'

import { useState } from 'react'
import { supabase } from 'mdp/lib/supabase/client'
import { Button } from 'mdp/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'mdp/components/ui/card'
import { Plus, Edit, Trash2, GraduationCap } from 'lucide-react'
import { Education } from 'mdp/lib/supabase/types/database'

interface EducationManagerProps {
  educations: Education[]
  onUpdate: (educations: Education[]) => void
}

export default function EducationManager({ educations, onUpdate }: EducationManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    field: '',
    start_date: '',
    end_date: '',
    current: false,
    description: '',
    grade: '',
    activities: ''
  })

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from('educations')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
        
        onUpdate(educations.map(edu => 
          edu.id === editingId ? { ...edu, ...formData } : edu
        ))
      } else {
        const { data, error } = await supabase
          .from('educations')
          .insert([formData])
          .select()

        if (error) throw error
        onUpdate([...educations, data[0]])
      }

      setEditingId(null)
      setShowForm(false)
      setFormData({
        institution: '',
        degree: '',
        field: '',
        start_date: '',
        end_date: '',
        current: false,
        description: '',
        grade: '',
        activities: ''
      })
    } catch (error) {
      console.error('Error saving education:', error)
      alert('Erro ao salvar educação')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta educação?')) return

    try {
      const { error } = await supabase
        .from('educations')
        .delete()
        .eq('id', id)

      if (error) throw error
      onUpdate(educations.filter(edu => edu.id !== id))
    } catch (error) {
      console.error('Error deleting education:', error)
      alert('Erro ao excluir educação')
    }
  }

  const startEdit = (education: Education) => {
    setEditingId(education.id)
    setFormData(education)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Formação Acadêmica</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Formação
        </Button>
      </div>

      {showForm && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? 'Editar Formação' : 'Nova Formação'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Instituição *</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Grau *</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({...formData, degree: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Área *</label>
                <input
                  type="text"
                  value={formData.field}
                  onChange={(e) => setFormData({...formData, field: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Nota</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Data de Início *</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Data de Término</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  disabled={formData.current}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white disabled:opacity-50"
                />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={formData.current}
                onChange={(e) => setFormData({...formData, current: e.target.checked})}
                className="w-4 h-4 mr-2"
              />
              <label className="text-sm text-gray-300">Cursando atualmente</label>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Descrição</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Atividades</label>
              <textarea
                rows={2}
                value={formData.activities}
                onChange={(e) => setFormData({...formData, activities: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
              />
            </div>
            <div className="flex space-x-4 mt-6">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                Salvar
              </Button>
              <Button 
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({
                    institution: '',
                    degree: '',
                    field: '',
                    start_date: '',
                    end_date: '',
                    current: false,
                    description: '',
                    grade: '',
                    activities: ''
                  })
                }}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de educações */}
      <div className="grid grid-cols-1 gap-4">
        {educations.map((education) => (
          <Card key={education.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-white">{education.institution}</h3>
                  </div>
                  <p className="text-gray-300">{education.degree} em {education.field}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(education.start_date).toLocaleDateString('pt-BR')} -{' '}
                    {education.current ? 'Presente' : new Date(education.end_date || Date.now()).toLocaleDateString('pt-BR')}
                  </p>
                  {education.grade && (
                    <p className="text-gray-400 text-sm">Nota: {education.grade}</p>
                  )}
                  {education.description && (
                    <p className="text-gray-400 text-sm mt-2">{education.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(education)}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(education.id)}
                    className="border-red-800 text-red-400 hover:bg-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {educations.length === 0 && !showForm && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhuma formação cadastrada</h3>
            <p className="text-gray-400 mb-4">Comece adicionando sua primeira formação acadêmica</p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Formação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}