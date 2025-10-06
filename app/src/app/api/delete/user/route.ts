import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { ALLOWED_ORIGINS} from 'mdp/lib/utils'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: NextRequest) {

    if (!ALLOWED_ORIGINS.includes(req.headers.get('origin') || '')) {
      return NextResponse.json({ error: 'Origem não permitida' }, { status: 403 });
    }

    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
    }

    const { userId } = await req.json()

    if (!userId) {
        return NextResponse.json({ error: 'ID do usuário não fornecido' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) {
        console.error('Erro ao deletar usuário:', error.message);
        return NextResponse.json({ error: 'Erro ao deletar usuário' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Usuário deletado com sucesso' });
}
