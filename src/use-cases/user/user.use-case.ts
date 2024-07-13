import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { User } from "../../core/entities";
import {
  IDataServices,
  IBcryptService,
  ICircleService,
} from "../../core/abstracts";
import {
  CreateCredsIssuedDto,
  CreateUserDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from "../../core/dtos";
import { UserFactoryService } from "./user-factory.service";

import { BASE_URL } from "../../configuration";
import { IEASService } from "../../core/abstracts/eas-services.abstract";
import {
  AssetData,
  EasAttestationAssetType,
  EasAttestationTypes,
  EasAttestationUserType,
} from "../../core/entities/eas.entity";
import { CredsIssuedUseCases } from "../creds-issued/creds-issued.use-case";
import { firstValueFrom } from "rxjs";
import { Role } from "../../core/roles/role.enum";
import { Wallet } from "src/frameworks/data-services/mongo/model";

export interface WalletsResponse {
  data: {
    wallets: Wallet[];
  };
}
@Injectable()
export class UserUseCases implements OnModuleInit {
  constructor(
    private dataServices: IDataServices,
    private userFactoryService: UserFactoryService,
    private bcryptService: IBcryptService,
    private easServices: IEASService,
    private circleservice: ICircleService,
    private credsIssuedUseCases: CredsIssuedUseCases,
  ) {}
  async onModuleInit(): Promise<void> {
    setTimeout(async () => {
      const adminEmail = "chris_raczkowski@hotmail.com";
      const adminExists = await this.dataServices.users.findByAttribute(
        "email",
        adminEmail,
      );
      if (adminExists) {
        console.log("Admin already exists");
      }
      if (!adminExists) {
        const adminUserDetails: any = {
          firstName: "Admin",
          lastName: "TrustId",
          avatar: undefined,
          email: adminEmail,
          password: "trustIdAdmin123",
          gender: "male",
          phoneNumber: "22334455",
          role: Role.Admin,
          birthDate: "1999-10-10",
        };

        try {
          await this.createUser(adminUserDetails);
          console.log("Admin user created successfully");
        } catch (error) {
          console.error("Failed to create admin user:", error);
        }
      }
    }, 1000);
  }
  getAllUsers(): Promise<User[]> {
    return this.dataServices.users.getAll();
  }

  async getUserById(id: any): Promise<User> {
    // const circleWalletResponse = await firstValueFrom(
    //   await this.circleservice.executeContract(
    //     [
    //       '0x64e6f74bb7ae45b76beeef05f51c310bdbba39c6',
    //       'ipfs://QmbN3jaurunvwJxVDaL2Z8uQ7FgiTpfAnpLJxDELXoVMaE'
    //     ],
    //     'b74bcb7b-d5e8-51fa-a72b-916f7135c6e4'
    //   )
    // );
    // console.log("circleWalletResponse", circleWalletResponse)
    // return circleWalletResponse as any;
    return this.dataServices.users.get(id);
  }
  

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userExist = await this.dataServices.users.findByAttribute(
        "email",
        createUserDto.email,
      );
      if (userExist) {
        throw new UnauthorizedException("User already exist.");
      }
      createUserDto.password = await this.bcryptService.hashPassword(
        createUserDto.password,
      );
      const user = this.userFactoryService.createNewUser(createUserDto);
      const createdUser = await this.dataServices.users.create(user);
      return createdUser;
    } catch (error) {
      throw error;
    }
  }
  async createAccount(
    createUserDto: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    try {
      const userExist = await this.dataServices.users.findByAttribute(
        "email",
        createUserDto.email,
      );
      if (userExist) {
        throw new UnauthorizedException("User already exist.");
      }

      createUserDto.password = await this.bcryptService.hashPassword(
        createUserDto.password,
      );
      createUserDto.role = Role.Citizen;
      createUserDto.avatar = file
        ? `${BASE_URL}/uploads/${file.filename}`
        : null;

      const adminEmail = "chris_raczkowski@hotmail.com";
      const adminExists = await this.dataServices.users.findByAttribute(
        "email",
        adminEmail,
      );

      const circleWalletResponse: WalletsResponse = await firstValueFrom(
        await this.circleservice.createDevelopWallet(createUserDto),
      );

      console.log("circleWalletResponse", circleWalletResponse.data);

      const userWallet: Wallet[] = circleWalletResponse.data.wallets;

      const newUser = this.userFactoryService.createNewUser({
        ...createUserDto,
        wallets: userWallet,
      });
      const createdUser = await this.dataServices.users.create(newUser);

      const attestedUser = await this.appendAttestationToUser(
        createdUser["_id"],
        EasAttestationTypes.OFFCHAIN,
        EasAttestationUserType.Citizen,
        adminExists["_id"],
      );
      return attestedUser;
    } catch (error) {
      throw error;
    }
  }

  async appendAttestationToUser(
    userId: string,
    attestationType: EasAttestationTypes,
    userType: EasAttestationUserType,
    attesterId: string,
  ): Promise<User> {
    //helper Role mapping
    function mapSubRoleToRole(
      subRole: EasAttestationUserType,
    ): Role | undefined {
      switch (subRole) {
        case EasAttestationUserType.Citizen:
          return Role.Citizen;
        case EasAttestationUserType.HumanL1:
        case EasAttestationUserType.HumanL2:
        case EasAttestationUserType.HumanL3:
        case EasAttestationUserType.HumanEmail:
        case EasAttestationUserType.HumanName:
          return Role.Human;
        case EasAttestationUserType.Creator:
          return Role.Creator;
        case EasAttestationUserType.Owner:
          return Role.Owner;
        default:
          console.warn(`No mapping found for sub-role: ${subRole}`);
          return Role.Citizen;
      }
    }

    let updatedUser: User;
    const userExist = await this.dataServices.users.get(userId);
    if (!userExist) {
      throw new UnauthorizedException("User does not already exist.");
    }
    try {
      const attestationResponse = await this.easServices.createAttestation(
        attestationType,
        userExist,
        userType,
      );

      if (attestationResponse) {
        const convertedResponse = JSON.parse(
          this.stringifyBigInts(attestationResponse.attestation),
        );
        const newAttestationArr = [
          ...userExist.attestationUid,
          attestationResponse.attestation.uid,
        ] as string[];

        const attestationResp =
          await this.dataServices.attestations.create(convertedResponse);
        const newAttestionIdArr = [
          ...userExist.attestationId,
          attestationResp["_id"],
        ];
        const newAttestionUrlArr = [
          ...userExist.attestationUrl,
          attestationResponse.url,
        ];
        const inputCredsIssued: CreateCredsIssuedDto = {
          attestationUrl: attestationResponse.url,
          userId: userExist["_id"],
          attestationId: attestationResp["_id"],
          requestedCredsRole: mapSubRoleToRole(userType),
          requestedCredsType: userType,
          isRevoked: false,
          attestationUid: attestationResponse.attestation.uid,
          attesterId: attesterId,
        };
        const creadsIssued = await this.credsIssuedUseCases.createCredsIssued(inputCredsIssued);
        console.log(creadsIssued)
        updatedUser = await this.updateUser(
          userId,
          {
            ...userExist,
            role: mapSubRoleToRole(userType),
            subRole: userType,
            attestationUid: newAttestationArr,
            attestationId: newAttestionIdArr,
            attestationUrl: newAttestionUrlArr,
          },
          undefined,
        );
        
      }
      return updatedUser;
    } catch (error) {
      console.error(
        `Error appending attestation to user ${userId}: ${error.message}`,
      );
    }
  }

  private stringifyBigInts(obj: any) {
    const replacer = (key, value) => {
      // If the value is a BigInt, convert it to a string no bigint in mongodb
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    };

    return JSON.stringify(obj, replacer);
  }

  async appendAssetAttestationtoUser(
    userId: string,
    attesterId: string,
    asset: AssetData,
  ) {
    let updatedUser: User;
    const userExist = await this.dataServices.users.get(userId);
    if (!userExist) {
      throw new UnauthorizedException("User does not already exist.");
    }

    try {
      const attestationResponse = await this.easServices.createAssetAttestation(
        EasAttestationTypes.OFFCHAIN,
        asset,
        EasAttestationAssetType.Asset,
      );
      console.log("attestationResponse", attestationResponse);

      if (attestationResponse) {
        const convertedResponse = JSON.parse(
          this.stringifyBigInts(attestationResponse.attestation),
        );
        const newAssetAttestationArr = [
          ...userExist.assetAttestationUid,
          attestationResponse.attestation.uid,
        ] as string[];

        const attestationResp =
          await this.dataServices.attestations.create(convertedResponse);
        const newAssetAttestionIdArr = [
          ...userExist.assetAttestationId,
          attestationResp["_id"],
        ];
        const newAssetAttestionUrlArr = [
          ...userExist.assetAttestationUrl,
          attestationResponse.url,
        ];
        const fullAssetUrl =
          "https://base-sepolia.easscan.org" + attestationResponse.url;
        //const abiParameters= ["0xae4a1b0be45bf58e1f07ee093e3552047b6e8773",fullAssetUrl]
        const abiParameters = [asset.userWallet, fullAssetUrl];

        const transaction: any = await firstValueFrom(
          await this.circleservice.executeContract(
            abiParameters,
            "4bf212fd-6978-5ef5-8d1c-8fb9b50d8336",
          ),
        );
        console.log("tx", transaction.data.id);
        updatedUser = await this.updateUser(
          userId,
          {
            ...userExist,
            assetAttestationUid: newAssetAttestationArr,
            assetAttestationId: newAssetAttestionIdArr,
            assetAttestationUrl: newAssetAttestionUrlArr,
          },
          undefined,
        );
        return transaction.data;
      }
    } catch (error) {
      console.error(
        `Error appending attestation to user ${userId}: ${error.message}`,
      );
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    try {
      const userToUpdate = await this.dataServices.users.get(userId);
      if (!userToUpdate) {
        throw new NotFoundException('User not found');
      }
  
      updateUserDto.avatar = file
        ? `${BASE_URL}/uploads/${file.filename}`
        : undefined;
      const updatedUser = this.userFactoryService.updateUser(updateUserDto);
      return this.dataServices.users.update(userId, updatedUser);
    } catch (error) {
      throw error;
    }
  }
  
  async updateUserPassword(
    userId: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found.");
    }
    const isValid = await this.bcryptService.comparePassword(
      updateUserPasswordDto.currentPassword,
      user.password,
    );
    if (!isValid) {
      throw new UnauthorizedException("Invalid Password!.");
    }
    user.password = await this.bcryptService.hashPassword(
      updateUserPasswordDto.newPassword,
    );
    await this.dataServices.users.update(userId, user);
    return true;
  }
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.dataServices.users.findByAttribute("email", email);

    if (!user) throw new NotFoundException("User not found.");
    return user;
  }
  async deleteUser(id: string): Promise<boolean> {
    const user = await this.dataServices.users.delete(id);
    return user ? true : false;
  }

  async usersStats(): Promise<number> {
    return await this.dataServices.users.countByCriteria({
      role: Role.Citizen,
    });
  }
  async revokeUserAttestation(uid: string): Promise<boolean> {
    const resp = await this.easServices.revokeOffChain(uid);
    if (resp) {
      await this.credsIssuedUseCases.updateCredsIssued(uid);
    }
    return resp;
  }
}
