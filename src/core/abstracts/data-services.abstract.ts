import {
  Art,
  CredsRequest,
  User,
  Notification,
  Attestation,
  CredsIssued,
  Message,
  Asset,
} from "../entities";
import { IGenericRepository } from "./generic-repository.abstract";

export abstract class IDataServices {
  abstract attestations: IGenericRepository<Attestation>;
  abstract users: IGenericRepository<User>;
  abstract arts: IGenericRepository<Art>;
  abstract credsRequests: IGenericRepository<CredsRequest>;
  abstract credsIssued: IGenericRepository<CredsIssued>;
  abstract notifications: IGenericRepository<Notification>;
  abstract messages: IGenericRepository<Message>;
  abstract conversations: IGenericRepository<any>;
  abstract assets: IGenericRepository<Asset>;
}
