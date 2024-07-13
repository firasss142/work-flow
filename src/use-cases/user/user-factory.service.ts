import { Injectable } from "@nestjs/common";
import { User } from "../../core/entities";
import { CreateUserDto, UpdateUserDto } from "../../core/dtos";

@Injectable()
export class UserFactoryService {
  createNewUser(createUserDto: CreateUserDto) {
    const newUser = new User();
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;
    newUser.role = createUserDto.role;
    newUser.birthDate = createUserDto.birthDate;
    newUser.gender = createUserDto.gender;
    newUser.phoneNumber = createUserDto.phoneNumber;
    newUser.avatar = createUserDto.avatar;
    newUser.wallets = createUserDto.wallets;
    return newUser;
  }

  updateUser(updateUserDto: UpdateUserDto) {
    const updatedUser = new User();
    updatedUser.firstName = updateUserDto.firstName;
    updatedUser.lastName = updateUserDto.lastName;
    updatedUser.birthDate = updateUserDto.birthDate;
    updatedUser.gender = updateUserDto.gender;
    updatedUser.attestationUid = updateUserDto.attestationUid;
    updatedUser.attestationId = updateUserDto.attestationId;
    updatedUser.attestationUrl = updateUserDto.attestationUrl;
    updatedUser.assetAttestationUid = updateUserDto.assetAttestationUid;
    updatedUser.assetAttestationId = updateUserDto.assetAttestationId;
    updatedUser.assetAttestationUrl = updateUserDto.assetAttestationUrl;
    updatedUser.role = updateUserDto.role;
    updatedUser.phoneNumber = updateUserDto.phoneNumber;
    updatedUser.avatar = updateUserDto.avatar;
    updatedUser.updatedAt = new Date();

    return updatedUser;
  }
}
