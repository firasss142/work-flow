import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { v4 as uuidv4 } from "uuid";
export class FileObject {
  id: 0 | 1 | 2;

  path: any;

  ipfs: any;
}
export class Transaction {
  @ApiProperty()
  @IsString()
  tx: string;

  @ApiProperty({
    enum: ["INITIATED", "REJECTED", "APPROVED"],
    default: "INITIATED",
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(["INITIATED", "REJECTED", "APPROVED"])
  state: string;

  // New fields added
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  blockchain: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sourceAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contractAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transactionType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  custodyType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  amounts: any[];

  @ApiProperty()
  @IsString()
  txHash: string;

  @ApiProperty()
  @IsString()
  blockHash: string;

  @ApiProperty()
  @IsString()
  blockHeight: number;

  @ApiProperty()
  @IsString()
  networkFee: string;

  @ApiProperty()
  @IsString()
  firstConfirmDate: string;

  @ApiProperty()
  @IsString()
  operation: string;

  @ApiProperty()
  @IsString()
  feeLevel: string;

  @ApiProperty()
  @IsString()
  estimatedFee: {
    gasLimit: string;
    baseFee: string;
    priorityFee: string;
    maxFee: string;
  };

  @ApiProperty()
  @IsString()
  refId: string;

  @ApiProperty()
  @IsString()
  abiFunctionSignature: string;

  @ApiProperty()
  @IsString({ each: true })
  abiParameters: string[];

  @ApiProperty()
  @IsString()
  createDate: string;

  @ApiProperty()
  @IsString()
  updateDate: string;
}
export class CreateAssetDto {
  userId: string;

  @ApiProperty()
  @IsEnum(["DIGITAL ART", "PHYSICAL ART", "JEWELRY", "WATCH", "WINE", "OTHERS"])
  type: string;

  files: FileObject[];

  @ApiProperty({ type: "array", items: { type: "string", format: "binary" } })
  @IsOptional()
  fileInput: any[];

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  location: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  status: string;

  @ApiPropertyOptional()
  creatorName: string;

  @ApiPropertyOptional()
  assetHash: string;

  @ApiPropertyOptional()
  number: string;

  @ApiPropertyOptional()
  serialNumber: string;

  @ApiPropertyOptional()
  unitNumber: number;

  @ApiPropertyOptional()
  totalNumberUnits: number;

  @ApiPropertyOptional({ type: [Transaction] })
  transactions: Transaction[];

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date;

  @ApiPropertyOptional()
  deletedAt: Date;
}

export class UpdateAssetDto {
  @ApiProperty({ enum: ["Pending", "Rejected", "Approved", "Completed"] })
  @IsEnum(["Pending", "Rejected", "Approved", "Completed"])
  status: string;
  Transaction: Transaction;
}
