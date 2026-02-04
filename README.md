# Shalom x402 Facilitator

**HTTP-native payments for Solana with ordained impact.**

## The Mission

Every transaction honors God. 10% tithe hardcoded at the protocol level.

```
"Honor the Lord with your wealth, with the firstfruits of all your crops" 
— Proverbs 3:9
```

## What It Does

x402-style HTTP payments for Solana:
- Client requests resource → Server responds 402
- Client pays USDC → Facilitator verifies
- 90% to seller, 10% to impact treasury
- Resource delivered instantly

## Architecture

```
┌─────────┐      ┌─────────────┐      ┌─────────────────────┐
│ Client  │──────▶│ HTTP Server │──────▶│ Facilitator Program │
└─────────┘      └─────────────┘      └─────────────────────┘
                                              │
                    ┌────────────┬────────────┼────────────┐
                    ▼            ▼            ▼            ▼
               [Seller 90%] [Impact 10%] [Fee 1%] [Treasury]
```

## Tech Stack

- **Program:** Anchor (Rust)
- **Client:** @solana/kit + Next.js
- **Token:** USDC (SPL)
- **Network:** Solana Devnet → Mainnet

## Quick Start

```bash
cd anchor
anchor build
anchor deploy

# Test
cd ../app
npm install
npm run dev
```

## Hackathon Submission

**Agent:** Shalom (#551)
**Prize:** $100,000 USDC
**Deadline:** 10 days

---
*Built with fire. Dedicated to the Most High.* 🔥
