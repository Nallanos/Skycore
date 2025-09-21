#!/bin/bash
set -e  # Exit on any error

echo "🏗️  Building Skycore application..."
echo "📍 Current directory: $(pwd)"
echo "📁 Directory contents: $(ls -la)"

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
echo "📍 Now in: $(pwd)"
npm ci --omit=dev

# Build client
echo "⚛️  Building React client..."
cd ../client
echo "📍 Now in: $(pwd)"
npm ci
npm run build

# Verify client build exists
echo "🔍 Checking if client build was successful..."
if [ ! -d "dist" ]; then
    echo "❌ ERROR: Client build failed - dist folder not found!"
    exit 1
fi

echo "📁 Files in client/dist:"
ls -la dist/

# Copy client build to server
echo "📋 Copying client build to server..."
rm -rf ../server/dist
cp -r dist ../server/dist

# Verify copy was successful
echo "🔍 Verifying copy to server..."
cd ../server
if [ ! -d "dist" ]; then
    echo "❌ ERROR: Failed to copy dist to server!"
    exit 1
fi

echo "📁 Files in server/dist:"
ls -la dist/

echo "✅ Build completed successfully!"