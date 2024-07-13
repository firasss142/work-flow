import { Module } from "@nestjs/common";
import { MailerModule } from "src/frameworks/mailer/mailer-services.module";
import { MailerService } from "src/frameworks/mailer/mailer-services.service";

@Module({
  imports: [MailerModule],
  exports: [MailerModule],
  providers: [MailerService],
})
export class MailerServicesModule {}
