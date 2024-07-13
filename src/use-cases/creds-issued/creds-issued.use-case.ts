import { Injectable } from "@nestjs/common";
import { CredsIssued } from "../../core/entities";
import { IDataServices } from "../../core/abstracts";
import { CreateCredsIssuedDto } from "../../core/dtos";
import { Types } from "mongoose";
import { CredsIssuedFactoryService } from "./creds-issued-factory.service";
import { Role } from "../../core/roles/role.enum";

@Injectable()
export class CredsIssuedUseCases {
  constructor(
    private dataServices: IDataServices,
    private credsIssuedFactoryService: CredsIssuedFactoryService,
  ) {}

  async getAllCredsIssued(userId: string) {
    const user = await this.dataServices.users.get(userId);
    if (user.role === Role.Admin) {
      return await this.getAllIssuedCreds();
    } else {
      return await this.getAllIssuedCredsPersonal(user["_id"]);
    }
  }
  getAllIssuedCreds(): Promise<CredsIssued[]> {
    return this.dataServices.credsIssued.getAll();
  }
  getAllIssuedCredsPersonal(userId: string): Promise<CredsIssued[]> {
    return this.dataServices.credsIssued.findAllByAttribute("userId", userId);
  }
  async getCredsIssuedBasedOnTime(userId: string) {
    const user = await this.dataServices.users.get(userId);
    if (user.role === Role.Admin) {
      return await this.getAllIssuedCredsCountByTime();
    } else {
      return await this.getAllIssuedCredsCountByTimePersonal(user["_id"]);
    }
  }
  async getAllIssuedCredsCountByTime(): Promise<{ [key: string]: number }> {
    const resp = await this.getAllIssuedCreds();
    const now = +new Date();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

    const result = {
      last24h: resp.filter(
        (el) => now - new Date(el.createdAt).getTime() <= oneDay,
      ).length,
      last3Days: resp.filter(
        (el) => now - new Date(el.createdAt).getTime() <= 3 * oneDay,
      ).length,
      last7Days: resp.filter(
        (el) => now - new Date(el.createdAt).getTime() <= 7 * oneDay,
      ).length,
      last14Days: resp.filter(
        (el) => now - new Date(el.createdAt).getTime() <= 14 * oneDay,
      ).length,
      moreThan14Days: resp.filter(
        (el) => now - new Date(el.createdAt).getTime() > 14 * oneDay,
      ).length,
    };

    return result;
  }

  async getAllIssuedCredsCountByTimePersonal(
    userId: string,
  ): Promise<{ [key: string]: number }> {
    const resp = await this.getAllIssuedCredsPersonal(userId);

    const now = +new Date();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

    const result = {
      last24h: resp.filter(
        (el) => now - new Date(el.createdAt).getTime() <= oneDay,
      ).length,
      last3Days: resp.filter(
        (el) => now - new Date(el.createdAt).getTime() <= 3 * oneDay,
      ).length,
      last7Days: resp.filter(
        (el) => now - new Date(el.createdAt).getTime() <= 7 * oneDay,
      ).length,
      last14Days: resp.filter(
        (el) => now - new Date(el.createdAt).getTime() <= 14 * oneDay,
      ).length,
      moreThan14Days: resp.filter(
        (el) => now - new Date(el.createdAt).getTime() > 14 * oneDay,
      ).length,
    };

    return result;
  }
  getIssuedCredsById(id: any): Promise<CredsIssued> {
    return this.dataServices.credsIssued.get(id);
  }

  async createCredsIssued(
    createCredsIssuedDto: CreateCredsIssuedDto,
  ): Promise<CredsIssued> {
    try {
      const credIssued =
        this.credsIssuedFactoryService.createCredsRequest(createCredsIssuedDto);
      const response = await this.dataServices.credsIssued.create(credIssued);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getCredsIssuedBasedOnRole(userId: string) {
    const user = await this.dataServices.users.get(userId);
    if (user.role === Role.Admin) {
      return await this.findCredsIssuedByRole();
    } else {
      return await this.findCredsIssuedByRolePersonal(user["_id"]);
    }
  }

  async findCredsIssuedByRole(): Promise<{ [key: string]: number }> {
    const now = +new Date();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const citizen = await this.dataServices.credsIssued.findAllByAttribute(
      "credsRequestedRole",
      Role.Citizen,
    );
    const human = await this.dataServices.credsIssued.findAllByAttribute(
      "credsRequestedRole",
      Role.Human,
    );
    const creator = await this.dataServices.credsIssued.findAllByAttribute(
      "credsRequestedRole",
      Role.Creator,
    );
    const owner = await this.dataServices.credsIssued.findAllByAttribute(
      "credsRequestedRole",
      Role.Owner,
    );
    const asset = await this.dataServices.credsIssued.findAllByAttribute(
      "credsRequestedRole",
      Role.Asset,
    );
    const result = {
      Citizen: citizen.filter(
        (el) => now - new Date(el.createdAt).getTime() <= 7 * oneDay,
      ).length,
      Human: human.filter(
        (el) => now - new Date(el.createdAt).getTime() <= 7 * oneDay,
      ).length,
      Creator: creator.filter(
        (el) => now - new Date(el.createdAt).getTime() <= 7 * oneDay,
      ).length,
      Owner: owner.filter(
        (el) => now - new Date(el.createdAt).getTime() <= 7 * oneDay,
      ).length,
      Asset: asset.filter(
        (el) => now - new Date(el.createdAt).getTime() <= 7 * oneDay,
      ).length,
    };
    return result;
  }

  async findCredsIssuedByRolePersonal(
    userId: string,
  ): Promise<{ [key: string]: number }> {
    const personalCreds = await this.getAllIssuedCredsPersonal(userId);
    const now = +new Date();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

    const result = {
      Citizen: personalCreds.filter(
        (el) =>
          now - new Date(el.createdAt).getTime() <= 7 * oneDay &&
          el.credsRequestedRole === Role.Citizen,
      ).length,
      Human: personalCreds.filter(
        (el) =>
          now - new Date(el.createdAt).getTime() <= 7 * oneDay &&
          el.credsRequestedRole === Role.Human,
      ).length,
      Creator: personalCreds.filter(
        (el) =>
          now - new Date(el.createdAt).getTime() <= 7 * oneDay &&
          el.credsRequestedRole === Role.Creator,
      ).length,
      Owner: personalCreds.filter(
        (el) =>
          now - new Date(el.createdAt).getTime() <= 7 * oneDay &&
          el.credsRequestedRole === Role.Owner,
      ).length,
      Asset: personalCreds.filter(
        (el) =>
          now - new Date(el.createdAt).getTime() <= 7 * oneDay &&
          el.credsRequestedRole === Role.Asset,
      ).length,
    };
    return result;
  }

  async updateCredsIssued(credsId: string): Promise<any> {
    try {
      const creds = await this.dataServices.credsIssued.findByAttribute(
        "attestationUid",
        credsId,
      );
      if (!creds) {
        throw new Error("Creds Issued not found");
      }
      creds.isRevoked = true;
      const credsIssued: any = {
        attestationUrl: creds.attestationUrl,
        userId: creds.userId,
        attestationId: creds.attestationId,
        requestedCredsRole: creds.credsRequestedRole,
        requestedCredsType: creds.credsRequestedType,
        isRevoked: true,
        attestationUid: creds.attestationUid,
      };
      const updatedCreds = await this.dataServices.credsIssued.update(
        creds["_id"].toString(),
        { ...credsIssued },
      );
      return updatedCreds;
    } catch (error) {
      throw error;
    }
  }

  // async findCredsRequestByArtId(artId: string): Promise<CredsRequest> {
  //   const id = new Types.ObjectId(artId);
  //   const transfertRequest =
  //     await this.dataServices.credsRequests.findByAttribute("artId", id);
  //   return transfertRequest;
  // }
  async findCredsIssuedByUserId(userId: string): Promise<CredsIssued[]> {
    const id = new Types.ObjectId(userId);
    const creds = await this.dataServices.credsIssued.findAllByAttribute(
      "userId",
      id,
    );
    return creds;
  }
  // async deleteCredsRequest(id: string): Promise<boolean> {
  //   const resp = await this.dataServices.credsRequests.delete(id);
  //   return resp ? true : false;
  // }

  // async credsRequestStats(): Promise<CredsRequestStats> {
  //   const pendingRequests =
  //     await this.dataServices.credsRequests.countByCriteria({
  //       status: "Pending",
  //     });
  //   const rejectedRequests =
  //     await this.dataServices.credsRequests.countByCriteria({
  //       status: "Rejected",
  //     });
  //   const approvedRequests =
  //     await this.dataServices.credsRequests.countByCriteria({
  //       status: "Approved",
  //     });
  //   const completedRequests =
  //     await this.dataServices.credsRequests.countByCriteria({
  //       status: "Completed",
  //     });
  //   return {
  //     pendingRequests: pendingRequests,
  //     rejectedRequests: rejectedRequests,
  //     approvedRequests: approvedRequests,
  //     completedRequests: completedRequests,
  //     totalRequests:
  //       pendingRequests +
  //       rejectedRequests +
  //       approvedRequests +
  //       completedRequests,
  //   };
  // }

  // async ownCredsRequestStats(currentUserId: any): Promise<CredsRequestStats> {
  //   const pendingRequests =
  //     await this.dataServices.credsRequests.countByCriteria({
  //       $and: [{ status: "Pending" }, { artist: currentUserId }],
  //     });
  //   const rejectedRequests =
  //     await this.dataServices.credsRequests.countByCriteria({
  //       $and: [{ status: "Rejected" }, { artist: currentUserId }],
  //     });
  //   const approvedRequests =
  //     await this.dataServices.credsRequests.countByCriteria({
  //       $and: [{ status: "Approved" }, { artist: currentUserId }],
  //     });
  //   const completedRequests =
  //     await this.dataServices.credsRequests.countByCriteria({
  //       $and: [{ status: "Completed" }, { artist: currentUserId }],
  //     });
  //   return {
  //     pendingRequests: pendingRequests,
  //     rejectedRequests: rejectedRequests,
  //     approvedRequests: approvedRequests,
  //     completedRequests: completedRequests,
  //     totalRequests:
  //       pendingRequests +
  //       rejectedRequests +
  //       approvedRequests +
  //       completedRequests,
  //   };
  // }
}
