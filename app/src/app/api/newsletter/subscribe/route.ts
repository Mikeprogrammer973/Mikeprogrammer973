
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from 'mdp/lib/supabase/client'
import { EmailFactory } from 'mdp/lib/email/Factory'
import { sendEmail } from 'mdp/lib/email/send'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('email', email)
      .single();

    console.log("rxt: ", existing)
    
    if (existing) {
      console.log(existing)
      if (existing.subscribed) {
        console.log("ativo")
        return NextResponse.json(
          { error: 'Este email já está inscrito' },
          { status: 400 }
        );
      } else {
        // Reativar inscrição
        console.log("re-ativando")
        const { error } = await supabase
          .from('newsletter_subscriptions')
          .update({
            subscribed: true,
            name: name || undefined,
            unsubscribe_date: null,
            unsubscribe_reason: null,
            updated_at: new Date().toISOString()
          })
          .eq('email', email);

        if (error) throw error;
      }
    } else {
      // Nova inscrição
      console.log("nova")
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email,
          name: name || undefined,
          subscribed: true,
          subscription_date: new Date().toISOString()
        });

      if (error) throw error;
    }

    // email de boas-vindas
    try {
      const __email = EmailFactory.createWelcomeEmail(
        name || 'Cliente',
        email
      )
      const { subject, html, text } = __email.render();

      await sendEmail({
        to: email,
        subject,
        html,
        text,
      });
    } catch (emailError) {
      console.error('Erro ao enviar email de boas-vindas:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Inscrição realizada com sucesso'
    });

  } catch (error) {
    console.error('Erro na inscrição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
