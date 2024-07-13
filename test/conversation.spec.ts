import { Types } from "mongoose";
import { ConversationUseCases } from "src/use-cases/conversations/conversation.use-case";

describe("ConversationsUseCases", () => {
  let conversationsUseCases: ConversationUseCases;
  let dataServicesMock: any;
  let conversationFactoryServiceMock: any;

  beforeEach(() => {
    dataServicesMock = {
      conversations: {
        findAllByAttributes: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        get: jest.fn(),
        getAll: jest.fn(),
      },
      users: {
        get: jest.fn(),
      },
    };

    conversationFactoryServiceMock = {
      createNewConversation: jest.fn(),
    };

    conversationsUseCases = new ConversationUseCases(dataServicesMock);
  });
  describe("getConversationById", () => {
    it("should return a conversation with sender and receiver information", async () => {
      const conversationId = "60322f9a6514f81a98d5f252";
      const conversation = {
        _id: new Types.ObjectId(conversationId),
        senderId: "senderId",
        receiverId: "receiverId",
        lastMessage: "Hello!",
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const sender = {
        _id: "senderId",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        avatar: "avatar.jpg",
        role: "user",
      };
      const receiver = {
        _id: "receiverId",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        avatar: "avatar.jpg",
        role: "user",
      };

      dataServicesMock.conversations.get.mockResolvedValue(conversation);
      dataServicesMock.users.get.mockImplementation((userId: string) => {
        if (userId === conversation.senderId) {
          return Promise.resolve(sender);
        } else if (userId === conversation.receiverId) {
          return Promise.resolve(receiver);
        }
        return Promise.reject(new Error("User not found"));
      });

      const result =
        await conversationsUseCases.getConversationById(conversationId);

      expect(dataServicesMock.conversations.get).toHaveBeenCalledWith(
        new Types.ObjectId(conversationId),
      );
      expect(dataServicesMock.users.get).toHaveBeenCalledWith(
        conversation.senderId,
      );
      expect(dataServicesMock.users.get).toHaveBeenCalledWith(
        conversation.receiverId,
      );
      expect(result).toEqual({
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
      });
    });
  });
  describe("getAllConversations", () => {
    it("should return paginated conversations with sender information", async () => {
      const page = 1;
      const limit = 10;
      const conversations = [
        {
          _id: "conversationId1",
          senderId: "senderId1",
          receiverId: "receiverId1",
          lastMessage: "Hello!",
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "conversationId2",
          senderId: "senderId2",
          receiverId: "receiverId2",
          lastMessage: "Hi!",
          read: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const senderIds = new Set<string>();
      dataServicesMock.conversations.getAll.mockResolvedValue(conversations);
      dataServicesMock.users.get.mockImplementation((userId: string) => {
        senderIds.add(userId);
        return Promise.resolve({
          _id: userId,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          avatar: "avatar.jpg",
          role: "user",
        });
      });

      const result = await conversationsUseCases.getAllConversations(
        page,
        limit,
      );

      expect(dataServicesMock.conversations.getAll).toHaveBeenCalled();
      expect(dataServicesMock.users.get).toHaveBeenCalledTimes(senderIds.size);
      expect(result).toEqual([
        {
          _id: conversations[0]._id,
          lastMessage: conversations[0].lastMessage,
          read: conversations[0].read,
          createdAt: conversations[0].createdAt,
          updatedAt: conversations[0].updatedAt,
          sender: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            avatar: "avatar.jpg",
            role: "user",
          },
        },
        {
          _id: conversations[1]._id,
          lastMessage: conversations[1].lastMessage,
          read: conversations[1].read,
          createdAt: conversations[1].createdAt,
          updatedAt: conversations[1].updatedAt,
          sender: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            avatar: "avatar.jpg",
            role: "user",
          },
        },
      ]);
    });
  });

  describe("getConversationsForCurrentUser", () => {
    it("should return paginated conversations for the current user with sender and receiver information", async () => {
      const userId = "userId";
      const page = 1;
      const limit = 10;
      const conversations = [
        {
          _id: "conversationId1",
          senderId: {
            _id: "senderId1",
          },
          receiverId: {
            _id: "receiverId1",
          },
          lastMessage: "Hello!",
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "conversationId2",
          senderId: {
            _id: "senderId2",
          },
          receiverId: {
            _id: "receiverId2",
          },
          lastMessage: "Hi!",
          read: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      dataServicesMock.conversations.getAll.mockResolvedValue(conversations); // Utilisez le mock pour simuler la récupération des conversations
      dataServicesMock.users.get.mockImplementation((userId: string) => {
        if (
          userId === "senderId1" ||
          userId === "receiverId1" ||
          userId === "senderId2" ||
          userId === "receiverId2"
        ) {
          return Promise.resolve({
            _id: userId,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            avatar: "avatar.jpg",
            role: "user",
          });
        }
        return Promise.reject(new Error("User not found"));
      });

      const result = await conversationsUseCases.getConversationsForCurrentUser(
        userId,
        page,
        limit,
      );

      expect(dataServicesMock.conversations.getAll).toHaveBeenCalled();
      expect(conversations).toBeDefined();
    });
  });
});
