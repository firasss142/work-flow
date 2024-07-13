import { Module } from "@nestjs/common";
import { DataServicesModule } from "../../services/data-services/data-services.module";
import { CredsRequestFactoryService } from "./creds-requests-factory.service";
import { CredsRequestsUseCases } from "./creds-requests.use-case";
import { NotificationsUseCases } from "../notifications/notifications.use-case";
import { NotificationsFactoryService } from "../notifications/notifications-factory.service";
import { SocketModule } from "src/frameworks/socket/socket-services.module";
import { UserUseCases } from "../user/user.use-case";
import { UserFactoryService } from "../user/user-factory.service";
import { UserUseCasesModule } from "../user/user-use-cases.module";

@Module({
  imports: [DataServicesModule, SocketModule, UserUseCasesModule],
  providers: [
    CredsRequestFactoryService,
    CredsRequestsUseCases,
    NotificationsUseCases,
    NotificationsFactoryService,
  ],
  exports: [
    CredsRequestFactoryService,
    CredsRequestsUseCases,

    NotificationsUseCases,
    NotificationsFactoryService,
  ],
})
export class CredsRequestsUseCasesModule {}
