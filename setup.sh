#!/bin/bash
# GFG Chapter Platform - Setup Script
# Run this from the project root directory

echo "🚀 GFG Chapter Platform - Setup Script"
echo "======================================"

# Check prerequisites
echo "Checking prerequisites..."
node --version > /dev/null || { echo "❌ Node.js not found"; exit 1; }
python --version > /dev/null || { echo "❌ Python not found"; exit 1; }
psql --version > /dev/null || { echo "❌ PostgreSQL not found"; exit 1; }
echo "✅ All prerequisites found"

# Database setup
echo ""
echo "Setting up database..."
read -p "PostgreSQL username (default: postgres): " pg_user
pg_user=${pg_user:-postgres}
read -sp "PostgreSQL password: " pg_password
echo ""

createdb -U $pg_user gfg_chapter
psql -U $pg_user -d gfg_chapter -f database/schema.sql
echo "✅ Database setup complete"

# Express backend
echo ""
echo "Setting up Express backend..."
cd backend-express
npm install
echo "✅ Express backend setup complete"
cd ..

# Python backend
echo ""
echo "Setting up Python backend..."
cd backend-python
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
echo "✅ Python backend setup complete"
cd ..

# React frontend
echo ""
echo "Setting up React frontend..."
cd frontend
npm install
echo "✅ React frontend setup complete"
cd ..

echo ""
echo "======================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env files with your database credentials"
echo "2. Run: npm run dev (from each backend folder, then frontend)"
echo "3. Open http://localhost:3000 in your browser"
echo ""
