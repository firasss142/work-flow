import { Module } from "@nestjs/common";
import { AbstractCronJobService } from "src/core/abstracts/cron-services.abstract";
import { CronJobService } from "./cron-services.service";
import { AssetUseCasesModule } from "src/use-cases/asset/asset-use-cases.module";
import { HttpModule } from "@nestjs/axios";
import { DataServicesModule } from "src/services";
import { CircleModule } from "src/services/circle-services/circle-services.module";

@Module({
  imports: [AssetUseCasesModule, HttpModule, DataServicesModule, CircleModule],
  providers: [
    {
      provide: AbstractCronJobService,
      useClass: CronJobService,
    },
  ],
  exports: [AbstractCronJobService],
})
export class CronJobModule {}
