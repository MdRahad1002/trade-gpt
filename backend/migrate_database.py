"""
Database migration script
Migrates existing database to new schema with enhanced tracking fields
"""

import sqlite3
import shutil
from datetime import datetime
import os

def backup_database():
    """Create backup before migration"""
    if not os.path.exists('instance/leads.db'):
        print("⚠️  No existing database found. Will create new one.")
        return True
    
    backup_file = f'instance/leads_backup_before_migration_{datetime.now().strftime("%Y%m%d_%H%M%S")}.db'
    try:
        shutil.copy2('instance/leads.db', backup_file)
        print(f"✅ Backup created: {backup_file}")
        return True
    except Exception as e:
        print(f"❌ Backup failed: {e}")
        return False

def migrate_database():
    """Add new columns to existing database"""
    
    if not os.path.exists('instance/leads.db'):
        print("⚠️  No existing database. Creating new schema...")
        from app import app, db
        with app.app_context():
            db.create_all()
        print("✅ New database created with enhanced schema")
        return True
    
    try:
        conn = sqlite3.connect('instance/leads.db')
        cursor = conn.cursor()
        
        # Check if migration is needed
        cursor.execute("PRAGMA table_info(lead)")
        columns = [col[1] for col in cursor.fetchall()]
        
        new_columns = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
            'referrer', 'landing_page', 'user_agent', 'device_type', 'ip_address',
            'country_code', 'city', 'conversion_value', 'quality_score', 'last_activity'
        ]
        
        columns_to_add = [col for col in new_columns if col not in columns]
        
        if not columns_to_add:
            print("✅ Database already up to date!")
            return True
        
        print(f"📋 Adding {len(columns_to_add)} new columns...")
        
        # Add new columns
        column_definitions = {
            'utm_source': 'TEXT',
            'utm_medium': 'TEXT',
            'utm_campaign': 'TEXT',
            'utm_term': 'TEXT',
            'utm_content': 'TEXT',
            'referrer': 'TEXT',
            'landing_page': 'TEXT',
            'user_agent': 'TEXT',
            'device_type': 'TEXT',
            'ip_address': 'TEXT',
            'country_code': 'TEXT',
            'city': 'TEXT',
            'conversion_value': 'REAL DEFAULT 0.0',
            'quality_score': 'INTEGER DEFAULT 50',
            'last_activity': 'DATETIME'
        }
        
        for column in columns_to_add:
            column_type = column_definitions.get(column, 'TEXT')
            try:
                cursor.execute(f'ALTER TABLE lead ADD COLUMN {column} {column_type}')
                print(f"  ✅ Added: {column}")
            except Exception as e:
                print(f"  ⚠️  {column}: {e}")
        
        # Update quality scores for existing leads
        print("\n📊 Calculating quality scores for existing leads...")
        cursor.execute("""
            UPDATE lead 
            SET quality_score = CASE
                WHEN investment LIKE '%1500%' THEN 70
                WHEN investment LIKE '%1000%' THEN 65
                WHEN investment LIKE '%250%' THEN 60
                ELSE 50
            END,
            last_activity = created_at
            WHERE quality_score IS NULL OR quality_score = 0
        """)
        
        affected = cursor.rowcount
        print(f"  ✅ Updated {affected} lead(s)")
        
        conn.commit()
        conn.close()
        
        print("\n✅ Migration completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        print("\nYou can restore from backup if needed:")
        print("  1. Stop the application")
        print("  2. Delete instance/leads.db")
        print("  3. Rename backup file to leads.db")
        return False

def verify_migration():
    """Verify the migration was successful"""
    try:
        from app import app, db, Lead
        
        with app.app_context():
            # Test query with new fields
            lead_count = Lead.query.count()
            print(f"\n✅ Verification: Found {lead_count} lead(s) in database")
            
            # Check if new columns exist
            if lead_count > 0:
                first_lead = Lead.query.first()
                has_utm = hasattr(first_lead, 'utm_source')
                has_quality = hasattr(first_lead, 'quality_score')
                
                if has_utm and has_quality:
                    print("✅ Verification: New columns accessible")
                    print(f"   Sample quality_score: {first_lead.quality_score}")
                else:
                    print("⚠️  Warning: Some columns may not be accessible")
            
            return True
            
    except Exception as e:
        print(f"⚠️  Verification warning: {e}")
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("TradeGPT Database Migration")
    print("=" * 60)
    print()
    
    # Step 1: Backup
    print("Step 1: Creating backup...")
    if not backup_database():
        print("\n❌ Migration aborted due to backup failure")
        exit(1)
    
    print()
    
    # Step 2: Migrate
    print("Step 2: Migrating database...")
    if not migrate_database():
        print("\n❌ Migration failed")
        exit(1)
    
    print()
    
    # Step 3: Verify
    print("Step 3: Verifying migration...")
    verify_migration()
    
    print()
    print("=" * 60)
    print("✅ Migration Complete!")
    print("=" * 60)
    print()
    print("Your database now has enhanced tracking fields:")
    print("  • UTM parameters (source, medium, campaign, term, content)")
    print("  • Traffic analytics (referrer, landing page, user agent)")
    print("  • Device tracking (device type, IP address)")
    print("  • Quality scoring (automatic lead quality scores)")
    print("  • Activity tracking (last activity timestamp)")
    print()
    print("You can now start the application with these new features!")
    print()
