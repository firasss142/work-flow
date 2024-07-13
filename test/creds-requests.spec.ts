import { CredsRequestsUseCases } from "src/use-cases/creds-requests/creds-requests.use-case";
import { UserUseCases } from "src/use-cases/user/user.use-case";
import { CreateCredsRequestDto, CredsRequest } from "src/core";
import { CreateNotificationDto } from "src/core";
import { Role } from "src/core/roles/role.enum";

describe("CredsRequestsUseCases", () => {
  let credsRequestsUseCases: CredsRequestsUseCases;
  let dataServicesMock: any;
  let tranfertRequestsFactoryServiceMock: any;
  let notificationMock: any;
  let notificationFactoryServiceMock: any;
  let usersUseCaseMock: UserUseCases;

  beforeEach(() => {
    dataServicesMock = {
      users: {
        get: jest.fn(),
      },
      credsRequests: {
        create: jest.fn(),
        findAllByAttribute: jest.fn(),
        countByCriteria: jest.fn(),
      },
    };

    tranfertRequestsFactoryServiceMock = {
      createCredsRequest: jest.fn(),
    };

    notificationMock = {
      createNotification: jest.fn(),
    };

    notificationFactoryServiceMock = {
      createNewNotification: jest.fn(),
    };

    usersUseCaseMock = {} as UserUseCases;

    credsRequestsUseCases = new CredsRequestsUseCases(
      dataServicesMock,
      tranfertRequestsFactoryServiceMock,
      notificationMock,
      notificationFactoryServiceMock,
      usersUseCaseMock,
    );
  });
  describe("createCredsRequest", () => {
    it("should create a new creds request and notification", async () => {
      const createCredsRequestDto: CreateCredsRequestDto = {
        userId: "userId",
        requestedCredsRole: "role",
      };

      const user = {
        _id: "userId",
      };

      const newCredsRequest = {
        _doc: {
          _id: "credsRequestId",
        },
      };

      dataServicesMock.users.get.mockResolvedValue(user);
      tranfertRequestsFactoryServiceMock.createCredsRequest.mockReturnValue(
        newCredsRequest,
      );
      dataServicesMock.credsRequests.create.mockResolvedValue(newCredsRequest);

      const notificationInput: CreateNotificationDto = {
        message: "New Transfer Request Created",
        transfertRequestId: newCredsRequest._doc._id,
        recipient: "userId",
      };

      const input = {
        ...notificationInput,
      };

      notificationFactoryServiceMock.createNewNotification.mockReturnValue(
        input,
      );
      notificationMock.createNotification.mockResolvedValue(null);

      const result = await credsRequestsUseCases.createCredsRequest(
        createCredsRequestDto,
      );

      expect(dataServicesMock.users.get).toHaveBeenCalledWith(
        createCredsRequestDto.userId,
      );
      expect(
        tranfertRequestsFactoryServiceMock.createCredsRequest,
      ).toHaveBeenCalledWith(createCredsRequestDto);
      expect(dataServicesMock.credsRequests.create).toHaveBeenCalledWith(
        newCredsRequest,
      );
      expect(notificationMock.createNotification).toHaveBeenCalledWith(input);
      expect(result).toEqual(newCredsRequest);
    });
  });

  describe("getAllBasedOnRole", () => {
    it("should return all personal requests excluding approved requests", async () => {
      const userId = "userId";
      const requests: CredsRequest[] = [
        {
          userId: "userId",
          status: "Pending",
          notes: "",
          attesterId: "",
          credsRequestedType: "",
          credsRequestedRole: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
        {
          userId: "userId",
          status: "Approved",
          notes: "",
          attesterId: "",
          credsRequestedType: "",
          credsRequestedRole: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
        {
          userId: "userId",
          status: "Rejected",
          notes: "",
          attesterId: "",
          credsRequestedType: "",
          credsRequestedRole: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
      ];

      dataServicesMock.credsRequests.findAllByAttribute.mockResolvedValue(
        requests,
      );

      const result = await credsRequestsUseCases.getAllPersonalRequests(userId);

      expect(
        dataServicesMock.credsRequests.findAllByAttribute,
      ).toHaveBeenCalledWith("userId", userId);
      expect(result).toHaveLength(2);
      expect(result).not.toContainEqual(
        expect.objectContaining({ status: "Approved" }),
      );
    });
  });
  describe("getAllRequests", () => {
    it('should return all requests with status "Pending"', async () => {
      const pendingRequests: CredsRequest[] = [
        {
          userId: "userId",
          status: "Pending",
          notes: "",
          attesterId: "",
          credsRequestedType: "",
          credsRequestedRole: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
        {
          userId: "userId",
          status: "Approved",
          notes: "",
          attesterId: "",
          credsRequestedType: "",
          credsRequestedRole: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
        {
          userId: "userId",
          status: "Rejected",
          notes: "",
          attesterId: "",
          credsRequestedType: "",
          credsRequestedRole: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
      ];

      dataServicesMock.credsRequests.findAllByAttribute.mockResolvedValue(
        pendingRequests,
      );

      const result = await credsRequestsUseCases.getAllRequests();

      expect(
        dataServicesMock.credsRequests.findAllByAttribute,
      ).toHaveBeenCalledWith("status", "Pending");
      expect(result).toEqual(pendingRequests);
    });
  });

  describe("credsRequestStats", () => {
    it("should return stats for creds requests", async () => {
      const pendingRequests = 2;
      const rejectedRequests = 1;
      const approvedRequests = 3;
      const completedRequests = 4;

      dataServicesMock.credsRequests.countByCriteria.mockImplementation(
        (criteria: any) => {
          switch (criteria.status) {
            case "Pending":
              return Promise.resolve(pendingRequests);
            case "Rejected":
              return Promise.resolve(rejectedRequests);
            case "Approved":
              return Promise.resolve(approvedRequests);
            case "Completed":
              return Promise.resolve(completedRequests);
            default:
              return Promise.resolve(0);
          }
        },
      );

      const result = await credsRequestsUseCases.credsRequestStats();

      expect(result.pendingRequests).toEqual(pendingRequests);
      expect(result.rejectedRequests).toEqual(rejectedRequests);
      expect(result.approvedRequests).toEqual(approvedRequests);
      expect(result.completedRequests).toEqual(completedRequests);
      expect(result.totalRequests).toEqual(
        pendingRequests +
          rejectedRequests +
          approvedRequests +
          completedRequests,
      );
    });
  });

  describe("ownCredsRequestStats", () => {
    it("should return stats for creds requests of a specific user", async () => {
      const currentUserId = "userId";
      const pendingRequests = 2;
      const rejectedRequests = 1;
      const approvedRequests = 3;
      const completedRequests = 4;

      dataServicesMock.credsRequests.countByCriteria.mockImplementation(
        (criteria: any) => {
          if (criteria.$and) {
            const [statusCriteria, userCriteria] = criteria.$and;
            if (statusCriteria.status && userCriteria.artist) {
              switch (statusCriteria.status) {
                case "Pending":
                  return Promise.resolve(pendingRequests);
                case "Rejected":
                  return Promise.resolve(rejectedRequests);
                case "Approved":
                  return Promise.resolve(approvedRequests);
                case "Completed":
                  return Promise.resolve(completedRequests);
                default:
                  return Promise.resolve(0);
              }
            }
          }
          return Promise.resolve(0);
        },
      );

      const result =
        await credsRequestsUseCases.ownCredsRequestStats(currentUserId);

      expect(result.pendingRequests).toEqual(pendingRequests);
      expect(result.rejectedRequests).toEqual(rejectedRequests);
      expect(result.approvedRequests).toEqual(approvedRequests);
      expect(result.completedRequests).toEqual(completedRequests);
      expect(result.totalRequests).toEqual(
        pendingRequests +
          rejectedRequests +
          approvedRequests +
          completedRequests,
      );
    });
  });

  describe("getAllBasedOnRole", () => {
    it("should return all requests for admin user", async () => {
      const userId = "adminUserId";
      const adminUser = { _id: "adminUserId", role: Role.Admin };
      const allRequests: CredsRequest[] = [
        // Add example requests for admin user
      ];

      dataServicesMock.users.get.mockResolvedValue(adminUser);
      credsRequestsUseCases.getAllRequests = jest
        .fn()
        .mockResolvedValue(allRequests);

      const result = await credsRequestsUseCases.getAllBasedOnRole(userId);

      expect(dataServicesMock.users.get).toHaveBeenCalledWith(userId);
      expect(credsRequestsUseCases.getAllRequests).toHaveBeenCalled();
      expect(result).toEqual(allRequests);
    });

    it("should return personal requests for non-admin user", async () => {
      const userId = "nonAdminUserId";
      const nonAdminUser = { _id: "nonAdminUserId", role: Role.Citizen };
      const personalRequests: CredsRequest[] = [];

      dataServicesMock.users.get.mockResolvedValue(nonAdminUser);
      credsRequestsUseCases.getAllPersonalRequests = jest
        .fn()
        .mockResolvedValue(personalRequests);

      const result = await credsRequestsUseCases.getAllBasedOnRole(userId);

      expect(dataServicesMock.users.get).toHaveBeenCalledWith(userId);
      expect(credsRequestsUseCases.getAllPersonalRequests).toHaveBeenCalledWith(
        nonAdminUser._id,
      );
      expect(result).toEqual(personalRequests);
    });
  });
});
