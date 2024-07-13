import { Module } from "@nestjs/common";
import { DataServicesModule } from "../../services/data-services/data-services.module";
import { UserFactoryService } from "./user-factory.service";
import { UserUseCases } from "./user.use-case";
import { BcryptModule } from "../../frameworks/bcrypt/bcrypt-services.module";
import { CredsIssuedUseCasesModule } from "../creds-issued/creds-issued-use-cases.module";
import { CircleModule } from "../../services/circle-services/circle-services.module";
import { EASModule } from "./../../services/eas-services/eas-services.module";

@Module({
  imports: [
    DataServicesModule,
    BcryptModule,
    CredsIssuedUseCasesModule,
    CircleModule,
    EASModule,
  ],
  providers: [UserFactoryService, UserUseCases],
  exports: [UserFactoryService, UserUseCases],
})
export class UserUseCasesModule {}
