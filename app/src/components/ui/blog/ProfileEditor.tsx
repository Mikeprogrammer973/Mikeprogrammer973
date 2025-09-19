import { supabase } from "mdp/lib/supabase/client";
import { useState, useEffect } from "react";

export default function ProfileEditor() {
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    website: '',
    avatar_url: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Buscar perfil do usuário
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('authors')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile({
            username: data.username || '',
            bio: data.bio || '',
            website: data.website || '',
            avatar_url: data.avatar_url || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('authors')
        .update({
          username: profile.username,
          bio: profile.bio,
          website: profile.website,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erro ao atualizar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-2xl font-semibold mb-6">Editar Perfil</h2>
        <div className="space-y-4">
          <div className="h-12 bg-[hsl(var(--muted))] rounded"></div>
          <div className="h-32 bg-[hsl(var(--muted))] rounded"></div>
          <div className="h-12 bg-[hsl(var(--muted))] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Editar Perfil</h2>
      
      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nome de Usuário</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Biografia</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            placeholder="Conte um pouco sobre você..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Website</label>
          <input
            type="url"
            value={profile.website}
            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            placeholder="https://exemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Foto de Perfil</label>
            <div>
              <input
                type="url"
                value={profile.avatar_url}
                onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                placeholder="avatar url"
              />
            </div>
          <div className="flex items-center space-x-4 mt-2">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              className="px-4 py-2 border rounded-md hover:bg-[hsl(var(--accent))] transition-colors"
            >
              Alterar Foto
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );

}