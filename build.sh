#!/bin/bash
# Build script for Render deployment
# This builds the React frontend before starting the Flask backend

echo "🔧 Installing backend dependencies..."
pip install -r requirements.txt

echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🏗️ Building React app..."
npm run build

echo "✅ Build complete! React app will be served by Flask."
cd ..
