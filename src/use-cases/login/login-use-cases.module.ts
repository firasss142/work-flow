import { Module } from "@nestjs/common";
import { LoginFactoryService } from "./login-factory.service";
import { LoginUseCase } from "./login.use-case";
import { JwtServicesModule } from "src/services";
import { JwtService } from "src/frameworks/jwt/jwt-services.service";
import { DataServicesModule } from "src/services/data-services/data-services.module";
import { BcryptModule } from "src/frameworks/bcrypt/bcrypt-services.module";
import { MailerService } from "src/frameworks/mailer/mailer-services.service";

@Module({
  imports: [DataServicesModule, BcryptModule, JwtServicesModule],
  providers: [LoginFactoryService, LoginUseCase, JwtService, MailerService],
  exports: [LoginFactoryService, LoginUseCase],
})
export class LoginUseCasesModule {}
