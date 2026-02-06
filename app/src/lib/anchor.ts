/**
 * Anchor Program Integration for Shalom x402 Facilitator
 * Program ID: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
 */

import { 
  Connection, 
  PublicKey, 
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';

const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

// Program IDL - Basic structure for the x402 facilitator
const IDL = {
  version: "0.1.0",
  name: "x402_facilitator",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "facilitator",
          isMut: true,
          isSigner: true,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "platformFeeBasisPoints",
          type: "u16",
        },
        {
          name: "titheBasisPoints",
          type: "u16",
        },
      ],
    },
    {
      name: "processPayment",
      accounts: [
        {
          name: "facilitator",
          isMut: false,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "recipient",
          isMut: true,
          isSigner: false,
        },
        {
          name: "titheRecipient",
          isMut: true,
          isSigner: false,
        },
        {
          name: "platformTreasury",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "resource",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "facilitator",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "platformFeeBasisPoints",
            type: "u16",
          },
          {
            name: "titheBasisPoints",
            type: "u16",
          },
          {
            name: "totalPaymentsProcessed",
            type: "u64",
          },
          {
            name: "totalVolume",
            type: "u64",
          },
          {
            name: "totalTithes",
            type: "u64",
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "PaymentProcessed",
      fields: [
        {
          name: "payer",
          type: "publicKey",
          index: false,
        },
        {
          name: "recipient",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
        {
          name: "tithe",
          type: "u64",
          index: false,
        },
        {
          name: "platformFee",
          type: "u64",
          index: false,
        },
        {
          name: "resource",
          type: "string",
          index: false,
        },
        {
          name: "timestamp",
          type: "i64",
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidAmount",
      msg: "Amount must be greater than zero",
    },
    {
      code: 6001,
      name: "InsufficientBalance",
      msg: "Insufficient balance for payment",
    },
    {
      code: 6002,
      name: "PaymentExpired",
      msg: "Payment has expired",
    },
  ],
};

export interface FacilitatorState {
  authority: PublicKey;
  platformFeeBasisPoints: number;
  titheBasisPoints: number;
  totalPaymentsProcessed: number;
  totalVolume: number;
  totalTithes: number;
}

export interface PaymentEvent {
  payer: PublicKey;
  recipient: PublicKey;
  amount: number;
  tithe: number;
  platformFee: number;
  resource: string;
  timestamp: number;
}

/**
 * Get Anchor provider
 */
export function getProvider(connection: Connection, wallet: any): AnchorProvider | null {
  if (!wallet) return null;
  
  return new AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed' }
  );
}

/**
 * Get the program instance
 */
export function getProgram(provider: AnchorProvider): Program {
  return new Program(IDL as any, provider);
}

/**
 * Get facilitator PDA
 */
export function getFacilitatorPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('facilitator')],
    PROGRAM_ID
  );
}

/**
 * Fetch facilitator state
 */
export async function fetchFacilitatorState(
  connection: Connection,
  wallet: any
): Promise<FacilitatorState | null> {
  try {
    const provider = getProvider(connection, wallet);
    if (!provider) return null;

    const program = getProgram(provider);
    const [facilitatorPDA] = getFacilitatorPDA();
    
    const account = await (program.account as any).facilitator.fetch(facilitatorPDA);
    
    return {
      authority: account.authority,
      platformFeeBasisPoints: account.platformFeeBasisPoints,
      titheBasisPoints: account.titheBasisPoints,
      totalPaymentsProcessed: account.totalPaymentsProcessed.toNumber(),
      totalVolume: account.totalVolume.toNumber(),
      totalTithes: account.totalTithes.toNumber(),
    };
  } catch (error) {
    console.error('Failed to fetch facilitator state:', error);
    return null;
  }
}

/**
 * Process payment through Anchor program
 */
export async function processProgramPayment(
  connection: Connection,
  wallet: any,
  recipient: PublicKey,
  amount: number,
  resource: string,
  signTransaction: (tx: any) => Promise<any>
): Promise<{ success: boolean; signature?: string; error?: string }> {
  try {
    const provider = getProvider(connection, wallet);
    if (!provider) {
      return { success: false, error: 'Wallet not connected' };
    }

    const program = getProgram(provider);
    const [facilitatorPDA] = getFacilitatorPDA();

    // Get wallet public key
    const payer = wallet.publicKey || wallet.adapter?.publicKey;
    if (!payer) {
      return { success: false, error: 'No payer public key' };
    }

    // Build the instruction
    const tx = await program.methods
      .processPayment(new BN(amount), resource)
      .accounts({
        facilitator: facilitatorPDA,
        payer: payer,
        recipient: recipient,
        titheRecipient: new PublicKey('Shal0mT1the1111111111111111111111111111111'), // Placeholder
        platformTreasury: new PublicKey('Shal0mTreas11111111111111111111111111111111'), // Placeholder
        tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    // Sign and send
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer;

    const signed = await signTransaction(tx);
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    await connection.confirmTransaction(signature, 'confirmed');

    return { success: true, signature };
  } catch (error) {
    console.error('Program payment failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export { PROGRAM_ID, IDL };
