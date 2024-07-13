import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { EasAttestationUserType } from "../../../../core";
import { Role } from "../../../../core/roles/role.enum";

export type CredsRequestDocument = CredsRequest & Document;

@Schema()
export class CredsRequest {
  @Prop({
    enum: ["Pending", "Rejected", "Approved", "Completed"],
    default: "Pending",
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  attesterId: Types.ObjectId;

  @Prop({ enum: Object.values(EasAttestationUserType) })
  credsRequestedType: string;

  @Prop({ enum: Object.values(Role) })
  credsRequestedRole: string;

  @Prop()
  notes: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const CredsRequestSchema = SchemaFactory.createForClass(CredsRequest);
