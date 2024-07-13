import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsOptional,
  IsMongoId,
  IsBoolean,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Types } from "mongoose";

export class CreateArtsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: "string", format: "binary" })
  artFile: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hidden: boolean;

  @ApiProperty({ enum: ["NFT", "NORMAL_ASSET"] })
  @IsEnum(["NFT", "NORMAL_ASSET"])
  artType: string;

  @ApiProperty({ type: String })
  @IsMongoId()
  artist: Types.ObjectId;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  publishedAt?: Date;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}

export class UpdateArtsDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsNotEmpty()
  hidden: boolean;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
