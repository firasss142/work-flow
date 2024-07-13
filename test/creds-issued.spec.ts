import { CredsIssuedUseCases } from "src/use-cases/creds-issued/creds-issued.use-case";
import { CreateCredsIssuedDto, EasAttestationUserType } from "src/core";
import { CredsIssued } from "src/core";
import { Role } from "src/core/roles/role.enum";
describe("CredsIssuedUseCases", () => {
  let credsIssuedUseCases: CredsIssuedUseCases;
  let dataServicesMock: any;
  let credsIssuedFactoryServiceMock: any;
  let findCredsIssuedByRoleMock: jest.Mock;

  beforeEach(() => {
    findCredsIssuedByRoleMock = jest.fn();

    dataServicesMock = {
      credsIssued: {
        create: jest.fn(),
        get: jest.fn(),
        getAll: jest.fn(),
        findAllByAttribute: jest.fn(),
      },
      users: {
        create: jest.fn(),
        get: jest.fn(),
      },
    };
    credsIssuedFactoryServiceMock = {
      createCredsRequest: jest.fn(),
    };

    credsIssuedUseCases = new CredsIssuedUseCases(
      dataServicesMock,
      credsIssuedFactoryServiceMock,
    );
  });
  describe("createCredsIssued", () => {
    it("should create creds issued", async () => {
      const createCredsIssuedDto: CreateCredsIssuedDto = {
        userId: "userId",
        attesterId: "attesterId",
        attestationUrl: "url",
        requestedCredsType: EasAttestationUserType.Citizen,
        requestedCredsRole: "role",
        attestationId: "attestationId",
        attestationUid: "attestationUid",
        isRevoked: false,
      };
      const credsIssued: CredsIssued = {
        userId: "userId",
        attesterId: "attesterId",
        credsRequestedType: "type",
        credsRequestedRole: "role",
        attestationUrl: "url",
        attestationId: "attestationId",
        attestationUid: "attestationUid",
        isRevoked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      credsIssuedFactoryServiceMock.createCredsRequest.mockReturnValue(
        credsIssued,
      );
      dataServicesMock.credsIssued.create.mockResolvedValue(credsIssued);

      const result =
        await credsIssuedUseCases.createCredsIssued(createCredsIssuedDto);

      expect(
        credsIssuedFactoryServiceMock.createCredsRequest,
      ).toHaveBeenCalledWith(createCredsIssuedDto);
      expect(dataServicesMock.credsIssued.create).toHaveBeenCalledWith(
        credsIssued,
      );
      expect(result).toEqual(credsIssued);
    });

    it("should throw error if creation fails", async () => {
      const createCredsIssuedDto: CreateCredsIssuedDto = {
        userId: "userId",
        attesterId: "attesterId",
        attestationUrl: "url",
        requestedCredsType: EasAttestationUserType.Citizen,
        requestedCredsRole: "role",
        attestationId: "attestationId",
        attestationUid: "attestationUid",
        isRevoked: false,
      };
      const error = new Error("Creation failed");
      credsIssuedFactoryServiceMock.createCredsRequest.mockReturnValue({});
      dataServicesMock.credsIssued.create.mockRejectedValue(error);

      await expect(
        credsIssuedUseCases.createCredsIssued(createCredsIssuedDto),
      ).rejects.toThrow(error);
    });
  });

  describe("getAllCredsIssued", () => {
    it("should return all issued creds for admin user", async () => {
      const userId = "adminUserId";
      const adminUser = { _id: "adminUserId", role: Role.Admin };
      const allIssuedCreds: CredsIssued[] = [];

      dataServicesMock.users.get.mockResolvedValue(adminUser);
      credsIssuedUseCases.getAllIssuedCreds = jest
        .fn()
        .mockResolvedValue(allIssuedCreds);

      const result = await credsIssuedUseCases.getAllCredsIssued(userId);

      expect(dataServicesMock.users.get).toHaveBeenCalledWith(userId);
      expect(credsIssuedUseCases.getAllIssuedCreds).toHaveBeenCalled();
      expect(result).toEqual(allIssuedCreds);
    });

    it("should return personal issued creds for non-admin user", async () => {
      const userId = "nonAdminUserId";
      const nonAdminUser = { _id: "nonAdminUserId", role: Role.Citizen };
      const personalIssuedCreds: CredsIssued[] = [];

      dataServicesMock.users.get.mockResolvedValue(nonAdminUser);
      credsIssuedUseCases.getAllIssuedCredsPersonal = jest
        .fn()
        .mockResolvedValue(personalIssuedCreds);

      const result = await credsIssuedUseCases.getAllCredsIssued(userId);

      expect(dataServicesMock.users.get).toHaveBeenCalledWith(userId);
      expect(
        credsIssuedUseCases.getAllIssuedCredsPersonal,
      ).toHaveBeenCalledWith(nonAdminUser._id);
      expect(result).toEqual(personalIssuedCreds);
    });
  });
  describe("getCredsIssuedBasedOnTime", () => {
    it("should return issued creds count based on time for admin user", async () => {
      const userId = "adminUserId";
      const adminUser = { _id: "adminUserId", role: Role.Admin };
      const issuedCredsCountByTime = {};

      dataServicesMock.users.get.mockResolvedValue(adminUser);
      credsIssuedUseCases.getAllIssuedCredsCountByTime = jest
        .fn()
        .mockResolvedValue(issuedCredsCountByTime);

      const result =
        await credsIssuedUseCases.getCredsIssuedBasedOnTime(userId);

      expect(dataServicesMock.users.get).toHaveBeenCalledWith(userId);
      expect(
        credsIssuedUseCases.getAllIssuedCredsCountByTime,
      ).toHaveBeenCalled();
      expect(result).toEqual(issuedCredsCountByTime);
    });

    it("should return personal issued creds count based on time for non-admin user", async () => {
      const userId = "nonAdminUserId";
      const nonAdminUser = { _id: "nonAdminUserId", role: Role.Citizen };
      const personalIssuedCredsCountByTime = {};

      dataServicesMock.users.get.mockResolvedValue(nonAdminUser);
      credsIssuedUseCases.getAllIssuedCredsCountByTimePersonal = jest
        .fn()
        .mockResolvedValue(personalIssuedCredsCountByTime);

      const result =
        await credsIssuedUseCases.getCredsIssuedBasedOnTime(userId);

      expect(dataServicesMock.users.get).toHaveBeenCalledWith(userId);
      expect(
        credsIssuedUseCases.getAllIssuedCredsCountByTimePersonal,
      ).toHaveBeenCalledWith(nonAdminUser._id);
      expect(result).toEqual(personalIssuedCredsCountByTime);
    });
  });

  describe("getCredsIssuedBasedOnRole", () => {
    it("should return creds issued based on role for admin user", async () => {
      const userId = "adminUserId";
      const adminUser = { _id: "adminUserId", role: Role.Admin };

      dataServicesMock.users.get.mockResolvedValue(adminUser);
      credsIssuedUseCases.findCredsIssuedByRole =
        findCredsIssuedByRoleMock.mockResolvedValue([]);

      const result =
        await credsIssuedUseCases.getCredsIssuedBasedOnRole(userId);

      expect(dataServicesMock.users.get).toHaveBeenCalledWith(userId);
      expect(credsIssuedUseCases.findCredsIssuedByRole).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should return personal creds issued based on role for non-admin user", async () => {
      const userId = "nonAdminUserId";
      const nonAdminUser = { _id: "nonAdminUserId", role: Role.Citizen };

      dataServicesMock.users.get.mockResolvedValue(nonAdminUser);
      credsIssuedUseCases.findCredsIssuedByRolePersonal =
        findCredsIssuedByRoleMock.mockResolvedValue([]);

      const result =
        await credsIssuedUseCases.getCredsIssuedBasedOnRole(userId);

      expect(dataServicesMock.users.get).toHaveBeenCalledWith(userId);
      expect(
        credsIssuedUseCases.findCredsIssuedByRolePersonal,
      ).toHaveBeenCalledWith(nonAdminUser._id);
      expect(result).toEqual([]);
    });
  });

  describe("findCredsIssuedByRole", () => {
    it("should return count of creds issued by role", async () => {
      const now = +new Date();
      const oneDay = 24 * 60 * 60 * 1000;
      const credsIssuedByRole = {
        Citizen: [
          { createdAt: new Date(now - oneDay * 6) },
          { createdAt: new Date(now - oneDay * 8) },
        ],
        Human: [
          { createdAt: new Date(now - oneDay * 3) },
          { createdAt: new Date(now - oneDay * 5) },
        ],
        Creator: [
          { createdAt: new Date(now - oneDay * 4) },
          { createdAt: new Date(now - oneDay * 9) },
        ],
        Owner: [],
        Asset: [
          { createdAt: new Date(now - oneDay * 2) },
          { createdAt: new Date(now - oneDay * 11) },
        ],
      };

      const expected = {
        Citizen: 1,
        Human: 2,
        Creator: 1,
        Owner: 0,
        Asset: 1,
      };

      for (const [role, creds] of Object.entries(credsIssuedByRole)) {
        dataServicesMock.credsIssued.findAllByAttribute.mockResolvedValueOnce(
          creds,
        );
      }

      const result = await credsIssuedUseCases.findCredsIssuedByRole();

      expect(
        dataServicesMock.credsIssued.findAllByAttribute,
      ).toHaveBeenCalledTimes(5);
      expect(result).toEqual(expected);
    });
  });
  describe("findCredsIssuedByRolePersonal", () => {
    it("should return count of personal creds issued by role", async () => {
      const userId = "user123";
      const personalCreds = [
        { createdAt: new Date(), credsRequestedRole: Role.Citizen },
        { createdAt: new Date(), credsRequestedRole: Role.Human },
        { createdAt: new Date(), credsRequestedRole: Role.Creator },
        { createdAt: new Date(), credsRequestedRole: Role.Owner },
        { createdAt: new Date(), credsRequestedRole: Role.Asset },
      ];

      const expected = {
        Citizen: 1,
        Human: 1,
        Creator: 1,
        Owner: 1,
        Asset: 1,
      };

      dataServicesMock.credsIssued.findAllByAttribute.mockResolvedValue(
        personalCreds,
      );

      const result =
        await credsIssuedUseCases.findCredsIssuedByRolePersonal(userId);

      expect(
        dataServicesMock.credsIssued.findAllByAttribute,
      ).toHaveBeenCalledWith("userId", userId);
      expect(result).toEqual(expected);
    });
  });
});
