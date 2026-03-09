#!/bin/bash

echo "🔍 Verifying Career Timeline setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "pnpm-workspace.yaml" ]; then
    echo -e "${RED}❌ Error: pnpm-workspace.yaml not found. Are you in the project root?${NC}"
    exit 1
fi

echo "✅ In project root directory"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

# Check pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo -e "${GREEN}✅ pnpm installed: $PNPM_VERSION${NC}"
else
    echo -e "${RED}❌ pnpm not found${NC}"
    exit 1
fi

# Check directory structure
echo ""
echo "📁 Checking directory structure..."

REQUIRED_DIRS=(
    "backend/src/db"
    "backend/src/routes"
    "backend/src/types"
    "frontend/src/components"
    "frontend/src/pages"
    "frontend/src/services"
    "frontend/src/types"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $dir${NC}"
    else
        echo -e "${RED}❌ $dir missing${NC}"
    fi
done

# Check key files
echo ""
echo "📄 Checking key files..."

REQUIRED_FILES=(
    "package.json"
    "pnpm-workspace.yaml"
    "backend/package.json"
    "backend/tsconfig.json"
    "backend/src/index.ts"
    "backend/src/seed.ts"
    "frontend/package.json"
    "frontend/src/App.tsx"
    "frontend/src/main.tsx"
    "frontend/.env.example"
    "README.md"
    "QUICKSTART.md"
    "DEVELOPMENT.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done

# Check if dependencies are installed
echo ""
echo "📦 Checking dependencies..."

if [ -d "node_modules" ] && [ -d "frontend/node_modules" ] && [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Dependencies not installed. Run: pnpm install${NC}"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Setup verification complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Run: pnpm install (if not already done)"
echo "  2. Run: pnpm dev"
echo "  3. Open: http://localhost:5173"
echo "  4. (Optional) Run: cd backend && pnpm seed"
echo ""
echo "Documentation:"
echo "  • QUICKSTART.md - Get started in 3 minutes"
echo "  • README.md - Full documentation"
echo "  • DEVELOPMENT.md - Development guide"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
