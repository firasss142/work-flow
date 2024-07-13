import { HttpService } from "@nestjs/axios";
import { Injectable, HttpException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import * as forge from "node-forge";
import { catchError, map } from "rxjs/operators";
import { firstValueFrom } from "rxjs";
import { User } from "src/core";
import { Asset } from "../data-services/mongo/model";

@Injectable()
export class CircleService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly entitySecret: string;
  private readonly entity: any;

  constructor(private httpService: HttpService) {
    this.baseUrl = "https://api.circle.com/v1/w3s"; // Use the sandbox or live URL as per your requirement
    this.apiKey = process.env.CIRCLE_API_KEY; // Replace this with your actual Circle API key
    this.entitySecret = process.env.CIRCLE_CYPHE_SECRET;
  }
  async createDevelopWallet(userData: Partial<User>) {
    const entity = await firstValueFrom(this.getEntity());

    const cyph = this.generateEntitySecretCiphertext(
      entity["data"]["publicKey"],
    );
    const walletSetUuid = uuidv4();

    const body = {
      entitySecretCiphertext: cyph,
      idempotencyKey: walletSetUuid,
      name: "newUsers",
    };

    const walletSet = await firstValueFrom(this.createDevWalletSet(body));
    if (walletSet) {
      const url = `${this.baseUrl}/developer/wallets`;
      const walletUuid = uuidv4();
      const newCyph = this.generateEntitySecretCiphertext(
        entity["data"]["publicKey"],
      );

      const walletBody = {
        idempotencyKey: walletUuid, // Should be a unique string for each request
        accountType: "EOA",
        blockchains: ["ETH-SEPOLIA", "MATIC-AMOY"],
        metadata: [{ name: userData.firstName + "wallet" }],
        walletSetId: walletSet["data"]["walletSet"]["id"],
        entitySecretCiphertext: newCyph,
        count: 1,
      };

      return this.httpService
        .post(url, walletBody, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        })
        .pipe(
          map((response) => response.data),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        );
    }
  }
  async deploySmartContract() {}
  async finalTransaction(transactionData: any) {
    const transactionId = transactionData.txHash;
    console.log("transactionId", transactionId);
    const url = `${this.baseUrl}/transactions?txHash=${transactionId}`;
    return this.httpService
      .get(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async getTransaction(asset: Asset) {
    const transactionId = asset.transactions[0]["id"];
    console.log("transactionId", transactionId);
    const url = `${this.baseUrl}/transactions/${transactionId}`;
    return this.httpService
      .get(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }
  //     const fetch = require('node-fetch');

  // const url = 'https://api.circle.com/v1/w3s/developer/wallets';
  // const options = {
  //   method: 'POST',
  //   headers: {
  //     accept: 'application/json',
  //     'content-type': 'application/json',
  //     authorization: 'Bearer TEST_API_KEY:7baea460589eba878481aef9c707bd0c:cd5bc295d8fe3ab7f4790fd01b52dd44'
  //   }
  // };

  // fetch(url, options)
  //   .then(res => res.json())
  //   .then(json => console.log(json))
  //   .catch(err => console.error('error:' + err));
  getEntity() {
    const url = `${this.baseUrl}/config/entity/publicKey`;
    return this.httpService
      .get(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }
  generateEntitySecretCiphertext(publicKeyPem: any) {
    const entitySecretBytes = forge.util.hexToBytes(this.entitySecret);

    // Convert PEM-formatted public key to a forge-compatible format
    const publicKey: forge.pki.PublicKey =
      forge.pki.publicKeyFromPem(publicKeyPem);

    // Encrypt data
    const encryptedData: string = publicKey.encrypt(
      entitySecretBytes,
      "RSA-OAEP",
      {
        md: forge.md.sha256.create(),
        mgf1: {
          md: forge.md.sha256.create(),
        },
      },
    );
    return forge.util.encode64(encryptedData);
  }
  // Method to create a user in Circle
  createUser(userData: any) {
    const url = `${this.baseUrl}/users`;
    return this.httpService
      .post(url, userData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }
  getUser(userData: any) {
    const url = `${this.baseUrl}/users/${userData}`;
    return this.httpService
      .get(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }
  GetWallet(walletData: any, userToken: string) {
    const url = `${this.baseUrl}/wallets/${walletData}`;
    return this.httpService
      .get(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "X-User-Token": userToken,
          "Content-Type": "application/json",
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }
  createUserToken(userData: any) {
    const url = `${this.baseUrl}/users/token`;
    return this.httpService
      .post(url, userData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }
  createDevWalletSet(walletSetData: any) {
    const url = `${this.baseUrl}/developer/walletSets`;
    return this.httpService
      .post(url, walletSetData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  // Method to create a wallet for a user in Circle
  createUserWallet(userName: string, userId: string, userToken: string) {
    const url = `${this.baseUrl}/user/wallets`;
    const walletUuid = uuidv4();
    const body = {
      idempotencyKey: walletUuid, // Should be a unique string for each request
      accountType: "EOA",
      blockchains: ["ETH-SEPOLIA", "MATIC-AMOY"],
      metadata: [{ name: userName + "wallet", refId: userId }], // Adjust according to your needs
    };

    return this.httpService
      .post(url, body, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "X-User-Token": userToken,
          "Content-Type": "application/json",
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async executeContract(
    abiParameters: string[],
    walletId: string,
  ): Promise<any> {
    const entity = await firstValueFrom(this.getEntity());
    const cyph = this.generateEntitySecretCiphertext(
      entity["data"]["publicKey"],
    );
    console.log(cyph);

    const idempotencyKey = uuidv4();
    const url = `${this.baseUrl}/developer/transactions/contractExecution`;

    const data = {
      abiFunctionSignature: "mintTo(address,string)",
      abiParameters: abiParameters,
      idempotencyKey: idempotencyKey,
      contractAddress: "0xe6e79c0e988ca9def153d38736da33cb6c9b9b8d",
      feeLevel: "HIGH",
      walletId: walletId,
      entitySecretCiphertext: cyph,
    };

    console.log(data);

    return this.httpService
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      })
      .pipe(
        map((response) => {
          console.log(response);
          return response.data;
        }),
        catchError((e) => {
          console.log("e", e);
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  //  async  approve(
  //   abiParameters: string[],
  //   walletId: string,
  //  ) {

  //   const entity = await firstValueFrom(this.getEntity());
  //   const cyph = this.generateEntitySecretCiphertext(
  //     entity['data']['publicKey']
  //   );
  //   const url= `${this.baseUrl}/developer/transactions/contractExecution`;
  //   const idempotencyKey= uuidv4();

  //     const data = {
  //       abiFunctionSignature: 'approve(address,uint256)',
  //       abiParameters,
  //       idempotencyKey:idempotencyKey,
  //       contractAddress: '0x007132f1fe51eb0a66b5683ae913900a292ef321',
  //       feeLevel: 'MEDIUM',
  //       walletId,
  //       entitySecretCiphertext:cyph ,
  //     }

  //   return this.httpService
  //   .post(url, data, {
  //     headers: {
  //       Authorization: `Bearer ${this.apiKey}`,
  //       'Content-Type': 'application/json',
  //       accept: 'application/json',

  //     },
  //   })
  //   .pipe(
  //     map((response) => { console.log(response.data)
  //        return response.data}),
  //     catchError((e) => {
  //       console.log(e)
  //       throw new HttpException(e.response.data, e.response.status);
  //     })
  //   );
  // }
}
