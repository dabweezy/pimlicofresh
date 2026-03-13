#!/bin/bash

# Deploy Pimlico Fresh website to Vercel
# Project ID: prj_TQvjHKYQU8p8k00uoVKrfxX1TSIy

echo "🚀 Deploying Pimlico Fresh to Vercel..."
echo "Project ID: prj_TQvjHKYQU8p8k00uoVKrfxX1TSIy"
echo ""

# First, link to the project (if not already linked)
echo "Linking to Vercel project..."
npx --yes vercel link --project prj_TQvjHKYQU8p8k00uoVKrfxX1TSIy --yes

# Then deploy to production
echo ""
echo "Deploying to production..."
npx --yes vercel --prod --yes

echo ""
echo "✅ Deployment complete!"

