import { PublicKey } from '@solana/web3.js';

export interface PaymentRequest {
  amount: number;
  recipient: string;
  resource: string;
  id?: string;
}

export interface PaymentResponse {
  success: boolean;
  signature?: string;
  error?: string;
  titheAmount?: number;
  recipientAmount?: number;
}

export interface X402PaymentDetails {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
}

export interface WalletState {
  connected: boolean;
  publicKey: PublicKey | null;
  balance: number | null;
  connecting: boolean;
}

export interface PaymentStatus {
  status: 'idle' | 'requesting' | 'awaiting_payment' | 'processing' | 'success' | 'error';
  message?: string;
  signature?: string;
  error?: string;
}

export interface TokenAccount {
  mint: PublicKey;
  address: PublicKey;
  balance: number;
  decimals: number;
}

export interface ImpactMetrics {
  totalPayments: number;
  totalVolume: number;
  totalTithe: number;
  beneficiaries: number;
}
