import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ type: Types.ObjectId, ref: "CredsRequest" })
  transfertRequestId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  recipient: Types.ObjectId;

  @Prop()
  message: string;

  @Prop()
  readAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
