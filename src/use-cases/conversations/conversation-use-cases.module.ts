import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/services";
import { ConversationUseCases } from "./conversation.use-case";

@Module({
  imports: [DataServicesModule],
  providers: [ConversationUseCases],
  exports: [ConversationUseCases],
})
export class ConversationUseCasesModule {}
