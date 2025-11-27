"""
Production Database Initialization Script
Run this on the production server to create all tables including the admin table
"""

import os
import sys
from app import app, db, Admin
from werkzeug.security import generate_password_hash

def init_production_database():
    """Initialize database tables and create default admin"""
    print("=" * 60)
    print("Production Database Initialization")
    print("=" * 60)
    print()
    
    with app.app_context():
        try:
            # Drop all tables if they exist (optional - comment out if you want to keep existing data)
            # db.drop_all()
            # print("✅ Dropped existing tables")
            
            # Create all tables
            print("Creating all database tables...")
            db.create_all()
            print("✅ All tables created successfully")
            print()
            
            # Check if admin exists
            existing_admin = Admin.query.filter_by(username='tradeadmin').first()
            
            if existing_admin:
                print("⚠️  Admin user already exists")
                print(f"   Username: {existing_admin.username}")
                print(f"   Email: {existing_admin.email}")
            else:
                # Create default admin
                admin = Admin(
                    username='tradeadmin',
                    email='admin@tradegpt.sbs',
                    password_hash=generate_password_hash('adm1234'),
                    is_active=True
                )
                db.session.add(admin)
                db.session.commit()
                
                print("✅ Default admin user created")
                print(f"   Username: tradeadmin")
                print(f"   Password: adm1234")
                print(f"   Email: admin@tradegpt.sbs")
                print()
                print("⚠️  IMPORTANT: Change the password after first login!")
            
            print()
            print("=" * 60)
            print("✅ Database Initialization Complete!")
            print("=" * 60)
            print()
            
            # List all tables
            print("Created tables:")
            inspector = db.inspect(db.engine)
            for table_name in inspector.get_table_names():
                print(f"  • {table_name}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == '__main__':
    # Check if DATABASE_URL is set (production environment)
    database_url = os.environ.get('DATABASE_URL')
    
    if database_url:
        print(f"Using database: {database_url.split('@')[1] if '@' in database_url else 'configured'}")
    else:
        print("Using SQLite database (development mode)")
    
    print()
    
    if len(sys.argv) > 1 and sys.argv[1] == '--force':
        init_production_database()
    else:
        response = input("This will create/update database tables. Continue? (yes/no): ")
        if response.lower() in ['yes', 'y']:
            init_production_database()
        else:
            print("Aborted.")
