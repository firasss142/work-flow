import { Transaction } from "src/frameworks/data-services/mongo/model";
import { FileObject } from "../dtos";

export class Asset {
  type: string;
  name: string;
  files: FileObject[]; //files: FileObject[]
  location: string;
  description: string;
  creatorName: string;
  assetHash: string;
  userId: any;
  number: string;
  serialNumber: string;
  unitNumber: number;
  totalNumberUnits: number;
  status: string;
  isLimitedSeries: boolean;
  transactions: Transaction[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
