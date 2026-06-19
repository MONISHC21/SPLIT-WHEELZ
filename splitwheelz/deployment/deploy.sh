#!/bin/bash
set -e

echo "🚀 SplitWheelz Deployment Script"
echo "================================="

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Install Docker first."
    exit 1
fi

# Load environment
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
    echo "✅ Loaded environment variables"
else
    echo "❌ .env file not found. Copy .env.example to .env first."
    exit 1
fi

echo ""
echo "📦 Building images..."
docker-compose build --no-cache

echo ""
echo "⬇️  Pulling latest base images..."
docker-compose pull postgres redis nginx

echo ""
echo "🗄️  Starting database..."
docker-compose up -d postgres redis
sleep 5

echo ""
echo "🔄 Running database migrations..."
docker-compose run --rm backend npx prisma migrate deploy

echo ""
echo "🌱 Seeding database (first deploy only)..."
docker-compose run --rm backend npx ts-node prisma/seed.ts || echo "Seed skipped (already seeded)"

echo ""
echo "🚀 Starting all services..."
docker-compose up -d

echo ""
echo "✅ Deployment complete!"
echo "   Frontend: http://localhost"
echo "   Backend:  http://localhost:5000"
echo "   API Docs: http://localhost:5000/api-docs"
echo ""
echo "🔍 Check logs: docker-compose logs -f"
