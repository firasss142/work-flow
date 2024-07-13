import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { IBcryptService } from "../../core";

@Injectable()
export class BcryptService implements IBcryptService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
