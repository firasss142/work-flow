import { Module } from "@nestjs/common";
import { DataServicesModule } from "../../services/data-services/data-services.module";
import { NotificationsFactoryService } from "./notifications-factory.service";
import { NotificationsUseCases } from "./notifications.use-case";
import { NotificationsGateway } from "src/frameworks/socket/socket-services.service";
import { SocketModule } from "src/frameworks/socket/socket-services.module";

@Module({
  imports: [DataServicesModule, SocketModule],
  providers: [
    NotificationsFactoryService,
    NotificationsUseCases,
    NotificationsGateway,
  ],
  exports: [
    NotificationsFactoryService,
    NotificationsUseCases,
    NotificationsGateway,
  ],
})
export class NotificationsUseCasesModule {}
