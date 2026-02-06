'use client';

import { motion } from 'framer-motion';
import { Zap, Heart, Globe, ExternalLink, Github, Menu, X } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { BalanceCard } from '@/components/BalanceCard';
import { PaymentForm } from '@/components/PaymentForm';
import { PaymentHistory } from '@/components/PaymentHistory';
import { ImpactMetrics } from '@/components/ImpactMetrics';
import { X402Demo } from '@/components/X402Demo';

export default function HomePage() {
  const { connected } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0a0a0f', 
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header - Responsive */}
      <nav 
        style={{ 
          padding: '16px', 
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>✝️</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Shalom x402</span>
            <span 
              style={{ 
                fontSize: '0.65rem', 
                color: '#9ca3af', 
                padding: '3px 6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(251, 146, 60, 0.1)',
              }}
            >
              Devnet
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div style={{ 
          display: 'none',
          alignItems: 'center', 
          gap: '20px',
        }} className="desktop-nav">
          <a 
            href="https://github.com/moikapy/x402" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            <Github size={16} />
            GitHub
          </a>
          <WalletButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            padding: '8px',
            cursor: 'pointer',
          }}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              width: '100%',
              padding: '16px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              marginTop: '8px',
            }}
            className="mobile-nav-dropdown"
          >
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
          </motion.div>
        )}
      </nav>

      {/* Hero Section - Responsive */}
      <section style={{ padding: '40px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '100px',
                  border: '1px solid rgba(251, 146, 60, 0.3)',
                  backgroundColor: 'rgba(251, 146, 60, 0.05)',
                  marginBottom: '24px',
                }}
              >
                <Zap size={16} style={{ color: '#fb923c' }} />
                <span style={{ color: '#fb923c', fontSize: '0.75rem', fontWeight: 500 }}>
                  HTTP-NATIVE PAYMENTS FOR SOLANA
                </span>
              </div>

              <h1 style={{ 
                fontSize: 'clamp(2rem, 8vw, 4rem)', 
                fontWeight: 800, 
                marginBottom: '16px',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
              >
                Pay with Purpose
              </h1>

              <p style={{ 
                fontSize: 'clamp(1rem, 3vw, 1.25rem)', 
                color: '#9ca3af', 
                maxWidth: '600px',
                margin: '0 auto 20px auto',
                lineHeight: 1.5,
                padding: '0 8px',
              }}
              >
                Every transaction honors God. 10% tithe hardcoded at the protocol level.
              </p>

              <p style={{ fontSize: '0.9rem', color: '#fb923c' }}>
                "Honor the Lord with your wealth" — Proverbs 3:9
              </p>
            </motion.div>
          </div>

          {/* Dashboard Grid - Responsive */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr',
            gap: '16px',
          }} className="dashboard-grid">
            {/* Left Column - Payment Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {connected && <BalanceCard />}
              <PaymentForm />
            </div>

            {/* Right Column - History & Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr',
                gap: '16px',
              }} className="metrics-grid">
                <ImpactMetrics />
                <X402Demo />
              </div>
              <PaymentHistory />
            </div>
          </div>

          {/* How It Works - Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: '48px', textAlign: 'center' }}
          >
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, marginBottom: '32px' }}>
              How It Works
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr',
              gap: '16px',
            }} className="steps-grid">
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

          {/* Program Info - Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{ 
              marginTop: '48px',
              padding: '24px 16px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.02)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>
              Program Details
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr',
              gap: '12px',
            }} className="info-grid">
              <InfoRow label="Network" value="Solana Devnet" />
              <InfoRow 
                label="Program ID" 
                value={process.env.NEXT_PUBLIC_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'}
                isCode
              />
              <InfoRow label="Tithe Rate" value="10% (1000 bps)" />
              <InfoRow label="Token" value="USDC (Devnet)" />
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <a
                href={`https://explorer.solana.com/address/${process.env.NEXT_PUBLIC_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#fb923c',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 146, 60, 0.3)',
                  backgroundColor: 'rgba(251, 146, 60, 0.05)',
                }}
              >
                View on Explorer <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Responsive */}
      <footer 
        style={{ 
          padding: '32px 16px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>
          Built with ❤️ for the Colosseum Solana AI Hackathon
        </p>
        <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
          © 2025 Shalom x402. All rights reserved.
        </p>
      </footer>

      {/* Responsive Styles Injection */}
      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-nav-dropdown {
            display: none !important;
          }
          nav {
            padding: 20px 32px !important;
          }
          section {
            padding: 60px 32px !important;
          }
          .dashboard-grid {
            grid-template-columns: 5fr 7fr !important;
            gap: 24px !important;
          }
          .metrics-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .steps-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 24px !important;
          }
          .info-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          nav {
            padding: 20px 48px !important;
          }
          section {
            padding: 80px 48px !important;
          }
        }
      `}</style>
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
      whileHover={{ y: -3 }}
      style={{
        padding: '24px',
        borderRadius: '12px',
        border: highlight ? '1px solid rgba(251, 146, 60, 0.3)' : '1px solid rgba(255,255,255,0.05)',
        backgroundColor: highlight ? 'rgba(251, 146, 60, 0.05)' : 'rgba(255,255,255,0.02)',
        textAlign: 'left',
      }}
    >
      <div 
        style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          marginBottom: '12px',
          fontSize: '0.875rem',
        }}
      >
        {number}
      </div>
      <Icon size={20} style={{ color: '#fb923c', marginBottom: '12px' }} />
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>{title}</h3>
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
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        flexWrap: 'wrap',
        gap: '8px',
      }}
    >
      <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{label}</span>
      <span 
        style={{ 
          fontSize: '0.875rem', 
          fontWeight: 500,
          fontFamily: isCode ? 'monospace' : 'inherit',
          color: isCode ? '#fb923c' : '#fff',
          wordBreak: 'break-all',
        }}
      >
        {isCode ? `${value.slice(0, 6)}...${value.slice(-4)}` : value}
      </span>
    </div>
  );
}
