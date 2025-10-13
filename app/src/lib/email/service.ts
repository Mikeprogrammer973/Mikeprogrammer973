
interface EmailRecipient {
  name?: string;
  email: string;
}

interface ProjectData {
  name: string;
  description: string;
  url: string;
  image?: string;
}

interface GeneralEmailData {
  subject: string
  title: string;
  message: string;
  cta?: {
    text: string;
    url: string;
  };
  additionalContent?: string;
}

export class EmailService {
  static async sendWelcomeEmail(recipient: EmailRecipient) {
    return this.sendEmail('welcome', recipient);
  }

  static async sendContactConfirmation(recipient: EmailRecipient) {
    return this.sendEmail('contact-confirmation', recipient);
  }

  static async sendNewProjectNotification(recipient: EmailRecipient, project: ProjectData) {
    return this.sendEmail('new-project', recipient, project);
  }

  static async sendNewArticleNotification(recipient: EmailRecipient, article: {
    name: string;
    excerpt: string;
    url: string;
    image?: string;
    author: string;
  }) {
    return this.sendEmail('new-article', recipient, article);
  }

  static async sendUnsubscribeConfirmation(recipient: EmailRecipient) {
    return this.sendEmail('unsubscribe-confirmation', recipient);
  }

  static async sendGeneralEmail(recipient: EmailRecipient, data: GeneralEmailData) {
    return this.sendEmail('general', recipient, data);
  }

  static async sendVerificationEmail(recipient: EmailRecipient, code: string) {
    return this.sendEmail('verification', recipient, code);
  }

  private static async sendEmail(type: string, recipient: EmailRecipient, data?: unknown) {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          recipient,
          data,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  }
}