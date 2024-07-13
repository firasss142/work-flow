import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { AbstractJwtService } from "../../core";
import { JwtPayload } from "jsonwebtoken";
import { SECRET_KEY } from "../../configuration";

@Injectable()
export class JwtService extends AbstractJwtService {
  private readonly secretKey: string = SECRET_KEY;

  generateToken(data: Record<string, any>, expiresIn: string): string {
    return jwt.sign(data, this.secretKey, { expiresIn });
  }

  verifyToken(token: string): Record<string, any> {
    return jwt.verify(token, this.secretKey) as Record<string, any>;
  }

  verifyResetToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, this.secretKey) as JwtPayload;
      return decoded.userId;
    } catch (error) {
      return null;
    }
  }
}
