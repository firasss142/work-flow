import { Types } from "mongoose";
import {
  CreateAssetDto,
  FileObject,
  UpdateAssetDto,
} from "src/core/dtos/asset.dto";
import { Asset } from "src/core/entities/asset.entity";

export class assetFactoryService {
  createNewAsset(createAssetDto: CreateAssetDto, fileObject: FileObject[]) {
    const newAsset = new Asset();
    newAsset.userId = new Types.ObjectId(createAssetDto.userId);
    newAsset.type = createAssetDto.type;
    newAsset.files = fileObject;
    newAsset.name = createAssetDto.name;
    newAsset.location = createAssetDto.location;
    newAsset.description = createAssetDto.description;
    newAsset.status = createAssetDto.status || "Pending";
    newAsset.creatorName = createAssetDto.creatorName;
    newAsset.assetHash = createAssetDto.assetHash;
    newAsset.number = createAssetDto.number;
    newAsset.serialNumber = createAssetDto.serialNumber;
    newAsset.unitNumber = createAssetDto.unitNumber;
    newAsset.totalNumberUnits = createAssetDto.totalNumberUnits;
    newAsset.transactions = [];
    return newAsset;
  }
  updateAsset(updateAssetDto: UpdateAssetDto) {
    const newAsset = new Asset();
    newAsset.status = updateAssetDto.status;
    newAsset.updatedAt = new Date();
    return newAsset;
  }
}
