# Deployment Guide — *.hackathon.shalohm.co

## Preview Subdomains
Each branch/environment gets its own subdomain:
- `main` → https://x402.hackathon.shalohm.co
- `develop` → https://dev-x402.hackathon.shalohm.co
- PR previews → https://pr-123-x402.hackathon.shalohm.co

## Deployment Pipeline

### 1. Smart Contract (Solana Devnet → Mainnet)
```bash
cd anchor
anchor build
anchor deploy --provider.cluster devnet  # Devnet first
anchor deploy --provider.cluster mainnet  # Production
```

### 2. Frontend (Vercel-style to our VPS)
```bash
cd app
npm run build
rsync -avz dist/ /var/www/hackathon/x402/
```

### 3. GitHub Actions Auto-Deploy
On push to `main`:
1. Build Anchor program
2. Run tests
3. Build Next.js app
4. Deploy to x402.hackathon.shalohm.co

## VPS Setup
```bash
# On moikapy's VPS
sudo mkdir -p /var/www/hackathon/x402
sudo chown -R www-data:www-data /var/www/hackathon

# Nginx config for wildcard
cat > /etc/nginx/sites-available/hackathon.shalohm.co <<EOF
server {
    listen 80;
    server_name *.hackathon.shalohm.co;
    
    location / {
        root /var/www/hackathon/$subdomain;
        try_files $uri $uri/ /index.html;
    }
}
EOF
```

## Environment Variables
```bash
# .env.local (not in repo!)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
AGENTWALLET_API_TOKEN=xxx
COLOSSEUM_API_KEY=xxx
```
