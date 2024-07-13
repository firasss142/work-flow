import { IsString, IsNotEmpty, IsDate, IsJSON } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "../roles/role.enum";
import { EasAttestationUserType } from "../entities";
import { Wallet } from "src/frameworks/data-services/mongo/model";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  role: Role;

  @ApiPropertyOptional()
  @IsString()
  birthDate: string;

  @ApiPropertyOptional()
  @IsString()
  gender: string;

  @ApiPropertyOptional({ type: "string", format: "binary" })
  avatar: any;

  @ApiPropertyOptional()
  @IsString()
  phoneNumber: string;

  @ApiPropertyOptional()
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional()
  @IsDate()
  updatedAt: Date;

  @ApiPropertyOptional()
  @IsDate()
  deletedAt: Date;

  wallets: Wallet[];
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsString()
  lastName: string;

  @ApiPropertyOptional()
  @IsString()
  birthDate: string;

  @ApiPropertyOptional()
  @IsString()
  gender: string;

  attestationUid: string[];

  attestationId: any[];

  attestationUrl: any[];

  assetAttestationUid: string[];

  assetAttestationId: any[];

  assetAttestationUrl: any[];

  role: Role;

  subRole: EasAttestationUserType;

  @ApiPropertyOptional({ type: "string", format: "binary" })
  avatar: any;

  @ApiPropertyOptional()
  @IsString()
  phoneNumber: string;

  @ApiPropertyOptional()
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional()
  @IsDate()
  updatedAt: Date;

  @ApiPropertyOptional()
  @IsDate()
  deletedAt: Date;
}

export class UpdateUserPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
