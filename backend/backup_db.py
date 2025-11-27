"""
Database backup utility
Run daily via cron job
"""

import shutil
import os
from datetime import datetime, timedelta
import sqlite3

def backup_database():
    """Create a timestamped backup of the database"""
    
    # Ensure backup directory exists
    os.makedirs('backups', exist_ok=True)
    
    # Source database
    source_db = 'instance/leads.db'
    
    if not os.path.exists(source_db):
        print(f"Error: Database not found at {source_db}")
        return False
    
    # Create backup filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = f'backups/leads_backup_{timestamp}.db'
    
    try:
        # Copy database file
        shutil.copy2(source_db, backup_file)
        print(f"✅ Backup created: {backup_file}")
        
        # Get backup size
        size_mb = os.path.getsize(backup_file) / (1024 * 1024)
        print(f"   Size: {size_mb:.2f} MB")
        
        # Clean old backups (keep last 30 days)
        cleanup_old_backups(days=30)
        
        return True
        
    except Exception as e:
        print(f"❌ Backup failed: {e}")
        return False

def cleanup_old_backups(days=30):
    """Remove backups older than specified days"""
    
    backup_dir = 'backups'
    if not os.path.exists(backup_dir):
        return
    
    cutoff_date = datetime.now() - timedelta(days=days)
    removed_count = 0
    
    for filename in os.listdir(backup_dir):
        if filename.startswith('leads_backup_') and filename.endswith('.db'):
            filepath = os.path.join(backup_dir, filename)
            file_time = datetime.fromtimestamp(os.path.getmtime(filepath))
            
            if file_time < cutoff_date:
                try:
                    os.remove(filepath)
                    removed_count += 1
                except Exception as e:
                    print(f"Error removing {filename}: {e}")
    
    if removed_count > 0:
        print(f"🗑️  Removed {removed_count} old backup(s)")

def verify_backup(backup_file):
    """Verify backup integrity"""
    
    try:
        conn = sqlite3.connect(backup_file)
        cursor = conn.cursor()
        
        # Check if tables exist
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        if not tables:
            print("⚠️  Warning: Backup appears empty")
            return False
        
        # Count records in lead table
        cursor.execute("SELECT COUNT(*) FROM lead")
        count = cursor.fetchone()[0]
        print(f"✅ Backup verified: {count} leads")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Backup verification failed: {e}")
        return False

def list_backups():
    """List all available backups"""
    
    backup_dir = 'backups'
    if not os.path.exists(backup_dir):
        print("No backups found")
        return
    
    backups = []
    for filename in os.listdir(backup_dir):
        if filename.startswith('leads_backup_') and filename.endswith('.db'):
            filepath = os.path.join(backup_dir, filename)
            size = os.path.getsize(filepath) / (1024 * 1024)
            mtime = datetime.fromtimestamp(os.path.getmtime(filepath))
            backups.append({
                'file': filename,
                'size': size,
                'date': mtime
            })
    
    if not backups:
        print("No backups found")
        return
    
    print(f"\n📦 Available Backups ({len(backups)}):")
    print("-" * 70)
    
    for backup in sorted(backups, key=lambda x: x['date'], reverse=True):
        print(f"{backup['file']:<40} {backup['size']:>8.2f} MB  {backup['date'].strftime('%Y-%m-%d %H:%M:%S')}")

def restore_backup(backup_file):
    """Restore database from backup"""
    
    if not os.path.exists(backup_file):
        print(f"❌ Backup file not found: {backup_file}")
        return False
    
    # Create a backup of current database before restore
    print("Creating safety backup of current database...")
    safety_backup = f'instance/leads_pre_restore_{datetime.now().strftime("%Y%m%d_%H%M%S")}.db'
    
    if os.path.exists('instance/leads.db'):
        shutil.copy2('instance/leads.db', safety_backup)
        print(f"✅ Safety backup created: {safety_backup}")
    
    try:
        # Restore from backup
        shutil.copy2(backup_file, 'instance/leads.db')
        print(f"✅ Database restored from: {backup_file}")
        
        # Verify restored database
        if verify_backup('instance/leads.db'):
            print("✅ Restore successful and verified")
            return True
        else:
            print("⚠️  Restore completed but verification failed")
            return False
            
    except Exception as e:
        print(f"❌ Restore failed: {e}")
        
        # Try to restore safety backup
        if os.path.exists(safety_backup):
            print("Attempting to restore safety backup...")
            shutil.copy2(safety_backup, 'instance/leads.db')
            print("✅ Safety backup restored")
        
        return False

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == 'backup':
            success = backup_database()
            sys.exit(0 if success else 1)
            
        elif command == 'list':
            list_backups()
            
        elif command == 'restore' and len(sys.argv) > 2:
            backup_file = sys.argv[2]
            success = restore_backup(backup_file)
            sys.exit(0 if success else 1)
            
        elif command == 'verify' and len(sys.argv) > 2:
            backup_file = sys.argv[2]
            success = verify_backup(backup_file)
            sys.exit(0 if success else 1)
            
        else:
            print("Usage:")
            print("  python backup_db.py backup           - Create a new backup")
            print("  python backup_db.py list             - List all backups")
            print("  python backup_db.py restore <file>   - Restore from backup")
            print("  python backup_db.py verify <file>    - Verify backup integrity")
    else:
        # Default: create backup
        backup_database()
