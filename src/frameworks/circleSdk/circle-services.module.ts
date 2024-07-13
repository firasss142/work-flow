// import {
//     ApiResponse,
//     ClientConfiguration,
//     Configuration,
//     CreateUserRequest,
//     WalletAddressRequest,
//     WalletVerificationRequest,
//   } from '@circle/client';

//   class CircleClient {
//     private readonly client: ClientConfiguration;

//     constructor(apiKey: string) {
//       this.client = new ClientConfiguration({
//         apiKey,
//         baseUrl: 'https://api-sandbox.circle.com', // Replace with production URL if needed
//       });
//     }

//     async createUser(
//       firstName: string,
//       lastName: string,
//       email: string,
//       ipAddress: string
//     ): Promise<ApiResponse<any>> {
//       const endpoint = '/v1/users';
//       const data: CreateUserRequest = {
//         firstName,
//         lastName,
//         email,
//         ipAddress,
//       };

//       const response = await this.client.request(endpoint, {
//         method: 'POST',
//         data,
//       });

//       return response;
//     }

//     async createWallet(userId: string): Promise<ApiResponse<any>> {
//       // ... (same implementation as before)
//     }

//     async createWalletAddress(
//       userId: string,
//       currency: string,
//       type: string = 'standard' // Optional type parameter
//     ): Promise<ApiResponse<any>> {
//       const endpoint = '/v1/users/{userId}/wallets/addresses';
//       const pathParams = { userId };
//       const data: WalletAddressRequest = {
//         currency,
//         type, // Adjust for optional parameter usage
//       };

//       const response = await this.client.request(endpoint, {
//         pathParams,
//         method: 'POST',
//         data,
//       });

//       return response;
//     }

//     async verifyWalletAddress(
//       userId: string,
//       addressId: string,
//       code: string
//     ): Promise<ApiResponse<any>> {
//       const endpoint = '/v1/users/{userId}/wallets/addresses/{addressId}/verification';
//       const pathParams = { userId, addressId };
//       const data: WalletVerificationRequest = {
//         code,
//       };

//       const response = await this.client.request(endpoint, {
//         pathParams,
//         method: 'POST',
//         data,
//       });

//       return response;
//     }

//   }
