
import { ContactConfirmationEmail } from "./__templates/ContactConfirmation";
import { NewProjectEmail } from "./__templates/NewProject";
import { WelcomeEmail } from "./__templates/Welcome";


export class EmailFactory {
  static createWelcomeEmail(name: string, email: string) {
    return new WelcomeEmail(name, email);
  }

  static createContactConfirmationEmail(name: string, email: string) {
    return new ContactConfirmationEmail(name, email);
  }

  static createNewProjectEmail(
    name: string, 
    email: string, 
    projectData: {
      projectName: string;
      projectDescription: string;
      projectUrl: string;
      projectImage?: string;
    }
  ) {
    return new NewProjectEmail(name, email, projectData);
  }
}