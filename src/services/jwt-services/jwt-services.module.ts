import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtModule } from "src/frameworks/jwt/jwt-services.module";

@Module({
  imports: [],
  exports: [],
  providers: [JwtService],
})
export class JwtServicesModule {}
