export enum EasAttestationTypes {
  ONCHAIN = "ONCHAIN",
  OFFCHAIN = "OFFCHAIN",
}

export enum EasAttestationUserType {
  Citizen = "Citizen",
  HumanL1 = "HumanL1",
  HumanL2 = "HumanL2",
  HumanL3 = "HumanL3",
  HumanEmail = "HumanEmail",
  Creator = "Creator",
  Owner = "Owner",
  HumanName = "HumanName",
}

export enum EasAttestationAssetType {
  Asset = "Asset",
}

class Domain {
  name: string;
  version: string;
  chainId: any;
  verifyingContract: string;
}
class Message {
  recipient: string;
  expirationTime: any;
  time: any;
  revocable: boolean;
  version: number;
  nonce?: any;
  schema: string;
  refUID: string;
  data: string;
}
class Types {
  Attest: Array<any>;
}
class Signature {
  v: number;
  r: string;
  s: string;
}

export class Attestation {
  domain: Domain;
  primaryType: string;
  message: Message;
  types: Types;
  signature: Signature;
  uid: string;
}

export type AssetData = {
  assetTypeLevel1: string; // T_S005_01: Asset type - Level 1
  creatorCred: string; // T_S005_02: Asset type - Level 2, originally bytes32
  assetName: string; // T_S005_03: Asset Name
  assetImage1Hash: string; // T_S005_04: Asset image 1 hash, originally bytes32
  assetImage2Hash: string; // T_S005_05: Asset image 2 hash, originally bytes32
  assetImage3Hash: string; // T_S005_06: Asset image 3 hash, originally bytes32
  assetCreationDate: string; // T_S005_07: Asset creation date
  assetCreationLocation: string; // T_S005_08: Asset creation location
  assetDescription: string; // T_S005_09: Asset description
  isLimitedSeries: boolean; // T_S005_10: Limited series, corrected Bool to boolean
  limitedSeriesUnitNumber: number; // T_S005_11: If limited series, unit number, corrected unit16 to number
  totalUnitsInLimitedEdition: number; // T_S005_12: If limited series, total number of units in limited edition, corrected unit16 to number
  assetProductNumber: string; // T_S005_13: Asset product number
  assetSerialNumber: string; // T_S005_14: Asset serial number
  schemaVersionNumber: string; // T_S005_15: Schema version number
  userWallet: string;
  assetOriginalHash: string;
  assetCreatorName: string;
};
