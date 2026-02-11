'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Lock, Unlock, ArrowRight, Loader2, CheckCircle, DollarSign, Server } from 'lucide-react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

// Demo resource server simulation
const DEMO_RESOURCE = {
  id: 'demo-resource-001',
  name: 'Premium API Access',
  price: 1_000_000, // 1 USDC in micro units
  endpoint: '/api/premium-data',
};

export function X402DemoReal() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  
  const [step, setStep] = useState<'idle' | 'requesting' | 'payment_required' | 'paying' | 'verifying' | 'success' | 'error'>('idle');
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const [x402Header, setX402Header] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentSignature, setPaymentSignature] = useState<string | null>(null);

  // Step 1: Request resource (simulated server call)
  const handleRequestAccess = async () => {
    if (!connected) {
      setError('Please connect your wallet first');
      return;
    }

    setStep('requesting');
    setError(null);
    setServerResponse(null);

    // Simulate HTTP request to resource server
    setTimeout(() => {
      // Server responds with 402 Payment Required
      setStep('payment_required');
      setX402Header({
        version: '0.1',
        scheme: 'solana',
        network: 'devnet',
        maxAmount: DEMO_RESOURCE.price.toString(),
        resource: DEMO_RESOURCE.id,
        description: DEMO_RESOURCE.name,
        recipient: publicKey?.toBase58() || '', // In real scenario, this would be the resource owner's address
      });
      setServerResponse('HTTP 402 Payment Required\nX-Payment-Required: x402');
    }, 1000);
  };

  // Step 2: Create and send payment
  const handlePayForAccess = async () => {
    setStep('paying');

    try {
      // In a real implementation:
      // 1. Create a transaction paying to the recipient
      // 2. Get signature from wallet
      // 3. Send payment proof to server
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSignature = '5xK...8mN'; // In real app, this would be actual tx signature
      setPaymentSignature(mockSignature);
      setStep('verifying');

      // Simulate server verification
      setTimeout(() => {
        setStep('success');
        setServerResponse(
          `HTTP 200 OK\nContent-Type: application/json\n\n{\n  "data": "Premium content accessed!",\n  "paid": ${DEMO_RESOURCE.price / 1_000_000} USDC,\n  "tx": "${mockSignature}"\n}`
        );
      }, 1500);

    } catch (err) {
      setStep('error');
      setError(err instanceof Error ? err.message : 'Payment failed');
    }
  };

  // Step 3: Reset demo
  const handleReset = () => {
    setStep('idle');
    setServerResponse(null);
    setX402Header(null);
    setError(null);
    setPaymentSignature(null);
  };

  const getStatusColor = () => {
    switch (step) {
      case 'success': return '#22c55e';
      case 'error': return '#ef4444';
      case 'idle': return '#6b7280';
      default: return '#fb923c';
    }
  };

  const getStatusIcon = () => {
    switch (step) {
      case 'idle': return <Lock size={32} style={{ color: '#6b7280' }} />;
      case 'success': return <CheckCircle size={32} style={{ color: '#22c55e' }} />;
      case 'error': return <Unlock size={32} style={{ color: '#ef4444' }} />;
      default: return <Loader2 size={32} style={{ color: '#fb923c', animation: 'spin 1s linear infinite' }} />;
    }
  };

  const getStatusText = () => {
    switch (step) {
      case 'idle': return 'Resource Locked';
      case 'requesting': return 'Requesting Resource...';
      case 'payment_required': return '402 Payment Required';
      case 'paying': return 'Processing Payment...';
      case 'verifying': return 'Verifying Payment...';
      case 'success': return 'Access Granted!';
      case 'error': return 'Payment Failed';
      default: return 'Processing...';
    }
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
            HTTP-native payments simulation
          </p>
        </div>
      </div>

      {/* HTTP Request/Response Display */}
      {serverResponse && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            marginBottom: '20px',
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            whiteSpace: 'pre-wrap',
            color: step === 'success' ? '#22c55e' : '#fb923c',
            maxHeight: '200px',
            overflow: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#9ca3af' }}>
            <Server size={14} />
            <span>Server Response</span>
          </div>
          {serverResponse}
        </motion.div>
      )}

      {/* x402 Header Display */}
      {x402Header && step !== 'idle' && step !== 'success' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginBottom: '20px',
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(251, 146, 60, 0.05)',
            border: '1px solid rgba(251, 146, 60, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <DollarSign size={16} style={{ color: '#fb923c' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fb923c' }}>
              X-402-Payment-Required Header
            </span>
          </div>
          <code style={{ fontSize: '0.75rem', color: '#d1d5db', display: 'block' }}>
            {JSON.stringify(x402Header, null, 2)}
          </code>
        </motion.div>
      )}

      {/* Status Display */}
      <div
        style={{
          padding: '24px',
          marginBottom: '24px',
          borderRadius: '12px',
          backgroundColor: `${getStatusColor()}10`,
          border: `1px solid ${getStatusColor()}30`,
          textAlign: 'center',
        }}
      >
        <div style={{ margin: '0 auto 16px' }}>
          {getStatusIcon()}
        </div>
        <div style={{ fontWeight: 600, color: getStatusColor(), marginBottom: '8px' }}>
          {getStatusText()}
        </div>
        {step === 'payment_required' && x402Header && (
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            Price: {(x402Header.maxAmount / 1_000_000).toFixed(2)} USDC
          </div>
        )}
        {step === 'success' && paymentSignature && (
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '8px' }}>
            TX: {paymentSignature}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {step === 'idle' && (
          <motion.button
            onClick={handleRequestAccess}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!connected}
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
            <Globe size={20} />
            Request Resource
          </motion.button>
        )}

        {step === 'payment_required' && (
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
            Pay {(DEMO_RESOURCE.price / 1_000_000).toFixed(2)} USDC
            <ArrowRight size={20} />
          </motion.button>
        )}

        {(step === 'success' || step === 'error') && (
          <motion.button
            onClick={handleReset}
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

      {/* Protocol Steps */}
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
          <strong style={{ color: '#60a5fa' }}>x402 Flow:</strong>
          <ol style={{ margin: '8px 0 0 16px', padding: 0 }}>
            <li style={{ color: step === 'requesting' ? '#fb923c' : undefined }}>
              Client → Server: GET /resource
            </li>
            <li style={{ color: step === 'payment_required' ? '#fb923c' : undefined }}>
              Server → Client: 402 + X-Payment-Required header
            </li>
            <li style={{ color: step === 'paying' ? '#fb923c' : undefined }}>
              Client: Sign payment transaction
            </li>
            <li style={{ color: step === 'verifying' ? '#fb923c' : undefined }}>
              Client → Server: X-402-Pay proof header
            </li>
            <li style={{ color: step === 'success' ? '#22c55e' : undefined }}>
              Server → Client: 200 + Resource
            </li>
          </ol>
        </div>
      </div>
    </motion.div>
  );
}
