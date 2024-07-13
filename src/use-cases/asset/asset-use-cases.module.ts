import { DataServicesModule } from "src/services";
import { AssetUseCases } from "./asset.use-case";
import { assetFactoryService } from "./asset-factory.service";
import { Module } from "@nestjs/common";
import { UserUseCasesModule } from "../user/user-use-cases.module";

@Module({
  imports: [DataServicesModule, UserUseCasesModule],
  providers: [assetFactoryService, AssetUseCases],
  exports: [assetFactoryService, AssetUseCases],
})
export class AssetUseCasesModule {}
