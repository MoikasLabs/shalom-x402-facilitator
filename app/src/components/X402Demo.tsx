'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Lock, Unlock, ArrowRight, Loader2, CheckCircle, DollarSign } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useX402Payment } from '@/hooks/usePayment';

export function X402Demo() {
  const { connected } = useWallet();
  const { checkPaymentRequired, payAndAccess, isChecking } = useX402Payment();
  
  const [accessStatus, setAccessStatus] = useState<'locked' | 'checking' | 'paying' | 'unlocked'>('locked');
  const [resourceData, setResourceData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequestAccess = async () => {
    if (!connected) {
      setError('Please connect your wallet first');
      return;
    }

    setAccessStatus('checking');
    setError(null);

    // Simulate checking payment requirement
    setTimeout(() => {
      setAccessStatus('paying');
    }, 1000);
  };

  const handlePayForAccess = async () => {
    setAccessStatus('paying');
    
    // Simulate payment and access
    setTimeout(() => {
      setResourceData('🔓 Premium Content Access Granted!\n\nThis is protected content that required payment to access. Thanks for supporting the ecosystem!');
      setAccessStatus('unlocked');
    }, 2000);
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
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Globe size={20} style={{ color: '#60a5fa' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>x402 Protocol Demo</h3>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            HTTP-native payments in action
          </p>
        </div>
      </div>

      {/* Status Display */}
      <div
        style={{
          padding: '24px',
          marginBottom: '24px',
          borderRadius: '12px',
          backgroundColor:
            accessStatus === 'locked'
              ? 'rgba(239, 68, 68, 0.1)'
              : accessStatus === 'unlocked'
              ? 'rgba(34, 197, 94, 0.1)'
              : 'rgba(251, 146, 60, 0.1)',
          border: `1px solid ${
            accessStatus === 'locked'
              ? 'rgba(239, 68, 68, 0.3)'
              : accessStatus === 'unlocked'
              ? 'rgba(34, 197, 94, 0.3)'
              : 'rgba(251, 146, 60, 0.3)'
          }`,
          textAlign: 'center',
        }}
      >
        {accessStatus === 'locked' && (
          <>
            <Lock size={32} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
            <div style={{ fontWeight: 600, color: '#ef4444', marginBottom: '8px' }}>
              Resource Locked
            </div>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              Payment required to access premium content
            </div>
          </>
        )}

        {accessStatus === 'checking' && (
          <>
            <Loader2 size={32} style={{ color: '#fb923c', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <div style={{ fontWeight: 600, color: '#fb923c', marginBottom: '8px' }}>
              Checking Payment Requirements...
            </div>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              Server returned 402 Payment Required
            </div>
          </>
        )}

        {accessStatus === 'paying' && (
          <>
            <Loader2 size={32} style={{ color: '#fb923c', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <div style={{ fontWeight: 600, color: '#fb923c', marginBottom: '8px' }}>
              Processing Payment...
            </div>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              Creating x402 payment proof
            </div>
          </>
        )}

        {accessStatus === 'unlocked' && (
          <>
            <CheckCircle size={32} style={{ color: '#22c55e', margin: '0 auto 16px' }} />
            <div style={{ fontWeight: 600, color: '#22c55e', marginBottom: '8px' }}>
              Access Granted!
            </div>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              X-402-Pay header validated successfully
            </div>
          </>
        )}
      </div>

      {/* Resource Content */}
      {resourceData && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            padding: '20px',
            marginBottom: '24px',
            borderRadius: '12px',
            backgroundColor: 'rgba(34, 197, 94, 0.05)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap',
          }}
        >
          {resourceData}
        </motion.div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {accessStatus === 'locked' && (
          <motion.button
            onClick={handleRequestAccess}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isChecking || !connected}
            style={{
              flex: 1,
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#0a0a0f',
              background: 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: !connected ? 'not-allowed' : 'pointer',
              opacity: !connected ? 0.5 : 1,
            }}
          >
            <Unlock size={20} />
            Request Access
          </motion.button>
        )}

        {accessStatus === 'paying' && (
          <motion.button
            onClick={handlePayForAccess}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              flex: 1,
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#0a0a0f',
              background: 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            <DollarSign size={20} />
            Pay 1.00 USDC
            <ArrowRight size={20} />
          </motion.button>
        )}

        {accessStatus === 'unlocked' && (
          <motion.button
            onClick={() => {
              setAccessStatus('locked');
              setResourceData(null);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              flex: 1,
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#fff',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            <Lock size={20} />
            Reset Demo
          </motion.button>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            fontSize: '0.875rem',
            textAlign: 'center',
          }}
        >
          {error}
        </motion.div>
      )}

      {/* Info */}
      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          border: '1px solid rgba(96, 165, 250, 0.2)',
        }}
      >
        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
          <strong style={{ color: '#60a5fa' }}>How it works:</strong>
          <ol style={{ margin: '8px 0 0 16px', padding: 0 }}>
            <li>Client requests resource → Server responds 402 Payment Required</li>
            <li>Client generates X-402-Pay header with signed transaction</li>
            <li>Server validates payment → Returns requested resource</li>
          </ol>
        </div>
      </div>
    </motion.div>
  );
}
