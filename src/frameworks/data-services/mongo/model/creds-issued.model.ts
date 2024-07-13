import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { EasAttestationUserType } from "../../../../core";
import { Role } from "../../../../core/roles/role.enum";

export type CredsIssuedDocument = CredsIssued & Document;

@Schema()
export class CredsIssued {
  @Prop({ type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  attesterId: Types.ObjectId;

  @Prop({ enum: Object.values(EasAttestationUserType) })
  credsRequestedType: string;

  @Prop({ enum: Object.values(Role) })
  credsRequestedRole: string;

  @Prop({})
  attestationUrl: string;

  @Prop({})
  attestationUid: string;

  @Prop({ type: Types.ObjectId, ref: "Attestation" })
  attestationId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const CredsIssuedSchema = SchemaFactory.createForClass(CredsIssued);
