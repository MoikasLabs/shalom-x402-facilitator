import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ShalomX402Facilitator } from "../target/types/shalom_x402_facilitator";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import {
  createMint,
  createAccount,
  mintTo,
  getAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { assert } from "chai";

describe("Shalom x402 Facilitator", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ShalomX402Facilitator as Program<ShalomX402Facilitator>;
  
  const authority = provider.wallet.publicKey;
  const impactTreasury = anchor.web3.Keypair.generate();
  const seller = anchor.web3.Keypair.generate();
  const protocolTreasury = anchor.web3.Keypair.generate();

  let usdcMint: PublicKey;
  let escrowTokenAccount: PublicKey;
  let sellerTokenAccount: PublicKey;
  let impactTokenAccount: PublicKey;
  let protocolTokenAccount: PublicKey;

  const CONFIG_SEED = "config";
  const TITHE_BPS = 1000; // 10%
  const FEE_BPS = 100;    // 1%

  it("Initializes the facilitator", async () => {
    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from(CONFIG_SEED)],
      program.programId
    );

    await program.methods
      .initialize(impactTreasury.publicKey, FEE_BPS, TITHE_BPS)
      .accounts({
        config: configPda,
        authority: authority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const config = await program.account.facilitatorConfig.fetch(configPda);
    assert.equal(config.authority.toString(), authority.toString());
    assert.equal(config.titheBps.toNumber(), TITHE_BPS);
    assert.equal(config.feeBps.toNumber(), FEE_BPS);
    assert.equal(config.totalPayments.toNumber(), 0);
  });

  it("Settles a payment with tithe", async () => {
    // Setup: Create USDC mint and accounts
    usdcMint = await createMint(
      provider.connection,
      provider.wallet.payer,
      authority,
      null,
      6
    );

    sellerTokenAccount = await createAccount(
      provider.connection,
      provider.wallet.payer,
      usdcMint,
      seller.publicKey
    );

    impactTokenAccount = await createAccount(
      provider.connection,
      provider.wallet.payer,
      usdcMint,
      impactTreasury.publicKey
    );

    protocolTokenAccount = await createAccount(
      provider.connection,
      provider.wallet.payer,
      usdcMint,
      protocolTreasury.publicKey
    );

    // Create escrow account and fund it
    const [escrowAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow")],
      program.programId
    );

    escrowTokenAccount = await createAccount(
      provider.connection,
      provider.wallet.payer,
      usdcMint,
      escrowAuthority
    );

    // Mint 1000 USDC to escrow
    await mintTo(
      provider.connection,
      provider.wallet.payer,
      usdcMint,
      escrowTokenAccount,
      authority,
      1000_000000 // 1000 USDC
    );

    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from(CONFIG_SEED)],
      program.programId
    );

    const paymentId = "test-payment-001";
    const paymentAmount = new anchor.BN(100_000000); // 100 USDC

    await program.methods
      .settlePayment(paymentAmount, paymentId)
      .accounts({
        config: configPda,
        seller: seller.publicKey,
        escrowTokenAccount,
        sellerTokenAccount,
        impactTreasuryAccount: impactTokenAccount,
        protocolTreasuryAccount: protocolTokenAccount,
        escrowAuthority,
        usdcMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Verify splits
    const sellerBalance = await getAccount(provider.connection, sellerTokenAccount);
    const impactBalance = await getAccount(provider.connection, impactTokenAccount);
    const protocolBalance = await getAccount(provider.connection, protocolTokenAccount);

    // 100 USDC - 10% tithe (10) - 1% fee (1) = 89 to seller
    assert.equal(sellerBalance.amount.toString(), "89000000");
    assert.equal(impactBalance.amount.toString(), "10000000"); // 10 USDC tithe
    assert.equal(protocolBalance.amount.toString(), "1000000");  // 1 USDC fee

    console.log("✝️ Payment settled with tithe — Prov 3:9");
  });
});
