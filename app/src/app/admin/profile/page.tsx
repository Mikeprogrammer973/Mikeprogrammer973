
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from 'mdp/lib/supabase/client'
import { Button } from 'mdp/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'mdp/components/ui/card'
import { 
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  Mail,
  FileText,
  Save,
} from 'lucide-react'
import EducationManager from 'mdp/components/admin/profile/education-manager'
import ExperienceManager from 'mdp/components/admin/profile/experience-manager'
import { useAuth } from 'mdp/hooks/useAuth'
import { Spinner } from 'mdp/components/ui/spinner'
import { Profile, Education, Experience } from 'mdp/lib/supabase/types/database'

export default function AdminProfile() {
    const {} = useAuth(true)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [educations, setEducations] = useState<Education[]>([])
    const [experiences, setExperiences] = useState<Experience[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('personal')

    useEffect(() => {
    fetchData()
    }, [])

    const fetchData = async () => {
    try {
        const [profileResponse, educationsResponse, experiencesResponse] = await Promise.all([
        supabase.from('profiles').select('*').single(),
        supabase.from('educations').select('*').order('start_date', { ascending: false }),
        supabase.from('experiences').select('*').order('start_date', { ascending: false })
        ])

        if (profileResponse.data) setProfile(profileResponse.data)
        if (educationsResponse.data) setEducations(educationsResponse.data)
        if (experiencesResponse.data) setExperiences(experiencesResponse.data)
    } catch (error) {
        console.error('Error fetching data:', error)
    } finally {
        setLoading(false)
    }
    }

    const handleSave = async () => {
    if (!profile) return
    setSaving(true)

    try {
        const { error } = await supabase
        .from('profiles')
        .update({
            ...profile,
            updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

        if (error) throw error
        alert('Perfil atualizado com sucesso!')
    } catch (error) {
        console.error('Error saving profile:', error)
        alert('Erro ao salvar perfil')
    } finally {
        setSaving(false)
    }
    }

    if (loading) {
        return <Spinner />
    }

    return (
    <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
            <Button variant="outline" asChild className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                <Link href="/admin/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
                Voltar
                </Link>
            </Button>
            <h1 className="text-3xl font-bold text-white">Informações Pessoais</h1>
            </div>
            <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            >
            {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
                <>
                <Save className="w-4 h-4 mr-2" />
                Salvar
                </>
            )}
            </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg mb-8">
            {[
            { id: 'personal', label: 'Pessoal', icon: User },
            { id: 'education', label: 'Educação', icon: GraduationCap },
            { id: 'experience', label: 'Experiência', icon: Briefcase }
            ].map((tab) => {
            const Icon = tab.icon
            return (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                </button>
            )
            })}
        </div>

        {/* Personal */}
        {activeTab === 'personal' && profile && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                <CardTitle className="text-white flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informações Básicas
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Nome Completo *</label>
                    <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Título Profissional *</label>
                    <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile({...profile, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Descrição Curta</label>
                    <textarea
                    rows={3}
                    value={profile.description}
                    onChange={(e) => setProfile({...profile, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Slogans</label>
                    <textarea
                    rows={5}
                    value={profile.slogans?.join('\n')}
                    onChange={(e) => setProfile({...profile, slogans: e.target.value.split('\n')})}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Um slogan por linha"
                    />
                </div>
                </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                <CardTitle className="text-white flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Contato e Mídia
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Email *</label>
                    <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Telefone</label>
                    <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Endereço</label>
                    <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Website</label>
                    <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">URL da Foto</label>
                    <input
                    type="url"
                    value={profile.photo_url}
                    onChange={(e) => setProfile({...profile, photo_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">URL do Currículo</label>
                    <input
                    type="url"
                    value={profile.resume_url}
                    onChange={(e) => setProfile({...profile, resume_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
                <CardHeader>
                <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Sobre e História
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Sobre</label>
                    <textarea
                    rows={6}
                    value={profile.about}
                    onChange={(e) => setProfile({...profile, about: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Escreva um texto detalhado sobre você..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">História</label>
                    <textarea
                    rows={6}
                    value={profile.history}
                    onChange={(e) => setProfile({...profile, history: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Conte sua história profissional..."
                    />
                </div>
                </CardContent>
            </Card>
            </div>
        )}

        {/* Education */}
        {activeTab === 'education' && (
            <EducationManager educations={educations} onUpdate={setEducations} />
        )}

        {/* Experience */}
        {activeTab === 'experience' && (
            <ExperienceManager experiences={experiences} onUpdate={setExperiences} />
        )}
        </div>
    </div>
    )
}
