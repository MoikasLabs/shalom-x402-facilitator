'use client';

import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { fetchFacilitatorState, fetchPaymentHistory, FacilitatorState, PaymentReceiptData } from '@/lib/anchor-real';

interface UseRealDataReturn {
  state: FacilitatorState | null;
  payments: PaymentReceiptData[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useRealData(): UseRealDataReturn {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  const [state, setState] = useState<FacilitatorState | null>(null);
  const [payments, setPayments] = useState<PaymentReceiptData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch both in parallel
      const [facilitatorState, paymentHistory] = await Promise.all([
        fetchFacilitatorState(connection, wallet),
        fetchPaymentHistory(connection, wallet),
      ]);

      setState(facilitatorState);
      setPayments(paymentHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [connection, wallet.connected, wallet.publicKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh every 10 seconds when connected
  useEffect(() => {
    if (!wallet.connected) return;
    
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData, wallet.connected]);

  return {
    state,
    payments,
    isLoading,
    error,
    refresh: fetchData,
  };
}