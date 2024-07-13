import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type AssetDocument = Asset & Document;
export interface FileObject {
  id: 0 | 1 | 2;
  path: string;
  ipfs: string;
}

export type Transaction = {
  id: string;
  blockchain: string;
  walletId: string;
  sourceAddress: string;
  contractAddress: string;
  transactionType: string;
  custodyType: string;
  state: string;
  amounts: any[]; // You might want to replace 'any[]' with a more specific type
  nfts: null;
  txHash: string;
  blockHash: string;
  blockHeight: number;
  networkFee: string;
  firstConfirmDate: string;
  operation: string;
  feeLevel: string;
  estimatedFee: {
    gasLimit: string;
    baseFee: string;
    priorityFee: string;
    maxFee: string;
  };
  refId: string;
  abiFunctionSignature: string;
  abiParameters: string[];
  createDate: string;
  updateDate: string;
};

@Schema()
export class Asset {
  @Prop({ type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Prop({
    enum: ["DIGITAL ART", "PHYSICAL ART", "JEWELRY", "WATCH", "WINE", "OTHERS"],
  })
  type: string;

  @Prop({ type: Object })
  files: FileObject[];

  @Prop()
  name: string;

  @Prop()
  isLimitedSeries: boolean;

  @Prop()
  location: string;

  @Prop()
  description: string;

  @Prop({
    enum: ["Pending", "Rejected", "Approved", "Completed"],
    default: "Pending",
  })
  status: string;

  @Prop()
  creatorName: string;

  @Prop()
  assetHash: string;

  @Prop()
  number: string;

  @Prop()
  serialNumber: string;

  @Prop()
  unitNumber: number;

  @Prop()
  totalNumberUnits: number;

  @Prop()
  transactions: Transaction[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}
export const AssetSchema = SchemaFactory.createForClass(Asset);
