'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletModalButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { Wallet, LogOut, ChevronDown, Copy, CheckCircle } from 'lucide-react';

export function WalletButton() {
  const { publicKey, connected, disconnect, wallet } = useWallet();
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowMenu(false);
  };

  if (!connected || !publicKey) {
    return (
      <WalletModalButton
        style={{
          padding: '12px 24px',
          borderRadius: '100px',
          background: 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
          color: '#0a0a0f',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Wallet size={18} />
        Connect Wallet
      </WalletModalButton>
    );
  }

  const truncatedAddress = `${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}`;

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          padding: '12px 20px',
          borderRadius: '100px',
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          color: '#fff',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#4ade80',
            animation: 'pulse 2s infinite',
          }}
        />
        <span>{truncatedAddress}</span>
        <ChevronDown size={16} />
      </motion.button>

      {showMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            backgroundColor: '#1a1a24',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '8px',
            minWidth: '200px',
            zIndex: 1000,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }}
        >
          <button
            onClick={handleCopy}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          >
            {copied ? <CheckCircle size={18} color="#22c55e" /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Address'}
          </button>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' }} />

          <button
            onClick={handleDisconnect}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          >
            <LogOut size={18} />
            Disconnect
          </button>
        </motion.div>
      )}
    </div>
  );
}
