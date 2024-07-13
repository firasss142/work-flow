export abstract class ICircleService {
  abstract createUser(userData: any): any;
  abstract createUserToken(userData: any): any;
  abstract createUserWallet(
    userName: string,
    userId: string,
    userToken: string,
  ): any;
  abstract finalTransaction(transactionData: any): any;
  abstract getUser(userData: any): any;
  abstract getTransaction(asset: any): any;
  abstract GetWallet(walletData: any, userToken: string): any;
  abstract createDevelopWallet(userData: any): any;
  abstract executeContract(abiParameters: string[], walletId: string): any;
  // add more abstract methods as needed
}
