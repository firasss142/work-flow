import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  //   handleRequest(err, user, info, context, status) {
  //     if (err || !user) {
  //       // Handle errors or cases where the user is not authenticated
  //       throw err || new UnauthorizedException('You are not authorized to access this resource');
  //     }
  //     // Optionally modify the user object or add additional checks
  //     return user;
  //   }
}
