import { Module } from "@nestjs/common";
import {
  UserController,
  LoginController,
  CredsRequestsController,
  ConversationController,
  AssetController,
} from "./controllers";
import { DataServicesModule } from "./services/data-services/data-services.module";
import { UserUseCasesModule } from "./use-cases/user/user-use-cases.module";
import { BcryptServicesModule } from "./services";
import { LoginUseCasesModule } from "./use-cases/login/login-use-cases.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./core/strategy/jwt.stratgy";
import { ArtsUseCasesModule } from "./use-cases/arts/arts-use-cases.module";
import { CredsRequestsUseCasesModule } from "./use-cases/creds-requests/creds-requests-use-cases.module";
import { NotificationsUseCasesModule } from "./use-cases/notifications/notifications-use-cases.module";
import { NotificationsController } from "./controllers/notifications.controller";
import { SocketModule } from "./frameworks/socket/socket-services.module";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { CredsIssuedController } from "./controllers/creds-issued.contoller";
import { CredsIssuedUseCasesModule } from "./use-cases/creds-issued/creds-issued-use-cases.module";
import { MessageUseCasesModule } from "./use-cases/Message/message-use-cases.module";
import { MessageController } from "./controllers/message.controller";
import { ConversationUseCasesModule } from "./use-cases/conversations/conversation-use-cases.module";
import { AssetUseCasesModule } from "./use-cases/asset/asset-use-cases.module";
import { ScheduleModule } from "@nestjs/schedule";
import { CronJobModule } from "./frameworks/cronJob/cron-services.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
    }),
    PassportModule,
    JwtModule.register({
      secret: "your-secret-key",
      signOptions: { expiresIn: "1d" },
    }),

    DataServicesModule,
    UserUseCasesModule,
    BcryptServicesModule,
    LoginUseCasesModule,
    ArtsUseCasesModule,
    CredsRequestsUseCasesModule,
    CredsIssuedUseCasesModule,
    NotificationsUseCasesModule,
    SocketModule,
    MessageUseCasesModule,
    ConversationUseCasesModule,
    AssetUseCasesModule,
    CronJobModule,
  ],
  providers: [JwtStrategy],
  controllers: [
    UserController,
    LoginController,
    CredsIssuedController,
    // ArtController,
    CredsRequestsController,
    NotificationsController,
    MessageController,
    ConversationController,
    AssetController,
  ],
})
export class AppModule {}
