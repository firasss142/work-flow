import { Module } from "@nestjs/common";
import { BcryptModule } from "src/frameworks/bcrypt/bcrypt-services.module";

@Module({
  imports: [BcryptModule],
  exports: [BcryptModule],
})
export class BcryptServicesModule {}
