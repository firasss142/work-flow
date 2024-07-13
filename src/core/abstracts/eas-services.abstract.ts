import { User } from "../entities";
import {
  AssetData,
  EasAttestationAssetType,
  EasAttestationTypes,
  EasAttestationUserType,
} from "../entities/eas.entity";

export abstract class IEASService {
  abstract createAttestation(
    type: EasAttestationTypes,
    user: User,
    easAttestationUserType: EasAttestationUserType,
  ): Promise<any>;
  abstract createAssetAttestation(
    type: EasAttestationTypes,
    asset: AssetData,
    easAttestationAssetType: EasAttestationAssetType,
  ): Promise<any>;
  abstract revokeOffChain(uid: string): Promise<boolean>;
}
