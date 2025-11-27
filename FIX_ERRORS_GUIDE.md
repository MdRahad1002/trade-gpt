# Fix Guide for Admin Login & Page2 Errors

## Issues Identified

### 1. Admin Login Error (Database Issue)
**Error**: `(psycopg2.errors.UndefinedTable) relation "admin" does not exist`

**Cause**: The production PostgreSQL database doesn't have the admin table created.

**Solution**: Initialize the production database with all required tables.

### 2. Page2 SSL Error
**Error**: `ERR_SSL_PROTOCOL_ERROR - This site can't provide a secure connection`

**Cause**: The site is being accessed via HTTPS but SSL/TLS is not properly configured on the server.

**Solution**: Access the site via HTTP initially, or configure SSL certificate properly.

---

## Fixes

### Fix 1: Initialize Production Database

#### Option A: Run the initialization script on production server

1. SSH into your production server (Render/Railway/Hostinger)

2. Navigate to the backend directory:
```bash
cd /path/to/backend
```

3. Run the initialization script:
```bash
python init_production_db.py --force
```

This will:
- Create all database tables (lead, admin, contact_submission, crm_integration)
- Create default admin user:
  - Username: `tradeadmin`
  - Password: `adm1234`
  - Email: `admin@tradegpt.sbs`

#### Option B: Use Python shell on production

```bash
python
```

Then run:
```python
from app import app, db, Admin
from werkzeug.security import generate_password_hash

with app.app_context():
    # Create all tables
    db.create_all()
    
    # Create admin
    admin = Admin(
        username='tradeadmin',
        email='admin@tradegpt.sbs',
        password_hash=generate_password_hash('adm1234'),
        is_active=True
    )
    db.session.add(admin)
    db.session.commit()
    print("Admin created successfully!")
```

#### Option C: Add initialization to app startup

The `app.py` file already has an `init_db()` function that should create the admin user automatically. Make sure it's being called on production startup.

Check if this code is in your `app.py` at the bottom:
```python
if __name__ == '__main__':
    init_db()  # This creates the admin if it doesn't exist
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=port, debug_mode)
```

### Fix 2: SSL/HTTPS Configuration

#### Immediate Solution: Use HTTP instead of HTTPS

For testing and development, access your site via HTTP:
- Instead of: `https://tradegpt.sbs/page2-lead-capture.html`
- Use: `http://tradegpt.sbs/page2-lead-capture.html`

#### Permanent Solution: Configure SSL Certificate

Depending on your hosting provider:

##### For Hostinger:
1. Go to Hostinger control panel
2. Navigate to SSL section
3. Enable "Force HTTPS" option
4. Install Let's Encrypt SSL certificate (free)
5. Wait 10-15 minutes for propagation

##### For Render:
1. Render automatically provides SSL certificates
2. Make sure your domain is properly connected
3. Check DNS settings point to Render

##### For Railway:
1. Railway provides SSL automatically
2. Ensure custom domain is properly configured
3. Wait for SSL certificate to provision (can take up to 24 hours)

##### For Cloudflare (Recommended):
1. Sign up for Cloudflare (free)
2. Add your domain `tradegpt.sbs`
3. Update nameservers at your domain registrar
4. Enable "Full" or "Full (Strict)" SSL/TLS encryption mode
5. Enable "Always Use HTTPS" in SSL/TLS settings

---

## Testing the Fixes

### Test Admin Login:

1. Access the admin page:
   - `http://tradegpt.sbs/admin` (if SSL not configured)
   - `https://tradegpt.sbs/admin` (if SSL configured)

2. Login with:
   - Username: `tradeadmin`
   - Password: `adm1234`

3. You should see the admin dashboard with leads

### Test Page2:

1. Access page2:
   - `http://tradegpt.sbs/page2-lead-capture.html` (if SSL not configured)
   - `https://tradegpt.sbs/page2-lead-capture.html` (if SSL configured)

2. Fill out the form
3. Submit and verify redirect to page3

---

## Quick Commands

### Check if backend is running:
```bash
curl http://localhost:5000/api/leads
# or
curl https://tradegpt.sbs/api/leads
```

### Check database tables:
```python
from app import app, db
with app.app_context():
    inspector = db.inspect(db.engine)
    print("Tables:", inspector.get_table_names())
```

### Reset admin password:
```python
from app import app, db, Admin
from werkzeug.security import generate_password_hash

with app.app_context():
    admin = Admin.query.filter_by(username='tradeadmin').first()
    admin.password_hash = generate_password_hash('new_password_here')
    db.session.commit()
    print("Password updated!")
```

---

## Common Issues

### Issue: "Could not connect to database"
**Solution**: Check DATABASE_URL environment variable is set correctly

### Issue: "CORS error"
**Solution**: The app.py already has CORS configured for tradegpt.sbs domain

### Issue: "500 Internal Server Error"
**Solution**: Check application logs:
```bash
# For Render
render logs

# For Railway
railway logs

# For Hostinger
Check error_log in public_html
```

---

## Environment Variables to Check

Make sure these are set in production:

```bash
DATABASE_URL=postgresql://user:password@host:5432/database
SECRET_KEY=your-secret-key-here
FLASK_ENV=production
PORT=5000
```

---

## Contact & Support

If issues persist:
1. Check application logs for detailed error messages
2. Verify database connection string
3. Ensure all tables are created (`admin`, `lead`, `contact_submission`, `crm_integration`)
4. Test API endpoints directly with curl or Postman

The main issues are:
1. **Production database not initialized** - Fix with init_production_db.py
2. **SSL not configured** - Use HTTP temporarily or configure SSL certificate

Both are common deployment issues and easily fixable!
