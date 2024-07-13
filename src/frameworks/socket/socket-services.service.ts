import { Injectable } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AbstractWebSocketGateway } from "../../core/abstracts/socket-service.abstract";
import { JwtService } from "../jwt/jwt-services.service";
import { IDataServices } from "../../core";
import { FRONT_END_URL } from "../../configuration";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: FRONT_END_URL,
    methods: ["GET", "POST"],
  },
})
export class NotificationsGateway extends AbstractWebSocketGateway {
  private connectedClients: Map<string, { userId: string; role: string }> =
    new Map();

  constructor(
    private jwtService: JwtService,
    private mongoDataService: IDataServices,
  ) {
    super();
  }

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token =
        client.handshake.query.token || client.handshake.headers.authorization;
      const cleanToken = (token as string).split(" ")[1];
      const decoded = this.jwtService.verifyToken(cleanToken);
      const user: any = await this.mongoDataService.users.get(decoded.userId);

      if (user) {
        this.connectedClients.set(client.id, {
          userId: user._id,
          role: user.role,
        });
        console.log(`${user.role} connected: ${client.id}`);
      } else {
        client.disconnect();
        console.log("Connection attempt failed: User not found");
      }
    } catch (error) {
      client.disconnect();
      console.error(`Connection attempt failed: ${error.message}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  // public notifyUsersOfRequestUpdate(request: any) {
  //   this.connectedClients.forEach((clientInfo, clientId) => {
  //     try {
  //       const client = this.server.sockets.sockets.get(clientId);
  //       if (!client) {
  //         return;
  //       }
  //       const userIdString = clientInfo.userId.toString();
  //       const recipientIdString = request.recipient.toString();
  //       if (clientInfo.role === "Admin") {
  //         client.emit("newCredsRequest", request);
  //       } else if (
  //         clientInfo.role === "Artist" &&
  //         userIdString === recipientIdString
  //       ) {
  //         client.emit("credsRequestUpdated", request);
  //       }
  //     } catch (error) {
  //       console.error(`Error notifying user: ${error.message}`);
  //     }
  //   });
  // }
  public notifyAdminsOfNewRequest(request: any) {
    this.connectedClients.forEach((clientInfo, clientId) => {
      if (clientInfo.role === "Admin") {
        try {
          const client = this.server.sockets.sockets.get(clientId);
          if (client) {
            client.emit("newCredsRequest", request);
          }
        } catch (error) {
          console.error(`Error notifying admin: ${error.message}`);
        }
      }
    });
  }

  public notifyNewMessage(message: any) {
    this.connectedClients.forEach((clientInfo, clientId) => {
      if (
        clientInfo.userId === message.senderId ||
        clientInfo.userId === message.receiverId
      ) {
        try {
          const client = this.server.sockets.sockets.get(clientId);
          if (client) {
            client.emit("newMessage", message);
            console.log("Notification sent for new message:", message);
          }
        } catch (error) {
          console.error(`Error notifying client: ${error.message}`);
        }
      }
    });
  }
}
