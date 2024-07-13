import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateMessagesDto, UpdateMessagesDTO } from "../core";
import { CurrentUser } from "../core/decorators/user.decorator";
import { JwtAuthGuard } from "../core/guards/jwtauth.guard";
import { Roles } from "../core/roles/role.decorator";
import { Role } from "../core/roles/role.enum";
import { RolesGuard } from "../core/roles/roles.guard";
import { MessagesUseCases } from "../use-cases/Message/message.use-case";

@ApiTags("api/messages")
@Controller("api/messages")
export class MessageController {
  constructor(private messagesUseCases: MessagesUseCases) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post()
  @ApiBody({ type: CreateMessagesDto })
  async createMessage(
    @Body() createDto: CreateMessagesDto,
    @CurrentUser() user: any,
  ) {
    const input = {
      ...createDto,
      senderId: user.userId,
    };
    return this.messagesUseCases.createMessage(input);
    // parse the createMessage to only return the message and the receiverId
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get("/allMessages")
  async getAllMessages() {
    return this.messagesUseCases.getAllMessages();
  }
  // @UseGuards(JwtAuthGuard,RolesGuard)
  // @ApiBearerAuth()
  // @Get('/allMessagesByUser')
  // async getAllMessagesByUser(@Param("id") id: string){
  //     return this.messagesUseCases.getAllMessagesByUser(id);
  // }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/:id")
  async getMessageById(@Param("id") id: string) {
    return this.messagesUseCases.getMessageById(id);
  }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Put("/:id")
    @ApiParam({ name: "id", type: String})
    @ApiBody({ type: UpdateMessagesDTO })
    async updateMessage(
      @Param("id") id: string,
      @Body() updateDto: UpdateMessagesDTO
    ) {
      return this.messagesUseCases.updateMessage(id, updateDto);
    }
  

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Delete(":id")
    @ApiParam({ name: "id", type: String,  })
    async deleteMessage(@Param() messageId: string) {
        return this.messagesUseCases.deleteMessage(messageId);
    }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/receiverId/:id")
  @ApiParam({ name: "id", type: String, description: "ID of the receiver" })
  async getMessagesByReceiver(@Param("id") id: string) {
    return this.messagesUseCases.getMessagesByReceiverId(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/senderId/:id")
  @ApiParam({ name: "id", type: String, description: "ID of the sender" })
  async getMessagesBySenderId(@Param("id") id: string) {
    return this.messagesUseCases.getMessagesBySenderId(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Put("/read/:id")
  @ApiParam({ name: "id", type: String })
  async markMessageAsRead(@Param("id") id: string) {
    return this.messagesUseCases.markMessageAsRead(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/conversation/:conversationId")
  async getMessageByConversationId(
    @Param("conversationId") conversationId: string,
    @Query("page") page: number,
    @Query("limit") limit: number,
  ) {
    return this.messagesUseCases.getMessagesByConversationId(
      conversationId,
      page,
      limit,
    );
  }
}
