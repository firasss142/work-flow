import { Injectable } from "@nestjs/common";
import { Asset, AssetData, FileObject, IDataServices } from "src/core";
import { CreateAssetDto, UpdateAssetDto } from "src/core/dtos/asset.dto";
import { BASE_URL } from "../../configuration";
import { assetFactoryService } from "./asset-factory.service";
import { Types } from "mongoose";
import { Role } from "src/core/roles/role.enum";
import { UserUseCases } from "../user/user.use-case";
const crypto = require("crypto");
const fs = require("fs");

@Injectable()
export class AssetUseCases {
  constructor(
    private dataServices: IDataServices,
    private assetFactoryService: assetFactoryService,
    private usersUseCase: UserUseCases,
  ) {}

  async createAssetRequest(
    createAssetDto: CreateAssetDto,
    files: Express.Multer.File[] | undefined, // Make files optional
  ) {
    try {
      if (!createAssetDto.userId) {
        throw new Error("User ID is required");
      }

      const inputFiles: string[] = [];
      const fileObject: FileObject[] = [];
      let assetHash = "";

      if (files && files.length > 0) {
        for (const file of files) {
          const inputFile = `${BASE_URL}/uploads/${file.filename}`;
          inputFiles.push(inputFile);
          fileObject.push({
            id: 0,
            path: inputFile,
            ipfs: inputFile,
          });
        }
        const firstFile = files[0];
        const hash = crypto.createHash("sha256");
        const fileStream = fs.createReadStream(firstFile.path);
        fileStream.on("data", (data) => {
          hash.update(data);
        });

        assetHash = await new Promise((resolve, reject) => {
          fileStream.on("end", () => {
            resolve(hash.digest("hex"));
          });
          fileStream.on("error", reject);
        });

        createAssetDto.fileInput = inputFiles;
        createAssetDto.assetHash = assetHash;
      }

      const assetRequest = this.assetFactoryService.createNewAsset(
        createAssetDto,
        fileObject,
      );
      const newAsset = await this.dataServices.assets.create(assetRequest);

      return newAsset;
    } catch (error) {
      console.error("An error occurred while creating asset:", error);
      throw new Error("Unable to create asset");
    }
  }

  async getAssetByUserId(userId: string): Promise<Asset[]> {
    const id = new Types.ObjectId(userId);
    return await this.dataServices.assets.findAllByAttribute("userId", id);
  }

  async getAllAssets() {
    const assets = await this.dataServices.assets.getAll();
    return assets;
  }

  async getAllAssetByUserRole(userId: string) {
    const user = await this.dataServices.users.get(userId);
    if (user.role === Role.Admin) {
      return await this.getAllAssets();
    } else {
      return await this.getAssetByUserId(user["_id"]);
    }
  }

  async updateAsset(
    assetId: string,
    updateAssetDto: UpdateAssetDto,
    user: any,
  ): Promise<Asset> {
    try {
      console.log("%%%%%%%", assetId);
      console.log("%%%%%%%", updateAssetDto);

      const asset = await this.dataServices.assets.get(assetId);
      if (!asset) {
        throw new Error("Asset not found");
      }

      const userId =
        asset.userId instanceof Object ? asset.userId._id : asset.userId;
      if (
        updateAssetDto.status === "Approved" ||
        updateAssetDto.status === "Completed"
      ) {
        function mapAssetToAssetData(asset: Asset): AssetData {
          // Initialize image hashes with empty strings
          let assetImage1Hash = "";
          let assetImage2Hash = "";
          let assetImage3Hash = "";

          // Assign image hashes based on the available FileObject instances
          asset.files.forEach((file, index) => {
            if (index === 0) assetImage1Hash = file.ipfs;
            else if (index === 1) assetImage2Hash = file.ipfs;
            else if (index === 2) assetImage3Hash = file.ipfs;
          });
          console.log("asset", asset);
          return {
            assetTypeLevel1: asset.type,
            creatorCred: "", // Assuming there's no direct mapping provided
            assetName: asset.name,
            assetImage1Hash: assetImage1Hash,
            assetImage2Hash: assetImage2Hash,
            assetImage3Hash: assetImage3Hash,
            assetCreationDate: new Date().toISOString(),
            assetCreationLocation: asset.location,
            assetDescription: asset.description,
            assetOriginalHash: asset.assetHash,
            assetCreatorName: asset.creatorName,
            isLimitedSeries:
              asset.isLimitedSeries === undefined
                ? false
                : asset.isLimitedSeries, // Example condition
            limitedSeriesUnitNumber: asset.unitNumber ?? 1,
            totalUnitsInLimitedEdition: asset.totalNumberUnits ?? 1,
            assetProductNumber: asset.number?.toString() ?? "1", // Assuming this maps to number
            assetSerialNumber: asset.serialNumber?.toString() ?? "1",
            schemaVersionNumber: "1.00", // Assuming there's no direct mapping provided
            userWallet: asset.userId.wallets.find(
              (el) => el.blockchain === "ETH-SEPOLIA",
            ).address, // Assuming the userId can be converted to a wallet string
          };
        }

        const attestation =
          await this.usersUseCase.appendAssetAttestationtoUser(
            asset.userId,
            asset.userId,
            mapAssetToAssetData(asset),
          );

        console.log(attestation);

        const updatedAsset = await this.dataServices.assets.update(assetId, {
          ...asset,
          ...updateAssetDto,
          transactions: [attestation],
          status: "Approved", // Assuming the status should be updated to 'LOADING' after the attestation is appended
          userId,
          updatedAt: new Date(),
        });

        return updatedAsset;
      }
    } catch (error) {
      console.error("An error occurred while updating asset:", error);
      throw new Error("Unable to update asset");
    }
  }

  async getAllAssetsRequest(): Promise<Asset[]> {
    try {
      const assets = await this.dataServices.assets.findAllByAttribute(
        "status",
        "Pending",
      );
      return assets;
    } catch (error) {
      console.error("An error occurred while fetching assets:", error);
      throw new Error("Unable to fetch assets");
    }
  }

  async deleteAsset(assetId: string): Promise<Asset> {
    try {
      const asset = await this.dataServices.assets.get(assetId);
      if (!asset) {
        throw new Error("Asset not found");
      }

      const userId =
        asset.userId instanceof Object ? asset.userId._id : asset.userId;

      const deletedAsset = await this.dataServices.assets.update(assetId, {
        ...asset,
        userId,
        deletedAt: new Date(),
      });

      return deletedAsset;
    } catch (error) {
      console.error("An error occurred while deleting asset:", error);
      throw new Error("Unable to delete asset");
    }
  }

  async getAllAssetsPending(): Promise<Asset[]> {
    try {
      const assets = await this.dataServices.assets.findAllByAttribute(
        "status",
        "Pending",
      );
      return assets;
    } catch (error) {
      console.error("An error occurred while fetching pending assets:", error);
      throw new Error("Unable to fetch pending assets");
    }
  }
  async getAllAssetsApproved(): Promise<Asset[]> {
    try {
      const assets = await this.dataServices.assets.findAllByAttribute(
        "status",
        "Approved",
      );
      return assets;
    } catch (error) {
      console.error("An error occurred while fetching approved assets:", error);
      throw new Error("Unable to fetch approved assets");
    }
  }

  async getAllAssetsPendingById(userId: string): Promise<Asset[]> {
    try {
      const id = new Types.ObjectId(userId);
      const assets = await this.dataServices.assets.findAllByAttributes({
        userId: id,
        status: "Pending",
      });
      return assets;
    } catch (error) {
      console.error(
        "An error occurred while fetching pending assets by user ID:",
        error,
      );
      throw new Error("Unable to fetch pending assets by user ID");
    }
  }

  async getAllAssetsApprovedById(userId: string): Promise<Asset[]> {
    try {
      const id = new Types.ObjectId(userId);
      const assets = await this.dataServices.assets.findAllByAttributes({
        userId: id,
        status: "Approved",
      });
      return assets;
    } catch (error) {
      console.error(
        "An error occurred while fetching approved assets by user ID:",
        error,
      );
      throw new Error("Unable to fetch approved assets by user ID");
    }
  }

  async getAllAssetsPendingByRole(userId: any): Promise<Asset[]> {
    try {
      const user = await this.dataServices.users.get(userId);

      if (user.role === Role.Admin) {
        return await this.getAllAssetsPending();
      } else {
        return await this.getAllAssetsPendingById(userId);
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching pending assets by role:",
        error,
      );
      throw new Error("Unable to fetch pending assets by role");
    }
  }

  async getAllAssetsApprovedByRole(userId: any): Promise<Asset[]> {
    try {
      const user = await this.dataServices.users.get(userId);

      if (user.role === Role.Admin) {
        return await this.getAllAssetsApproved();
      } else {
        return await this.getAllAssetsApprovedById(userId);
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching approved assets by role:",
        error,
      );
      throw new Error("Unable to fetch approved assets by role");
    }
  }

  async getAllAssetsWithInitiatedTransactions(): Promise<Asset[]> {
    try {
      const assets = await this.dataServices.assets.findAllByAttribute(
        "transactions.state",
        "INITIATED",
      );
      return assets;
    } catch (error) {
      console.error(
        "An error occurred while fetching assets with initiated transactions:",
        error,
      );
      throw new Error("Unable to fetch assets with initiated transactions");
    }
  }
}
