import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
} from "@nestjs/swagger";
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseGuards,
  Put,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";

import { JwtAuthGuard } from "../core/guards/jwtauth.guard";
import { RolesGuard } from "src/core/roles/roles.guard";
import { AssetUseCases } from "src/use-cases/asset/asset.use-case";
import { CreateAssetDto, UpdateAssetDto } from "src/core";
import { CurrentUser } from "src/core/decorators/user.decorator";
import { Roles } from "src/core/roles/role.decorator";
import { Role } from "src/core/roles/role.enum";
import { FilesInterceptor } from "@nestjs/platform-express";
import { imageAndPdfFilter, storage } from "src/configuration/multer.config";
import path from "path";

@ApiTags("api/asset")
@Controller("api/asset")
export class AssetController {
  constructor(private AssetUseCases: AssetUseCases) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get()
  async getAllAssets() {
    const assets = await this.AssetUseCases.getAllAssets();
    return assets;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get('/user/:userId')
  @ApiParam({ name: 'userId', type: String, description: 'id of the user' })
  async getAssetByUserId(@Param('userId') userId: string) {
    const assets = await this.AssetUseCases.getAssetByUserId(userId);
    return assets;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Creator) // Optional role-based authorization
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @Post()
  @UseInterceptors(
    FilesInterceptor("fileInput", 3, {
      // Use FileArrayInterceptor for multiple files
      storage: storage,
      fileFilter: imageAndPdfFilter,
    }),
  )
  @ApiBody({ type: CreateAssetDto })
  async createAssetRequest(
    @Body() requestDto: CreateAssetDto,
    @CurrentUser() user: any,
    @UploadedFiles() fileInput: Express.Multer.File[],
  ) {
    const newRequest = await this.AssetUseCases.createAssetRequest(
      {
        ...requestDto,
        userId: user.userId,
      },
      fileInput, // Pass the array of files to the use case
    );
    return newRequest;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Put(":assetId")
  @ApiParam({
    name: "assetId",
    type: String,
    description: "ID of the asset",
  })
  @ApiBody({ type: UpdateAssetDto })
  async updateAset(
    @Body() updateAssetDto: UpdateAssetDto,
    @Param("assetId") assetId: string,
    @CurrentUser() user: any,
  ) {
    return this.AssetUseCases.updateAsset(assetId, updateAssetDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/userRole/:userId")
  @ApiParam({ name: "userId", type: String, description: "id of the user" })
  async getAllAssetByUserRole(@Param("userId") userId: string) {
    return this.AssetUseCases.getAllAssetByUserRole(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get("/allAssetsRequest")
  async getAllAssetsRequest() {
    console.log("here");
    return this.AssetUseCases.getAllAssetsRequest();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(":assetId")
  @ApiParam({
    name: "assetId",
    type: String,
    description: "ID of the asset",
  })
  async deleteAsset(@Param("assetId") assetId: string) {
    return this.AssetUseCases.deleteAsset(assetId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/pending")
  async getAllAssetsPending() {
    return this.AssetUseCases.getAllAssetsPending();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/approved")
  async getAllAssetsApproved() {
    return this.AssetUseCases.getAllAssetsApproved();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/Pending/:userId")
  @ApiParam({ name: "userId", type: String, description: "id of the user" })
  async getAllAssetsPendingById(@Param("userId") userId: string) {
    return this.AssetUseCases.getAllAssetsPendingById(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/Approved/:userId")
  @ApiParam({ name: "userId", type: String, description: "id of the user" })
  async getAllAssetsApprovedById(@Param("userId") userId: string) {
    return this.AssetUseCases.getAllAssetsApprovedById(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("pending/userRole/:userId")
  @ApiParam({ name: "userId", type: String, description: "id of the user" })
  async getAllAssetsPendingByRole(@Param("userId") userId: string) {
    return this.AssetUseCases.getAllAssetsPendingByRole(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("approved/userRole/:userId")
  @ApiParam({ name: "userId", type: String, description: "id of the user" })
  async getAllAssetsApprovedByRole(@Param("userId") userId: string) {
    return this.AssetUseCases.getAllAssetsApprovedByRole(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/initiated-transactions")
  async getAllAssetsWithInitiatedTransactions() {
    try {
      return await this.AssetUseCases.getAllAssetsWithInitiatedTransactions();
    } catch (error) {
      console.error(
        "An error occurred while fetching assets with initiated transactions:",
        error,
      );
      throw new Error("Unable to fetch assets with initiated transactions");
    }
  }
}
