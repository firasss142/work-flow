import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  CredsRequest,
  CredsRequestStats,
  EasAttestationTypes,
} from "../../core/entities";
import { IDataServices } from "../../core/abstracts";
import {
  CreateNotificationDto,
  CreateCredsRequestDto,
  UpdateCredsRequestDto,
} from "../../core/dtos";
import { Types } from "mongoose";
import { CredsRequestFactoryService } from "./creds-requests-factory.service";
import { NotificationsUseCases } from "../notifications/notifications.use-case";
import { NotificationsFactoryService } from "../notifications/notifications-factory.service";
import { Role } from "../../core/roles/role.enum";
import { UserUseCases } from "../user/user.use-case";

@Injectable()
export class CredsRequestsUseCases {
  constructor(
    private dataServices: IDataServices,
    private tranfertRequestsFactoryService: CredsRequestFactoryService,
    private notification: NotificationsUseCases,
    private notificationFactoryService: NotificationsFactoryService,
    private usersUseCase: UserUseCases,
  ) {}
  async getAllBasedOnRole(userId: string) {
    const user = await this.dataServices.users.get(userId);
    if (user.role === Role.Admin) {
      return await this.getAllRequests();
    } else {
      return await this.getAllPersonalRequests(user["_id"]);
    }
  }
  async getAllPersonalRequests(userId: string): Promise<CredsRequest[]> {
    const resp = await this.dataServices.credsRequests.findAllByAttribute(
      "userId",
      userId,
    );
    return resp.filter((request) => request.status !== "Approved");
  }
  getAllRequests(): Promise<CredsRequest[]> {
    return this.dataServices.credsRequests.findAllByAttribute(
      "status",
      "Pending",
    );
  }

  async getRequestById(id: any): Promise<CredsRequest> {
    try {
        const request = await this.dataServices.credsRequests.get(id);
        if (!request) {
            throw new NotFoundException('Request not found.');
        }
        return request;
    } catch (error) {
        throw new NotFoundException('Request not found.');
    }
}


  async createCredsRequest(
    createCredsRequestDto: CreateCredsRequestDto,
  ): Promise<CredsRequest> {
    try {
      const user = await this.dataServices.users.get(
        createCredsRequestDto.userId,
      );
      const credsRequest =
        this.tranfertRequestsFactoryService.createCredsRequest(
          createCredsRequestDto,
        );
      const newCredsRequest =
        await this.dataServices.credsRequests.create(credsRequest);

      const response: any = { ...newCredsRequest };
      if (response) {
        const notificationInput: CreateNotificationDto = {
          message: "New Transfer Request Created",
          transfertRequestId: response._doc._id,
          recipient: response._doc.artId,
        };
        const input =
          this.notificationFactoryService.createNewNotification(
            notificationInput,
          );
        await this.notification.createNotification(input);
      }
      return newCredsRequest;
    } catch (error) {
      throw error;
    }
  }
  async updateCredsRequest(
    requestId: string,
    updateCredsRequestDto: UpdateCredsRequestDto,
    attesterId: string,
  ): Promise<CredsRequest> {
    try {
      const tranfertRequest =
        this.tranfertRequestsFactoryService.updateCredsRequest({
          ...updateCredsRequestDto,
          attesterId: attesterId.toString(),
        });
      if (
        updateCredsRequestDto.status === "Approved" ||
        updateCredsRequestDto.status === "Completed"
      ) {
        const request = await this.getRequestById(requestId);
        await this.usersUseCase.appendAttestationToUser(
          request.userId,
          EasAttestationTypes.OFFCHAIN,
          updateCredsRequestDto.requestedCredsType,
          attesterId,
        );
        const user = await this.dataServices.users.get(request.userId);
        user.subRole = updateCredsRequestDto.requestedCredsType;
        await this.dataServices.users.update(request.userId, {
          ...user,
        });
      }
      const updatedCredsRequest = await this.dataServices.credsRequests.update(
        requestId,
        tranfertRequest,
      );

      return updatedCredsRequest;
    } catch (error) {
      throw error;
    }
  }

  async findCredsRequestByArtId(artId: string): Promise<CredsRequest> {
    const id = new Types.ObjectId(artId);
    const transfertRequest =
      await this.dataServices.credsRequests.findByAttribute("artId", id);
    return transfertRequest;
  }
  async findCredsRequestByArtistId(artistId: string): Promise<CredsRequest[]> {
    if (!artistId || !Types.ObjectId.isValid(artistId)) {
        throw new BadRequestException('Invalid artist ID.');
    }

    const id = new Types.ObjectId(artistId);
    const transfertRequest =
      await this.dataServices.credsRequests.findAllByAttribute("artistId", id);
    return transfertRequest;
}

  async deleteCredsRequest(id: string): Promise<boolean> {
    const resp = await this.dataServices.credsRequests.delete(id);
    return resp ? true : false;
  }

  async credsRequestStats(): Promise<CredsRequestStats> {
    const pendingRequests =
      await this.dataServices.credsRequests.countByCriteria({
        status: "Pending",
      });
    const rejectedRequests =
      await this.dataServices.credsRequests.countByCriteria({
        status: "Rejected",
      });
    const approvedRequests =
      await this.dataServices.credsRequests.countByCriteria({
        status: "Approved",
      });
    const completedRequests =
      await this.dataServices.credsRequests.countByCriteria({
        status: "Completed",
      });
    return {
      pendingRequests: pendingRequests,
      rejectedRequests: rejectedRequests,
      approvedRequests: approvedRequests,
      completedRequests: completedRequests,
      totalRequests:
        pendingRequests +
        rejectedRequests +
        approvedRequests +
        completedRequests,
    };
  }

  async ownCredsRequestStats(currentUserId: any): Promise<CredsRequestStats> {
    const pendingRequests =
      await this.dataServices.credsRequests.countByCriteria({
        $and: [{ status: "Pending" }, { artist: currentUserId }],
      });
    const rejectedRequests =
      await this.dataServices.credsRequests.countByCriteria({
        $and: [{ status: "Rejected" }, { artist: currentUserId }],
      });
    const approvedRequests =
      await this.dataServices.credsRequests.countByCriteria({
        $and: [{ status: "Approved" }, { artist: currentUserId }],
      });
    const completedRequests =
      await this.dataServices.credsRequests.countByCriteria({
        $and: [{ status: "Completed" }, { artist: currentUserId }],
      });
    return {
      pendingRequests: pendingRequests,
      rejectedRequests: rejectedRequests,
      approvedRequests: approvedRequests,
      completedRequests: completedRequests,
      totalRequests:
        pendingRequests +
        rejectedRequests +
        approvedRequests +
        completedRequests,
    };
  }
}
