# 🚀 Trade GPT - Live Hosting Deployment Guide

## Overview

This guide will help you deploy your Trade GPT landing page and CRM system to production. We'll cover multiple hosting options from free to premium.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:
- [ ] Both servers run locally without errors
- [ ] Database has some test leads
- [ ] Admin login works (admin/admin123)
- [ ] Form submission creates leads
- [ ] Webhook integration tested
- [ ] All files committed to Git (optional but recommended)

---

## 🎯 Recommended Solution: Railway (Free Tier)

**Why Railway?**
- ✅ Free tier available ($5 credit monthly)
- ✅ Zero config deployment
- ✅ Automatic HTTPS
- ✅ GitHub integration
- ✅ Python/Flask support
- ✅ SQLite database support

### Step 1: Prepare Your Project

1. **Create a `requirements.txt` file** (if not exists):

```bash
cd "c:\Users\albion mulaj\trade-gpt-landing\backend"
pip freeze > requirements.txt
```

Or create it manually with:
```
Flask==3.1.2
Flask-SQLAlchemy==3.1.1
Flask-CORS==4.0.0
pandas==2.2.0
openpyxl==3.1.2
requests==2.31.0
Werkzeug==3.0.1
```

2. **Create `Procfile`** in backend folder:

```bash
cd backend
```

Create file named `Procfile` (no extension) with content:
```
web: python app.py
```

3. **Update app.py for production**:

Add at the bottom of `app.py`:
```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

### Step 2: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub (recommended)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your repository

3. **Configure Backend Service**
   - Click "Add Service" → "GitHub Repo"
   - Select the backend folder
   - Railway will auto-detect Python/Flask
   - Click "Deploy"

4. **Add Environment Variables**
   - Go to your service settings
   - Click "Variables" tab
   - Add:
     ```
     PORT=5000
     SECRET_KEY=your-super-secret-key-change-this
     FLASK_ENV=production
     ```

5. **Generate Domain**
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://your-app.railway.app`)

### Step 3: Deploy Frontend to Netlify (Free)

1. **Create `netlify.toml`** in root folder:

```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Update Frontend API URL**

In `script.js`, change:
```javascript
// OLD:
const response = await fetch('http://localhost:5000/api/leads', {

// NEW:
const response = await fetch('https://your-app.railway.app/api/leads', {
```

In `admin/admin-script.js`, change:
```javascript
// OLD:
this.baseURL = 'http://localhost:5000/api';

// NEW:
this.baseURL = 'https://your-app.railway.app/api';
```

3. **Deploy to Netlify**
   - Go to https://netlify.com
   - Sign up / Login
   - Click "Add new site" → "Deploy manually"
   - Drag and drop these files:
     - index.html
     - script.js
     - styles.css
     - logo.svg
     - admin/ folder (entire folder)
   - Click "Deploy"
   - Your site will be live at `https://random-name.netlify.app`

4. **Custom Domain (Optional)**
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Follow DNS instructions

### Step 4: Update CORS Settings

In `backend/app.py`, update CORS:

```python
# OLD:
CORS(app, supports_credentials=True, origins=['http://localhost:8000', 'http://127.0.0.1:8000'])

# NEW:
CORS(app, supports_credentials=True, origins=[
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'https://your-site.netlify.app',
    'https://your-custom-domain.com'
])
```

Redeploy to Railway after this change.

---

## 🔄 Alternative: Render (Free Tier)

### Backend on Render

1. **Create `render.yaml`** in backend folder:

```yaml
services:
  - type: web
    name: trade-gpt-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python app.py
    envVars:
      - key: PORT
        value: 5000
      - key: FLASK_ENV
        value: production
```

2. **Deploy Steps**
   - Go to https://render.com
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Connect repository
   - Select backend folder
   - Click "Create Web Service"
   - Copy the URL

3. **Frontend on Render**
   - Click "New +" → "Static Site"
   - Connect repository
   - Set publish directory: `.`
   - Deploy

---

## 💰 Alternative: Vercel (Free)

### Frontend Only on Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd "c:\Users\albion mulaj\trade-gpt-landing"
vercel
```

3. **Follow prompts**:
   - Login with GitHub
   - Select project
   - Confirm settings
   - Deploy

4. **Update API URLs** in `script.js` and `admin-script.js`

---

## 🏢 Alternative: Traditional VPS (DigitalOcean, Linode)

### Cost: $5-12/month

### Step 1: Create Droplet

1. **Sign up at DigitalOcean**
   - Go to https://digitalocean.com
   - Get $200 credit (new accounts)

2. **Create Droplet**
   - Click "Create" → "Droplets"
   - Choose Ubuntu 22.04 LTS
   - Select $6/month plan
   - Create SSH key (optional)
   - Click "Create Droplet"

### Step 2: Connect to Server

```bash
ssh root@your-server-ip
```

### Step 3: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Python and pip
apt install python3 python3-pip python3-venv nginx -y

# Install Node.js (for frontend if needed)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install nodejs -y
```

### Step 4: Upload Files

From your local machine:
```bash
# Upload backend
scp -r "c:\Users\albion mulaj\trade-gpt-landing\backend" root@your-server-ip:/var/www/

# Upload frontend
scp -r "c:\Users\albion mulaj\trade-gpt-landing\*" root@your-server-ip:/var/www/frontend/
```

### Step 5: Setup Backend

On server:
```bash
cd /var/www/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create systemd service
nano /etc/systemd/system/tradegpt-backend.service
```

Add this content:
```ini
[Unit]
Description=Trade GPT Backend
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/backend
Environment="PATH=/var/www/backend/venv/bin"
ExecStart=/var/www/backend/venv/bin/python app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
systemctl enable tradegpt-backend
systemctl start tradegpt-backend
systemctl status tradegpt-backend
```

### Step 6: Setup Nginx

```bash
nano /etc/nginx/sites-available/tradegpt
```

Add this configuration:
```nginx
# Backend API
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /admin {
        alias /var/www/frontend/admin;
        index index.html;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/tradegpt /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 7: Setup SSL (Free with Let's Encrypt)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com

# Auto-renewal
certbot renew --dry-run
```

---

## 🌍 Domain Setup

### Option 1: Use Netlify/Railway Domain
- No configuration needed
- Free subdomain provided
- Example: `https://trade-gpt.netlify.app`

### Option 2: Buy Custom Domain

1. **Purchase domain** from:
   - Namecheap ($8-12/year)
   - GoDaddy ($12-20/year)
   - Google Domains ($12/year)
   - Cloudflare ($8-9/year)

2. **Update DNS Records**:

For Netlify frontend:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

For Railway backend:
```
Type: CNAME
Name: api
Value: your-app.railway.app
```

3. **Wait for DNS propagation** (5 minutes - 48 hours)

---

## 🔒 Production Security Checklist

### Backend Security

1. **Change Default Password**

In `backend/app.py`, update admin credentials:
```python
# Around line 80-90
if not Admin.query.first():
    admin = Admin(
        username='your-admin-username',  # Change this
        password_hash=generate_password_hash('your-secure-password')  # Change this
    )
```

2. **Use Environment Variables**

Update `app.py`:
```python
import os

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'fallback-secret')
```

On Railway/Render, add environment variable:
```
SECRET_KEY=your-super-secret-random-string-here
```

3. **Enable HTTPS Only**

In `app.py`:
```python
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Strict'
```

4. **Database Backup**

Set up automatic backups:
- Railway: Automatic backups included
- VPS: Use cron job

```bash
# Add to crontab
0 2 * * * cp /var/www/backend/leads.db /var/backups/leads-$(date +\%Y\%m\%d).db
```

### Frontend Security

1. **Update API URLs** to HTTPS
2. **Add CSP Headers** (Content Security Policy)
3. **Enable rate limiting** on form submission

---

## 📊 Monitoring & Maintenance

### Setup Monitoring

1. **UptimeRobot** (Free)
   - Go to https://uptimerobot.com
   - Add monitor for your site
   - Get alerts if site goes down

2. **Google Analytics**
   - Add tracking code to `index.html`
   - Monitor traffic and conversions

3. **Error Tracking**
   - Add Sentry.io for error tracking
   - Free tier: 5,000 errors/month

### Regular Maintenance

- [ ] Check logs weekly
- [ ] Backup database monthly
- [ ] Update dependencies quarterly
- [ ] Review leads daily
- [ ] Test webhooks monthly

---

## 🚀 Quick Deploy Script (VPS)

Save as `deploy.sh`:

```bash
#!/bin/bash

# Update code
cd /var/www/backend
git pull origin main

# Restart backend
systemctl restart tradegpt-backend

# Update frontend
cd /var/www/frontend
# Copy new files here

# Reload nginx
nginx -t && systemctl reload nginx

echo "Deployment complete!"
```

Make executable:
```bash
chmod +x deploy.sh
```

Run:
```bash
./deploy.sh
```

---

## 💡 Recommended Setup (Best Value)

**For Small Business (Free):**
- Frontend: Netlify
- Backend: Railway
- Database: SQLite (included)
- Domain: Use free subdomain
- **Cost: $0/month** (within free tiers)

**For Growing Business ($12/month):**
- Frontend: Netlify
- Backend: Railway Pro ($5/month)
- Domain: Custom domain ($12/year = $1/month)
- SSL: Free (Let's Encrypt)
- **Cost: ~$6/month + domain**

**For Enterprise ($20/month+):**
- Frontend & Backend: DigitalOcean VPS ($12/month)
- Database: Managed PostgreSQL ($15/month)
- Domain: Custom ($12/year)
- SSL: Free
- **Cost: ~$28/month**

---

## 🆘 Troubleshooting

### Issue: CORS Errors
**Solution:** Update `app.py` CORS settings with your production domain

### Issue: 502 Bad Gateway
**Solution:** Check backend logs, ensure service is running

### Issue: Database not persisting
**Solution:** Check file permissions, use persistent storage

### Issue: Webhook not working
**Solution:** Use ngrok temporarily, then switch to production URL

### Issue: Form not submitting
**Solution:** Check API URL in `script.js`, verify CORS

---

## 📞 Next Steps

1. Choose hosting option (Railway + Netlify recommended)
2. Create accounts
3. Deploy backend first
4. Update API URLs in frontend
5. Deploy frontend
6. Test end-to-end
7. Configure custom domain
8. Setup monitoring
9. Go live! 🎉

---

## 📚 Additional Resources

- Railway Docs: https://docs.railway.app
- Netlify Docs: https://docs.netlify.com
- Flask Deployment: https://flask.palletsprojects.com/en/2.3.x/deploying/
- Let's Encrypt: https://letsencrypt.org

---

**Need Help?**
- Check backend logs first
- Test locally before deploying
- Use ngrok for testing webhooks
- Start with free tiers

**Last Updated:** November 13, 2025
