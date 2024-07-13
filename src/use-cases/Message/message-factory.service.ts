import { Injectable } from "@nestjs/common";
import { CreateMessagesDto, Message, UpdateMessagesDTO } from "../../core";
import { Types } from "mongoose";

@Injectable()
export class MessageFactoryService {
  createNewMessage(createMessageDto: CreateMessagesDto) {
    const newMessage = new Message();
    newMessage.senderId = createMessageDto.senderId;
    newMessage.receiverId = createMessageDto.receiverId;
    newMessage.message = createMessageDto.message;
    newMessage.read = createMessageDto.read;
    newMessage._id = new Types.ObjectId();
    newMessage.conversationId = createMessageDto.conversationId;
    return newMessage;
  }

  updateMessage(updateMessageDto: UpdateMessagesDTO) {
    const updatedMessage = new Message();
    updatedMessage.message = updateMessageDto.message;
    updatedMessage.updatedAt = new Date();
    return updatedMessage;
  }
}
