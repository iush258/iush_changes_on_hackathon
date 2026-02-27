#!/bin/bash

# Database Deployment Verification Script
# This script helps verify that the database fixes are working correctly

set -e

echo "🔍 Database Deployment Verification"
echo "======================================"
echo ""

# Check 1: Verify build script changes
echo "✓ Checking package.json build script..."
if grep -q "prisma db push" package.json; then
    echo "  ✅ Build script includes 'prisma db push'"
else
    echo "  ❌ Build script missing 'prisma db push'"
    exit 1
fi

# Check 2: Verify vercel.json configuration
echo ""
echo "✓ Checking vercel.json configuration..."
if grep -q "buildCommand" web/vercel.json; then
    echo "  ✅ vercel.json includes buildCommand"
else
    echo "  ⚠️  vercel.json missing buildCommand"
fi

# Check 3: Verify DATABASE_URL in environment (.env file exists)
echo ""
echo "✓ Checking .env configuration..."
if [ -f ".env" ]; then
    if grep -q "DATABASE_URL" .env; then
        echo "  ✅ .env file contains DATABASE_URL"
        # Extract and show (masked)
        DB_URL=$(grep "DATABASE_URL=" .env | cut -d'=' -f2)
        DB_HOST=$(echo "$DB_URL" | grep -oP '(?<=@)[^/:]+' || echo "N/A")
        echo "     Host detected: $DB_HOST"
    else
        echo "  ❌ .env file exists but missing DATABASE_URL"
        exit 1
    fi
else
    echo "  ⚠️  .env file not found (OK if deploying to Vercel with env vars)"
fi

# Check 4: Verify Prisma schema exists
echo ""
echo "✓ Checking Prisma schema..."
if [ -f "prisma/schema.prisma" ]; then
    TABLE_COUNT=$(grep -c "^model " prisma/schema.prisma || echo "0")
    echo "  ✅ Prisma schema found with $TABLE_COUNT models"
else
    echo "  ❌ Prisma schema not found"
    exit 1
fi

# Check 5: Verify migrations directory
echo ""
echo "✓ Checking migrations..."
if [ -d "prisma/migrations" ]; then
    MIGRATION_COUNT=$(ls -d prisma/migrations/*/ 2>/dev/null | wc -l)
    echo "  ✅ Migrations directory found with $MIGRATION_COUNT migrations"
else
    echo "  ⚠️  Migrations directory not found (OK - using db push)"
fi

# Check 6: Verify Prisma client setup
echo ""
echo "✓ Checking Prisma client configuration..."
if grep -q "@prisma/adapter-pg" src/lib/prisma.ts; then
    echo "  ✅ Using PrismaPg adapter (correct for Neon/Supabase)"
else
    echo "  ⚠️  Not using PrismaPg adapter"
fi

echo ""
echo "======================================"
echo "✅ All checks passed!"
echo ""
echo "📋 Next steps:"
echo "  1. Set DATABASE_URL in Vercel dashboard (Project Settings → Environment Variables)"
echo "  2. For Neon: Use pooling endpoint (ends with -pooler)"
echo "  3. For Supabase: Copy connection string from dashboard"
echo "  4. Deploy/redeploy to Vercel"
echo "  5. Check deployment logs for 'prisma db push' success"
echo "  6. Verify tables in your database"
echo ""
