/**
 * Shalom x402 Facilitator - Real Blockchain Integration
 * Program ID: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
 * Network: Solana Devnet
 * 
 * Fetches real on-chain data from the deployed program
 */

import { 
  Connection, 
  PublicKey,
  clusterApiUrl,
} from '@solana/web3.js';

const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');
export const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

// Devnet connection with fallback
export function getConnection(): Connection {
  // Try custom devnet endpoint first, fallback to public
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
  return new Connection(endpoint, 'confirmed');
}

export interface FacilitatorState {
  authority: PublicKey;
  impactTreasury: PublicKey;
  feeBps: number;
  titheBps: number;
  totalPayments: number;
  totalVolume: number;
  bump: number;
}

export interface PaymentReceiptData {
  paymentId: string;
  amount: number;
  seller: PublicKey;
  titheAmount: number;
  feeAmount: number;
  timestamp: number;
  settled: boolean;
}

// Account discriminator for FacilitatorConfig (anchor account discriminator)
const FACILITATOR_CONFIG_DISCRIMINATOR = Buffer.from([56, 77, 8, 244, 79, 172, 181, 79]);

// Account discriminator for PaymentReceipt
const PAYMENT_RECEIPT_DISCRIMINATOR = Buffer.from([12, 44, 76, 144, 109, 222, 54, 225]);

/**
 * Deserialize FacilitatorConfig account data
 * Account structure based on the Anchor program:
 * - authority: Pubkey (32 bytes)
 * - impact_treasury: Pubkey (32 bytes)  
 * - fee_bps: u16 (2 bytes)
 * - tithe_bps: u16 (2 bytes)
 * - total_payments: u64 (8 bytes)
 * - total_volume: u64 (8 bytes)
 * - bump: u8 (1 byte)
 */
function deserializeFacilitatorConfig(data: Buffer): FacilitatorState | null {
  try {
    // Skip 8-byte discriminator
    let offset = 8;
    
    // authority: Pubkey (32 bytes)
    const authority = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    
    // impact_treasury: Pubkey (32 bytes)
    const impactTreasury = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    
    // fee_bps: u16 (2 bytes, little endian)
    const feeBps = data.readUInt16LE(offset);
    offset += 2;
    
    // tithe_bps: u16 (2 bytes, little endian)
    const titheBps = data.readUInt16LE(offset);
    offset += 2;
    
    // total_payments: u64 (8 bytes, little endian)
    const totalPayments = Number(data.readBigUInt64LE(offset));
    offset += 8;
    
    // total_volume: u64 (8 bytes, little endian)
    const totalVolume = Number(data.readBigUInt64LE(offset));
    offset += 8;
    
    // bump: u8 (1 byte)
    const bump = data.readUInt8(offset);
    
    return {
      authority,
      impactTreasury,
      feeBps,
      titheBps,
      totalPayments,
      totalVolume,
      bump,
    };
  } catch (error) {
    console.error('Failed to deserialize FacilitatorConfig:', error);
    return null;
  }
}

/**
 * Deserialize PaymentReceipt account data
 * Account structure:
 * - payment_id: String (4 bytes len + variable)
 * - amount: u64 (8 bytes)
 * - seller: Pubkey (32 bytes)
 * - buyer: Pubkey (32 bytes)
 * - tithe_amount: u64 (8 bytes)
 * - fee_amount: u64 (8 bytes)
 * - timestamp: i64 (8 bytes)
 * - settled: bool (1 byte)
 */
function deserializePaymentReceipt(data: Buffer, accountPubkey: PublicKey): PaymentReceiptData | null {
  try {
    let offset = 8; // Skip discriminator
    
    // payment_id: String (4 bytes length prefix + variable content)
    const idLength = data.readUInt32LE(offset);
    offset += 4;
    const paymentId = data.slice(offset, offset + idLength).toString('utf8');
    offset += idLength;
    
    // amount: u64
    const amount = Number(data.readBigUInt64LE(offset));
    offset += 8;
    
    // seller: Pubkey (32 bytes)
    const seller = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    
    // buyer: Pubkey (32 bytes) - skip for now
    offset += 32;
    
    // tithe_amount: u64
    const titheAmount = Number(data.readBigUInt64LE(offset));
    offset += 8;
    
    // fee_amount: u64
    const feeAmount = Number(data.readBigUInt64LE(offset));
    offset += 8;
    
    // timestamp: i64 (signed)
    const timestamp = Number(data.readBigInt64LE(offset));
    offset += 8;
    
    // settled: bool (1 byte)
    const settled = data.readUInt8(offset) === 1;
    
    return {
      paymentId,
      amount,
      seller,
      titheAmount,
      feeAmount,
      timestamp,
      settled,
    };
  } catch (error) {
    console.error('Failed to deserialize PaymentReceipt:', error);
    return null;
  }
}

/**
 * Get config PDA
 */
export function getConfigPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('config')],
    PROGRAM_ID
  );
}

/**
 * Get payment receipt PDA
 */
export function getPaymentReceiptPDA(paymentId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('payment'), Buffer.from(paymentId)],
    PROGRAM_ID
  );
}

/**
 * Get escrow authority PDA
 */
export function getEscrowAuthorityPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('escrow')],
    PROGRAM_ID
  );
}

/**
 * Fetch real facilitator state from on-chain
 */
export async function fetchFacilitatorState(
  connection: Connection,
  wallet: any
): Promise<FacilitatorState | null> {
  try {
    const [configPDA] = getConfigPDA();
    
    const accountInfo = await connection.getAccountInfo(configPDA);
    
    if (!accountInfo) {
      console.log('Facilitator config account not found at:', configPDA.toBase58());
      return null;
    }
    
    const state = deserializeFacilitatorConfig(accountInfo.data);
    
    if (state) {
      console.log('Fetched real facilitator state:', {
        totalPayments: state.totalPayments,
        totalVolume: state.totalVolume,
        titheBps: state.titheBps,
      });
    }
    
    return state;
  } catch (error) {
    console.error('Failed to fetch facilitator state:', error);
    return null;
  }
}

/**
 * Fetch all payment receipts from the program
 * Uses getProgramAccounts to find all PaymentReceipt accounts
 */
export async function fetchPaymentHistory(
  connection: Connection,
  wallet: any
): Promise<PaymentReceiptData[]> {
  try {
    // Fetch all accounts owned by the program
    const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
      filters: [
        // Filter for accounts with the PaymentReceipt discriminator
        {
          memcmp: {
            offset: 0,
            bytes: PAYMENT_RECEIPT_DISCRIMINATOR.toString('base64'),
          },
        },
      ],
    });
    
    const payments: PaymentReceiptData[] = [];
    
    for (const { pubkey, account } of accounts) {
      const payment = deserializePaymentReceipt(account.data, pubkey);
      if (payment) {
        payments.push(payment);
      }
    }
    
    // Sort by timestamp descending (newest first)
    payments.sort((a, b) => b.timestamp - a.timestamp);
    
    console.log(`Fetched ${payments.length} real payments from chain`);
    
    return payments;
  } catch (error) {
    console.error('Failed to fetch payment history:', error);
    return [];
  }
}

/**
 * Get USDC balance for a wallet
 */
export async function getUSDCBalanceReal(
  connection: Connection,
  walletPublicKey: PublicKey
): Promise<number> {
  try {
    const { getAssociatedTokenAddress, getAccount, getMint } = await import('@solana/spl-token');
    
    const tokenAccount = await getAssociatedTokenAddress(USDC_MINT, walletPublicKey);
    
    try {
      const accountInfo = await getAccount(connection, tokenAccount);
      const mintInfo = await getMint(connection, USDC_MINT);
      
      // Convert raw amount to decimal
      const balance = Number(accountInfo.amount) / Math.pow(10, mintInfo.decimals);
      return balance;
    } catch (e) {
      // Account doesn't exist
      return 0;
    }
  } catch (error) {
    console.error('Failed to get USDC balance:', error);
    return 0;
  }
}

/**
 * Check if facilitator is initialized on-chain
 */
export async function isFacilitatorInitialized(
  connection: Connection
): Promise<boolean> {
  try {
    const [configPDA] = getConfigPDA();
    const accountInfo = await connection.getAccountInfo(configPDA);
    return accountInfo !== null;
  } catch {
    return false;
  }
}

export { PROGRAM_ID };

// Re-export from x402 for convenience
export { getUSDCBalance } from './x402';
