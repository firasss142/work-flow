import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsDateString,
  IsOptional,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateNotificationDto {
  @ApiProperty({ description: "The ID of the transfer request" })
  @IsMongoId()
  @IsNotEmpty()
  transfertRequestId: string;

  @ApiProperty({ description: "The ID of the recipient user" })
  @IsMongoId()
  @IsNotEmpty()
  recipient: string;

  @ApiProperty({ description: "Notification message content" })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class UpdateNotificationDto {
  @ApiPropertyOptional({
    description: "Timestamp of when the notification was read",
  })
  @IsDateString()
  @IsOptional()
  readAt?: Date;
}
