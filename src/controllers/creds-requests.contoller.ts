import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseGuards,
  Put,
} from "@nestjs/common";
import {
  CreateArtsDto,
  CreateCredsRequestDto,
  UpdateArtsDto,
  UpdateCredsRequestDto,
} from "../core/dtos";
import { ApiBody, ApiTags, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { RolesGuard } from "../core/roles/roles.guard";
import { Role } from "../core/roles/role.enum";
import { Roles } from "../core/roles/role.decorator";
import { JwtAuthGuard } from "../core/guards/jwtauth.guard";
import { CredsRequestsUseCases } from "../use-cases/creds-requests/creds-requests.use-case";
import { CurrentUser } from "../core/decorators/user.decorator";
import { Types } from "mongoose";
import { User } from "../core";

@ApiTags("api/creds-requests")
@Controller("api/creds-requests")
export class CredsRequestsController {
  constructor(private credsRequestsUseCases: CredsRequestsUseCases) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get()
  async getAllRequests(@CurrentUser() user: any) {
    return this.credsRequestsUseCases.getAllBasedOnRole(user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get(":id")
  @ApiParam({ name: "id", type: String, description: "id of the request" })
  async getById(@Param("id") id: any) {
    return this.credsRequestsUseCases.getRequestById(id);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiBearerAuth()
  // @Roles(Role.Admin)
  // @Get("/request/:artId")
  // @ApiParam({ name: "artId", type: String, description: "id of the art" })
  // async getRequestByArtId(@Param("artId") artId: string) {
  //   return this.credsRequestsUseCases.findCredsRequestByArtId(artId);
  // }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get("/request/user/:userId")
  @ApiParam({ name: "userId", type: String, description: "id of the user" })
  async getRequestByUserId(@Param("userId") userId: string) {
    return this.credsRequestsUseCases.findCredsRequestByArtistId(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post()
  @ApiBody({ type: CreateCredsRequestDto })
  async createRequest(
    @Body() requestDto: CreateCredsRequestDto,
    @CurrentUser() user: any,
  ) {
    try {
      const newRequest = await this.credsRequestsUseCases.createCredsRequest({
        ...requestDto,
        userId: user.userId,
      });
      return newRequest;
    } catch (error) {
      return { error: "Unable to create request" };
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Put(":requestId")
  @ApiParam({
    name: "requestId",
    type: String,
    description: "ID of the request",
  })
  @ApiBody({ type: UpdateCredsRequestDto })
  async updateArt(
    @Body() updateRequestDto: UpdateCredsRequestDto,
    @Param("requestId") requestId: string,
    @CurrentUser() user: any,
  ) {
    try {
      const updatedRequest =
        await this.credsRequestsUseCases.updateCredsRequest(
          requestId,
          updateRequestDto,
          user.userId,
        );
      return updatedRequest;
    } catch (error) {
      return { error: "Unable to update art" };
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(":id")
  async deleteRequest(@Param("id") id: string): Promise<boolean> {
    return this.credsRequestsUseCases.deleteCredsRequest(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get("/requests/stats")
  async getRequestsStats() {
    return this.credsRequestsUseCases.credsRequestStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/ownrequests/stats")
  async getOwnRequestsStats(@CurrentUser() user: any) {
    const id = new Types.ObjectId(user.userId);
    return this.credsRequestsUseCases.ownCredsRequestStats(id);
  }
}
