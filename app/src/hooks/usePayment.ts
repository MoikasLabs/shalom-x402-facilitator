'use client';

import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { 
  executeX402Payment, 
  validatePaymentAmount,
  calculatePaymentSplit,
  createPaymentProofHeader,
  getUSDCBalance,
} from '@/lib/x402';
import type { PaymentRequest, PaymentResponse, PaymentStatus } from '@/types';

export function usePayment() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  
  const [status, setStatus] = useState<PaymentStatus>({ status: 'idle' });

  const initiatePayment = useCallback(async (
    request: PaymentRequest
  ): Promise<PaymentResponse> => {
    if (!publicKey || !signTransaction) {
      return { 
        success: false, 
        error: 'Wallet not connected' 
      };
    }

    // Validate amount
    const validation = validatePaymentAmount(request.amount);
    if (!validation.valid) {
      return { 
        success: false, 
        error: validation.error 
      };
    }

    setStatus({ status: 'processing', message: 'Processing payment...' });

    try {
      // Check USDC balance
      const usdcBalance = await getUSDCBalance(connection, publicKey);
      
      if (usdcBalance < request.amount) {
        setStatus({ 
          status: 'error', 
          error: `Insufficient USDC balance. You have ${usdcBalance.toFixed(2)} USDC` 
        });
        return { 
          success: false, 
          error: 'Insufficient USDC balance' 
        };
      }

      // Calculate amounts (convert to USDC smallest units: 6 decimals)
      const amountInMicros = Math.floor(request.amount * 1_000_000);
      const { recipientAmount, titheAmount } = calculatePaymentSplit(amountInMicros);

      setStatus({ status: 'processing', message: 'Signing transaction...' });

      // Execute payment
      const result = await executeX402Payment(
        connection,
        publicKey,
        async (tx: Transaction) => {
          if (!signTransaction) {
            throw new Error('No signTransaction available');
          }
          return await signTransaction(tx);
        },
        {
          amount: amountInMicros,
          recipient: request.recipient,
          resource: request.resource,
          description: request.description || `Payment for ${request.resource}`,
        }
      );

      if (result.success && result.signature) {
        setStatus({ 
          status: 'success', 
          signature: result.signature,
          message: 'Payment successful!' 
        });

        return {
          success: true,
          signature: result.signature,
          titheAmount: titheAmount / 1_000_000,
          recipientAmount: recipientAmount / 1_000_000,
        };
      } else {
        setStatus({ 
          status: 'error', 
          error: result.error || 'Payment failed' 
        });
        return { 
          success: false, 
          error: result.error || 'Payment failed' 
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus({ 
        status: 'error', 
        error: errorMessage 
      });
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, [publicKey, signTransaction, connection]);

  const resetStatus = useCallback(() => {
    setStatus({ status: 'idle' });
  }, []);

  return {
    status,
    initiatePayment,
    resetStatus,
    isProcessing: status.status === 'processing',
    isSuccess: status.status === 'success',
    isError: status.status === 'error',
  };
}

/**
 * Hook for checking payment requirements (402 handling)
 */
export function useX402Payment() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [isChecking, setIsChecking] = useState(false);

  const checkPaymentRequired = useCallback(async (
    resourceUrl: string
  ): Promise<{
    required: boolean;
    details?: {
      maxAmount: number;
      resource: string;
      description?: string;
    };
    error?: string;
  }> => {
    setIsChecking(true);
    try {
      // In a real implementation, this would make a fetch request
      // and check for 402 status with x402 header
      const response = await fetch(resourceUrl, {
        method: 'HEAD',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.status === 402) {
        const x402Header = response.headers.get('X-402-Payment-Required');
        
        if (x402Header) {
          // Parse x402 header
          // Expected format: x402 version=0 scheme=pay network=solana-maxb...
          return {
            required: true,
            details: {
              maxAmount: 1.0, // Parse from header
              resource: resourceUrl,
              description: 'Payment required for access',
            },
          };
        }
      }

      return { required: false };
    } catch (error) {
      return {
        required: false,
        error: error instanceof Error ? error.message : 'Check failed',
      };
    } finally {
      setIsChecking(false);
    }
  }, []);

  const payAndAccess = useCallback(async (
    resourceUrl: string,
    amount: number,
    recipient: string
  ): Promise<{ success: boolean; data?: any; signature?: string; error?: string }> => {
    if (!publicKey || !signTransaction) {
      return { success: false, error: 'Wallet not connected' };
    }

    try {
      // Execute payment first
      const { executeX402Payment } = await import('@/lib/x402');
      
      const result = await executeX402Payment(
        connection,
        publicKey,
        async (tx: Transaction) => {
          if (!signTransaction) throw new Error('No signer');
          return await signTransaction(tx);
        },
        {
          amount: Math.floor(amount * 1_000_000),
          recipient,
          resource: resourceUrl,
        }
      );

      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Create payment proof header
      const proofHeader = createPaymentProofHeader(result.signature!);

      // Retry request with payment proof
      const response = await fetch(resourceUrl, {
        headers: {
          'X-402-Pay': proofHeader,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          signature: result.signature,
        };
      } else {
        return {
          success: false,
          error: `Resource access failed: ${response.status}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, [publicKey, signTransaction, connection]);

  return {
    checkPaymentRequired,
    payAndAccess,
    isChecking,
  };
}
