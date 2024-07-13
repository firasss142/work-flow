import { Injectable } from "@nestjs/common";
import { LoginRequest, LoginResponse } from "../../core/entities";
import { LoginRequestDto, LoginResponseDto } from "src/core/dtos";

@Injectable()
export class LoginFactoryService {
  createLoginRequest(createLoginRequest: LoginRequestDto) {
    const loginRequest = new LoginRequest();
    loginRequest.email = createLoginRequest.email;
    loginRequest.password = createLoginRequest.password;
    return loginRequest;
  }
  createLoginResponse(accessToken: string): LoginResponseDto {
    return { accessToken };
  }
}
