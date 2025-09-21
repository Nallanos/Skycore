#!/bin/bash
set -e

echo "🏗️  Railway build starting..."
echo "📍 Current directory: $(pwd)"
echo "📁 Contents: $(ls -la)"

# Store the initial directory
INITIAL_DIR=$(pwd)

# Detect if we're in root or server directory
if [ -d "client" ] && [ -d "server" ]; then
    echo "📍 Detected: Building from project root"
    BASE_DIR="$INITIAL_DIR"
    CLIENT_DIR="$INITIAL_DIR/client"
    SERVER_DIR="$INITIAL_DIR/server"
    DIST_TARGET="$INITIAL_DIR/server/dist"
elif [ -d "../client" ] && [ -d "../server" ]; then
    echo "📍 Detected: Building from server directory"
    BASE_DIR="$(dirname "$INITIAL_DIR")"
    CLIENT_DIR="$BASE_DIR/client"
    SERVER_DIR="$INITIAL_DIR"
    DIST_TARGET="$INITIAL_DIR/dist"
else
    echo "❌ Error: Cannot detect project structure"
    echo "Looking for client and server directories..."
    find . -name "client" -type d 2>/dev/null || echo "No client directory found"
    find . -name "server" -type d 2>/dev/null || echo "No server directory found"
    exit 1
fi

echo "🔧 Using BASE_DIR: $BASE_DIR"
echo "🔧 CLIENT_DIR: $CLIENT_DIR"
echo "🔧 SERVER_DIR: $SERVER_DIR"
echo "🔧 DIST_TARGET: $DIST_TARGET"

# Build client
echo "⚛️ Building React client..."
cd "$CLIENT_DIR"
echo "📍 Now in: $(pwd)"
npm ci
npm run build

echo "📁 Client build contents:"
ls -la dist/

# Copy to server
echo "📋 Copying client build to server..."
rm -rf "$DIST_TARGET"
cp -r "$CLIENT_DIR/dist" "$DIST_TARGET"

echo "🔍 Verifying copy..."
if [ ! -d "$DIST_TARGET" ]; then
    echo "❌ Failed to copy dist to server!"
    exit 1
fi

echo "📁 Server dist contents:"
ls -la "$DIST_TARGET/"

# Install server dependencies
echo "📦 Installing server dependencies..."
cd "$SERVER_DIR"
npm ci --omit=dev

# Create database directory
echo "🗄️  Creating database directory..."
mkdir -p database
chmod 755 database

echo "✅ Build completed successfully!"
echo "📍 Final structure check:"
echo "  Server directory: $(pwd)"
echo "  Dist exists: $([ -d 'dist' ] && echo 'YES' || echo 'NO')"
if [ -d 'dist' ]; then
    echo "  Dist contents: $(ls dist/ | tr '\n' ' ')"
fi
echo "  Database dir exists: $([ -d 'database' ] && echo 'YES' || echo 'NO')"