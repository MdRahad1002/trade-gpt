#!/bin/bash

# Trade GPT Deployment Helper Script
# This script helps you prepare your project for deployment

echo "🚀 Trade GPT Deployment Preparation"
echo "===================================="
echo ""

# Check if backend folder exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend folder not found"
    exit 1
fi

echo "✅ Backend folder found"

# Check if requirements.txt exists
if [ ! -f "backend/requirements.txt" ]; then
    echo "⚠️  Creating requirements.txt..."
    cat > backend/requirements.txt << EOF
Flask==3.1.2
Flask-SQLAlchemy==3.1.1
Flask-CORS==4.0.0
pandas==2.2.0
openpyxl==3.1.2
requests==2.31.0
Werkzeug==3.0.1
gunicorn==21.2.0
EOF
    echo "✅ requirements.txt created"
else
    echo "✅ requirements.txt exists"
fi

# Check if Procfile exists
if [ ! -f "backend/Procfile" ]; then
    echo "⚠️  Creating Procfile..."
    echo "web: python app.py" > backend/Procfile
    echo "✅ Procfile created"
else
    echo "✅ Procfile exists"
fi

# Check if netlify.toml exists
if [ ! -f "netlify.toml" ]; then
    echo "⚠️  Creating netlify.toml..."
    cat > netlify.toml << 'EOF'
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF
    echo "✅ netlify.toml created"
else
    echo "✅ netlify.toml exists"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo ""
echo "Backend Preparation:"
echo "  ✓ requirements.txt"
echo "  ✓ Procfile"
echo "  ✓ render.yaml"
echo ""
echo "Frontend Preparation:"
echo "  ✓ netlify.toml"
echo "  ✓ index.html"
echo "  ✓ script.js"
echo "  ✓ styles.css"
echo "  ✓ admin folder"
echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. Deploy Backend:"
echo "   → Go to https://railway.app or https://render.com"
echo "   → Connect GitHub and deploy backend folder"
echo "   → Copy your backend URL"
echo ""
echo "2. Update API URLs:"
echo "   → Edit script.js (line ~250)"
echo "   → Edit admin/admin-script.js (line ~3)"
echo "   → Replace 'http://localhost:5000' with your backend URL"
echo ""
echo "3. Deploy Frontend:"
echo "   → Go to https://netlify.com"
echo "   → Drag & drop your project folder"
echo "   → Your site will be live!"
echo ""
echo "📚 Read QUICK_DEPLOY.md for detailed instructions"
echo ""
