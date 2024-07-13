import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type MessageDocument = Message & Document;
@Schema()
export class Message {
  @Prop()
  _id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: "Conversation" })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  receiverId: Types.ObjectId;

  @Prop()
  message: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
