
import { EmailFactory } from 'mdp/lib/email/Factory';
import { sendEmail } from 'mdp/lib/email/send';
import { ALLOWED_ORIGINS } from 'mdp/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  if (!ALLOWED_ORIGINS.includes(request.headers.get('origin') || '')) {
    return NextResponse.json({ error: 'Origem não permitida' }, { status: 403 });
  }
  
  try {
    const body = await request.json()
    const { type, recipient, data } = body;

    // validar os dados
    if (!type || !recipient || !recipient.email) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    let email;

    // email baseado no tipo
    switch (type) {
      case 'welcome':
        email = EmailFactory.createWelcomeEmail(
          recipient.name || 'amigo(a)',
          recipient.email
        );
        break;

      case 'contact-confirmation':
        email = EmailFactory.createContactConfirmationEmail(
          recipient.name || 'amigo(a)',
          recipient.email
        );
        break;

      case 'new-project':
        if (!data || !data.name || !data.description) {
          return NextResponse.json(
            { error: 'Dados do projeto incompletos' },
            { status: 400 }
          );
        }
        email = EmailFactory.createNewProjectEmail(
          recipient.name || 'amigo(a)',
          recipient.email,
          data
        );
        break;

      case 'new-article':
        if (!data || !data.name || !data.excerpt || !data.url) {
          return NextResponse.json(
            { error: 'Dados do artigo incompletos' },
            { status: 400 }
          );
        }
        email = EmailFactory.createNewArticleEmail(
          recipient.name || 'amigo(a)',
          recipient.email,
          data
        );
        break;

      case 'unsubscribe-confirmation':
        email = EmailFactory.createUnsubscribeEmail(
          recipient.name || 'amigo(a)',
          recipient.email
        );
        break;

      case 'general':
        email = EmailFactory.createGeneralEmail(
          recipient.name || 'amigo(a)',
          recipient.email,
          data
        );
        break;
      
      case 'verification':
        email = EmailFactory.createVerificationEmail(
          recipient.name || 'amigo(a)',
          recipient.email,
          data
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo de email inválido' },
          { status: 400 }
        );
    }

    // renderizar email
    const { subject, html, text } = email.render();

    // enviar
    const result = await sendEmail({
      to: recipient.email,
      subject,
      html,
      text,
    });

    return NextResponse.json({
      success: true,
      message: 'Email enviado com sucesso',
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Erro no endpoint de email:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Configuração da rota
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};