// Bid-related types

export type BidStatus = 'pending' | 'accepted' | 'rejected';

export interface Bid {
  id: number;
  projectId: number;
  userId: number;
  amount: number;
  deliveryTime: number; // delivery time in days
  message?: string;
  status: BidStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BidPayload {
  projectId: number;
  amount: number;
  deliveryTime: number;
  message?: string;
}

export interface BidResponse {
  bid: Bid;
}

export type BidApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
