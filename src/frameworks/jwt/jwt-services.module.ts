import { Module } from "@nestjs/common";
import { AbstractJwtService } from "src/core";
import { JwtService } from "./jwt-services.service";

@Module({
  providers: [
    {
      provide: AbstractJwtService,
      useClass: JwtService,
    },
  ],
  exports: [AbstractJwtService],
})
export class JwtModule {}
