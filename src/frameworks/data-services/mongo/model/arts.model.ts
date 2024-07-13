import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type ArtsDocument = Arts & Document;

@Schema()
export class Arts {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  artFile: string;

  @Prop({ default: false })
  hidden: boolean;

  @Prop({ default: Date.now })
  publishedAt: Date;

  @Prop({ type: Types.ObjectId, ref: "User" })
  artist: Types.ObjectId;

  @Prop({ enum: ["NFT", "NORMAL_ASSET"] })
  artType: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const ArtsSchema = SchemaFactory.createForClass(Arts);
