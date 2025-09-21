#!/bin/bash

echo "🏗️  Building Skycore application..."

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm ci --omit=dev

# Build client
echo "⚛️  Building React client..."
cd ../client
npm ci
npm run build

# Copy client build to server
echo "📋 Copying client build to server..."
rm -rf ../server/dist
cp -r dist ../server/dist

echo "✅ Build completed successfully!"