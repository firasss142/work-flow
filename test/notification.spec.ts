import { NotificationsUseCases } from "src/use-cases/notifications/notifications.use-case";
import { CreateNotificationDto, UpdateNotificationDto } from "src/core";
import { Types } from "mongoose";

describe("NotificationsUseCases", () => {
  let notificationsUseCases: NotificationsUseCases;
  let dataServicesMock: any;
  let notificationsFactoryServiceMock: any;
  let notificationSocketMock: any;

  beforeEach(() => {
    dataServicesMock = {
      notifications: {
        create: jest.fn(),
        getAll: jest.fn(),
        findAllByAttribute: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
      },
    };
    notificationsFactoryServiceMock = {
      createNewNotification: jest.fn(),
      updateNotification: jest.fn(),
    };
    notificationSocketMock = {
      notifyAdminsOfNewRequest: jest.fn(),
    };

    notificationsUseCases = new NotificationsUseCases(
      dataServicesMock,
      notificationsFactoryServiceMock,
      notificationSocketMock,
    );
  });
  describe("createNotification", () => {
    it("should create a new notification", async () => {
      const createNotificationDto: CreateNotificationDto = {
        transfertRequestId: "123",
        recipient: "456",
        message: "New transfer request",
      };
      const newNotifData = {
        transfertRequestId: "123",
        recipient: "456",
        message: "New transfer request",
      };
      const newNotif = {
        transfertRequestId: "123",
        recipient: "456",
        message: "New transfer request",
      };
      notificationsFactoryServiceMock.createNewNotification.mockReturnValue(
        newNotifData,
      );
      dataServicesMock.notifications.create.mockResolvedValue(newNotif);

      const result = await notificationsUseCases.createNotification(
        createNotificationDto,
      );

      expect(
        notificationsFactoryServiceMock.createNewNotification,
      ).toHaveBeenCalledWith(createNotificationDto);
      expect(dataServicesMock.notifications.create).toHaveBeenCalledWith(
        newNotifData,
      );
      expect(
        notificationSocketMock.notifyAdminsOfNewRequest,
      ).toHaveBeenCalledWith(newNotif);
      expect(result).toBe(newNotif);
    });

    it("should throw an error if notification creation fails", async () => {
      const createNotificationDto: CreateNotificationDto = {
        transfertRequestId: "123",
        recipient: "456",
        message: "New transfer request",
      };
      notificationsFactoryServiceMock.createNewNotification.mockReturnValue({
        transfertRequestId: "123",
        recipient: "456",
        message: "New transfer request",
      });
      dataServicesMock.notifications.create.mockRejectedValue(
        new Error("Failed to create notification"),
      );

      await expect(
        notificationsUseCases.createNotification(createNotificationDto),
      ).rejects.toThrowError("Failed to create notification");
    });
  });
  describe("getAllNotifcations", () => {
    it("should return all notifications", async () => {
      const notifications = [
        { id: "1", message: "Notification 1" },
        { id: "2", message: "Notification 2" },
      ];
      dataServicesMock.notifications.getAll.mockResolvedValue(notifications);

      const result = await notificationsUseCases.getAllNotifications();

      expect(dataServicesMock.notifications.getAll).toHaveBeenCalled();
      expect(result).toEqual(notifications);
    });
  });
  describe("getUnseenNotifications", () => {
    it("should return unseen notifications", async () => {
      const unseenNotifications = [
        { id: "1", message: "Notification 1", readAt: null },
        { id: "2", message: "Notification 2", readAt: null },
      ];
      dataServicesMock.notifications.findAllByAttribute.mockResolvedValue(
        unseenNotifications,
      );

      const result = await notificationsUseCases.getUnseenNotifications();

      expect(
        dataServicesMock.notifications.findAllByAttribute,
      ).toHaveBeenCalledWith("readAt", null);
      expect(result).toEqual(unseenNotifications);
    });
  });
  describe("updateNotification", () => {
    it("should update a notification", async () => {
      const notifId = "1";
      const updateNotificationDto: UpdateNotificationDto = { readAt: null };
      const updatedNotification = {
        id: "1",
        message: "Updated message",
        readAt: null,
      };

      notificationsFactoryServiceMock.updateNotification.mockReturnValue(
        updateNotificationDto,
      );
      dataServicesMock.notifications.update.mockResolvedValue(
        updatedNotification,
      );

      const result = await notificationsUseCases.updateNotif(
        notifId,
        updateNotificationDto,
      );

      expect(
        notificationsFactoryServiceMock.updateNotification,
      ).toHaveBeenCalledWith(updateNotificationDto);
      expect(dataServicesMock.notifications.update).toHaveBeenCalledWith(
        notifId,
        updateNotificationDto,
      );
      expect(result).toEqual(updatedNotification);
    });

    it("should throw an error if update fails", async () => {
      const notifId = "1";
      const updateNotificationDto = { readAt: null };
      const error = new Error("Update failed");

      notificationsFactoryServiceMock.updateNotification.mockReturnValue(
        updateNotificationDto,
      );
      dataServicesMock.notifications.update.mockRejectedValue(error);

      await expect(
        notificationsUseCases.updateNotif(notifId, updateNotificationDto),
      ).rejects.toThrowError(error);
    });
  });
  describe("findNotificationByRequestId", () => {
    it("should find notifications by request ID", async () => {
      const reqId = "60322f9a6514f81a98d5f252";
      const objectId = new Types.ObjectId(reqId);
      const notifications = [
        { id: "1", transfertRequestId: objectId },
        { id: "2", transfertRequestId: objectId },
      ];

      dataServicesMock.notifications.findAllByAttribute.mockResolvedValue(
        notifications,
      );

      const result =
        await notificationsUseCases.findNotificationByRequestId(reqId);

      expect(
        dataServicesMock.notifications.findAllByAttribute,
      ).toHaveBeenCalledWith("transfertRequestId", objectId);
      expect(result).toEqual(notifications);
    });
  });
  describe("deleteNotification", () => {
    it("should delete a notification", async () => {
      const id = "1";
      dataServicesMock.notifications.delete.mockResolvedValue(true);

      const result = await notificationsUseCases.deleteNotification(id);

      expect(dataServicesMock.notifications.delete).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });

    it("should return false if deletion fails", async () => {
      const id = "1";
      dataServicesMock.notifications.delete.mockResolvedValue(false);

      const result = await notificationsUseCases.deleteNotification(id);

      expect(dataServicesMock.notifications.delete).toHaveBeenCalledWith(id);
      expect(result).toBe(false);
    });
  });

  describe("findNotificationById", () => {
    it("should get a notification by ID", async () => {
      const id = "1";
      const notification = { id: "1", message: "Notification message" };
      dataServicesMock.notifications.get.mockResolvedValue(notification);

      const result = await notificationsUseCases.getNotificationById(id);

      expect(dataServicesMock.notifications.get).toHaveBeenCalledWith(id);
      expect(result).toEqual(notification);
    });
  });
});
