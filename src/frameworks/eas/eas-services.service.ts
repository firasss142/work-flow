import { firstValueFrom } from 'rxjs';
import { IEASService } from '../../core/abstracts/eas-services.abstract';
import { catchError, map } from 'rxjs/operators';

import { ethers, toBigInt } from 'ethers';
import {
  EAS,
  SchemaEncoder,
  createOffchainURL,
  AttestationShareablePackageObject,
} from '@ethereum-attestation-service/eas-sdk';
import { EAS_CONTRACT_ADDRESS, PROVIDER, SIGNER } from 'src/configuration';
import {
  AssetData,
  EasAttestationAssetType,
  EasAttestationTypes,
  EasAttestationUserType,
} from 'src/core/entities/eas.entity';
import { User } from 'src/core';
import { easAssetSchemas, easUserSchemas } from 'src/configuration/eas-schemas';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
export type StoreAttestationRequest = { filename: string; textJson: string };

@Injectable()
export class EASService implements IEASService {
  private readonly easContractAddress: string = EAS_CONTRACT_ADDRESS;
  private readonly provider: string =
    PROVIDER === ''
      ? 'https://sepolia.infura.io/v3/d2f0919eab97459ba8a4e89bddf42784'
      : PROVIDER;
  private readonly signer: string = SIGNER;

  constructor(private httpService: HttpService) {}
  async createAttestation(
    type: EasAttestationTypes,
    user: User,
    easAttestationUserType: EasAttestationUserType
  ): Promise<any> {
    try {
      if (type === EasAttestationTypes.ONCHAIN) {
        const provider = new ethers.JsonRpcProvider(this.provider);
        const signer = new ethers.Wallet(this.signer, provider);
        const eas = new EAS(this.easContractAddress, {
          signer,
        });
        await eas.connect(signer);

        const overrides = {
          gasLimit: ethers.parseUnits('200000', 'wei'), // Adjusted based on your contract's complexity
          gasPrice: ethers.parseUnits('50', 'gwei'), // Increased slightly for faster processing
        };

        const tx = await eas.attest(
          {
            schema:
              '0x4ebeac3426ea288dbaedae2d43b05fbb9f81326a2323d33481f2e9153847eab7',
            data: {
              refUID:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              recipient: '0x0000000000000000000000000000000000000000',
              expirationTime: 0 as unknown as bigint,
              revocable: true,
              data: '0x5468697320697320612074657374206d657373616765',
              // value: 40 as unknown as bigint,
            },
          },
          overrides
        );
        const receipt = await tx.wait();
        console.log(receipt);
        return receipt;
      } else if (type === EasAttestationTypes.OFFCHAIN) {
        const schemaToUse = easUserSchemas(
          user.email,
          user.firstName,
          user.firstName,
          user.lastName
        )[easAttestationUserType];
        // Initialize SchemaEncoder with the schema string
        const schemaEncoder = new SchemaEncoder(schemaToUse.schemaEncoded);
        const encodedData = schemaEncoder.encodeData(schemaToUse.encodedSchema);
        const provider = ethers.getDefaultProvider('https://sepolia.base.org');

        const signer = new ethers.Wallet(this.signer, provider);
        const eas = new EAS(this.easContractAddress, {
          signer,
        });
        await eas.connect(signer);
        const offchain = await eas.getOffchain();

        const timestampInMilliseconds = +new Date();
        const timestampInSeconds =
          BigInt(timestampInMilliseconds) / BigInt(1000);

        const offchainAttestation = await offchain.signOffchainAttestation(
          {
            recipient: '0x0263AC7DD307Ab5EE1C963B8e0d627DD350fcf7B',
            // Unix timestamp of when attestation expires. (0 for no expiration)
            expirationTime: toBigInt(schemaToUse.expire) as unknown as bigint,
            // Unix timestamp of current time
            time: timestampInSeconds as unknown as bigint,
            revocable: true, // Be aware that if your schema is not revocable, this MUST be false
            nonce: 0 as unknown as bigint,
            schema: schemaToUse.schema_uid,
            refUID: schemaToUse.refUID,
            data: encodedData,
          },
          signer
        );
        const url = createOffchainURL({
          sig: offchainAttestation,
          signer: signer.address,
        });

        function bigIntReplacer(_key: string, value: any): any {
          return typeof value === 'bigint' ? value.toString() : value;
        }

        const trx = await eas.timestamp(offchainAttestation.uid);
        const trxResponse = await trx.wait();

        const data: StoreAttestationRequest = {
          filename: `eas.txt`,
          textJson: JSON.stringify(
            {
              sig: offchainAttestation,
              signer: signer.address,
            },
            bigIntReplacer
          ),
        };

        const indexedAttestation = await firstValueFrom(
          await this.httpService
            .post(`https://base-sepolia.easscan.org/offchain/store`, data)
            .pipe(
              map((response) => response.data),
              catchError((e) => {
                console.log(e.response.data);
                throw new HttpException(e.response.data, e.response.status);
              })
            )
        );

        console.log('trxResponse', indexedAttestation);
        return {
          attestation: offchainAttestation,
          url: url,
          timeStamp: trxResponse,
        };
      }
    } catch (err) {
      console.error(err);
      return '';
    }
  }
  async createAssetAttestation(
    type: EasAttestationTypes,
    asset: AssetData,
    easAttestationAssetType: EasAttestationAssetType
  ): Promise<any> {
    try {
      if (type === EasAttestationTypes.ONCHAIN) {
        const provider = new ethers.JsonRpcProvider(this.provider);
        const signer = new ethers.Wallet(this.signer, provider);
        const eas = new EAS(this.easContractAddress, {
          signer,
        });
        await eas.connect(signer);

        const overrides = {
          gasLimit: ethers.parseUnits('200000', 'wei'), // Adjusted based on your contract's complexity
          gasPrice: ethers.parseUnits('50', 'gwei'), // Increased slightly for faster processing
        };

        const tx = await eas.attest(
          {
            schema:
              '0x4ebeac3426ea288dbaedae2d43b05fbb9f81326a2323d33481f2e9153847eab7',
            data: {
              refUID:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              recipient: '0x0000000000000000000000000000000000000000',
              expirationTime: 0 as unknown as bigint,
              revocable: true,
              data: '0x5468697320697320612074657374206d657373616765',
              // value: 40 as unknown as bigint,
            },
          },
          overrides
        );
        const receipt = await tx.wait();
        console.log(receipt);
        return receipt;
      } else if (type === EasAttestationTypes.OFFCHAIN) {
        const schemaToUse = easAssetSchemas(asset)[easAttestationAssetType];
        // Initialize SchemaEncoder with the schema string
        const schemaEncoder = new SchemaEncoder(schemaToUse.schemaEncoded);
        const encodedData = schemaEncoder.encodeData(schemaToUse.encodedSchema);
        const provider = ethers.getDefaultProvider('https://sepolia.base.org');

        console.log('1', provider);
        const signer = new ethers.Wallet(this.signer, provider);
        const eas = new EAS(this.easContractAddress, {
          signer,
        });
        await eas.connect(signer);
        const offchain = await eas.getOffchain();
        const timestampInMilliseconds = +new Date();
        const timestampInSeconds =
          BigInt(timestampInMilliseconds) / BigInt(1000);

        const offchainAttestation = await offchain.signOffchainAttestation(
          {
            recipient: '0x0263AC7DD307Ab5EE1C963B8e0d627DD350fcf7B',
            // Unix timestamp of when attestation expires. (0 for no expiration)
            expirationTime: toBigInt(schemaToUse.expire) as unknown as bigint,
            // Unix timestamp of current time
            time: timestampInSeconds as unknown as bigint,
            revocable: true, // Be aware that if your schema is not revocable, this MUST be false
            nonce: 0 as unknown as bigint,
            schema: schemaToUse.schema_uid,
            refUID: schemaToUse.refUID,
            data: encodedData,
          },
          signer
        );

        const url = createOffchainURL({
          sig: offchainAttestation,
          signer: signer.address,
        });
        const trx = await eas.timestamp(offchainAttestation.uid);
        const trxResponse = await trx.wait();
        function bigIntReplacer(_key: string, value: any): any {
          return typeof value === 'bigint' ? value.toString() : value;
        }

        const data: StoreAttestationRequest = {
          filename: `eas.txt`,
          textJson: JSON.stringify(
            {
              sig: offchainAttestation,
              signer: signer.address,
            },
            bigIntReplacer
          ),
        };

        const IndexedAttestation = await firstValueFrom(
          await this.httpService
            .post(`https://base-sepolia.easscan.org/offchain/store`, data)
            .pipe(
              map((response) => response.data),
              catchError((e) => {
                console.log(e.response.data);
                throw new HttpException(e.response.data, e.response.status);
              })
            )
        );

        console.log('trxResponse', IndexedAttestation);
        return {
          attestation: offchainAttestation,
          url: url,
          timeStamp: trxResponse,
        };
      }
    } catch (err) {
      console.error(err);
      return '';
    }
  }
  async revokeOffChain(uid: string): Promise<boolean> {
    const provider = ethers.getDefaultProvider('https://sepolia.base.org');

    const signer = new ethers.Wallet(this.signer, provider);
    const eas = new EAS(this.easContractAddress, {
      signer,
    });
    try {
      await eas.connect(signer);
      const offchainRevoke = await eas.revokeOffchain(uid);
      return offchainRevoke ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
