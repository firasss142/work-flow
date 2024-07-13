import { Injectable } from "@nestjs/common";
import { AbstractMailerService } from "../../core";
import * as nodemailer from "nodemailer";
import {
  MAILER_HOST,
  MAILER_PASSWORD,
  MAILER_PORT,
  MAILER_USER,
  MAILER_SENDER,
} from "../../configuration";

@Injectable()
export class MailerService extends AbstractMailerService {
  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: MAILER_HOST,
      port: Number(MAILER_PORT),
      auth: {
        user: MAILER_USER,
        pass: MAILER_PASSWORD,
      },
      secure: true,
      // tls: {
      //   ciphers: "SSLv3",
      // },
    });

    const mailOptions = {
      from: MAILER_SENDER,
      to,
      subject,
      html: htmlContent,
      headers: {
        "Content-Type": "text/html",
      },
    };

    await transporter.sendMail(mailOptions);
  }
}
