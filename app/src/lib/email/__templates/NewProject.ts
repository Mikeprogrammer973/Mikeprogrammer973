
import { EmailTemplate } from '../Template';

interface NewProjectEmailProps {
  name: string;
  description: string;
  url: string;
  image?: string;
}

export class NewProjectEmail extends EmailTemplate {
  constructor(
    recipientName: string,
    recipientEmail: string,
    private props: NewProjectEmailProps
  ) {
    super(recipientName, recipientEmail);
  }

  protected subject = `🎉 Novo projeto lançado: ${this.props.name}`;
  protected previewText = `Acabei de lançar ${this.props.name} - confira!`;

  render() {
    const { name, description, url, image } = this.props;

    const content = `
      <h1 style="
        margin: 0 0 16px 0;
        font-size: 24px;
        font-weight: bold;
        color: #f5f5f5;
        text-align: center;
      ">
        Novo Projeto Lançado! 🚀
      </h1>
      
      <p style="
        margin: 0 0 16px 0;
        font-size: 16px;
        color: #e5e5e5;
        text-align: center;
      ">
        Olá, ${this.recipientName}! Acabei de publicar um novo projeto e queria compartilhar com você.
      </p>
      
      ${image ? `
        <div style="text-align: center; margin: 0 0 24px 0; padding: 30px; border-radius: 8px; border: 1px solid #374151; background-color: #fff; box-sizing: border-box;">
          <img 
            src="${image}" 
            alt="${name}"
            style="
              max-width: 100%;
              height: auto;
            "
          />
        </div>
      ` : ''}
      
      <h2 style="
        margin: 0 0 12px 0;
        font-size: 30px;
        font-weight: bold;
        color: #3b82f6;
        text-align: center;
      ">
        ${name}
      </h2>
      
      <p style="
        margin: 0 0 24px 0;
        font-size: 16px;
        color: #a19999;
        text-align: center;
      ">
        ${description}
      </p>
      
      <div style="text-align: center; margin: 0 0 24px 0;">
        <a
          href="${url}"
          style="
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
          "
        >
          🔍 Ver Projeto
        </a>
      </div>
      
      <div style="
        background-color: #1f2937;
        border-left: 4px solid #8b5cf6;
        padding: 16px;
        margin: 24px 0;
        border-radius: 4px;
      ">
        <h3 style="
          margin: 0 0 12px 0;
          font-size: 18px;
          color: #f5f5f5;
          font-weight: bold;
        ">
          💡 Gostaria de contribuir?
        </h3>
        <p style="margin: 0; color: #e5e5e5;">
          Estou sempre aberto a feedback, sugestões e contribuições!
        </p>
      </div>
      
      <p style="
        margin: 0 0 24px 0;
        font-size: 16px;
        color: #e5e5e5;
      ">
        Sua opinião é muito valiosa para mim. O que você achou do projeto?
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

    const html = this.getContainer(content);
    const text = this.generateTextVersion(content);

    return { subject: this.subject, html, text };
  }
}