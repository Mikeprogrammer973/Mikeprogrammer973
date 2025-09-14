
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from 'mdp/lib/supabase/client'
import { Button } from 'mdp/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'mdp/components/ui/card'
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Search,
  Filter,
  Star,
  Code,
  Palette,
  Database,
  Server,
  Smartphone,
  Cloud
} from 'lucide-react'
import { Spinner } from 'mdp/components/ui/spinner'
import { useAuth } from 'mdp/hooks/useAuth'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon: string
  color: string
  featured: boolean
  created_at: string
}

export default function AdminSkills() {
  const {loading, session} = useAuth(true)
  const [skills, setSkills] = useState<Skill[]>([])
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([])
  const [loading_, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    fetchSkills()
  }, [])

  useEffect(() => {
    filterSkills()
  }, [skills, searchTerm, categoryFilter])

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('proficiency', { ascending: false })

      if (error) {
        throw error
      }

      setSkills(data || [])
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSkills = () => {
    let filtered = skills.filter(skill =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(skill => skill.category === categoryFilter)
    }

    setFilteredSkills(filtered)
  }

  const deleteSkill = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta habilidade?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setSkills(skills.filter(skill => skill.id !== id))
    } catch (error) {
      console.error('Error deleting skill:', error)
      alert('Erro ao excluir habilidade')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend': return <Code className="w-4 h-4" />
      case 'backend': return <Server className="w-4 h-4" />
      case 'database': return <Database className="w-4 h-4" />
      case 'design': return <Palette className="w-4 h-4" />
      case 'mobile': return <Smartphone className="w-4 h-4" />
      case 'devops': return <Cloud className="w-4 h-4" />
      default: return <Code className="w-4 h-4" />
    }
  }

  const categories = [
    { id: 'all', name: 'Todas', icon: <Filter className="w-4 h-4" /> },
    { id: 'frontend', name: 'Frontend', icon: <Code className="w-4 h-4" /> },
    { id: 'backend', name: 'Backend', icon: <Server className="w-4 h-4" /> },
    { id: 'database', name: 'Database', icon: <Database className="w-4 h-4" /> },
    { id: 'design', name: 'Design', icon: <Palette className="w-4 h-4" /> },
    { id: 'mobile', name: 'Mobile', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'devops', name: 'DevOps', icon: <Cloud className="w-4 h-4" /> }
  ]

  if (loading || loading_) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center flex-wrap gap-4 justify-between mb-8">
          <div className="flex items-center flex-wrap gap-4 space-x-4">
            <Button variant="outline" asChild className="border-gray-700 hover:bg-gray-800">
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Gerenciar Habilidades</h1>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/admin/skills/new">
              <Plus className="w-6 h-6" />
            </Link>
          </Button>
        </div>

        <Card className="mb-8 bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Buscar</label>
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar habilidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Categoria</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <Card key={skill.id} className="relative group bg-gray-900 border-gray-800 hover:border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: skill.color }}
                    >
                      {getCategoryIcon(skill.category)}
                    </div>
                    <CardTitle className="text-lg text-white">{skill.name}</CardTitle>
                  </div>
                  {skill.featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-400">Categoria</span>
                    <p className="font-medium capitalize text-white">{skill.category}</p>
                  </div>

                  <div>
                    <span className="text-sm text-gray-400">Proficiência</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-white">{skill.proficiency}%</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" asChild className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                      <Link href={`/admin/skills/edit/${skill.id}`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteSkill(skill.id)}
                      className="border-red-800 text-red-400 hover:bg-red-900 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Code className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Nenhuma habilidade encontrada</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece adicionando sua primeira habilidade'
                }
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/admin/skills/new">
                  <Plus className="w-4 h-4 mr-2 inline-block" />
                  Adicionar Habilidade
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
