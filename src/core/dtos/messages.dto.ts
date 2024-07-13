import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateMessagesDto {
  _id: string;

  senderId: string;

  conversationId: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  receiverId: string;

  read: boolean;

  @ApiProperty({ description: "Notification message content" })
  @IsString()
  @IsNotEmpty()
  message: string;

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

export class UpdateMessagesDTO {
  @ApiPropertyOptional()
  @IsString()
  message: string;

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

export class MessageResponseDTO {
  @ApiProperty()
  sender: {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    role: string;
  };

  @ApiProperty()
  receiver: {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    role: string;
  };

  @ApiProperty()
  read: boolean;

  @ApiProperty({ description: "Notification message content" })
  message: string;

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date;

  @ApiPropertyOptional()
  deletedAt: Date;
}
