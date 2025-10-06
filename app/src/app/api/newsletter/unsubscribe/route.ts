
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from 'mdp/lib/supabase/client'
import { EmailFactory } from 'mdp/lib/email/Factory'
import { sendEmail } from 'mdp/lib/email/send'
import { ALLOWED_ORIGINS } from 'mdp/lib/utils';

export async function POST(request: NextRequest) {
  if (!ALLOWED_ORIGINS.includes(request.headers.get('origin') || '')) {
    return NextResponse.json({ error: 'Origem não permitida' }, { status: 403 });
  }
  
  try {
    const { email, reason } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Verificar se existe e está inscrito
    const { data: subscription } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('email', email)
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: 'Email não encontrado' },
        { status: 404 }
      );
    }

    if (!subscription.subscribed) {
      return NextResponse.json(
        { error: 'Este email já não está inscrito' },
        { status: 400 }
      );
    }

    // Atualizar para cancelado
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({
        subscribed: false,
        unsubscribe_date: new Date().toISOString(),
        unsubscribe_reason: reason || null,
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) throw error;

    // email de confirmação de cancelamento
    try {
      const __email = EmailFactory.createUnsubscribeEmail(
        subscription.name || 'Assinante',
        email
      )

      const { subject, html, text } = __email.render()

      await sendEmail({
        to: email,
        subject,
        html,
        text,
      })
    } catch (emailError) {
      console.error('Erro ao enviar email de cancelamento:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Inscrição cancelada com sucesso'
    });

  } catch (error) {
    console.error('Erro no cancelamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}