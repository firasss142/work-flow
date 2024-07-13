import { Module } from "@nestjs/common";
import { BcryptService } from "./bcrypt-services.service";
import { IBcryptService } from "../../core";

@Module({
  providers: [
    {
      provide: IBcryptService,
      useClass: BcryptService,
    },
  ],
  exports: [IBcryptService],
})
export class BcryptModule {}
