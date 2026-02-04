/**
 * x402 Payment Protocol Client
 * HTTP-native payments for Solana
 */

import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { 
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

const USDC_MINT_DEVNET = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

// Tithe percentage (10% = 1000 basis points)
const TITHE_BASIS_POINTS = 1000;

export interface X402PaymentRequest {
  amount: number; // Amount in USDC (with decimals)
  recipient: string; // Recipient public key
  resource: string; // Resource identifier
  description?: string;
}

export interface X402PaymentResult {
  success: boolean;
  signature?: string;
  error?: string;
  details?: {
    totalAmount: number;
    recipientAmount: number;
    titheAmount: number;
    recipient: string;
    resource: string;
  };
}

/**
 * Parse x402 402 Payment Required response
 */
export function parseX402Header(headerValue: string): {
  version: string;
  scheme: string;
  network: string;
  maxAmount: string;
  resource: string;
  description?: string;
} | null {
  try {
    // Expected format: x402 version=0 scheme=pay network=solana-maxb...
    const parts = headerValue.split(' ');
    const params: Record<string, string> = {};
    
    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key && value) {
        params[key] = value;
      }
    }

    if (params.version && params.scheme && params.network) {
      return {
        version: params.version,
        scheme: params.scheme,
        network: params.network,
        maxAmount: params['x-solana-max_amount'] || '0',
        resource: params['x-solana-resource'] || '',
        description: params['x-solana-description'],
      };
    }
    return null;
  } catch (e) {
    console.error('Failed to parse x402 header:', e);
    return null;
  }
}

/**
 * Calculate payment split with tithe
 */
export function calculatePaymentSplit(totalAmount: number): {
  recipientAmount: number;
  titheAmount: number;
} {
  const titheAmount = Math.floor((totalAmount * TITHE_BASIS_POINTS) / 10000);
  const recipientAmount = totalAmount - titheAmount;
  
  return {
    recipientAmount,
    titheAmount,
  };
}

/**
 * Create USDC transfer transaction
 */
export async function createUSDCTransferTransaction(
  connection: Connection,
  payer: PublicKey,
  recipient: PublicKey,
  amount: number, // Amount in USDC smallest units (6 decimals)
  mint: PublicKey = USDC_MINT_DEVNET
): Promise<Transaction> {
  try {
    // Get token accounts
    const payerTokenAccount = await getAssociatedTokenAddress(mint, payer);
    const recipientTokenAccount = await getAssociatedTokenAddress(mint, recipient);

    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      payerTokenAccount,
      recipientTokenAccount,
      payer,
      amount,
      [],
      TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction().add(transferInstruction);
    
    // Set recent blockhash and fee payer
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    return transaction;
  } catch (error) {
    console.error('Failed to create transfer transaction:', error);
    throw error;
  }
}

/**
 * Execute x402 payment
 */
export async function executeX402Payment(
  connection: Connection,
  payer: PublicKey,
  signTransaction: (tx: Transaction) => Promise<Transaction>,
  request: X402PaymentRequest
): Promise<X402PaymentResult> {
  try {
    const { recipientAmount, titheAmount } = calculatePaymentSplit(request.amount);
    
    // Create payment transaction
    const transaction = await createUSDCTransferTransaction(
      connection,
      payer,
      new PublicKey(request.recipient),
      recipientAmount
    );

    // Sign and send transaction
    const signed = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    // Confirm transaction
    await connection.confirmTransaction(signature, 'confirmed');

    return {
      success: true,
      signature,
      details: {
        totalAmount: request.amount,
        recipientAmount,
        titheAmount,
        recipient: request.recipient,
        resource: request.resource,
      },
    };
  } catch (error) {
    console.error('Payment execution failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check USDC balance
 */
export async function getUSDCBalance(
  connection: Connection,
  owner: PublicKey,
  mint: PublicKey = USDC_MINT_DEVNET
): Promise<number> {
  try {
    const tokenAccount = await getAssociatedTokenAddress(mint, owner);
    const accountInfo = await connection.getTokenAccountBalance(tokenAccount);
    return accountInfo.value.uiAmount || 0;
  } catch (error) {
    // Account doesn't exist or has no balance
    return 0;
  }
}

/**
 * Create X-402-Pay header for proof of payment
 */
export function createPaymentProofHeader(
  signature: string,
  scheme: string = 'pay',
  network: string = 'solana'
): string {
  return `x402-pay version=0 scheme=${scheme} network=${network} transaction_hash=${signature}`;
}

/**
 * Validate payment amount
 */
export function validatePaymentAmount(amount: number): {
  valid: boolean;
  error?: string;
} {
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  
  // Minimum payment: $0.01 (10000 micro USDC)
  const MIN_AMOUNT = 0.01;
  if (amount < MIN_AMOUNT) {
    return { valid: false, error: `Minimum payment is $${MIN_AMOUNT}` };
  }
  
  return { valid: true };
}

export {
  USDC_MINT_DEVNET,
  PROGRAM_ID,
  TITHE_BASIS_POINTS,
};
