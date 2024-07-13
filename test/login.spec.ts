import { LoginUseCase } from "src/use-cases/login/login.use-case";

describe("LoginUseCase", () => {
  let loginUseCase: LoginUseCase;
  let dataServicesMock: any;
  let bcryptServiceMock: any;
  let jwtServiceMock: any;
  let mailerServiceMock: any;
  let loginFactoryServiceMock: any;
  beforeEach(() => {
    dataServicesMock = {
      users: {
        findByAttribute: jest.fn(),
        update: jest.fn(),
        get: jest.fn(),
      },
    };
    bcryptServiceMock = {
      comparePassword: jest.fn(),
    };
    mailerServiceMock = {
      sendEmail: jest.fn(),
    };
    bcryptServiceMock = {
      comparePassword: jest.fn(),
      hashPassword: jest.fn(),
    };
    jwtServiceMock = {
      generateToken: jest.fn(),
      verifyResetToken: jest.fn(),
    };
    loginFactoryServiceMock = {
      createLoginResponse: jest.fn(),
    };
    loginUseCase = new LoginUseCase(
      dataServicesMock,
      bcryptServiceMock,
      jwtServiceMock,
      mailerServiceMock,
      loginFactoryServiceMock,
    );
  });
  describe("validateUser", () => {
    it("should return user if email and password are valid", async () => {
      const email = "test@example.com";
      const password = "password123";
      const user = { email: "test@example.com", password: "hashedPassword" };

      dataServicesMock.users.findByAttribute.mockResolvedValue(user);
      bcryptServiceMock.comparePassword.mockResolvedValue(true);

      const result = await loginUseCase.validateUser(email, password);

      expect(dataServicesMock.users.findByAttribute).toHaveBeenCalledWith(
        "email",
        email,
      );
      expect(bcryptServiceMock.comparePassword).toHaveBeenCalledWith(
        password,
        user.password,
      );
      expect(result).toEqual(user);
    });

    it("should return null if email is not found", async () => {
      const email = "test@example.com";
      const password = "password123";

      dataServicesMock.users.findByAttribute.mockResolvedValue(null);

      const result = await loginUseCase.validateUser(email, password);

      expect(dataServicesMock.users.findByAttribute).toHaveBeenCalledWith(
        "email",
        email,
      );
      expect(bcryptServiceMock.comparePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("should return null if password is invalid", async () => {
      const email = "test@example.com";
      const password = "password123";
      const user = { email: "test@example.com", password: "hashedPassword" };

      dataServicesMock.users.findByAttribute.mockResolvedValue(user);
      bcryptServiceMock.comparePassword.mockResolvedValue(false);

      const result = await loginUseCase.validateUser(email, password);

      expect(dataServicesMock.users.findByAttribute).toHaveBeenCalledWith(
        "email",
        email,
      );
      expect(bcryptServiceMock.comparePassword).toHaveBeenCalledWith(
        password,
        user.password,
      );
      expect(result).toBeNull();
    });
  });
  describe("login", () => {
    it("should send a 2FA code to the user email", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const user = {
        id: "user_id",
        email: "test@example.com",
        password: "hashed_password",
      };
      const twoFactorCode = loginUseCase.generateTwoFactorCode();

      dataServicesMock.users = {
        findByAttribute: jest.fn().mockResolvedValue(user),
        update: jest.fn().mockResolvedValue(undefined),
      };

      bcryptServiceMock.comparePassword = jest.fn().mockResolvedValue(true);
      loginUseCase.generateTwoFactorCode = jest
        .fn()
        .mockReturnValue(twoFactorCode);
      mailerServiceMock.sendEmail = jest.fn().mockResolvedValue(undefined);

      const result = await loginUseCase.login(credentials);

      expect(result).toBe("2FA code sent to email.");
      expect(dataServicesMock.users.findByAttribute).toHaveBeenCalledWith(
        "email",
        credentials.email,
      );
      expect(bcryptServiceMock.comparePassword).toHaveBeenCalledWith(
        credentials.password,
        user.password,
      );
      expect(loginUseCase.generateTwoFactorCode).toHaveBeenCalled();
      expect(dataServicesMock.users.update).toHaveBeenCalledWith(user.id, {
        ...user,
        twoFactorCode,
        twoFactorExpiration: expect.any(Date),
      });
      expect(mailerServiceMock.sendEmail).toHaveBeenCalledWith(
        user.email,
        "Two-Factor Authentication Code",
        expect.any(String),
      );
    });

    it("should throw NotFoundException if email or password is incorrect", async () => {
      const credentials = {
        email: "test@example.com",
        password: "wrong_password",
      };

      dataServicesMock.users = {
        findByAttribute: jest.fn().mockResolvedValue(null),
      };

      await expect(loginUseCase.login(credentials)).rejects.toThrowError(
        "Email or Password incorrect",
      );
    });
  });
  describe("verifyTwoFactorCode", () => {
    it("should verify two-factor code and return login response", async () => {
      // Mock user data and behavior
      const user = {
        id: "userId",
        email: "test@example.com",
        twoFactorCode: "123456",
        twoFactorExpiration: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes from now
      };
      dataServicesMock.users.findByAttribute.mockResolvedValue(user);

      // Mock JWT token generation
      jwtServiceMock.generateToken.mockReturnValue("jwtToken");

      // Mock LoginResponseDto creation
      loginFactoryServiceMock.createLoginResponse.mockReturnValue({
        token: "jwtToken",
      });

      // Test the function
      const result = await loginUseCase.verifyTwoFactorCode({
        email: "test@example.com",
        code: "123456",
      });

      // Assert
      expect(dataServicesMock.users.findByAttribute).toHaveBeenCalledWith(
        "email",
        "test@example.com",
      );
      expect(jwtServiceMock.generateToken).toHaveBeenCalledWith(
        { userId: "userId" },
        "1d",
      );
      expect(loginFactoryServiceMock.createLoginResponse).toHaveBeenCalledWith(
        "jwtToken",
      );
      expect(result).toEqual({ token: "jwtToken" });
    });

    it("should throw NotFoundException for invalid or expired 2FA code", async () => {
      // Mock user data with expired 2FA code
      const user = {
        id: "userId",
        email: "test@example.com",
        twoFactorCode: "123456",
        twoFactorExpiration: new Date(Date.now() - 1000), // 1 second ago (expired)
      };
      dataServicesMock.users.findByAttribute.mockResolvedValue(user);

      // Test and assert
      await expect(
        loginUseCase.verifyTwoFactorCode({
          email: "test@example.com",
          code: "123456",
        }),
      ).rejects.toThrowError("Invalid or expired 2FA code.");
    });
  });

  describe("forgotPassword", () => {
    it("should send password reset link to user email", async () => {
      const user = {
        id: "userId",
        email: "test@example.com",
      };
      dataServicesMock.users.findByAttribute.mockResolvedValue(user);

      jwtServiceMock.generateToken.mockReturnValue("resetToken");

      const result = await loginUseCase.forgotPassword("test@example.com");

      expect(dataServicesMock.users.findByAttribute).toHaveBeenCalledWith(
        "email",
        "test@example.com",
      );
      expect(jwtServiceMock.generateToken).toHaveBeenCalledWith(
        { userId: "userId" },
        "1h",
      );
      expect(mailerServiceMock.sendEmail).toHaveBeenCalledWith(
        "test@example.com",
        "reset-password",
        expect.any(String),
      );
      expect(result).toEqual("A link has been sent to your email");
    });

    it("should throw NotFoundException for non-existing user email", async () => {
      dataServicesMock.users.findByAttribute.mockResolvedValue(null);

      await expect(
        loginUseCase.forgotPassword("nonexisting@example.com"),
      ).rejects.toThrowError("User not found.");
    });
  });
  describe("resetPassword", () => {
    it("should reset user password", async () => {
      jwtServiceMock.verifyResetToken.mockReturnValue("userId");

      const user = {
        id: "userId",
        password: "oldPassword",
      };
      dataServicesMock.users.get.mockResolvedValue(user);

      bcryptServiceMock.hashPassword.mockResolvedValue("hashedNewPassword");

      const result = await loginUseCase.resetPassword(
        "resetToken",
        "newPassword",
      );

      expect(jwtServiceMock.verifyResetToken).toHaveBeenCalledWith(
        "resetToken",
      );
      expect(dataServicesMock.users.get).toHaveBeenCalledWith("userId");
      expect(bcryptServiceMock.hashPassword).toHaveBeenCalledWith(
        "newPassword",
      );
      expect(dataServicesMock.users.update).toHaveBeenCalledWith("userId", {
        ...user,
        password: "hashedNewPassword",
      });
      expect(result).toEqual("Password updated successfully.");
    });

    it("should throw NotFoundException for invalid or expired token", async () => {
      jwtServiceMock.verifyResetToken.mockReturnValue(null);

      await expect(
        loginUseCase.resetPassword("invalidToken", "newPassword"),
      ).rejects.toThrowError("Invalid or expired token");
    });

    it("should throw NotFoundException for non-existing user", async () => {
      jwtServiceMock.verifyResetToken.mockReturnValue("userId");

      dataServicesMock.users.get.mockResolvedValue(null);

      await expect(
        loginUseCase.resetPassword("validToken", "newPassword"),
      ).rejects.toThrowError("User not found");
    });
  });
});
