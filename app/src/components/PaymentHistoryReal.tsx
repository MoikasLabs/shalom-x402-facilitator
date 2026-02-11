'use client';

import { motion } from 'framer-motion';
import { History, ExternalLink, Heart, RefreshCw } from 'lucide-react';
import { useRealData } from '@/hooks/useRealData';
import { useWallet } from '@solana/wallet-adapter-react';

export function PaymentHistoryReal() {
  const { payments, isLoading, error, refresh } = useRealData();
  const { connected } = useWallet();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getExplorerUrl = (paymentId: string) => {
    // Link to the payment receipt account
    return `https://explorer.solana.com/address/${paymentId}?cluster=devnet`;
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
            Connect Wallet
          </h3>
          <p style={{ color: '#9ca3af' }}>
            Connect your wallet to view payment history
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.02)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <History size={24} style={{ color: '#fb923c' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Payment History</h3>
        </div>
        <button
          onClick={refresh}
          disabled={isLoading}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'rgba(251, 146, 60, 0.1)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
          }}
          title="Refresh history"
        >
          <RefreshCw size={18} style={{ color: '#fb923c', animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
          Loading transactions from devnet...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#ef4444' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚠️</div>
          <div>{error}</div>
        </div>
      ) : payments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
          <div style={{ color: '#9ca3af', marginBottom: '8px' }}>No payments yet</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Be the first to make a payment!
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {payments.map((payment, index) => (
            <motion.div
              key={payment.paymentId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: 'rgba(255,255,255,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {(payment.amount / 1_000_000).toFixed(2)} USDC
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    To: {truncateAddress(payment.seller.toBase58())}
                  </div>
                </div>
                <a
                  href={getExplorerUrl(payment.paymentId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    color: '#fb923c',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(251, 146, 60, 0.1)',
                  }}
                >
                  View <ExternalLink size={12} />
                </a>
              </div>
              
              <div style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '8px', fontFamily: 'monospace' }}>
                ID: {truncateAddress(payment.paymentId)}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#fb923c' }}>
                  <Heart size={12} />
                  <span>${(payment.titheAmount / 1_000_000).toFixed(2)} tithe</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {formatDate(payment.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
