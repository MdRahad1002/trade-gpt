#!/bin/bash
# Production Database Fix Commands
# Run these commands on your production server (Render/Railway/Hostinger)

echo "=========================================="
echo "TradeGPT Production Database Fix"
echo "=========================================="
echo ""

# Step 1: Check Python version
echo "Step 1: Checking Python version..."
python --version || python3 --version

# Step 2: Check current directory
echo ""
echo "Step 2: Current directory:"
pwd

# Step 3: Install dependencies if needed
echo ""
echo "Step 3: Ensuring dependencies are installed..."
pip install flask flask-sqlalchemy flask-cors psycopg2-binary werkzeug

# Step 4: Initialize database
echo ""
echo "Step 4: Initializing database..."
python init_production_db.py --force

# Alternative: Use app's init_db function
# python -c "from app import init_db; init_db()"

# Step 5: Verify admin user
echo ""
echo "Step 5: Verifying admin user..."
python << EOF
from app import app, Admin
with app.app_context():
    admin = Admin.query.filter_by(username='tradeadmin').first()
    if admin:
        print("✅ Admin user found!")
        print(f"   Username: {admin.username}")
        print(f"   Email: {admin.email}")
        print(f"   Active: {admin.is_active}")
    else:
        print("❌ Admin user not found!")
EOF

# Step 6: List all tables
echo ""
echo "Step 6: Listing database tables..."
python << EOF
from app import app, db
with app.app_context():
    inspector = db.inspect(db.engine)
    tables = inspector.get_table_names()
    print(f"Found {len(tables)} tables:")
    for table in tables:
        print(f"  • {table}")
EOF

echo ""
echo "=========================================="
echo "Fix Complete!"
echo "=========================================="
echo ""
echo "Admin Credentials:"
echo "  Username: tradeadmin"
echo "  Password: adm1234"
echo ""
echo "Test the admin login at:"
echo "  https://tradegpt.sbs/admin"
echo "  or"
echo "  http://tradegpt.sbs/admin (if SSL not configured)"
echo ""
