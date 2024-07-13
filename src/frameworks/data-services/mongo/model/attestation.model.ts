import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AttestationDocument = Attestation & Document;

class Domain {
  name: string;
  version: string;
  chainId: string;
  verifyingContract: string;
}
class Message {
  recipient: string;
  expirationTime: number;
  time: number;
  revocable: boolean;
  version: number;
  nonce: number;
  schema: string;
  refUID: string;
  data: string;
}
class Types {
  Attest: Array<any>;
}
class Signature {
  v: number;
  r: string;
  s: string;
}
@Schema()
export class Attestation {
  @Prop()
  domain: Domain;

  @Prop()
  primaryType: string;

  @Prop()
  message: Message;

  @Prop()
  types: Types;

  @Prop()
  signature: Signature;

  @Prop()
  uid: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const AttestationSchema = SchemaFactory.createForClass(Attestation);
