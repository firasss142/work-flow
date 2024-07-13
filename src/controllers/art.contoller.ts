import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { CreateArtsDto, UpdateArtsDto } from "../core/dtos";
import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
} from "@nestjs/swagger";
import { RolesGuard } from "../core/roles/roles.guard";
import { Role } from "../core/roles/role.enum";
import { Roles } from "../core/roles/role.decorator";
import { JwtAuthGuard } from "../core/guards/jwtauth.guard";
import { ArtsUseCases } from "../use-cases/arts/arts.use-case";
import { FileInterceptor } from "@nestjs/platform-express";
import { imageAndPdfFilter, storage } from "../configuration/multer.config";
import { CurrentUser } from "../core/decorators/user.decorator";
import { ArtStats } from "../core";
import { Types } from "mongoose";

@ApiTags("api/art")
@Controller("api/art")
export class ArtController {
  constructor(private artUseCases: ArtsUseCases) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get("/shown")
  async getShownArts() {
    return this.artUseCases.getShownArts();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiBearerAuth()
  @Roles(Role.Admin)
  async getAllArts() {
    return this.artUseCases.getAllArts();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get(":id")
  @ApiParam({ name: "id", type: String, description: "id of the art" })
  async getById(@Param("id") id: any) {
    return this.artUseCases.getArtById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get("/artist/:id")
  @ApiParam({ name: "id", type: String, description: "id of the artist" })
  async getArtsByArtistId(@Param("id") artistId: string) {
    return this.artUseCases.findArtsByArtistId(artistId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("artFile", {
      storage: storage,
      fileFilter: imageAndPdfFilter,
    }),
  )
  @Post()
  @ApiBody({ type: CreateArtsDto })
  async createArt(
    @Body() artDto: CreateArtsDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    try {
      const artistId = user.userId;
      const newArt = await this.artUseCases.createArt(
        { ...artDto },
        file,
        artistId,
      );
      return newArt;
    } catch (error) {
      return { error: "Unable to create art" };
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Put(":artId")
  @ApiParam({ name: "artId", type: String, description: "ID of the art" })
  @ApiBody({ type: UpdateArtsDto })
  async updateArt(
    @Body() updateArtDto: UpdateArtsDto,
    @Param("artId") artId: string,
  ) {
    try {
      const updatedArt = await this.artUseCases.updateArt(artId, updateArtDto);
      return updatedArt;
    } catch (error) {
      return { error: "Unable to update art" };
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(":id")
  async deleteArt(@Param("id") id: string): Promise<boolean> {
    return this.artUseCases.deleteArt(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get("/arts/count")
  async artStats(): Promise<ArtStats> {
    return this.artUseCases.artStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Owner)
  @Get("/ownarts/count")
  async ownArtStats(@CurrentUser() user: any): Promise<ArtStats> {
    const id = new Types.ObjectId(user.userId);
    return this.artUseCases.ownArtStats(id);
  }
}
