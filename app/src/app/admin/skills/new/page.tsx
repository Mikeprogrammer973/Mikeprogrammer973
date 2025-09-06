
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from 'mdp/lib/supabase/client'
import { Button } from 'mdp/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'mdp/components/ui/card'
import { ArrowLeft, Save, Palette, Sparkles } from 'lucide-react'
import { Skill } from 'mdp/lib/supabase/types/database'

const defaultColors = [
  '#3B82F6', 
  '#10B981', 
  '#F59E0B', 
  '#EF4444',
  '#8B5CF6', 
  '#EC4899',
  '#06B6D4', 
  '#84CC16' 
]

const categories = [
  { id: 'frontend', name: 'Frontend', icon: '💻' },
  { id: 'backend', name: 'Backend', icon: '⚙️' },
  { id: 'database', name: 'Database', icon: '🗄️' },
  { id: 'design', name: 'Design', icon: '🎨' },
  { id: 'mobile', name: 'Mobile', icon: '📱' },
  { id: 'devops', name: 'DevOps', icon: '☁️' },
  { id: 'other', name: 'Outro', icon: '🔧' }
]

export default function NewSkill() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Skill>({
    name: '',
    description: '',
    category: 'frontend',
    proficiency: 80,
    icon: '💻',
    color: '#3B82F6',
    featured: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('skills')
        .insert([{
          ...formData,
          proficiency: Number(formData.proficiency)
        }])

      if (error) {
        throw error
      }

      router.push('/admin/skills')
    } catch (error) {
      console.error('Error creating skill:', error)
      alert('Erro ao criar habilidade')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" asChild className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
            <Link href="/admin/skills">
              <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-white">Nova Habilidade</h1>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Detalhes da Habilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Nome *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: React, Node.js, Photoshop"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Descrição *</label>
                <input
                  type="text"
                  required
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Framework for web applications"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Categoria *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => {handleInputChange('category', e.target.value), handleInputChange('icon', categories.find(c => c.id === e.target.value)?.icon || '')}}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Proficiência: {formData.proficiency}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.proficiency}
                  onChange={(e) => handleInputChange('proficiency', e.target.value)}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-dark"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Iniciante</span>
                  <span>Especialista</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {defaultColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleInputChange('color', color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        formData.color === color ? 'border-white scale-110' : 'border-gray-700'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => handleInputChange('color', '#FFFFFF')}
                    className="w-8 h-8 rounded-lg border border-gray-700 flex items-center justify-center bg-gray-800"
                  >
                    <Palette className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Ícone</label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={(e) => handleInputChange('icon', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Emoji ou código de ícone"
                  maxLength={2}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="w-4 h-4 mr-2 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="featured" className="flex items-center text-sm font-medium text-gray-300">
                  <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
                  Habilidade em destaque
                </label>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Criar Habilidade
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        .slider-dark::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #1F2937;
        }
        
        .slider-dark::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #1F2937;
        }
      `}</style>
    </div>
  )
}