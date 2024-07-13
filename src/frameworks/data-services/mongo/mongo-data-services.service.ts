import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IDataServices } from "../../../core";
import { MongoGenericRepository } from "./mongo-generic-repository";
import {
  UserDocument,
  User,
  Arts,
  ArtsDocument,
  CredsRequest,
  CredsRequestDocument,
  Notification,
  NotificationDocument,
  Attestation,
  AttestationDocument,
  CredsIssued,
  CredsIssuedDocument,
  Message,
  MessageDocument,
  ConversationDocument,
  Conversation,
  AssetDocument,
  Asset,
} from "./model";

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap
{
  attestations: MongoGenericRepository<Attestation>;
  users: MongoGenericRepository<User>;
  arts: MongoGenericRepository<Arts>;
  credsRequests: MongoGenericRepository<CredsRequest>;
  credsIssued: MongoGenericRepository<CredsIssued>;
  notifications: MongoGenericRepository<Notification>;
  messages: MongoGenericRepository<Message>;
  conversations: MongoGenericRepository<Conversation>;
  assets: MongoGenericRepository<Asset>;
  constructor(
    @InjectModel(User.name)
    private UserRepository: Model<UserDocument>,
    @InjectModel(Arts.name)
    private ArtsRepository: Model<ArtsDocument>,
    @InjectModel(CredsRequest.name)
    private CredsRequestRepository: Model<CredsRequestDocument>,
    @InjectModel(Notification.name)
    private NotificationRepository: Model<NotificationDocument>,
    @InjectModel(Attestation.name)
    private AttestationRepository: Model<AttestationDocument>,
    @InjectModel(CredsIssued.name)
    private CredsIssuedRepository: Model<CredsIssuedDocument>,
    @InjectModel(Message.name)
    private MessageRepository: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private ConversationRepository: Model<ConversationDocument>,
    @InjectModel(Asset.name)
    private AssetRepository: Model<AssetDocument>,
  ) {}

  onApplicationBootstrap() {
    this.attestations = new MongoGenericRepository<Attestation>(
      this.AttestationRepository,
    );
    this.users = new MongoGenericRepository<User>(this.UserRepository);
    this.arts = new MongoGenericRepository<Arts>(this.ArtsRepository, [
      "artist",
    ]);
    this.credsRequests = new MongoGenericRepository<CredsRequest>(
      this.CredsRequestRepository,
      ["userId"],
    );
    this.notifications = new MongoGenericRepository<Notification>(
      this.NotificationRepository,
      ["transfertRequestId", "recipient"],
    );
    this.credsIssued = new MongoGenericRepository<CredsIssued>(
      this.CredsIssuedRepository,
      ["userId", "attestationId"],
    );

    this.messages = new MongoGenericRepository<Message>(
      this.MessageRepository,
      ["senderId", "receiverId"],
    );

    this.conversations = new MongoGenericRepository<Conversation>(
      this.ConversationRepository,
      ["senderId", "receiverId"],
    );

    this.assets = new MongoGenericRepository<Asset>(this.AssetRepository, [
      "userId",
    ]);
  }
}
