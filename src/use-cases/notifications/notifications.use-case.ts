import { Injectable, NotFoundException } from "@nestjs/common";
import { Notification } from "../../core/entities";
import { AbstractWebSocketGateway, IDataServices } from "../../core/abstracts";
import { CreateNotificationDto, UpdateNotificationDto } from "../../core/dtos";
import { NotificationsFactoryService } from "./notifications-factory.service";
import { Types } from "mongoose";

@Injectable()
export class NotificationsUseCases {
  constructor(
    private dataServices: IDataServices,
    private notificationsFactoryService: NotificationsFactoryService,
    private notificationSocket: AbstractWebSocketGateway,
  ) {}

  getAllNotifications(): Promise<Notification[]> {
    return this.dataServices.notifications.getAll();
  }

  async getUnseenNotifications(): Promise<Notification[]> {
    return await this.dataServices.notifications.findAllByAttribute(
      "readAt",
      null,
    );
  }

  async getNotificationById(id: any): Promise<Notification> {
    const notification = await this.dataServices.notifications.get(id);
    if (!notification) {
        throw new NotFoundException('Notification not found.');
    }
    return notification;
}


  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    try {
      const newNotifData =
        this.notificationsFactoryService.createNewNotification(
          createNotificationDto,
        );
      const newNotif =
        await this.dataServices.notifications.create(newNotifData);
      this.notificationSocket.notifyAdminsOfNewRequest(newNotif);
      return newNotif;
    } catch (error) {
      throw error;
    }
  }
  async updateNotif(
    notifId: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    try {
      const newNotifData = this.notificationsFactoryService.updateNotification(
        updateNotificationDto,
      );
      const response = await this.dataServices.notifications.update(
        notifId,
        newNotifData,
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async findNotificationByArtistId(artistId: string): Promise<Notification[]> {
    const notifs = await this.dataServices.notifications.findAllByAttribute(
      "recipient",
      artistId
    );
    return notifs;
  }
  async findNotificationByRequestId(reqId: string): Promise<Notification[]> {
    const id = new Types.ObjectId(reqId);
    const notifs = await this.dataServices.notifications.findAllByAttribute(
      "transfertRequestId",
      id,
    );
    return notifs;
  }
  async deleteNotification(id: string): Promise<boolean> {
    const notificationId= new Types.ObjectId(id);
    const notification = await this.dataServices.notifications.get(notificationId);
    if (!notification) {
        throw new NotFoundException('Notification not found.');
    }
    const resp = await this.dataServices.notifications.delete(id);
    return resp ? true : false;
}

}
