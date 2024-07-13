import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";
import { ApiBody, ApiTags, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { User } from "../core";
import { CurrentUser } from "../core/decorators/user.decorator";
import {
  ForgotPasswordRequestDto,
  LoginRequestDto,
  ResetPasswordRequestDto,
  TwoFactorDto,
} from "../core/dtos";
import { LoginResponseDto } from "../core/dtos";
import { JwtAuthGuard } from "../core/guards/jwtauth.guard";
import { LoginUseCase } from "../use-cases/login/login.use-case";
@ApiTags("auth")
@Controller("auth")
export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post("login")
  async login(@Body() credentials: LoginRequestDto): Promise<string> {
    const loginResponse = await this.loginUseCase.login(credentials);
    return loginResponse;
  }

  @Post("two-factor-auth")
  async verifyTwoFactorCode(
    @Body() twoFactorInput: TwoFactorDto,
  ): Promise<LoginResponseDto> {
    const loginResponse =
      await this.loginUseCase.verifyTwoFactorCode(twoFactorInput);
    return loginResponse;
  }

  @Post("forgot-password")
  @ApiBody({ type: ForgotPasswordRequestDto })
  async forgotPassword(
    @Body() input: ForgotPasswordRequestDto,
  ): Promise<string> {
    return await this.loginUseCase.forgotPassword(input.email);
  }

  @Post("reset-password")
  @ApiBody({ type: ResetPasswordRequestDto })
  async resetPassword(
    @Body() resetPasswordRequest: ResetPasswordRequestDto,
  ): Promise<any> {
    return await this.loginUseCase.resetPassword(
      resetPasswordRequest.token,
      resetPasswordRequest.password,
    );
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("loadMe")
  async loadMeEndpoint(@CurrentUser() user: any): Promise<User> {
    return await this.loginUseCase.loadUserDetails(user.userId);
  }
}
