import { Injectable } from "@nestjs/common";
import { create } from "domain";
import { Types } from "mongoose";
import {
  Conversation,
  CreateConversationDto,
  UpdateConversationDTO,
} from "../../core";

@Injectable()
export class ConversationFactoryService {
  createNewConversation(createConversationDto: CreateConversationDto) {
    const newConversation = new Conversation();
    newConversation.senderId = createConversationDto.senderId;
    newConversation.receiverId = createConversationDto.receiverId;
    newConversation.lastMessage = createConversationDto.lastMessage;
    newConversation.read = createConversationDto.read;
    newConversation._id = new Types.ObjectId();
    newConversation.createdAt = new Date();
    newConversation.updatedAt = new Date();
    return newConversation;
  }

  updateConversation(updateConversationDto: UpdateConversationDTO) {
    const updatedConversation = new Conversation();
    updatedConversation.lastMessage = updateConversationDto.lastMessage;
    updatedConversation.updatedAt = new Date();
    return updatedConversation;
  }
}
