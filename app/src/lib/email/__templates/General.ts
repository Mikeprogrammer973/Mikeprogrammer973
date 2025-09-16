
import { EmailTemplate } from '../Template';

interface GeneralEmailProps {
  subject: string;
  title: string;
  message: string;
  cta?: {
    text: string;
    url: string;
  };
  additionalContent?: string;
}

export class GeneralEmail extends EmailTemplate {
  constructor(
    recipientName: string,
    recipientEmail: string,
    private props: GeneralEmailProps
  ) {
    super(recipientName, recipientEmail);
  }

  protected subject = this.props.subject;
  protected previewText = this.props.message.substring(0, 150) + '...';

  render() {
    const { title, message, cta, additionalContent } = this.props;

    const content = `
      <h1 style="
        margin: 0 0 16px 0;
        font-size: 24px;
        font-weight: bold;
        color: #f5f5f5;
        text-align: center;
      ">
        ${title}
      </h1>
      
      <p style="
        margin: 0 0 16px 0;
        font-size: 16px;
        color: #e5e5e5;
        text-align: center;
      ">
        Olá, ${this.recipientName}!
      </p>
      
      <div style="
        background-color: #1f2937;
        border-left: 4px solid #3b82f6;
        padding: 20px;
        margin: 24px 0;
        border-radius: 4px;
      ">
        <p style="margin: 0; font-size: 16px; color: #e5e5e5; line-height: 1.6;">
          ${message}
        </p>
      </div>
      
      ${additionalContent ? `
        <div style="
          margin: 24px 0;
          padding: 16px;
          background-color: #1f2937;
          border-radius: 6px;
          border: 1px solid #374151;
        ">
          ${additionalContent}
        </div>
      ` : ''}
      
      ${cta ? `
        <div style="text-align: center; margin: 32px 0;">
          <a
            href="${cta.url}"
            style="
              display: inline-block;
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              font-size: 16px;
              transition: all 0.3s ease;
            "
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)';"
            onmouseout="this.style.transform='none'; this.style.boxShadow='none';"
          >
            ${cta.text}
          </a>
        </div>
      ` : ''}
      
      <p style="
        margin: 0 0 24px 0;
        font-size: 16px;
        color: #e5e5e5;
      ">
        Se você tiver alguma dúvida ou precisar de mais informações, não hesite em responder este email 
        ou <a href="https://mikedp.vercel.app/contact" style="color: #3b82f6; text-decoration: none;">entrar em contato diretamente comigo</a>.
      </p>
      
      <p style="
        margin: 0;
        font-size: 16px;
        color: #e5e5e5;
        font-weight: bold;
      ">
        Atenciosamente,<br>
        Mike D. Pascal
      </p>
    `;

    const html = this.getContainer(content, false);
    const text = this.generateTextVersion(content);

    return { subject: this.subject, html, text };
  }
}
