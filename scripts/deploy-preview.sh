#!/bin/bash
# Deploy preview to hackathon.shalohm.co subdomain

set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)
PROJECT_NAME="x402"

if [ "$BRANCH" = "main" ]; then
  SUBDOMAIN="$PROJECT_NAME"
elif [ "$BRANCH" = "develop" ]; then
  SUBDOMAIN="dev-$PROJECT_NAME"
else
  SUBDOMAIN="pr-$(echo $BRANCH | tr '/' '-')-$PROJECT_NAME"
fi

echo "Deploying to https://$SUBDOMAIN.hackathon.shalohm.co"

# Build
cd /root/dev/hackathon/shalom-x402-facilitator/app
npm ci
npm run build

# Deploy to VPS (rsync)
rsync -avz --delete dist/ root@shalohm.co:/var/www/hackathon/$SUBDOMAIN/

# Post to Colosseum forum about deployment
echo "✅ Deployed to https://$SUBDOMAIN.hackathon.shalohm.co"
