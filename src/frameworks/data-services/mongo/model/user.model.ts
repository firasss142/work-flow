import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EasAttestationUserType } from "../../../../core";
import { Role } from "../../../../core/roles/role.enum";

export type UserDocument = User & Document;
export interface Wallet {
  id: string;
  state: string;
  walletSetId: string;
  custodyType: string;
  refId: string;
  name: string;
  address: string;
  blockchain: string;
  accountType: string;
  updateDate: string;
  createDate: string;
}

@Schema()
export class User {
  @Prop({required: true})
  firstName: string;

  @Prop({required: true})
  lastName: string;

  @Prop({required: true, unique: true})
  email: string;

  @Prop({required: true})
  password: string;
  @Prop({ default: [] })
  attestationUid: string[];

  @Prop({ default: [] })
  attestationId: string[];

  @Prop({ default: [] })
  assetAttestationUid: string[];

  @Prop({ default: [] })
  assetAttestationId: string[];

  @Prop({ default: [] })
  assetAttestationUrl: string[];

  @Prop({ default: [] })
  attestationUrl: string[];

  @Prop({ enum: Object.values(Role), default: Role.Citizen })
  role: Role;

  @Prop({ enum: Object.values(EasAttestationUserType), default: Role.Citizen })
  subRole: EasAttestationUserType;

  @Prop()
  birthDate: string;

  @Prop()
  avatar: string;

  @Prop()
  gender: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  wallets: Wallet[];

  @Prop()
  twoFactorCode: string;

  @Prop()
  twoFactorExpiration: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
