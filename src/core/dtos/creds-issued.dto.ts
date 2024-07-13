import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsMongoId,
  IsEnum,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "../roles/role.enum";
import { EasAttestationUserType } from "../entities";

export class CreateCredsIssuedDto {
  @ApiProperty({ description: "The ID of the user" })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: "The ID of the attester" })
  @IsMongoId()
  @IsNotEmpty()
  attesterId: string;

  @ApiProperty({ description: "The ID of the attestation" })
  @IsMongoId()
  @IsNotEmpty()
  attestationId: string;

  @ApiProperty({ enum: Object.values(EasAttestationUserType) })
  @IsEnum({ enum: Object.values(EasAttestationUserType) })
  requestedCredsType: string;

  @ApiProperty({ enum: Object.values(Role) })
  @IsEnum({ enum: Object.values(Role) })
  requestedCredsRole: string;

  attestationUrl: string;

  attestationUid: string;

  isRevoked: boolean;
}

export class UpdateCredsIssuedDto {
  isRevoked: boolean;
}
