
import { EmailTemplate } from '../Template';

interface NewArticleEmailProps {
  name: string;
  excerpt: string;
  url: string;
  image?: string;
  author: string;
}

export class NewArticleEmail extends EmailTemplate {
  constructor(
    recipientName: string,
    recipientEmail: string,
    private props: NewArticleEmailProps
  ) {
    super(recipientName, recipientEmail);
  }

  protected subject = `🎉 Novo artigo lançado: ${this.props.name}`;
  protected previewText = `${this.props.author} acabou de lançar ${this.props.name} - confira!`;

  render() {
    const { name, excerpt, url, image } = this.props;

    const content = `
      <h1 style="
        margin: 0 0 16px 0;
        font-size: 24px;
        font-weight: bold;
        color: #f5f5f5;
        text-align: center;
      ">
        Novo Artigo Lançado! 🚀
      </h1>
      
      <p style="
        margin: 0 0 16px 0;
        font-size: 16px;
        color: #e5e5e5;
        text-align: center;
      ">
        Olá, ${this.recipientName}! ${this.props.author} acabou de publicar um novo artigo e queria compartilhar com você.
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
        ${excerpt}
      </p>
      
      ${url && `<div style="text-align: center; margin: 0 0 24px 0;">
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
          🔍 Ler mais
        </a>
      </div>`}
      
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