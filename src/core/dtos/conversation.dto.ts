import { IsDate, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Message } from "../entities";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateConversationDto {
  senderId: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  read: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastMessage: string;

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

export class UpdateConversationDTO {
  @ApiPropertyOptional()
  @IsString()
  lastMessage: string;

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
export class ConversationResponseDTO {
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
  senderId: string;

  @ApiProperty()
  receiverId: string;

  @ApiProperty()
  lastMessage: Message;

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date;

  @ApiPropertyOptional()
  deletedAt: Date;
}
