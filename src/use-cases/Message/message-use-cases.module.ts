import { DataServicesModule } from "src/services";
import { MessagesUseCases } from "./message.use-case";
import { MessageFactoryService } from "./message-factory.service";
import { Module } from "@nestjs/common";
import { ConversationFactoryService } from "../conversations/conversation-factory.service";
import { SocketModule } from "src/frameworks/socket/socket-services.module";
import { NotificationsGateway } from "src/frameworks/socket/socket-services.service";

@Module({
  imports: [DataServicesModule, SocketModule],
  providers: [
    MessagesUseCases,
    MessageFactoryService,
    ConversationFactoryService,
    NotificationsGateway,
  ],
  exports: [
    MessagesUseCases,
    MessageFactoryService,
    ConversationFactoryService,
    NotificationsGateway,
  ],
})
export class MessageUseCasesModule {}
