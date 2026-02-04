'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet as useSolanaWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getUSDCBalance } from '@/lib/x402';
import type { WalletState } from '@/types';

export function useWallet() {
  const { 
    publicKey, 
    connected, 
    connecting, 
    disconnect, 
    select, 
    wallets,
    signTransaction,
  } = useSolanaWallet();
  const { connection } = useConnection();

  const [balance, setBalance] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch balances when connected
  useEffect(() => {
    if (!connected || !publicKey) {
      setBalance(null);
      setUsdcBalance(null);
      return;
    }

    const fetchBalances = async () => {
      setIsLoading(true);
      try {
        // Fetch SOL balance
        const solBalance = await connection.getBalance(publicKey);
        setBalance(solBalance / LAMPORTS_PER_SOL);

        // Fetch USDC balance
        const usdc = await getUSDCBalance(connection, publicKey);
        setUsdcBalance(usdc);
      } catch (error) {
        console.error('Failed to fetch balances:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchBalances, 10000);
    return () => clearInterval(interval);
  }, [connected, publicKey, connection]);

  const refreshBalances = useCallback(async () => {
    if (!connected || !publicKey) return;
    
    setIsLoading(true);
    try {
      const solBalance = await connection.getBalance(publicKey);
      setBalance(solBalance / LAMPORTS_PER_SOL);

      const usdc = await getUSDCBalance(connection, publicKey);
      setUsdcBalance(usdc);
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    } finally {
      setIsLoading(false);
    }
  }, [connected, publicKey, connection]);

  const walletState: WalletState = {
    connected,
    publicKey,
    balance,
    connecting,
  };

  return {
    ...walletState,
    wallet: { publicKey, connected, disconnect, select, wallets, signTransaction },
    connection,
    balance,
    usdcBalance,
    isLoading,
    refreshBalances,
    signTransaction,
  };
}
