export class CredsRequest {
  notes: string;
  userId: any;
  attesterId: any;
  credsRequestedType: string;
  credsRequestedRole: string;
  createdAt: Date;
  status: string;
  updatedAt: Date;
  deletedAt: Date;
}
export class CredsRequestStats {
  completedRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  totalRequests: number;
}
