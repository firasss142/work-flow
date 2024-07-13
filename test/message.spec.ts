import { IDataServices } from "src/core";
import { MessagesUseCases } from "src/use-cases/Message/message.use-case";
import { Types } from "mongoose";

describe("MessagesUseCases", () => {
  let messagesUseCases: MessagesUseCases;
  let dataServicesMock: any;
  let messageFactoryServiceMock: any;
  let conversationFactoryServiceMock: any;
  let notificationsGatewayMock: any;

  beforeEach(() => {
    dataServicesMock = {
      conversations: {
        findAllByAttributes: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      messages: {
        create: jest.fn(),
        getAll: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findAllByAttribute: jest.fn(),
      },
      users: {
        get: jest.fn(),
      },
    };

    messageFactoryServiceMock = {
      createNewMessage: jest.fn(),
      updateMessage: jest.fn(),
      deleteMessage: jest.fn(),
    };

    conversationFactoryServiceMock = {
      createNewConversation: jest.fn(),
    };

    notificationsGatewayMock = {
      notifyNewMessage: jest.fn(),
    };

    messagesUseCases = new MessagesUseCases(
      dataServicesMock,
      messageFactoryServiceMock,
      conversationFactoryServiceMock,
      notificationsGatewayMock,
    );
  });

  describe("createMessage", () => {
    it("should create a new message and conversation if no existing conversation", async () => {
      const createMessageDto = {
        _id: "messageId",
        conversationId: "conversationId",
        senderId: "senderId",
        receiverId: "receiverId",
        message: "Hello, world!",
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const mockConversation = {
        _id: "conversationId",
        senderId: "senderId",
        receiverId: "receiverId",
        lastMessage: "Hello, world!",
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const mockMessage = {
        _id: "messageId",
        conversationId: "conversationId",
        senderId: "senderId",
        receiverId: "receiverId",
        message: "Hello, world!",
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      dataServicesMock.conversations.findAllByAttributes.mockResolvedValue([]);
      conversationFactoryServiceMock.createNewConversation.mockReturnValue(
        mockConversation,
      );
      messageFactoryServiceMock.createNewMessage.mockReturnValue(mockMessage);
      dataServicesMock.conversations.create.mockResolvedValue(mockConversation);
      dataServicesMock.messages.create.mockResolvedValue(mockMessage);
      const result = await messagesUseCases.createMessage(createMessageDto);

      expect(
        conversationFactoryServiceMock.createNewConversation,
      ).toHaveBeenCalledWith({
        senderId: createMessageDto.senderId,
        receiverId: createMessageDto.receiverId,
        read: false,
        lastMessage: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      });
      expect(messageFactoryServiceMock.createNewMessage).toHaveBeenCalledWith({
        ...createMessageDto,
        conversationId: mockConversation._id,
      });
      expect(dataServicesMock.conversations.create).toHaveBeenCalledWith(
        mockConversation,
      );
      expect(dataServicesMock.messages.create).toHaveBeenCalledWith(
        mockMessage,
      );
      expect(notificationsGatewayMock.notifyNewMessage).toHaveBeenCalledWith(
        mockMessage,
      );
      expect(result).toEqual(mockMessage);
    });

    it("should update an existing conversation and create a new message if conversation exists", async () => {
      const existingConversation = {
        _id: "conversationId",
        senderId: "senderId",
        receiverId: "receiverId",
        read: false,
        lastMessage: "Hello, world!",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const createMessageDto = {
        _id: "messageId",
        conversationId: "conversationId",
        senderId: "senderId",
        receiverId: "receiverId",
        message: "Hello!!!",
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const updatedConversationData = {
        lastMessage: createMessageDto.message,
        read: existingConversation.read,
        senderId: existingConversation.senderId,
        receiverId: existingConversation.receiverId,
      };

      const newMessageData = {
        ...createMessageDto,
        conversationId: existingConversation._id,
      };

      const updatedConversation = {
        ...existingConversation,
        ...updatedConversationData,
      };

      dataServicesMock.conversations.findAllByAttributes.mockResolvedValue([
        existingConversation,
      ]);

      dataServicesMock.messages.create.mockResolvedValue(newMessageData);
      dataServicesMock.conversations.update.mockResolvedValue(
        updatedConversation,
      );

      const result = await messagesUseCases.createMessage(createMessageDto);
      console.log("result:", result);
      expect(dataServicesMock.conversations.update).toHaveBeenCalledWith(
        existingConversation._id,
        updatedConversationData,
      );
      expect(notificationsGatewayMock.notifyNewMessage).toHaveBeenCalledWith(
        newMessageData,
      );
      expect(result).toEqual(newMessageData);
    });

    it("should throw an error if an error occurs during the process", async () => {
      const createMessageDto = {
        _id: "messageId",
        conversationId: "conversationId",
        senderId: "senderId",
        receiverId: "receiverId",
        message: "Hello, world!",
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const error = new Error("Failed to create message");

      dataServicesMock.conversations.findAllByAttributes.mockRejectedValue(
        error,
      );

      await expect(
        messagesUseCases.createMessage(createMessageDto),
      ).rejects.toThrow(error);
    });
  });

  describe("getAllMessages", () => {
    it("should return all active messages with sender and receiver details", async () => {
      const messages = [
        {
          _id: "messageId1",
          senderId: "senderId1",
          receiverId: "receiverId1",
          message: "Hello!",
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          _id: "messageId2",
          senderId: "senderId2",
          receiverId: "receiverId2",
          message: "Hi!",
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      const users = [
        {
          _id: "senderId1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          avatar: "avatar1.jpg",
          role: "user",
        },
        {
          _id: "receiverId1",
          firstName: "Jane",
          lastName: "Doe",
          email: "jane.doe@example.com",
          avatar: "avatar2.jpg",
          role: "user",
        },
        {
          _id: "senderId2",
          firstName: "Alice",
          lastName: "Smith",
          email: "alice.smith@example.com",
          avatar: "avatar3.jpg",
          role: "user",
        },
        {
          _id: "receiverId2",
          firstName: "Bob",
          lastName: "Johnson",
          email: "bob.johnson@example.com",
          avatar: "avatar4.jpg",
          role: "user",
        },
      ];

      dataServicesMock.messages.getAll.mockResolvedValue(messages);
      dataServicesMock.users.get.mockImplementation((userId) => {
        return users.find((user) => user._id === userId);
      });

      const expectedMessageResponses = messages.map((message) => {
        const sender = users.find((user) => user._id === message.senderId);
        const receiver = users.find((user) => user._id === message.receiverId);

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
      });

      const result = await messagesUseCases.getAllMessages();

      expect(dataServicesMock.messages.getAll).toHaveBeenCalledTimes(1);
      expect(dataServicesMock.users.get).toHaveBeenCalledTimes(
        messages.length * 2,
      );
      expect(result).toEqual(expectedMessageResponses);
    });
  });

  describe("getMessageById", () => {
    it("should return a message with sender and receiver information", async () => {
      const messageId = "60322f9a6514f81a98d5f252";
      const message = {
        _id: new Types.ObjectId(messageId),
        senderId: "senderId",
        receiverId: "receiverId",
        message: "Hello!",
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const sender = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        avatar: "avatar.jpg",
        role: "user",
      };
      const receiver = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        avatar: "avatar.jpg",
        role: "user",
      };

      dataServicesMock.messages.get.mockResolvedValue(message);
      dataServicesMock.users.get.mockImplementation((userId: string) => {
        if (userId === message.senderId) {
          return Promise.resolve(sender);
        } else if (userId === message.receiverId) {
          return Promise.resolve(receiver);
        }
        return Promise.reject(new Error("User not found"));
      });

      const result = await messagesUseCases.getMessageById(messageId);

      expect(dataServicesMock.messages.get).toHaveBeenCalledWith(
        new Types.ObjectId(messageId),
      );
      expect(dataServicesMock.users.get).toHaveBeenCalledWith(message.senderId);
      expect(dataServicesMock.users.get).toHaveBeenCalledWith(
        message.receiverId,
      );
      expect(result).toEqual({
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
      });
    });
  });
  describe("updateMessage", () => {
    it("should update a message", async () => {
      const messageId = "messageId";
      const updateMessageDto = {
        message: "Updated message",
        read: true,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null,
      };

      const messagesUseCases = new MessagesUseCases(
        dataServicesMock,
        messageFactoryServiceMock,
        conversationFactoryServiceMock,
        notificationsGatewayMock,
      );
      messageFactoryServiceMock.updateMessage.mockReturnValue(updateMessageDto);
      dataServicesMock.messages.update.mockResolvedValue(updateMessageDto);
      const result = await messagesUseCases.updateMessage(
        messageId,
        updateMessageDto,
      );
    });

    it("should throw an error if update fails", async () => {
      const messageId = "messageId";
      const updateMessageDto = {
        message: "Updated message",
        read: true,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null,
      };
      const errorMessage = "Update failed";

      const messagesUseCases = new MessagesUseCases(
        dataServicesMock,
        messageFactoryServiceMock,
        conversationFactoryServiceMock,
        notificationsGatewayMock,
      );
      messageFactoryServiceMock.updateMessage.mockReturnValue(updateMessageDto);
      dataServicesMock.messages.update.mockRejectedValue(
        new Error(errorMessage),
      );
      await expect(
        messagesUseCases.updateMessage(messageId, updateMessageDto),
      ).rejects.toThrowError(errorMessage);
    });
  });

  describe("deleteMessage", () => {
    it("should delete a message", async () => {
      const messageId = "messageId";

      const deletedMessage = {
        _id: messageId,
        senderId: "senderId",
        receiverId: "receiverId",
        message: "Hello!",
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };
      dataServicesMock.messages.delete.mockResolvedValue(deletedMessage);
      const result = await messagesUseCases.deleteMessage(messageId);
      expect(dataServicesMock.messages.delete).toHaveBeenCalledWith(messageId);
      expect(result).toEqual(deletedMessage);
    });

    it("should throw an error if delete fails", async () => {
      const messageId = "messageId";
      const errorMessage = "Delete failed";
      dataServicesMock.messages.delete.mockRejectedValue(
        new Error(errorMessage),
      );
      await expect(
        messagesUseCases.deleteMessage(messageId),
      ).rejects.toThrowError(errorMessage);
    });
  });

  describe("getMessagesByConversationId", () => {
    it("should return messages for a given conversation ID", async () => {
      const conversationId = "60322f9a6514f81a98d5f252";
      const page = 1;
      const limit = 10;

      const senderId = "senderId";
      const receiverId = "receiverId";

      const messages = [
        {
          _id: "messageId1",
          conversationId: conversationId,
          senderId: senderId,
          receiverId: receiverId,
          message: "Hello!",
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          _id: "messageId2",
          conversationId: conversationId,
          senderId: senderId,
          receiverId: receiverId,
          message: "Hi!",
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      const sender = {
        _id: senderId,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        avatar: "avatar.jpg",
        role: "user",
      };

      const receiver = {
        _id: receiverId,
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        avatar: "avatar.jpg",
        role: "user",
      };

      dataServicesMock.messages.findAllByAttribute.mockResolvedValue(messages);
      dataServicesMock.users.get.mockImplementation((userId: string) => {
        if (userId === senderId) {
          return Promise.resolve(sender);
        } else if (userId === receiverId) {
          return Promise.resolve(receiver);
        }
        return Promise.reject(new Error("User not found"));
      });

      const result = await messagesUseCases.getMessagesByConversationId(
        conversationId,
        page,
        limit,
      );

      expect(dataServicesMock.messages.findAllByAttribute).toHaveBeenCalledWith(
        "conversationId",
        expect.any(Types.ObjectId),
      );
      expect(dataServicesMock.users.get).toHaveBeenCalledWith(senderId);
      expect(dataServicesMock.users.get).toHaveBeenCalledWith(receiverId);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("message", "Hello!");
      expect(result[1]).toHaveProperty("message", "Hi!");
      expect(result[0]).toHaveProperty("sender");
      expect(result[1]).toHaveProperty("sender");
      expect(result[0]).toHaveProperty("receiver");
      expect(result[1]).toHaveProperty("receiver");
    });
  });

  describe("markMessageAsRead", () => {
    it("should mark a message as read", async () => {
      const messageId = "60322f9a6514f81a98d5f252";
      const message = {
        _id: messageId,
        senderId: "senderId",
        receiverId: "receiverId",
        message: "Hello!",
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      dataServicesMock.messages.get.mockResolvedValue(message);
      dataServicesMock.messages.update.mockResolvedValue({
        ...message,
        read: true,
      });

      const result = await messagesUseCases.markMessageAsRead(messageId);

      expect(dataServicesMock.messages.get).toHaveBeenCalledWith(messageId);
      expect(dataServicesMock.messages.update).toHaveBeenCalledWith(messageId, {
        ...message,
        read: true,
      });
      expect(result).toEqual({ ...message, read: true });
    });

    it("should throw an error if message is not found", async () => {
      const messageId = "nonExistingMessageId";
      dataServicesMock.messages.get.mockResolvedValue(null);

      await expect(
        messagesUseCases.markMessageAsRead(messageId),
      ).rejects.toThrowError("Message not found");
    });
  });
});
