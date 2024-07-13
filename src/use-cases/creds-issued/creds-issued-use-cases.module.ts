import { Module } from "@nestjs/common";
import { DataServicesModule } from "../../services/data-services/data-services.module";
import { CredsIssuedFactoryService } from "./creds-issued-factory.service";
import { CredsIssuedUseCases } from "./creds-issued.use-case";

import { SocketModule } from "../../frameworks/socket/socket-services.module";

@Module({
  imports: [DataServicesModule, SocketModule],
  providers: [CredsIssuedFactoryService, CredsIssuedUseCases],
  exports: [CredsIssuedFactoryService, CredsIssuedUseCases],
})
export class CredsIssuedUseCasesModule {}
