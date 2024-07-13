export abstract class AbstractJwtService {
  abstract generateToken(data: Record<string, any>, expiresIn: string): string;
  abstract verifyToken(token: string): Record<string, any>;
  abstract verifyResetToken(token: string): string;
}
