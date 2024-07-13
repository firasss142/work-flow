import { Module } from "@nestjs/common";
import { NotificationsGateway } from "./socket-services.service";
import { AbstractWebSocketGateway } from "../../core";
import { JwtService } from "../jwt/jwt-services.service";
import { MongoDataServicesModule } from "../data-services/mongo/mongo-data-services.module";

@Module({
  imports: [MongoDataServicesModule],
  providers: [
    {
      provide: AbstractWebSocketGateway,
      useClass: NotificationsGateway,
    },

    JwtService,
  ],
  exports: [AbstractWebSocketGateway, JwtService],
})
export class SocketModule {}
