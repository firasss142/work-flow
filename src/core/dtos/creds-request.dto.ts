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

export class CreateCredsRequestDto {
  userId: string;

  @ApiProperty({ enum: Object.values(Role) })
  @IsEnum({ enum: Object.values(Role) })
  requestedCredsRole: string;
}

export class UpdateCredsRequestDto {
  @ApiProperty({ enum: Object.values(EasAttestationUserType) })
  @IsEnum({ enum: Object.values(EasAttestationUserType) })
  requestedCredsType: EasAttestationUserType;

  @ApiProperty({ enum: ["Pending", "Rejected", "Approved", "Completed"] })
  @IsEnum(["Pending", "Rejected", "Approved", "Completed"])
  status: string;

  @ApiPropertyOptional()
  @IsString()
  attesterId: string;
}
