import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Message } from "src/core";

export type ConversationDocument = Conversation & Document;
@Schema()
export class Conversation {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  receiverId: Types.ObjectId;

  @Prop()
  lastMessage: string;

  @Prop()
  read: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
