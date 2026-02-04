#!/bin/bash
# Install Anchor CLI via AVM (faster than compiling)

. "$HOME/.cargo/env"

# Install AVM
cargo install --git https://github.com/coral-xyz/anchor avm

# Install anchor 0.29.0 via AVM
avm install 0.29.0
avm use 0.29.0

# Verify
anchor --version
echo "✅ Anchor installed!"
