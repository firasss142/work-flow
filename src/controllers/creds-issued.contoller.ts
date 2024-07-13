import { Controller, Get, Param, UseGuards } from "@nestjs/common";

import { ApiTags, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { RolesGuard } from "src/core/roles/roles.guard";
import { Role } from "src/core/roles/role.enum";
import { Roles } from "src/core/roles/role.decorator";
import { JwtAuthGuard } from "src/core/guards/jwtauth.guard";

import { CredsIssuedUseCases } from "src/use-cases/creds-issued/creds-issued.use-case";
import { CurrentUser } from "src/core/decorators/user.decorator";

@ApiTags("api/creds-issued")
@Controller("api/creds-issued")
export class CredsIssuedController {
  constructor(private credsIssuedUseCases: CredsIssuedUseCases) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get()
  async getAllCredsIssued(@CurrentUser() user: any) {
    return await this.credsIssuedUseCases.getAllCredsIssued(user.userId);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/countCreds/countByTime")
  async getAllCredsIssuedCountByTime(@CurrentUser() user: any) {
    return await this.credsIssuedUseCases.getCredsIssuedBasedOnTime(
      user.userId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/countCreds/countByRole")
  async getAllCredsIssuedCountByRole(@CurrentUser() user: any) {
    return await this.credsIssuedUseCases.getCredsIssuedBasedOnRole(
      user.userId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get(":id")
  @ApiParam({ name: "id", type: String, description: "id of the creds issued" })
  async getById(@Param("id") id: any) {
    return this.credsIssuedUseCases.getIssuedCredsById(id);
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
  @Get("/creds/:userId")
  @ApiParam({ name: "userId", type: String, description: "id of the user" })
  async getRequestByUserId(@Param("userId") userId: string) {
    return this.credsIssuedUseCases.findCredsIssuedByUserId(userId);
  }
}
