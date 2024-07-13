import { Injectable } from "@nestjs/common";
import { CredsRequest } from "../../core/entities";
import { CreateCredsRequestDto, UpdateCredsRequestDto } from "../../core/dtos";
import { Types } from "mongoose";
import { Role } from "src/core/roles/role.enum";

@Injectable()
export class CredsRequestFactoryService {
  createCredsRequest(createCredsRequest: CreateCredsRequestDto) {
    const newRequest = new CredsRequest();
    newRequest.userId = new Types.ObjectId(createCredsRequest.userId);
    //newRequest.attesterId = new Types.ObjectId(createCredsRequest.attesterId);
    newRequest.credsRequestedRole = createCredsRequest.requestedCredsRole;
    return newRequest;
  }
  updateCredsRequest(updateCredsRequest: UpdateCredsRequestDto) {
    const updatedRequest = new CredsRequest();
    updatedRequest.status = updateCredsRequest.status;
    updatedRequest.credsRequestedType = updateCredsRequest.requestedCredsType;
    updatedRequest.updatedAt = new Date();
    if (updateCredsRequest.attesterId != null) {
      updatedRequest.attesterId = new Types.ObjectId(
        updateCredsRequest.attesterId,
      );
    }

    return updatedRequest;
  }
}
