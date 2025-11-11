#!/bin/bash
# Quick start script for MCP-CE UI

echo "🚀 Starting MCP-CE UI Development Server"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    if command -v bun &> /dev/null; then
        bun install
    else
        npm install
    fi
    echo ""
fi

echo "✅ Dependencies ready"
echo ""
echo "🌐 Starting Vite dev server..."
echo "   UI will be available at: http://localhost:5173"
echo "   API proxy configured for: http://localhost:8000"
echo ""
echo "⚠️  Make sure the server is running on port 8000!"
echo ""

# Start dev server
if command -v bun &> /dev/null; then
    bun dev
else
    npm run dev
fi
