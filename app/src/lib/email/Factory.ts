
import { ContactConfirmationEmail } from "./__templates/ContactConfirmation";
import { GeneralEmail } from "./__templates/General";
import { NewProjectEmail } from "./__templates/NewProject";
import { UnsubscribeEmail } from "./__templates/Unsubscribe";
import { WelcomeEmail } from "./__templates/Welcome";


export class EmailFactory {
  static createWelcomeEmail(name: string, email: string) {
    return new WelcomeEmail(name, email);
  }

  static createUnsubscribeEmail(name: string, email: string) {
    return new UnsubscribeEmail(name, email);
  }

  static createContactConfirmationEmail(name: string, email: string) {
    return new ContactConfirmationEmail(name, email);
  }

  static createNewProjectEmail(
    name: string, 
    email: string, 
    projectData: {
      name: string;
      description: string;
      url: string;
      image?: string;
    }
  ) {
    return new NewProjectEmail(name, email, projectData);
  }

  static createGeneralEmail(
    name: string, 
    email: string, 
    data: {
      title: string;
      message: string;
      cta?: {
        text: string;
        url: string;
      };
      additionalContent?: string;
    }
    ) {
    return new GeneralEmail(name, email, data);
  }

}