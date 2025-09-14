
import { EmailTemplate } from '../Template';

export class ContactConfirmationEmail extends EmailTemplate {
  protected subject = 'Mensagem recebida! 📩';
  protected previewText = 'Agradeço seu contato e retornarei em breve.';

  render() {
    const content = `
      <h1 style="
        margin: 0 0 16px 0;
        font-size: 24px;
        font-weight: bold;
        color: #f5f5f5;
        text-align: center;
      ">
        Obrigado pelo contato, ${this.recipientName}! 🙏
      </h1>
      
      <p style="
        margin: 0 0 16px 0;
        font-size: 16px;
        color: #e5e5e5;
        text-align: center;
      ">
        Recebi sua mensagem e agradeço muito pelo seu interesse.
      </p>
      
      <p style="
        margin: 0 0 24px 0;
        font-size: 16px;
        color: #e5e5e5;
      ">
        Estou analisando sua solicitação com cuidado e retornarei o mais breve possível. 
        Normalmente respondo dentro de 24 horas durante dias úteis.
      </p>
      
      <div style="
        background-color: #1f2937;
        border: 1px solid #374151;
        padding: 20px;
        margin: 24px 0;
        border-radius: 8px;
        text-align: center;
      ">
        <h3 style="
          margin: 0 0 12px 0;
          font-size: 18px;
          color: #3b82f6;
          font-weight: bold;
        ">
          📋 O que acontece agora?
        </h3>
        <ol style="
          margin: 0;
          padding-left: 20px;
          text-align: left;
          color: #e5e5e5;
        ">
          <li>Analiso sua mensagem detalhadamente</li>
          <li>Preparo uma resposta completa</li>
          <li>Entro em contato com a solução ou proposta</li>
        </ol>
      </div>
      
      <p style="
        margin: 0 0 24px 0;
        font-size: 16px;
        color: #e5e5e5;
      ">
        Enquanto isso, você pode <a href="https://mikedp.vercel.app/projects" style="color: #3b82f6; text-decoration: none;">explorar meus projetos</a> 
        ou <a href="https://mikedp.vercel.app/blog" style="color: #3b82f6; text-decoration: none;">ler meus artigos mais recentes</a>.
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
