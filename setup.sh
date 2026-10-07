#!/bin/bash

# De Peenk Courtroom - Complete Setup Script
# Run this to set up the project locally

echo "🎉 Setting up De Peenk Courtroom..."

# Create directory structure
mkdir -p src/components
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p prisma
mkdir -p public/audio

echo "✅ Directory structure created"

# Install dependencies
echo "📦 Installing dependencies..."
npm install framer-motion @supabase/supabase-js

echo "✅ Dependencies installed"

# Next steps
echo ""
echo "🎯 Next Steps:"
echo "1. Copy all files from the workspace to your local project"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:5173"
echo ""
echo "📚 See README.md for complete documentation"
