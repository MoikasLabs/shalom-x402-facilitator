'use client';

import { motion } from 'framer-motion';
import { Zap, Heart, Globe, ArrowRight, ExternalLink, Github } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/WalletButton';
import { BalanceCard } from '@/components/BalanceCard';
import { PaymentForm } from '@/components/PaymentForm';
import { PaymentHistory } from '@/components/PaymentHistory';
import { ImpactMetrics } from '@/components/ImpactMetrics';
import { X402Demo } from '@/components/X402Demo';

export default function HomePage() {
  const { connected } = useWallet();

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0a0a0f', 
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <nav 
        style={{ 
          padding: '20px 48px', 
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>✝️</span>
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Shalom x402</span>
            <span 
              style={{ 
                fontSize: '0.75rem', 
                color: '#9ca3af', 
                marginLeft: '12px',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(251, 146, 60, 0.1)',
              }}
            >
              Devnet
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a 
            href="https://github.com/moikapy/x402" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            <Github size={18} />
            GitHub
          </a>
          <WalletButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '80px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 20px',
                  borderRadius: '100px',
                  border: '1px solid rgba(251, 146, 60, 0.3)',
                  backgroundColor: 'rgba(251, 146, 60, 0.05)',
                  marginBottom: '32px',
                }}
              >
                <Zap size={18} style={{ color: '#fb923c' }} />
                <span style={{ color: '#fb923c', fontSize: '0.875rem', fontWeight: 500 }}>
                  HTTP-NATIVE PAYMENTS FOR SOLANA
                </span>
              </div>

              <h1 style={{ 
                fontSize: '4.5rem', 
                fontWeight: 800, 
                marginBottom: '24px',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
              >
                Pay with Purpose
              </h1>

              <p style={{ 
                fontSize: '1.25rem', 
                color: '#9ca3af', 
                maxWidth: '600px',
                margin: '0 auto 32px auto',
                lineHeight: 1.6,
              }}
              >
                Every transaction honors God. 10% tithe hardcoded at the protocol level.
              </p>

              <p style={{ fontSize: '1rem', color: '#fb923c' }}>
                "Honor the Lord with your wealth" — Proverbs 3:9
              </p>
            </motion.div>
          </div>

          {/* Dashboard Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            {/* Left Column - Payment Actions */}
            <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {connected && <BalanceCard />}
              <PaymentForm />
            </div>

            {/* Right Column - History & Metrics */}
            <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <ImpactMetrics />
                <X402Demo />
              </div>
              <PaymentHistory />
            </div>
          </div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: '80px', textAlign: 'center' }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '48px' }}>
              How It Works
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
              <StepCard
                icon={Globe}
                number="1"
                title="Request Resource"
                description="Client requests API/service. Server responds 402 Payment Required with x402 header."
              />
              <StepCard
                icon={Zap}
                number="2"
                title="Pay with USDC"
                description="User approves payment. Facilitator processes transaction and splits proceeds."
                highlight
              />
              <StepCard
                icon={Heart}
                number="3"
                title="Create Impact"
                description="90% to recipient, 10% tithe for good. Resource delivered with proof of payment."
              />
            </div>
          </motion.div>

          {/* Program Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{ 
              marginTop: '80px',
              padding: '32px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.02)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
              Program Details
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <InfoRow label="Network" value="Solana Devnet" />
              <InfoRow 
                label="Program ID" 
                value={process.env.NEXT_PUBLIC_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'}
                isCode
              />
              <InfoRow label="Tithe Rate" value="10% (1000 bps)" />
              <InfoRow label="Token" value="USDC (Devnet)" />
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <a
                href={`https://explorer.solana.com/address/${process.env.NEXT_PUBLIC_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#fb923c',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 146, 60, 0.3)',
                  backgroundColor: 'rgba(251, 146, 60, 0.05)',
                }}
              >
                View on Explorer <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        style={{ 
          padding: '48px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '16px' }}>
          Built with ❤️ for the Colosseum Solana AI Hackathon
        </p>
        <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
          © 2025 Shalom x402. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function StepCard({ 
  icon: Icon, 
  number, 
  title, 
  description, 
  highlight = false 
}: { 
  icon: any; 
  number: string; 
  title: string; 
  description: string; 
  highlight?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      style={{
        padding: '32px',
        borderRadius: '16px',
        border: highlight ? '1px solid rgba(251, 146, 60, 0.3)' : '1px solid rgba(255,255,255,0.05)',
        backgroundColor: highlight ? 'rgba(251, 146, 60, 0.05)' : 'rgba(255,255,255,0.02)',
        textAlign: 'left',
      }}
    >
      <div 
        style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          marginBottom: '16px',
        }}
      >
        {number}
      </div>
      <Icon size={24} style={{ color: '#fb923c', marginBottom: '16px' }} />
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.5 }}>{description}</p>
    </motion.div>
  );
}

function InfoRow({ label, value, isCode = false }: { label: string; value: string; isCode?: boolean }) {
  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px 16px',
        borderRadius: '8px',
        backgroundColor: 'rgba(255,255,255,0.03)',
      }}
    >
      <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{label}</span>
      <span 
        style={{ 
          fontSize: '0.875rem', 
          fontWeight: 500,
          fontFamily: isCode ? 'monospace' : 'inherit',
          color: isCode ? '#fb923c' : '#fff',
        }}
      >
        {isCode ? `${value.slice(0, 8)}...${value.slice(-4)}` : value}
      </span>
    </div>
  );
}
