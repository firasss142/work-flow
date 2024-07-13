import { Module } from "@nestjs/common";
import { AbstractMailerService } from "src/core";
import { MailerService } from "./mailer-services.service";

@Module({
  providers: [
    {
      provide: AbstractMailerService,
      useClass: MailerService,
    },
  ],
  exports: [AbstractMailerService],
})
export class MailerModule {}
