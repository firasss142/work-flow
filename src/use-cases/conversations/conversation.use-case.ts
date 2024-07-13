import { Injectable } from "@nestjs/common";
import { Conversation, IDataServices } from "../../core";
import { Types } from "mongoose";

@Injectable()
export class ConversationUseCases {
  constructor(private dataServices: IDataServices) {}

  async getConversationById(
    conversationId: string,
  ): Promise<Conversation | null> {
    try {
      console.log("conversationId", conversationId)
      const id = new Types.ObjectId(conversationId);
      const conversation = await this.dataServices.conversations.get(id);
      if (!conversation) {
        throw new Error(`No conversation found for id: ${id}`);
      }

      const [sender, receiver] = await Promise.all([
        this.dataServices.users.get(conversation.senderId),
        this.dataServices.users.get(conversation.receiverId),
      ]);

      return {
        _id: conversation._id,
        lastMessage: conversation.lastMessage,
        read: conversation.read,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        deletedAt: conversation.deletedAt,
        senderId: {
          firstName: sender.firstName,
          lastName: sender.lastName,
          email: sender.email,
          avatar: sender.avatar,
          role: sender.role,
        },
        receiverId: {
          firstName: receiver.firstName,
          lastName: receiver.lastName,
          email: receiver.email,
          avatar: receiver.avatar,
          role: receiver.role,
        },
      };
    } catch (error) {
      throw new Error(`Error fetching conversation: ${error.conversation}`);
    }
  }

  async getAllConversations(page: number, limit: number): Promise<any[]> {
    const skip = (page - 1) * limit;
    const conversations = await this.dataServices.conversations.getAll();
    const conversationResponses = await Promise.all(
      conversations.map(async (conversation) => {
        try {
          const [sender, receiver] = await Promise.all([
            this.dataServices.users.get(conversation.senderId),
            this.dataServices.users.get(conversation.receiverId),
          ]);

          return {
            _id: conversation._id,
            lastMessage: conversation.lastMessage,
            read: conversation.read,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            sender: {
              firstName: sender.firstName,
              lastName: sender.lastName,
              email: sender.email,
              avatar: sender.avatar,
              role: sender.role,
            },
          };
        } catch (error) {
          throw new Error(
            `Error fetching user data for conversation: ${error.conversation}`,
          );
        }
      }),
    );
    const paginatedConversations = conversationResponses.slice(
      skip,
      skip + limit,
    );
    return paginatedConversations;
  }
  async getConversationsForCurrentUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<any[]> {
    const skip = (page - 1) * limit;
    // Fetch all conversations and then filter them based on the current user's ID
    const allConversations = await this.dataServices.conversations.getAll();
  
    const userConversations = allConversations.filter(
      (conversation) =>
        conversation.senderId._id.toString() === userId ||
        conversation.receiverId._id.toString() === userId,
    );

    const conversationResponses = await Promise.all(
      userConversations.map(async (conversation) => {
        try {
          const [sender, receiver] = await Promise.all([


            this.dataServices.users.get(conversation.senderId),
            this.dataServices.users.get(conversation.receiverId),
          ]);

          return {
            _id: conversation._id,
            lastMessage: conversation.lastMessage,
            read: conversation.read,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
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
              role: sender.role,
            },
          };
        } catch (error) {
          throw new Error(
            `Error fetching user data for conversation: ${error.conversation}`,
          );
        }
      }),
    );
    const paginatedConversations = conversationResponses.slice(
      skip,
      skip + limit,
    );
    return paginatedConversations;
  }
}
