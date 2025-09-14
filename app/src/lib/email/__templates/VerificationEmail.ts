
import { EmailTemplate } from '../Template';

export class VerificationEmail extends EmailTemplate {
  constructor(
    recipientName: string,
    recipientEmail: string,
    private code: string
  ) {
    super(recipientName, recipientEmail);
  }

  protected subject = 'Seu código de verificação 🔐';
  protected previewText = `Use o código ${this.code} para verificar seu email.`;

  render() {
    const content = `
      <h1 style="
        margin: 0 0 16px 0;
        font-size: 24px;
        font-weight: bold;
        color: #f5f5f5;
        text-align: center;
      ">
        Verificação de Email
      </h1>
      
      <p style="
        margin: 0 0 16px 0;
        font-size: 16px;
        color: #e5e5e5;
        text-align: center;
      ">
        Olá, ${this.recipientName}! Use este código para verificar seu email:
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <div style="
          display: inline-block;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          padding: 4px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
        ">
          <div style="
            display: flex;
            gap: 8px;
            background: #1f2937;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #374151;
          ">
            ${this.code.split('').map((digit, index) => `
              <div style="
                padding: 10px;
                background: #111827;
                border: 2px solid #374151;
                border-radius: 8px;
                font-size: 24px;
                font-weight: bold;
                color: #3b82f6;
                text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.4)';"
              onmouseout="this.style.transform='none'; this.style.boxShadow='0 2px 8px rgba(0, 0, 0, 0.3)';">
                ${digit}
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div style="
        background-color: #1f2937;
        border-left: 4px solid #3b82f6;
        padding: 16px;
        margin: 24px 0;
        border-radius: 4px;
      ">
        <h3 style="
          margin: 0 0 8px 0;
          font-size: 18px;
          color: #3b82f6;
          font-weight: bold;
        ">
          💡 Dica de segurança
        </h3>
        <p style="margin: 0; color: #e5e5e5; font-size: 14px;">
          Nunca compartilhe este código com ninguém. Eu nunca pedirei
          seu código de verificação por email, telefone ou mensagem.
        </p>
      </div>

      <div style="
        background-color: #1f2937;
        border: 1px solid #374151;
        padding: 16px;
        margin: 24px 0;
        border-radius: 8px;
        text-align: center;
      ">
        <h3 style="
          margin: 0 0 12px 0;
          font-size: 16px;
          color: #a3a3a3;
          font-weight: bold;
        ">
          ⚡ Não solicitou este código?
        </h3>
        <p style="margin: 0; color: #a3a3a3; font-size: 14px;">
          Se você não solicitou este código, ignore este email ou 
          <a href="htpps://mikedp.vercel.app/contact" style="color: #3b82f6; text-decoration: none; cursor: pointer;">entre em contato comigo</a>.
        </p>
      </div>

      <p style="
        margin: 0;
        font-size: 16px;
        color: #e5e5e5;
        font-weight: bold;
        text-align: center;
      ">
        Atenciosamente,<br>
        Mike D. Pascal
      </p>

      <p style="
        margin: 24px 0 0 0;
        font-size: 12px;
        color: #737373;
        text-align: center;
      ">
        Este é um email automático. Por favor, não responda diretamente a esta mensagem.
      </p>
    `;

    const html = this.getContainer(content, false);
    const text = `Seu código de verificação é: ${this.code}\n\nUse este código para verificar seu email.\n\nSe você não solicitou este código, ignore este email.`;

    return { subject: this.subject, html, text };
  }
}