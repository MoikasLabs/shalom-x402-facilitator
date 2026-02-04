"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Globe, Heart, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [connected, setConnected] = useState(false);

  const stats = [
    { label: "Total Payments", value: "0" },
    { label: "Volume", value: "0 USDC" },
    { label: "Impact Tithe", value: "0 USDC" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0f", color: "#fff" }}>
      {/* Header */}
      <nav style={{ padding: "24px 48px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "2rem" }}>✝️</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>Shalom x402</span>
          </div>
          <button
            onClick={() => setConnected(!connected)}
            style={{
              padding: "12px 24px",
              borderRadius: "100px",
              background: connected ? "#22c55e" : "linear-gradient(135deg, #fb923c 0%, #f87171 100%)",
              color: "#0a0a0f",
              fontWeight: 600,
              border: "none",
              cursor: "pointer"
            }}
          >
            {connected ? "Connected" : "Connect Wallet"}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "120px 48px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 24px",
            borderRadius: "100px",
            border: "1px solid rgba(251, 146, 60, 0.3)",
            backgroundColor: "rgba(251, 146, 60, 0.05)",
            marginBottom: "32px"
          }}>
            <Zap size={20} style={{ color: "#fb923c" }} />
            <span style={{ color: "#fb923c", fontSize: "0.875rem", fontWeight: 500 }}>
              ⚡ HTTP-NATIVE PAYMENTS FOR SOLANA
            </span>
          </div>

          <h1 style={{
            fontSize: "5rem",
            fontWeight: 800,
            marginBottom: "24px",
            letterSpacing: "-0.03em",
            lineHeight: 1.1
          }}>
            Pay with Purpose
          </h1>

          <p style={{
            fontSize: "1.5rem",
            color: "#9ca3af",
            maxWidth: "700px",
            margin: "0 auto 48px auto",
            lineHeight: 1.6
          }}>
            Every transaction honors God. 10% tithe hardcoded at the protocol level.
            <br />
            <span style={{ color: "#fb923c", fontSize: "1rem" }}>
              "Honor the Lord with your wealth" — Proverbs 3:9
            </span>
          </p>

          {/* Stats */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "48px",
            padding: "32px 48px",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(255,255,255,0.02)"
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: i === 2 ? "#fb923c" : "#fff" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section style={{ padding: "80px 48px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, textAlign: "center", marginBottom: "64px" }}>
            How It Works
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            <StepCard
              icon={Globe}
              number="1"
              title="Request Resource"
              description="Client requests API/service. Server responds 402 Payment Required."
            />
            <StepCard
              icon={Zap}
              number="2"
              title="Pay USDC"
              description="Client pays with USDC. Facilitator verifies and splits."
              highlight
            />
            <StepCard
              icon={Heart}
              number="3"
              title="Impact"
              description="90% to seller, 10% tithe to impact. Resource delivered."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "120px 48px", textAlign: "center" }}>
        <button style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          padding: "20px 40px",
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "#0a0a0f",
          background: "linear-gradient(135deg, #fb923c 0%, #f87171 100%)",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer"
        }}>
          Start Building <ArrowRight size={20} />
        </button>
      </section>
    </div>
  );
}

function StepCard({ icon: Icon, number, title, description, highlight = false }: {
  icon: any;
  number: string;
  title: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div style={{
      padding: "32px",
      borderRadius: "16px",
      border: highlight ? "1px solid rgba(251, 146, 60, 0.3)" : "1px solid rgba(255,255,255,0.05)",
      backgroundColor: highlight ? "rgba(251, 146, 60, 0.05)" : "rgba(255,255,255,0.02)"
    }}>
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #fb923c 0%, #f87171 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        marginBottom: "16px"
      }}>
        {number}
      </div>
      <Icon size={24} style={{ color: "#fb923c", marginBottom: "16px" }} />
      <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "8px" }}>{title}</h3>
      <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>{description}</p>
    </div>
  );
}
