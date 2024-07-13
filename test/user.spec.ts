import { UserUseCases } from "src/use-cases/user/user.use-case";
import {
  EasAttestationUserType,
  ICircleService,
  IDataServices,
  IGenericRepository,
  User,
} from "src/core";
import { CreateUserDto, UpdateUserDto } from "src/core";
import { UnauthorizedException } from "@nestjs/common";
import { of } from "rxjs";
import { Role } from "src/core/roles/role.enum";
import { BASE_URL } from "src/configuration";

describe("UserUseCases", () => {
  let userUseCases: UserUseCases;
  let dataServicesMock: Partial<IDataServices>;
  let bcryptServiceMock: any;
  let userFactoryServiceMock: any;
  let circleserviceMock: any;

  const appendAttestationToUserMock = jest.fn();

  beforeEach(() => {
    const userRepositoryMock: Partial<IGenericRepository<User>> = {
      findByAttribute: jest.fn(),
      create: jest.fn(),
    };

    dataServicesMock = {
      users: userRepositoryMock,
    };

    bcryptServiceMock = {
      hashPassword: jest.fn(),
    };

    userFactoryServiceMock = {
      createNewUser: jest.fn(),
    };

    circleserviceMock = {
      createDevelopWallet: jest
        .fn()
        .mockResolvedValue({ data: { wallets: [] } }),
    };

    userUseCases = new UserUseCases(
      dataServicesMock as IDataServices,
      userFactoryServiceMock,
      bcryptServiceMock,
      null,
      circleserviceMock as ICircleService,
      null,
    );
    userUseCases.appendAttestationToUser = appendAttestationToUserMock;
  });

  describe("createUser", () => {
    it("should create a new user if user does not exist", async () => {
      dataServicesMock.users.findByAttribute = jest
        .fn()
        .mockResolvedValue(null);
      const createUserDto: CreateUserDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "citizen",
        birthDate: "1990-01-01",
        gender: "male",
        phoneNumber: "1234567890",
        avatar: null,
        wallet: {
          id: "1",
          createDate: new Date().toISOString(),
          custodyType: "DEVELOPER",
          name: "John Doe Wallet",
          updateDate: new Date().toISOString(),
          userId: "1",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const newUser: User = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password",
        role: "user",
        subRole: "subRole",
        birthDate: "1990-01-01",
        avatar: "https://example.com/avatar.jpg",
        gender: "male",
        phoneNumber: "123456789",
        twoFactorCode: "",
        twoFactorExpiration: new Date(),
        attestationUid: [],
        attestationId: [],
        attestationUrl: [],
        wallet: "wallet",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      userFactoryServiceMock.createNewUser.mockReturnValue(newUser);
      bcryptServiceMock.hashPassword.mockResolvedValue("hashedPassword");

      const createdUser = await userUseCases.createUser(createUserDto);

      expect(dataServicesMock.users.findByAttribute).toHaveBeenCalledWith(
        "email",
        createUserDto.email,
      );
      expect(userFactoryServiceMock.createNewUser).toHaveBeenCalledWith(
        createUserDto,
      );
      expect(dataServicesMock.users.create).toHaveBeenCalledWith(newUser);
    });

    it("should throw UnauthorizedException if user already exists", async () => {
      const createUserDto: CreateUserDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "citizen",
        birthDate: "1990-01-01",
        gender: "male",
        phoneNumber: "1234567890",
        avatar: null,
        wallet: {
          id: "1",
          createDate: new Date().toISOString(),
          custodyType: "DEVELOPER",
          name: "John Doe Wallet",
          updateDate: new Date().toISOString(),
          userId: "1",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      dataServicesMock.users.findByAttribute = jest
        .fn()
        .mockResolvedValue({ email: "john.doe@example.com" });

      await expect(userUseCases.createUser(createUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe("createAccount", () => {
    it("should create a new account if user does not exist", async () => {
      dataServicesMock.users.findByAttribute = jest
        .fn()
        .mockResolvedValue(null);
      bcryptServiceMock.hashPassword = jest
        .fn()
        .mockResolvedValue("hashedPassword");

      const createUserDto: CreateUserDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "citizen",
        birthDate: "1990-01-01",
        gender: "male",
        phoneNumber: "1234567890",
        avatar: null,
        wallet: {
          id: "1",
          createDate: new Date().toISOString(),
          custodyType: "DEVELOPER",
          name: "John Doe Wallet",
          updateDate: new Date().toISOString(),
          userId: "1",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const newUser: User = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password",
        role: "user",
        subRole: "subRole",
        birthDate: "1990-01-01",
        avatar: "https://example.com/avatar.jpg",
        gender: "male",
        phoneNumber: "123456789",
        twoFactorCode: "",
        twoFactorExpiration: new Date(),
        attestationUid: [],
        attestationId: [],
        attestationUrl: [],
        wallet: "wallet",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };
      userFactoryServiceMock.createNewUser.mockReturnValue(newUser);
      circleserviceMock.createDevelopWallet.mockReturnValue(
        of({
          data: {
            wallets: [
              {
                id: "1",
                createDate: new Date().toISOString(),
                custodyType: "DEVELOPER",
                name: "John Doe Wallet",
                updateDate: new Date().toISOString(),
                userId: "1",
              },
            ],
          },
        }),
      );

      dataServicesMock.users.create = jest
        .fn()
        .mockRejectedValue(new Error("Failed to create account"));

      await expect(
        userUseCases.createAccount(createUserDto, null),
      ).rejects.toThrowError("Failed to create account");

      expect(appendAttestationToUserMock).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException if user already exists", async () => {
      dataServicesMock.users.findByAttribute = jest
        .fn()
        .mockResolvedValue({ email: "john.doe@example.com" });

      const createUserDto: CreateUserDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "citizen",
        birthDate: "1990-01-01",
        gender: "male",
        phoneNumber: "1234567890",
        avatar: null,
        wallet: {
          id: "1",
          createDate: new Date().toISOString(),
          custodyType: "DEVELOPER",
          name: "John Doe Wallet",
          updateDate: new Date().toISOString(),
          userId: "1",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      await expect(
        userUseCases.createAccount(createUserDto, null),
      ).rejects.toThrow(Error);
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      // Mock data returned by getAll()
      const mockUsers: User[] = [
        {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password",
          role: "user",
          subRole: "subRole",
          birthDate: "1990-01-01",
          avatar: "https://example.com/avatar.jpg",
          gender: "male",
          phoneNumber: "123456789",
          twoFactorCode: "",
          twoFactorExpiration: new Date(),
          attestationUid: [],
          attestationId: [],
          attestationUrl: [],
          wallet: "wallet",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password",
          role: "user",
          subRole: "subRole",
          birthDate: "1990-01-01",
          avatar: "https://example.com/avatar.jpg",
          gender: "male",
          phoneNumber: "123456789",
          twoFactorCode: "",
          twoFactorExpiration: new Date(),
          attestationUid: [],
          attestationId: [],
          attestationUrl: [],
          wallet: "wallet",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      // Mock the behavior of dataServices.users.getAll()
      dataServicesMock.users.getAll = jest.fn().mockResolvedValue(mockUsers);

      // Call getAllUsers() and store the result
      const result = await userUseCases.getAllUsers();

      // Check if the result matches the expected mockUsers array
      expect(result).toEqual(mockUsers);
    });
  });

  describe("getUserById", () => {
    it("should return the user with the specified ID", async () => {
      // Mock user data
      const userId = "1";
      const mockUser: User = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password",
        role: "user",
        subRole: "subRole",
        birthDate: "1990-01-01",
        avatar: "https://example.com/avatar.jpg",
        gender: "male",
        phoneNumber: "123456789",
        twoFactorCode: "",
        twoFactorExpiration: new Date(),
        attestationUid: [],
        attestationId: [],
        attestationUrl: [],
        wallet: "wallet",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      dataServicesMock.users.get = jest.fn().mockResolvedValue(mockUser);

      const result = await userUseCases.getUserById(userId);

      expect(result).toEqual(mockUser);

      expect(dataServicesMock.users.get).toHaveBeenCalledWith(userId);
    });
  });

  describe("updateUser", () => {
    it("should update the user with the specified ID", async () => {
      const userId = "1";

      const updateUserDto: UpdateUserDto = {
        firstName: "Alice",
        lastName: "Smith",
        birthDate: "1990-01-01",
        gender: "female",
        attestationUid: ["uid1", "uid2"],
        attestationId: [1, 2],
        attestationUrl: ["url1", "url2"],
        role: Role.Citizen,
        subRole: EasAttestationUserType.Citizen,
        avatar: null, // Mettez ici le fichier simulé
        phoneNumber: "1234567890",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      // Mock file object
      const file: Express.Multer.File = {
        fieldname: "avatar",
        originalname: "avatar.jpg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "/tmp",
        filename: "avatar.jpg",
        path: "/tmp/avatar.jpg",
        size: 12345,
        stream: null,
        buffer: null,
      };

      const updatedUser: Partial<User> = {
        ...updateUserDto,
        avatar: `${BASE_URL}/uploads/${file.filename}`,
      };

      userFactoryServiceMock.updateUser = jest
        .fn()
        .mockReturnValue(updatedUser);

      dataServicesMock.users.update = jest.fn().mockResolvedValue(updatedUser);

      const result = await userUseCases.updateUser(userId, updateUserDto, file);

      expect(updateUserDto.avatar).toBe(`${BASE_URL}/uploads/${file.filename}`);

      expect(userFactoryServiceMock.updateUser).toHaveBeenCalledWith(
        updateUserDto,
      );

      expect(dataServicesMock.users.update).toHaveBeenCalledWith(
        userId,
        updatedUser,
      );

      expect(result).toEqual(updatedUser);
    });
  });

  describe("deleteUser", () => {
    it("should return true if the user is deleted", async () => {
      const userId = "1";

      const deletedUser = { id: userId };

      dataServicesMock.users.delete = jest.fn().mockResolvedValue(deletedUser);

      const result = await userUseCases.deleteUser(userId);

      expect(dataServicesMock.users.delete).toHaveBeenCalledWith(userId);

      expect(result).toBe(true);
    });

    it("should return false if the user is not deleted", async () => {
      const userId = "1";

      dataServicesMock.users.delete = jest.fn().mockResolvedValue(null);

      const result = await userUseCases.deleteUser(userId);

      expect(dataServicesMock.users.delete).toHaveBeenCalledWith(userId);

      expect(result).toBe(false);
    });
  });
});
