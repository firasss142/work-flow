import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../core/decorators/user.decorator";
import { JwtAuthGuard } from "../core/guards/jwtauth.guard";
import { Roles } from "../core/roles/role.decorator";
import { Role } from "../core/roles/role.enum";
import { RolesGuard } from "../core/roles/roles.guard";
import { ConversationUseCases } from "../use-cases/conversations/conversation.use-case";

@ApiTags("api/conversations")
@Controller("api/conversations")
export class ConversationController {
  constructor(private conversationUseCases: ConversationUseCases) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get("/allConversations")
  async getAllConversations(
    @Query("page") page: number,
    @Query("limit") limit: number,
  ) {
    return this.conversationUseCases.getAllConversations(page, limit);
  }

  @UseGuards(JwtAuthGuard) // This ensures that only authenticated users can access this endpoint
  @ApiBearerAuth()
  @Get("/userConversations")
  async getUserConversations(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @CurrentUser() user: any,
  ) {
    // Assuming the user's ID is stored in the request object (e.g., set by JwtAuthGuard)
    const userId = user.userId; // Make sure this matches how your JWT strategy is set up
    return await this.conversationUseCases.getConversationsForCurrentUser(
      userId,
      page,
      limit,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get("/:id")
  async getConversationById(@Param("id") id: string) {
    return this.conversationUseCases.getConversationById(id);
  }
}
