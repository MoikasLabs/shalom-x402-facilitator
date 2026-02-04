'use client';

import { motion } from 'framer-motion';
import { Coins, Wallet } from 'lucide-react';
import { useWallet as useCustomWallet } from '@/hooks/useWallet';

export function BalanceCard() {
  const { balance, usdcBalance, isLoading } = useCustomWallet();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.02)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Wallet size={16} style={{ color: '#9ca3af' }} />
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>
            SOL Balance
          </span>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          {isLoading ? (
            <span style={{ color: '#6b7280' }}>Loading...</span>
          ) : balance !== null ? (
            `${balance.toFixed(4)} SOL`
          ) : (
            '--'
          )}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Coins size={16} style={{ color: '#fb923c' }} />
          <span style={{ fontSize: '0.75rem', color: '#fb923c', textTransform: 'uppercase' }}>
            USDC Balance
          </span>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fb923c' }}>
          {isLoading ? (
            <span style={{ color: '#6b7280' }}>Loading...</span>
          ) : usdcBalance !== null ? (
            `${usdcBalance.toFixed(2)} USDC`
          ) : (
            '--'
          )}
        </div>
      </div>
    </motion.div>
  );
}
