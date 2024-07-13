import { Injectable, NotFoundException } from "@nestjs/common";
import { Art, ArtStats } from "../../core/entities";
import { IDataServices } from "../../core/abstracts";
import { CreateArtsDto, UpdateArtsDto } from "../../core/dtos";
import { ArtsFactoryService } from "./arts-factory.service";
import { Types } from "mongoose";
import { BASE_URL } from "../../configuration";

@Injectable()
export class ArtsUseCases {
  constructor(
    private dataServices: IDataServices,
    private artFactoryService: ArtsFactoryService,
  ) {}

  getAllArts(): Promise<Art[]> {
    return this.dataServices.arts.getAll();
  }

  async getShownArts(): Promise<Art[]> {
    return await this.dataServices.arts.findAllByAttribute("hidden", false);
  }

  getArtById(id: any): Promise<Art> {
    return this.dataServices.arts.get(id);
  }

  async createArt(
    createArtsDto: CreateArtsDto,
    file: Express.Multer.File,
    artistId: string,
  ): Promise<Art> {
    try {
      createArtsDto.artFile = file
        ? `${BASE_URL}/uploads/${file.filename}`
        : null;
      createArtsDto.artist = new Types.ObjectId(artistId);
      const art = this.artFactoryService.createNewArt(createArtsDto);
      const newArt = await this.dataServices.arts.create(art);
      return newArt;
    } catch (error) {
      throw error;
    }
  }
  async updateArt(artId: string, updateArtsDto: UpdateArtsDto): Promise<Art> {
    try {
      const art = this.artFactoryService.updateArt(updateArtsDto);
      const newArt = await this.dataServices.arts.update(artId, art);
      return newArt;
    } catch (error) {
      throw error;
    }
  }

  async findArtsByArtistId(artistId: string): Promise<Art[]> {
    const id = new Types.ObjectId(artistId);
    const arts = await this.dataServices.arts.findAllByAttribute("artist", id);
    return arts;
  }
  async deleteArt(id: string): Promise<boolean> {
    const art = await this.dataServices.arts.delete(id);
    return art ? true : false;
  }
  async artStats(): Promise<ArtStats> {
    const hiddenArts = await this.dataServices.arts.countByCriteria({
      hidden: true,
    });
    const shownArts = await this.dataServices.arts.countByCriteria({
      hidden: false,
    });
    const normalAssetsArts = await this.dataServices.arts.countByCriteria({
      artType: "NORMAL_ASSET",
    });
    const nftArts = await this.dataServices.arts.countByCriteria({
      artType: "NFT",
    });
    const totalArts = hiddenArts + shownArts;
    return {
      totalArts: totalArts,
      hiddenArts: hiddenArts,
      shownArts: shownArts,
      nftArts: nftArts,
      normalAssetsArts: normalAssetsArts,
    };
  }

  async ownArtStats(currentUserId: any): Promise<ArtStats> {
    const hiddenArts = await this.dataServices.arts.countByCriteria({
      $and: [{ hidden: true }, { artist: currentUserId }],
    });
    const shownArts = await this.dataServices.arts.countByCriteria({
      $and: [{ hidden: false }, { artist: currentUserId }],
    });
    const normalAssetsArts = await this.dataServices.arts.countByCriteria({
      $and: [{ artType: "NORMAL_ASSET" }, { artist: currentUserId }],
    });
    const nftArts = await this.dataServices.arts.countByCriteria({
      $and: [{ artType: "NFT" }, { artist: currentUserId }],
    });
    const totalArts = hiddenArts + shownArts;
    return {
      totalArts: totalArts,
      hiddenArts: hiddenArts,
      shownArts: shownArts,
      nftArts: nftArts,
      normalAssetsArts: normalAssetsArts,
    };
  }
}
