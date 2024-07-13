import { Injectable } from "@nestjs/common";
import {
  Conversation,
  CreateMessagesDto,
  IDataServices,
  Message,
  MessageResponseDTO,
  UpdateMessagesDTO,
} from "../../core";
import { MessageFactoryService } from "./message-factory.service";
import { ConversationFactoryService } from "../conversations/conversation-factory.service";
import { Types } from "mongoose";
import { NotificationsGateway } from "../../frameworks/socket/socket-services.service";

@Injectable()
export class MessagesUseCases {
  constructor(
    private dataServices: IDataServices,
    private messageFactoryService: MessageFactoryService,
    private conversationFactoryService: ConversationFactoryService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async createMessage(createMessageDto: CreateMessagesDto): Promise<Message> {
    try {
      const conversations =
        await this.dataServices.conversations.findAllByAttributes({
          $or: [
            {
              $and: [
                { senderId: createMessageDto.senderId },
                { receiverId: createMessageDto.receiverId },
              ],
            },
            {
              $and: [
                { senderId: createMessageDto.receiverId },
                { receiverId: createMessageDto.senderId },
              ],
            },
          ],
        });

      console.log(conversations);

      let conversation: Conversation;

      if (!conversations || conversations.length === 0) {
        const newConversationData =
          this.conversationFactoryService.createNewConversation({
            senderId: createMessageDto.senderId,
            receiverId: createMessageDto.receiverId,
            read: false,
            lastMessage: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          });
        conversation =
          await this.dataServices.conversations.create(newConversationData);
      } else {
        conversation = conversations[0];
      }

      const newMessageData = this.messageFactoryService.createNewMessage({
        ...createMessageDto,
        conversationId: conversation._id,
      });

      const newMessage =
        await this.dataServices.messages.create(newMessageData);

      conversation.lastMessage = newMessage.message;
      conversation.read = newMessage.read;
      conversation.senderId = createMessageDto.senderId;
      conversation.receiverId = createMessageDto.receiverId;
      await this.dataServices.conversations.update(conversation._id, {
        lastMessage: newMessage.message,
        read: newMessage.read,
        senderId: createMessageDto.senderId,
        receiverId: createMessageDto.receiverId,
      });
      this.notificationsGateway.notifyNewMessage(newMessage);
      console.log("Notification sent for new message:", newMessage);

      return newMessage;
    } catch (error) {
      throw error;
    }
  }

  async getAllMessages(): Promise<MessageResponseDTO[]> {
    try {
      const allMessages = await this.dataServices.messages.getAll();
      const activeMessages = allMessages.filter(
        (message) => !message.deletedAt,
      );

      const messageResponses = await Promise.all(
        activeMessages.map(async (message) => {
          const sender = await this.dataServices.users.get(message.senderId);
          const receiver = await this.dataServices.users.get(
            message.receiverId,
          );

          return {
            message: message.message,
            read: message.read,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            deletedAt: message.deletedAt,
            sender: {
              firstName: sender.firstName,
              lastName: sender.lastName,
              email: sender.email,
              avatar: sender.avatar,
              role: sender.role,
            },
            receiver: {
              firstName: receiver.firstName,
              lastName: receiver.lastName,
              email: receiver.email,
              avatar: receiver.avatar,
              role: receiver.role,
            },
          };
        }),
      );

      return messageResponses;
    } catch (error) {
      throw error;
    }
  }

  // async getAllMessagesByUser(userId: string): Promise<Message[]> {
  //     if (!Types.ObjectId.isValid(userId)) {
  //         throw new Error('Invalid userId');
  //     }

  //     const id = new Types.ObjectId(userId);
  //     const allMessages = await this.dataServices.messages.getAll();
  //     const userMessages = allMessages.filter(message =>
  //         message.receiverId.equals(id) || message.senderId.equals(id)
  //     );

  //     console.log(userMessages);
  //     return userMessages;
  // }

    async getMessageById(messageId: string): Promise<MessageResponseDTO> {
        try {
            const id = new Types.ObjectId(messageId);
            
            const message = await this.dataServices.messages.get(id);
            if (!message) {
                throw new Error('Message not found');
            }
           
            const sender = await this.dataServices.users.get(message.senderId);
            const receiver = await this.dataServices.users.get(message.receiverId);
    
            const messageResponse: MessageResponseDTO = {
                message: message.message,
                read: message.read,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
                deletedAt: message.deletedAt,
                sender: {
                    firstName: sender.firstName,
                    lastName: sender.lastName,
                    email: sender.email,
                    avatar: sender.avatar,
                    role: sender.role,
                },
                receiver: {
                    firstName: receiver.firstName,
                    lastName: receiver.lastName,
                    email: receiver.email,
                    avatar: receiver.avatar,
                    role: receiver.role,
                },
            };
    
            return messageResponse;
        } catch (error) {
            throw error;
        }
    }
    
    async updateMessage(
        messageId: string,
        updateMessageDto: UpdateMessagesDTO
    ): Promise<Message> {
        try{
            const id = new Types.ObjectId(messageId);
            const message = await this.dataServices.messages.get(id);
            console.log("message",message)
            if (!message) {
                throw new Error('Message not found');
            }  
            const newMessageData = this.messageFactoryService.updateMessage(updateMessageDto);
            const response = await this.dataServices.messages.update(message._id, newMessageData);
            return response;
        } catch (error){
            throw error;
        }
    }

    async deleteMessage(messageId: string): Promise<boolean> {
        try{
            const id = new Types.ObjectId(messageId);
            const message = await this.dataServices.messages.get(id);
            console.log("message",message)
            if (!message) {
                throw new Error('Message not found');
            }   
            const response = await this.dataServices.messages.delete(message._id);
            return response? true : false;;
        } catch (error){
            throw error;
        }
    }

  async getMessagesByReceiverId(
    receiverId: string,
  ): Promise<MessageResponseDTO[]> {
    try {
      const messages = await this.dataServices.messages.findAllByAttribute(
        "receiverId",
        receiverId,
      );
      const messageResponses = await Promise.all(
        messages.map(async (message) => {
          const sender = await this.dataServices.users.get(message.senderId);
          const receiver = await this.dataServices.users.get(
            message.receiverId,
          );

          return {
            message: message.message,
            read: message.read,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            deletedAt: message.deletedAt,
            sender: {
              firstName: sender.firstName,
              lastName: sender.lastName,
              email: sender.email,
              avatar: sender.avatar,
              role: sender.role,
            },
            receiver: {
              firstName: receiver.firstName,
              lastName: receiver.lastName,
              email: receiver.email,
              avatar: receiver.avatar,
              role: receiver.role,
            },
          };
        }),
      );

      return messageResponses;
    } catch (error) {
      throw error;
    }
  }

  async getMessagesBySenderId(senderId: string): Promise<MessageResponseDTO[]> {
    try {
      const messages = await this.dataServices.messages.findAllByAttribute(
        "senderId",
        senderId,
      );
      const messageResponses = await Promise.all(
        messages.map(async (message) => {
          const sender = await this.dataServices.users.get(message.senderId);
          const receiver = await this.dataServices.users.get(
            message.receiverId,
          );

          return {
            message: message.message,
            read: message.read,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            deletedAt: message.deletedAt,
            sender: {
              firstName: sender.firstName,
              lastName: sender.lastName,
              email: sender.email,
              avatar: sender.avatar,
              role: sender.role,
            },
            receiver: {
              firstName: receiver.firstName,
              lastName: receiver.lastName,
              email: receiver.email,
              avatar: receiver.avatar,
              role: receiver.role,
            },
          };
        }),
      );

      return messageResponses;
    } catch (error) {
      throw error;
    }
  }

    async markMessageAsRead(messageId: string): Promise<Message> {
        try {
            const message = await this.dataServices.messages.get(messageId);
            if (!message) {
                throw new Error('Message not found');
            }

            message.read = true;
            const updatedMessage = await this.dataServices.messages.update(messageId, message);
            return updatedMessage;
        } catch (error) {
            throw error;
        }
    }
    async getMessagesByConversationId(conversationId: string, page: number, limit: number): Promise<MessageResponseDTO[]> {
        const skip = (page - 1) * limit;
        const id = new Types.ObjectId(conversationId);
        const messages = await this.dataServices.messages.findAllByAttribute("conversationId", id);
        const messageResponses = await Promise.all(messages.map(async message => {
            try {
                const [sender, receiver] = await Promise.all([
                    this.dataServices.users.get(message.senderId),
                    this.dataServices.users.get(message.receiverId)
                ]);
    
                return {
                    message: message.message,
                    read: message.read,
                    createdAt: message.createdAt,
                    updatedAt: message.updatedAt,
                    deletedAt: message.deletedAt,
                    senderId: message.senderId._id,
                    receiverId: message.receiverId._id,
                    sender: {
                        firstName: sender.firstName,
                        lastName: sender.lastName,
                        email: sender.email,
                        avatar: sender.avatar,
                        role: sender.role,
                    },
                    receiver: {
                        firstName: receiver.firstName,
                        lastName: receiver.lastName,
                        email: receiver.email,
                        avatar: receiver.avatar,
                        role: receiver.role,
                    },
                };
            } catch (error) {
                throw new Error(`Error fetching user data for message: ${error.message}`);
            }
        }));
        const paginatedMessages = messageResponses.slice(skip, skip + limit);
        return paginatedMessages;
    }
    
    


}
