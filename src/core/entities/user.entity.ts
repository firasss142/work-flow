import { Wallet } from "src/frameworks/data-services/mongo/model";
import { Role } from "../roles/role.enum";
import { EasAttestationUserType } from "./eas.entity";

// TODO: Adapt attestation table
// type AttestationUser ={
//   uuid: string;
//   id: string;
//   url: string;
// }

// type CreateDevelopWallet = {
//   id: string;
//   state: string;
//   walletSetId: string;
//   custodyType:  string;
//   refId: string;
//   name: string;
//   address: string;
//   blockchain: string;
//   accountType: string;
// }
export class User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  subRole: EasAttestationUserType;
  birthDate: string;
  avatar: string;
  gender: string;
  phoneNumber: string;
  twoFactorCode: string;
  twoFactorExpiration: Date;
  attestationUid: string[];
  attestationId: string[];
  attestationUrl: string[];
  assetAttestationUid: string[];
  assetAttestationId: string[];
  assetAttestationUrl: string[];
  wallets: Wallet[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
