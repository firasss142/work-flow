import { Injectable } from "@nestjs/common";
import { CredsIssued } from "../../core/entities";
import { Types } from "mongoose";
import { CreateCredsIssuedDto } from "src/core";

@Injectable()
export class CredsIssuedFactoryService {
  createCredsRequest(createCredsIssued: CreateCredsIssuedDto) {
    const newRequest = new CredsIssued();
    newRequest.userId = new Types.ObjectId(createCredsIssued.userId);
    newRequest.credsRequestedType = createCredsIssued.requestedCredsType;
    newRequest.credsRequestedRole = createCredsIssued.requestedCredsRole;
    newRequest.attestationUrl = createCredsIssued.attestationUrl;
    newRequest.attestationId = new Types.ObjectId(
      createCredsIssued.attestationId,
    );
    newRequest.isRevoked = false;
    newRequest.attestationUid = createCredsIssued.attestationUid;
    newRequest.attesterId = new Types.ObjectId(createCredsIssued.attesterId);
    return newRequest;
  }
}
