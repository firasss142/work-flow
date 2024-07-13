import { Injectable } from "@nestjs/common";
import { Notification } from "../../core/entities";
import { CreateNotificationDto, UpdateNotificationDto } from "../../core/dtos";

@Injectable()
export class NotificationsFactoryService {
  createNewNotification(createNotification: CreateNotificationDto) {
    const newNotification = new Notification();
    newNotification.transfertRequestId = createNotification.transfertRequestId;
    newNotification.recipient = createNotification.recipient;
    newNotification.message = createNotification.message;
    newNotification.readAt = null;

    return newNotification;
  }
  updateNotification(updateNotification: UpdateNotificationDto) {
    const updatedNotification = new Notification();
    updatedNotification.readAt = updateNotification.readAt;
    updatedNotification.updatedAt = new Date();
    return updatedNotification;
  }
}
