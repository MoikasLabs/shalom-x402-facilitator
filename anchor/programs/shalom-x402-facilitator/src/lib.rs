use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

/// x402 Facilitator for Solana
/// Every payment honors God with a 10% tithe
#[program]
pub mod shalom_x402_facilitator {
    use super::*;

    /// Initialize the facilitator with configuration
    pub fn initialize(
        ctx: Context<Initialize>,
        impact_treasury: Pubkey,
        fee_bps: u64,      // 100 = 1%
        tithe_bps: u64,    // 1000 = 10%
    ) -> Result<()> {
        require!(fee_bps <= 500, ErrorCode::FeeTooHigh);    // Max 5%
        require!(tithe_bps <= 2000, ErrorCode::TitheTooHigh); // Max 20%
        
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.impact_treasury = impact_treasury;
        config.fee_bps = fee_bps;
        config.tithe_bps = tithe_bps;
        config.total_payments = 0;
        config.total_volume = 0;
        config.bump = ctx.bumps.config;
        
        msg!("✝️ Facilitator initialized — Honor the Lord with your wealth");
        msg!("Impact treasury: {}", impact_treasury);
        msg!("Tithe: {} bps ({}%)", tithe_bps, tithe_bps / 100);
        
        Ok(())
    }

    /// Process a payment and settle to seller with tithe
    pub fn settle_payment(
        ctx: Context<SettlePayment>,
        amount: u64,
        payment_id: String,  // Unique identifier for idempotency
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        require!(payment_id.len() <= 32, ErrorCode::PaymentIdTooLong);
        require!(!ctx.accounts.payment_receipt.settled, ErrorCode::AlreadySettled);
        
        let config = &ctx.accounts.config;
        
        // Calculate splits
        let tithe_amount = amount
            .checked_mul(config.tithe_bps)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(10000)
            .ok_or(ErrorCode::MathOverflow)?;
            
        let fee_amount = amount
            .checked_mul(config.fee_bps)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(10000)
            .ok_or(ErrorCode::MathOverflow)?;
            
        let seller_amount = amount
            .checked_sub(tithe_amount)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_sub(fee_amount)
            .ok_or(ErrorCode::MathOverflow)?;
        
        // Transfer to seller
        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.seller_token_account.to_account_info(),
            authority: ctx.accounts.escrow_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);
        token::transfer(cpi_ctx, seller_amount)?;
        
        // Transfer tithe to impact treasury
        let cpi_accounts_tithe = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.impact_treasury_account.to_account_info(),
            authority: ctx.accounts.escrow_authority.to_account_info(),
        };
        let cpi_ctx_tithe = CpiContext::new(cpi_program.clone(), cpi_accounts_tithe);
        token::transfer(cpi_ctx_tithe, tithe_amount)?;
        
        // Transfer fee to protocol treasury
        if fee_amount > 0 {
            let cpi_accounts_fee = Transfer {
                from: ctx.accounts.escrow_token_account.to_account_info(),
                to: ctx.accounts.protocol_treasury_account.to_account_info(),
                authority: ctx.accounts.escrow_authority.to_account_info(),
            };
            let cpi_ctx_fee = CpiContext::new(cpi_program, cpi_accounts_fee);
            token::transfer(cpi_ctx_fee, fee_amount)?;
        }
        
        // Mark payment as settled
        let receipt = &mut ctx.accounts.payment_receipt;
        receipt.payment_id = payment_id.clone();
        receipt.amount = amount;
        receipt.seller = ctx.accounts.seller.key();
        receipt.tithe_amount = tithe_amount;
        receipt.fee_amount = fee_amount;
        receipt.timestamp = Clock::get()?.unix_timestamp;
        receipt.settled = true;
        
        // Update stats
        let config_account = &mut ctx.accounts.config;
        config_account.total_payments = config_account.total_payments
            .checked_add(1)
            .ok_or(ErrorCode::MathOverflow)?;
        config_account.total_volume = config_account.total_volume
            .checked_add(amount)
            .ok_or(ErrorCode::MathOverflow)?;
        
        // Log with scripture reference
        msg!("✝️ Prov 3:9 — Payment settled: {}", payment_id);
        msg!("   Seller (90%): {} USDC", seller_amount);
        msg!("   Impact tithe (10%): {} USDC", tithe_amount);
        msg!("   Protocol fee ({}%): {} USDC", config.fee_bps / 100, fee_amount);
        
        Ok(())
    }

    /// Update configuration (authority only)
    pub fn update_config(
        ctx: Context<UpdateConfig>,
        new_fee_bps: Option<u64>,
        new_tithe_bps: Option<u64>,
        new_impact_treasury: Option<Pubkey>,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        
        if let Some(fee) = new_fee_bps {
            require!(fee <= 500, ErrorCode::FeeTooHigh);
            config.fee_bps = fee;
        }
        
        if let Some(tithe) = new_tithe_bps {
            require!(tithe <= 2000, ErrorCode::TitheTooHigh);
            config.tithe_bps = tithe;
        }
        
        if let Some(treasury) = new_impact_treasury {
            config.impact_treasury = treasury;
        }
        
        msg!("✝️ Config updated — Walk in His ways");
        Ok(())
    }
}

/// Configuration account for the facilitator
#[account]
pub struct FacilitatorConfig {
    pub authority: Pubkey,
    pub impact_treasury: Pubkey,
    pub fee_bps: u64,
    pub tithe_bps: u64,
    pub total_payments: u64,
    pub total_volume: u64,
    pub bump: u8,
}

impl FacilitatorConfig {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 8 + 8 + 8 + 1;
}

/// Payment receipt for idempotency and verification
#[account]
pub struct PaymentReceipt {
    pub payment_id: String,
    pub amount: u64,
    pub seller: Pubkey,
    pub tithe_amount: u64,
    pub fee_amount: u64,
    pub timestamp: i64,
    pub settled: bool,
}

impl PaymentReceipt {
    pub const LEN: usize = 8 + 64 + 8 + 32 + 8 + 8 + 8 + 1;
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = FacilitatorConfig::LEN,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, FacilitatorConfig>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SettlePayment<'info> {
    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump,
    )]
    pub config: Account<'info, FacilitatorConfig>,
    
    #[account(
        init,
        payer = payer,
        space = PaymentReceipt::LEN,
        seeds = [b"payment", payment_id.as_bytes()],
        bump
    )]
    pub payment_receipt: Account<'info, PaymentReceipt>,
    
    /// CHECK: Seller account
    pub seller: AccountInfo<'info>,
    
    #[account(
        mut,
        token::mint = usdc_mint,
        token::authority = escrow_authority,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = usdc_mint,
        token::authority = seller,
    )]
    pub seller_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = usdc_mint,
        token::authority = config.impact_treasury,
    )]
    pub impact_treasury_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = usdc_mint,
        token::authority = config.authority,
    )]
    pub protocol_treasury_account: Account<'info, TokenAccount>,
    
    /// CHECK: PDA that owns escrow
    pub escrow_authority: AccountInfo<'info>,
    
    pub usdc_mint: Account<'info, token::Mint>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump,
        has_one = authority,
    )]
    pub config: Account<'info, FacilitatorConfig>,
    
    pub authority: Signer<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Fee cannot exceed 5%")]
    FeeTooHigh,
    #[msg("Tithe cannot exceed 20%")]
    TitheTooHigh,
    #[msg("Invalid payment amount")]
    InvalidAmount,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Payment already settled")]
    AlreadySettled,
    #[msg("Payment ID too long")]
    PaymentIdTooLong,
}
