import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { IDataServices, User } from "../../../core";
import { DATA_BASE_CONFIGURATION } from "../../../configuration";
import {
  Arts,
  ArtsSchema,
  Attestation,
  AttestationSchema,
  Notification,
  NotificationSchema,
  CredsRequest,
  CredsRequestSchema,
  UserSchema,
  CredsIssued,
  CredsIssuedSchema,
  Message,
  MessageSchema,
  ConversationSchema,
  Conversation,
  Asset,
} from "./model";
import { MongoDataServices } from "./mongo-data-services.service";
import { AssetSchema } from "./model/asset.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Arts.name, schema: ArtsSchema },
      { name: CredsRequest.name, schema: CredsRequestSchema },
      { name: CredsIssued.name, schema: CredsIssuedSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: Attestation.name, schema: AttestationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Asset.name, schema: AssetSchema },
    ]),

    MongooseModule.forRoot(DATA_BASE_CONFIGURATION.mongoConnectionString, {
      dbName: "TrustId",
    }),
  ],
  providers: [
    {
      provide: IDataServices,
      useClass: MongoDataServices,
    },
  ],
  exports: [IDataServices],
})
export class MongoDataServicesModule {}
