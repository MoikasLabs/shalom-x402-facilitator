'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle, AlertCircle, Heart } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePayment } from '@/hooks/usePayment';
import { calculatePaymentSplit } from '@/lib/x402';

export function PaymentForm() {
  const { connected } = useWallet();
  const { initiatePayment, status, resetStatus, isProcessing } = usePayment();
  
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [resource, setResource] = useState('');
  const [showTitheBreakdown, setShowTitheBreakdown] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,6}$/.test(value)) {
      setAmount(value);
      setShowTitheBreakdown(parseFloat(value) > 0);
      if (status.status !== 'idle') resetStatus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !recipient || !resource) return;

    const result = await initiatePayment({
      amount: parseFloat(amount),
      recipient,
      resource,
    });

    if (result.success) {
      // Reset form after success
      setTimeout(() => {
        setAmount('');
        setRecipient('');
        setResource('');
        setShowTitheBreakdown(false);
        resetStatus();
      }, 5000);
    }
  };

  // Calculate tithe breakdown
  const titheBreakdown = amount ? calculatePaymentSplit(parseFloat(amount) * 1_000_000) : null;
  const recipientAmount = titheBreakdown ? (titheBreakdown.recipientAmount / 1_000_000).toFixed(2) : '0';
  const titheAmount = titheBreakdown ? (titheBreakdown.titheAmount / 1_000_000).toFixed(2) : '0';

  if (!connected) {
    return (
      <div
        style={{
          padding: '48px',
          textAlign: 'center',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
          Connect Wallet First
        </h3>
        <p style={{ color: '#9ca3af' }}>
          Please connect your Solana wallet to make payments
        </p>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.02)',
      }}
    >
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>
        Make a Payment
      </h3>

      {/* Amount Input */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: '8px',
            color: '#d1d5db',
          }}
        >
          Amount (USDC)
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '14px 16px',
              paddingRight: '60px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
          <span
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#fb923c',
              fontWeight: 600,
            }}
          >
            USDC
          </span>
        </div>
      </div>

      {/* Recipient Input */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: '8px',
            color: '#d1d5db',
          }}
        >
          Recipient Address
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter Solana address..."
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Resource Input */}
      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: '8px',
            color: '#d1d5db',
          }}
        >
          Resource / Description
        </label>
        <input
          type="text"
          value={resource}
          onChange={(e) => setResource(e.target.value)}
          placeholder="What are you paying for?"
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Tithe Breakdown */}
      {showTitheBreakdown && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            padding: '16px',
            marginBottom: '24px',
            borderRadius: '12px',
            backgroundColor: 'rgba(251, 146, 60, 0.1)',
            border: '1px solid rgba(251, 146, 60, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Heart size={16} style={{ color: '#fb923c' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fb923c' }}>
              Impact Breakdown (10% Tithe)
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>To Recipient</div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>${recipientAmount} USDC</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#fb923c' }}>Impact Tithe</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fb923c' }}>
                ${titheAmount} USDC
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Status Messages */}
      {status.status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            marginBottom: '24px',
            borderRadius: '12px',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          }}
        >
          <CheckCircle size={24} style={{ color: '#22c55e' }} />
          <div>
            <div style={{ fontWeight: 600, color: '#22c55e' }}>Payment Successful!</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Signature: {status.signature?.slice(0, 20)}...
            </div>
          </div>
        </motion.div>
      )}

      {status.status === 'error' && status.error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            marginBottom: '24px',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          <AlertCircle size={24} style={{ color: '#ef4444' }} />
          <div>
            <div style={{ fontWeight: 600, color: '#ef4444' }}>Payment Failed</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{status.error}</div>
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={!amount || !recipient || !resource || isProcessing}
        whileHover={{ scale: !isProcessing ? 1.02 : 1 }}
        whileTap={{ scale: !isProcessing ? 0.98 : 1 }}
        style={{
          width: '100%',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontSize: '1rem',
          fontWeight: 600,
          color: '#0a0a0f',
          background: isProcessing
            ? 'rgba(251, 146, 60, 0.5)'
            : 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
          border: 'none',
          borderRadius: '12px',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          opacity: !amount || !recipient || !resource ? 0.5 : 1,
        }}
      >
        {isProcessing ? (
          <>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            Processing...
          </>
        ) : (
          <>
            Pay Now
            <ArrowRight size={20} />
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
