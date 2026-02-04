'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, ExternalLink, Heart } from 'lucide-react';
import { useConnection } from '@solana/wallet-adapter-react';

interface PaymentRecord {
  id: string;
  amount: number;
  recipient: string;
  resource: string;
  signature: string;
  timestamp: number;
  tithe: number;
}

export function PaymentHistory() {
  const { connection } = useConnection();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for hackathon - in production, fetch from API or index transactions
  useEffect(() => {
    // Simulate fetching payment history
    const mockPayments: PaymentRecord[] = [
      {
        id: '1',
        amount: 10,
        recipient: '8xH...32k',
        resource: 'API Access - Premium Tier',
        signature: '5xK...8mN',
        timestamp: Date.now() - 3600000,
        tithe: 1,
      },
      {
        id: '2',
        amount: 5,
        recipient: '3jK...9pL',
        resource: 'Content Subscription',
        signature: '7mB...4vX',
        timestamp: Date.now() - 86400000,
        tithe: 0.5,
      },
      {
        id: '3',
        amount: 25,
        recipient: '9wQ...7rT',
        resource: 'Consultation Service',
        signature: '2nC...6yZ',
        timestamp: Date.now() - 172800000,
        tithe: 2.5,
      },
    ];

    setTimeout(() => {
      setPayments(mockPayments);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getExplorerUrl = (signature: string) => {
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
  };

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <History size={24} style={{ color: '#fb923c' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Payment History</h3>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
          Loading transactions...
        </div>
      ) : payments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
          <div style={{ color: '#9ca3af' }}>No payments yet</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {payments.map((payment) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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
                    {payment.amount} USDC
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    To: {payment.recipient}
                  </div>
                </div>
                <a
                  href={getExplorerUrl(payment.signature)}
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
              
              <div style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '8px' }}>
                {payment.resource}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#fb923c' }}>
                  <Heart size={12} />
                  <span>${payment.tithe} tithe</span>
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
