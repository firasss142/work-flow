export abstract class AbstractMailerService {
  abstract sendEmail(to: string, subject: string, htmlContent: string): void;
}
