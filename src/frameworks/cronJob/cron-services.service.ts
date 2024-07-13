import { Injectable } from "@nestjs/common";
import { AbstractCronJobService } from "src/core/abstracts/cron-services.abstract";
import { Cron } from "@nestjs/schedule";
import { AssetUseCases } from "src/use-cases/asset/asset.use-case";
import { HttpService } from "@nestjs/axios";
import { ICircleService, IDataServices } from "src/core";
import { Asset } from "../data-services/mongo/model";
import { firstValueFrom } from "rxjs";

@Injectable()
export class CronJobService extends AbstractCronJobService {
  constructor(
    private assetUseCase: AssetUseCases,
    private httpService: HttpService,
    private dataServices: IDataServices,
    private circleservice: ICircleService,
  ) {
    super();
  }

  async execute(): Promise<void> {
    const assets: Asset[] =
      await this.assetUseCase.getAllAssetsWithInitiatedTransactions();
    const updates = await Promise.all(
      assets.map((asset) => this.processAsset(asset)),
    );
  }

  async processAsset(asset: Asset): Promise<Asset | undefined> {
    try {
      const transactionResponse = await firstValueFrom(
        await this.circleservice.getTransaction(asset),
      );
      const transactionData = transactionResponse["data"]["transaction"];

      if (transactionData && transactionData.state === "COMPLETE") {
        const finalTransaction = await firstValueFrom(
          await this.circleservice.finalTransaction(transactionData),
        );
        await this.delay(1000); // Introducing a delay
        const updatedAsset = await this.updateAsset(
          asset,
          finalTransaction["data"]["transactions"],
          "completed",
        );
        return updatedAsset;
      } else if (transactionData && transactionData.state === "FAILED") {
        const updatedAsset = await this.updateAsset(
          asset,
          transactionData,
          "failed",
        );
        return updatedAsset;
      }
    } catch (error) {
      console.error("An error occurred while processing the asset:", error);
    }
  }

  async updateAsset(
    asset: Asset,
    transactionData: any,
    status,
  ): Promise<Asset | undefined> {
    const newAsset: any = { transactions: transactionData, status };

    try {
      const assetId = asset["_id"];
      delete newAsset["_id"];
      const updatedAsset = await this.dataServices.assets.update(
        assetId,
        newAsset,
      );
      if (updatedAsset) {
        console.log("Asset updated successfully:", updatedAsset);
        return updatedAsset;
      } else {
        console.error("Failed to update asset:", assetId);
      }
    } catch (error) {
      console.error(
        "An error occurred while updating the asset:",
        asset["_id"],
        error,
      );
    }
  }

  async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  @Cron("*/1 * * * *")
  async executeCronJob() {
    await this.execute();
  }
}
