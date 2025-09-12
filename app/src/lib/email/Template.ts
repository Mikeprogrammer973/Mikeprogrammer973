
export abstract class EmailTemplate {
  protected abstract subject: string;
  protected abstract previewText: string;
  
  constructor(protected recipientName: string, protected recipientEmail: string) {}

  protected getHeader(): string {
    return `
      <table
        role="presentation"
        cellPadding="0"
        cellSpacing="0"
        style="
          width: 100%;
          background-color: #171717;
          border-bottom: 1px solid #262626;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        "
      >
        <tr>
          <td style="padding: 24px 32px; text-align: center;">
            <div style="
              display: inline-block; 
              padding: 12px 20px;
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              border-radius: 8px;
              font-weight: bold;
              font-size: 18px;
              color: #ffffff;
              font-family: 'Courier New', monospace;
            ">
              mdp
            </div>
            <p style="
              margin: 12px 0 0 0;
              font-size: 14px;
              color: #a3a3a3;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
              Desenvolvedor Full Stack & UI/UX Designer
            </p>
          </td>
        </tr>
      </table>
    `;
  }

  protected getFooter(): string {
    return `
      <table
        role="presentation"
        cellPadding="0"
        cellSpacing="0"
        style="
          width: 100%;
          background-color: #171717;
          border-top: 1px solid #262626;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        "
      >
        <tr>
          <td style="padding: 24px 32px; text-align: center;">
            <p style="
              margin: 0 0 12px 0;
              font-size: 14px;
              color: #a3a3a3;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
              &copy; ${new Date().getFullYear()} Mike D. Pascal. Todos os direitos reservados.
            </p>
            <p style="
              margin: 0 0 16px 0;
              font-size: 14px;
              color: #a3a3a3;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
              <a
                href="{{unsubscribe_link}}"
                style="
                  color: #a3a3a3;
                  text-decoration: underline;
                "
              >
                Cancelar inscrição
              </a>
            </p>
            <p style="
              margin: 0;
              font-size: 12px;
              color: #737373;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
              Você está recebendo este email porque se inscreveu em meu portfólio.
            </p>
          </td>
        </tr>
      </table>
    `;
  }

  protected getContainer(content: string, withFooter = true): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${this.subject}</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="color-scheme" content="dark light" />
          <meta name="supported-color-schemes" content="dark light" />
        </head>
        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #0a0a0a;
            color: #e5e5e5;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
          "
        >
          <!-- Preview text (hidden) -->
          <div
            style="
              display: none;
              max-height: 0;
              overflow: hidden;
            "
          >
            ${this.previewText}
          </div>

          <!-- Email container -->
          <table
            role="presentation"
            cellPadding="0"
            cellSpacing="0"
            style="
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #0a0a0a;
              border: 1px solid #262626;
              border-radius: 8px;
              margin-top: 20px;
              margin-bottom: 20px;
            "
          >
            <tr>
              <td style="padding: 0;">
                ${this.getHeader()}
                
                <!-- Main content -->
                <table
                  role="presentation"
                  cellPadding="0"
                  cellSpacing="0"
                  style="width: 100%;"
                >
                  <tr>
                    <td style="padding: 32px;">
                      ${content}
                    </td>
                  </tr>
                </table>

                ${withFooter ? this.getFooter() : ''}
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  abstract render(): { subject: string; html: string; text: string };
  
  protected generateTextVersion(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}