
import { EmailTemplate } from "../Template";

export class UnsubscribeEmail extends EmailTemplate {
  protected subject = 'Inscrição cancelada 😢';
  protected previewText = 'Sua inscrição na newsletter foi cancelada com sucesso.';

  render() {
    const content = `
      <h1 style="
        margin: 0 0 16px 0;
        font-size: 24px;
        font-weight: bold;
        color: #f5f5f5;
        text-align: center;
      ">
        Inscrição Cancelada
      </h1>
      
      <p style="
        margin: 0 0 16px 0;
        font-size: 16px;
        color: #e5e5e5;
        text-align: center;
      ">
        Olá, ${this.recipientName}!
      </p>
      
      <p style="
        margin: 0 0 24px 0;
        font-size: 16px;
        color: #e5e5e5;
      ">
        Sua inscrição na minha newsletter foi <strong>cancelada com sucesso</strong>. 
        Você não receberá mais emails sobre novos projetos e atualizações.
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
          color: #a3a3a3;
          font-weight: bold;
        ">
          💔 Sentirei sua falta!
        </h3>
        <p style="margin: 0; color: #a3a3a3;">
          Espero que tenha gostado do conteúdo que compartilhei até agora.
        </p>
      </div>
      
      <p style="
        margin: 0 0 16px 0;
        font-size: 16px;
        color: #e5e5e5;
      ">
        Se foi um engano ou se mudar de ideia no futuro, você pode se reinscrever a qualquer momento 
        visitando <a href="https://mikedp.vercel.app/newsletter" style="color: #3b82f6; text-decoration: none;">meu site</a>.
      </p>
      
      <p style="
        margin: 0 0 24px 0;
        font-size: 16px;
        color: #e5e5e5;
      ">
        Mesmo assim, você ainda pode me acompanhar através das redes sociais ou 
        <a href="https://mikedp.vercel.app/contact" style="color: #3b82f6; text-decoration: none;">entrar em contato</a> 
        diretamente comigo se precisar de algo.
      </p>
      
      <div style="
        text-align: center;
        margin: 32px 0;
        padding: 16px;
        border-top: 1px solid #374151;
        border-bottom: 1px solid #374151;
      ">
        <p style="margin: 0; font-size: 14px; color: #a3a3a3;">
          <strong>Redes Sociais:</strong><br>
          <a href="https://linkedin.com/in/mike-pascal-280927247" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">LinkedIn</a> • 
          <a href="https://github.com/Mikeprogrammer973" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">GitHub</a> • 
          <a href="https://x.com/IlSognatore007" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">Twitter</a>
        </p>
      </div>
      
      <p style="
        margin: 0;
        font-size: 16px;
        color: #e5e5e5;
        font-weight: bold;
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
        Este é um email automático de confirmação. Se você não solicitou o cancelamento, 
        por favor <a href="https://mikedp.vercel.app/contact" style="color: #3b82f6; text-decoration: none;">entre em contato</a>.
      </p>
    `;

    const html = this.getContainer(content, false);
    const text = this.generateTextVersion(content);

    return { subject: this.subject, html, text };
  }
}
