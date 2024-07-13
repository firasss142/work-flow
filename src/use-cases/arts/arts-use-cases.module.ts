import { Module } from "@nestjs/common";
import { DataServicesModule } from "../../services/data-services/data-services.module";
import { ArtsFactoryService } from "./arts-factory.service";
import { ArtsUseCases } from "./arts.use-case";

@Module({
  imports: [DataServicesModule],
  providers: [ArtsFactoryService, ArtsUseCases],
  exports: [ArtsFactoryService, ArtsUseCases],
})
export class ArtsUseCasesModule {}
