import { Injectable } from "@nestjs/common";
import { Art } from "../../core/entities";
import { CreateArtsDto, UpdateArtsDto } from "../../core/dtos";
import { Types } from "mongoose";

@Injectable()
export class ArtsFactoryService {
  createNewArt(createArtDto: CreateArtsDto) {
    const newArt = new Art();
    newArt.name = createArtDto.name;
    newArt.description = createArtDto.description;
    newArt.artFile = createArtDto.artFile;
    newArt.artType = createArtDto.artType;
    newArt.artist = new Types.ObjectId(createArtDto.artist);
    newArt.publishedAt = createArtDto.publishedAt;
    return newArt;
  }
  updateArt(updateArtDto: UpdateArtsDto) {
    const newArt = new Art();
    newArt.description = updateArtDto.description;
    newArt.hidden = updateArtDto.hidden;
    newArt.updatedAt = new Date();
    return newArt;
  }
}
