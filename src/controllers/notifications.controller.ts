import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiParam, ApiBody } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/core/guards/jwtauth.guard";
import { RolesGuard } from "src/core/roles/roles.guard";
import { Role } from "src/core/roles/role.enum";
import { Roles } from "src/core/roles/role.decorator";
import { NotificationsUseCases } from "src/use-cases/notifications/notifications.use-case";
import { CreateNotificationDto, UpdateNotificationDto } from "src/core/dtos";

@ApiTags("api/notifications")
@Controller("api/notifications")
export class NotificationsController {
  constructor(private notificationsUseCases: NotificationsUseCases) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get("unseen")
  async getUnseenNotifications() {
    return this.notificationsUseCases.getUnseenNotifications();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get()
  async getAllNotifications() {
    return this.notificationsUseCases.getAllNotifications();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get(":id")
  @ApiParam({ name: "id", type: String, description: "ID of the notification" })
  async getNotificationById(@Param("id") id: string) {
    return this.notificationsUseCases.getNotificationById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get("/artist/:id")
  @ApiParam({ name: "id", type: String, description: "ID of the artist" })
  async getNotificationByArtistId(@Param("id") id: string) {
    return this.notificationsUseCases.findNotificationByArtistId(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get("/request/:id")
  @ApiParam({ name: "id", type: String, description: "ID of the request" })
  async getNotificationByRequestId(@Param("id") id: string) {
    return this.notificationsUseCases.findNotificationByRequestId(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Post()
  @ApiBody({ type: CreateNotificationDto })
  async createNotification(@Body() createDto: CreateNotificationDto) {
    return this.notificationsUseCases.createNotification(createDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Put(":id")
  @ApiParam({ name: "id", type: String, description: "ID of the notification" })
  @ApiBody({ type: UpdateNotificationDto })
  async updateNotification(
    @Param("id") id: string,
    @Body() updateDto: UpdateNotificationDto,
  ) {
    return this.notificationsUseCases.updateNotif(id, updateDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(":id")
  @ApiParam({ name: "id", type: String, description: "ID of the notification" })
  async deleteNotification(@Param("id") id: string) {
    return this.notificationsUseCases.deleteNotification(id);
  }
}
