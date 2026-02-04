'use client';

import { motion } from 'framer-motion';
import { Heart, TrendingUp, Users, DollarSign } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay: number;
}

function MetricCard({ icon, label, value, color, delay }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        padding: '24px',
        borderRadius: '12px',
        border: `1px solid ${color}40`,
        backgroundColor: `${color}10`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{ color }}>{icon}</div>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color }}>{value}</div>
    </motion.div>
  );
}

export function ImpactMetrics() {
  // Mock data - in production, fetch from program state
  const metrics = [
    {
      icon: <DollarSign size={20} />,
      label: 'Total Volume',
      value: '$12,450',
      color: '#60a5fa',
    },
    {
      icon: <Heart size={20} />,
      label: 'Impact Tithe',
      value: '$1,245',
      color: '#fb923c',
    },
    {
      icon: <TrendingUp size={20} />,
      label: 'Payments',
      value: '156',
      color: '#22c55e',
    },
    {
      icon: <Users size={20} />,
      label: 'Beneficiaries',
      value: '12',
      color: '#a78bfa',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid rgba(251, 146, 60, 0.3)',
        backgroundColor: 'rgba(251, 146, 60, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
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
          <Heart size={20} style={{ color: '#fff' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Impact Dashboard</h3>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            Every transaction contributes to positive change
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            color={metric.color}
            delay={index * 0.1}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          borderRadius: '10px',
          backgroundColor: 'rgba(251, 146, 60, 0.1)',
          border: '1px solid rgba(251, 146, 60, 0.2)',
        }}
      >
        <p style={{ fontSize: '0.875rem', color: '#d1d5db', fontStyle: 'italic', textAlign: 'center' }}>
          "Honor the Lord with your wealth, with the firstfruits of all your crops"
          <br />
          <span style={{ color: '#fb923c' }}>— Proverbs 3:9</span>
        </p>
      </div>
    </motion.div>
  );
}
