
import { EmailTemplate } from '../Template';

export class WelcomeEmail extends EmailTemplate {
  protected subject = 'Bem-vindo(a) ao meu portfólio! 🎉';
  protected previewText = 'Obrigado por se inscrever na minha newsletter.';

  render() {
    const content = `
      <h1 style="
        margin: 0 0 16px 0;
        font-size: 24px;
        font-weight: bold;
        color: #f5f5f5;
        text-align: center;
      ">
        Olá, ${this.recipientName}! 👋
      </h1>
      
      <p style="
        margin: 0 0 16px 0;
        font-size: 16px;
        color: #e5e5e5;
        text-align: center;
      ">
        Que bom ter você aqui! Obrigado por se inscrever na minha newsletter.
      </p>
      
      <p style="
        margin: 0 0 24px 0;
        font-size: 16px;
        color: #e5e5e5;
      ">
        Através desta newsletter, você receberá:
      </p>
      
      <ul style="
        margin: 0 0 24px 0;
        padding-left: 20px;
        color: #e5e5e5;
      ">
        <li>Atualizações sobre meus projetos mais recentes</li>
        <li>Dicas e insights sobre desenvolvimento web</li>
        <li>Novos artigos e tutoriais que eu publicar</li>
        <li>Oportunidades exclusivas de colaboração</li>
      </ul>
      
      <div style="
        background-color: #1f2937;
        border-left: 4px solid #3b82f6;
        padding: 16px;
        margin: 24px 0;
        border-radius: 4px;
      ">
        <p style="margin: 0; color: #e5e5e5; font-style: italic;">
          "Compartilhar conhecimento é minha maneira de contribuir para a comunidade de desenvolvedores."
        </p>
      </div>
      
      <p style="
        margin: 0 0 24px 0;
        font-size: 16px;
        color: #e5e5e5;
      ">
        Fique à vontade para responder este email se quiser conversar sobre algum projeto específico ou tiver alguma dúvida!
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