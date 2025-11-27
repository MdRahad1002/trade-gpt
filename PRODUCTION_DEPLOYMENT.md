# TradeGPT Production Deployment Configuration

## Environment Variables for Production

Create a `.env` file in the backend directory with these settings:

```env
# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-change-this-in-production
DEBUG=False

# Database (Use PostgreSQL for production)
DATABASE_URL=postgresql://username:password@localhost:5432/tradegpt_db
# Or for SQLite in production (not recommended)
# DATABASE_URL=sqlite:///production.db

# Email Configuration (Gmail example)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-specific-password
ADMIN_EMAIL=admin@tradegpt.com

# CORS Allowed Origins (your production domains)
ALLOWED_ORIGINS=https://tradegpt.com,https://www.tradegpt.com,https://admin.tradegpt.com

# API Configuration
API_RATE_LIMIT=100/hour
MAX_LEADS_PER_IP=5/day

# CRM Integration Keys (Optional)
HUBSPOT_API_KEY=your-hubspot-api-key
SALESFORCE_API_KEY=your-salesforce-api-key
PIPEDRIVE_API_KEY=your-pipedrive-api-key

# Security
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_HTTPONLY=True
SESSION_COOKIE_SAMESITE=Strict

# Logging
LOG_LEVEL=INFO
LOG_FILE=/var/log/tradegpt/app.log
```

## Deployment Steps

### 1. Railway Deployment (Recommended - Easiest)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy backend
cd backend
railway up

# Get your backend URL
railway status
# Example: https://tradegpt-production-xxxx.up.railway.app
```

### 2. Update Frontend Configuration

Update these files with your production backend URL:

**admin/admin-script.js:**
```javascript
this.baseURL = 'https://your-backend-url.railway.app/api';
```

**script.js:**
```javascript
const response = await fetch('https://your-backend-url.railway.app/api/leads', {
```

### 3. Hostinger/cPanel Deployment

1. **Upload Files:**
   - Upload all HTML, CSS, JS files to `public_html/`
   - Upload backend to a subdirectory like `public_html/api/`

2. **Setup Python Environment:**
```bash
cd ~/public_html/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **Configure .htaccess:**
```apache
# Redirect API requests to Python backend
RewriteEngine On
RewriteRule ^api/(.*)$ /api/app.py/$1 [L]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 4. Netlify Deployment (Frontend)

1. **Connect Repository:**
   - Go to Netlify Dashboard
   - Click "Add new site"
   - Connect your GitHub repo

2. **Build Settings:**
   - Build command: (leave empty)
   - Publish directory: `/`

3. **Environment Variables:**
   Add in Netlify dashboard:
   ```
   BACKEND_URL=https://your-backend-url.railway.app
   ```

4. **netlify.toml (already configured):**
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.railway.app/api/:splat"
  status = 200
  force = true
```

### 5. Database Migration (PostgreSQL Production)

```bash
# Install PostgreSQL Python driver
pip install psycopg2-binary

# Update app.py database URI
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///leads.db')

# Run migration
python
>>> from app import app, db
>>> with app.app_context():
...     db.create_all()
```

### 6. SSL/HTTPS Configuration

**For Hostinger:**
- Enable free SSL in cPanel
- Force HTTPS redirect in .htaccess

**For Railway:**
- Automatic HTTPS provided

**For Netlify:**
- Automatic HTTPS provided

### 7. Performance Optimization

**Enable Gzip Compression (.htaccess):**
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

**Cache Static Assets:**
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 8. Security Hardening

**Backend (app.py):**
```python
# Add rate limiting
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)

@app.route('/api/leads', methods=['POST'])
@limiter.limit("10 per minute")
def create_lead():
    # ... existing code
```

**Install security dependencies:**
```bash
pip install flask-limiter flask-talisman
```

### 9. Monitoring and Logging

**Setup logging (app.py):**
```python
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/tradegpt.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('TradeGPT startup')
```

### 10. Email Notifications Setup

**For Gmail:**
1. Enable 2-factor authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password in SENDER_PASSWORD env var

**For SendGrid (Recommended for production):**
```bash
pip install sendgrid
```

Update email_notifications.py:
```python
import sendgrid
from sendgrid.helpers.mail import Mail

sg = sendgrid.SendGridAPIClient(api_key=os.getenv('SENDGRID_API_KEY'))
```

## Testing Production Deployment

```bash
# Test backend health
curl https://your-backend-url.railway.app/api/leads

# Test lead creation
curl -X POST https://your-backend-url.railway.app/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "investment": "250-999",
    "source": "test"
  }'

# Test admin login
curl -X POST https://your-backend-url.railway.app/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "trader07",
    "password": "trade123"
  }'
```

## Domain Configuration

### Custom Domain Setup

1. **Point DNS to Netlify:**
   - A Record: `185.199.108.153`
   - CNAME: `your-site.netlify.app`

2. **Update Backend CORS:**
```python
allowed_origins = [
    'https://tradegpt.com',
    'https://www.tradegpt.com',
    'https://admin.tradegpt.com'
]
```

3. **Update Admin Dashboard URL:**
```javascript
this.baseURL = 'https://api.tradegpt.com/api';
```

## Backup Strategy

**Automated Database Backup (cron job):**
```bash
# Add to crontab: crontab -e
0 2 * * * cd ~/tradegpt/backend && python backup_db.py
```

**backup_db.py:**
```python
import shutil
from datetime import datetime

backup_file = f"backups/leads_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
shutil.copy('instance/leads.db', backup_file)
print(f"Backup created: {backup_file}")
```

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database configured and migrated
- [ ] Environment variables set
- [ ] Email notifications working
- [ ] HTTPS/SSL enabled
- [ ] Analytics tracking enabled
- [ ] Admin login working
- [ ] Lead form submissions working
- [ ] CRM integrations configured
- [ ] Error logging enabled
- [ ] Backup system configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Custom domain configured (if applicable)

## Support and Maintenance

**Regular Tasks:**
- Monitor error logs daily
- Review lead quality weekly
- Update CRM integrations monthly
- Backup database weekly
- Update dependencies quarterly
- Review analytics monthly

**Emergency Contacts:**
- Railway Support: https://railway.app/support
- Hostinger Support: https://www.hostinger.com/contact
- Netlify Support: https://www.netlify.com/support/

## Cost Estimates

**Railway (Backend):**
- Hobby Plan: $5/month
- Pro Plan: $20/month (recommended)

**Netlify (Frontend):**
- Starter: Free
- Pro: $19/month (for advanced features)

**Hostinger (Alternative full hosting):**
- Premium: $2.99/month
- Business: $4.99/month

**Total Monthly Cost:**
- Budget: $0-10/month (Railway Hobby + Netlify Free)
- Recommended: $25-40/month (Railway Pro + Netlify Pro)
