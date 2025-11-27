# TradeGPT.sbs - Domain Configuration Guide

## 🌐 Your Domain: tradegpt.sbs

All files have been updated to use your domain. Here's your complete DNS and deployment setup.

---

## 📋 DNS Configuration

Configure these DNS records in your domain registrar (Namecheap, GoDaddy, etc.):

### Main Website (tradegpt.sbs)
```
Type: A
Name: @
Value: [Your hosting IP or use CNAME below]
TTL: 3600

OR (if using Netlify):

Type: CNAME  
Name: @
Value: your-site.netlify.app
TTL: 3600
```

### WWW Subdomain
```
Type: CNAME
Name: www
Value: tradegpt.sbs (or your-site.netlify.app)
TTL: 3600
```

### Admin Dashboard (admin.tradegpt.sbs)
```
Type: CNAME
Name: admin
Value: tradegpt.sbs (or your-site.netlify.app)
TTL: 3600
```

### API Backend (api.tradegpt.sbs)
```
Type: CNAME
Name: api
Value: your-backend.railway.app
TTL: 3600
```

### Email (optional)
```
Type: MX
Name: @
Value: mx1.your-email-provider.com
Priority: 10
TTL: 3600
```

---

## 🚀 Deployment Architecture

```
tradegpt.sbs (Main Site)
├── Frontend → Netlify/Hostinger
├── Forms → Submit to api.tradegpt.sbs
└── Links to admin.tradegpt.sbs

www.tradegpt.sbs
└── Redirects to tradegpt.sbs

admin.tradegpt.sbs (Admin Panel)
├── Admin Dashboard → Netlify/Hostinger
├── Connects to api.tradegpt.sbs
└── Manages all leads

api.tradegpt.sbs (Backend)
├── Flask API → Railway
├── Database → PostgreSQL/SQLite
├── Endpoints → /api/leads, /api/analytics, etc.
└── Email notifications
```

---

## 📁 Recommended Hosting Setup

### Option 1: Netlify + Railway (Recommended)

**Frontend (Netlify - Free):**
- tradegpt.sbs → Main landing pages
- www.tradegpt.sbs → Redirect to main
- admin.tradegpt.sbs → Admin dashboard

**Backend (Railway - $5-20/month):**
- api.tradegpt.sbs → Backend API + Database

**Cost:** $5-20/month

### Option 2: Hostinger All-in-One

**Single Hosting Account:**
- tradegpt.sbs → All pages
- admin.tradegpt.sbs → Admin (subfolder or subdomain)
- api.tradegpt.sbs → Backend (Python app)

**Cost:** $2.99-$4.99/month

---

## 🔧 Configuration Files Updated

### 1. Frontend (script.js)
```javascript
// Automatically detects environment
const apiURL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/leads'
    : 'https://api.tradegpt.sbs/api/leads';
```

### 2. Admin Dashboard (admin-script.js)
```javascript
// Automatically detects environment
this.baseURL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://api.tradegpt.sbs/api';
```

### 3. Backend CORS (app.py)
```python
allowed_origins = [
    'https://tradegpt.sbs',
    'https://www.tradegpt.sbs',
    'https://admin.tradegpt.sbs',
    'https://api.tradegpt.sbs',
    'http://localhost:8000',  # Development
    'http://localhost:5000'   # Development
]
```

### 4. Email Notifications (email_notifications.py)
```python
# Links updated to:
- Admin dashboard: https://admin.tradegpt.sbs
- Education page: https://tradegpt.sbs/education.html
- Contact: support@tradegpt.sbs
```

### 5. Environment Variables (.env)
```env
SENDER_EMAIL=support@tradegpt.sbs
ADMIN_EMAIL=admin@tradegpt.sbs
ALLOWED_ORIGINS=https://tradegpt.sbs,https://www.tradegpt.sbs,https://admin.tradegpt.sbs
```

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Railway

```bash
cd backend

# Login to Railway
railway login

# Create new project
railway init

# Set environment variables
railway variables set DATABASE_URL=postgresql://...
railway variables set SECRET_KEY=your-secret-key-here
railway variables set SENDER_EMAIL=support@tradegpt.sbs
railway variables set ADMIN_EMAIL=admin@tradegpt.sbs

# Deploy
railway up

# Get your Railway URL
railway status
# Example: tradegpt-production-abc123.up.railway.app
```

### Step 2: Configure Custom Domain on Railway

1. Go to Railway Dashboard → Your Project → Settings
2. Click "Add Custom Domain"
3. Enter: `api.tradegpt.sbs`
4. Copy the CNAME value
5. Add to your DNS:
   ```
   Type: CNAME
   Name: api
   Value: [Railway CNAME from dashboard]
   ```

### Step 3: Deploy Frontend to Netlify

```bash
# Option A: Connect Git Repository
1. Go to netlify.com
2. Click "Add new site" → "Import from Git"
3. Select your repository
4. Deploy

# Option B: Manual Deploy
1. Drag and drop your files to Netlify
2. Or use Netlify CLI:
   npm install -g netlify-cli
   netlify deploy --prod
```

### Step 4: Configure Custom Domains on Netlify

1. **Main Domain (tradegpt.sbs):**
   - Netlify Dashboard → Domain Settings
   - Add custom domain: `tradegpt.sbs`
   - Follow Netlify's DNS instructions

2. **WWW Subdomain:**
   - Add: `www.tradegpt.sbs`
   - Netlify will auto-redirect to main domain

3. **Admin Subdomain (admin.tradegpt.sbs):**
   - Add: `admin.tradegpt.sbs`
   - Point to admin folder or separate Netlify site

### Step 5: Configure SSL Certificates

**Railway:**
- Automatic SSL for api.tradegpt.sbs (no action needed)

**Netlify:**
- Automatic SSL for all domains (no action needed)

**Hostinger:**
- Enable free SSL in cPanel → SSL/TLS

---

## 📧 Email Configuration

### Option 1: Use Professional Email (Recommended)

**Setup email@tradegpt.sbs:**

1. **Hostinger Email:**
   - Included with hosting ($2.99/month)
   - Create: support@tradegpt.sbs, admin@tradegpt.sbs

2. **Google Workspace:**
   - $6/user/month
   - Professional email with tradegpt.sbs domain

3. **Zoho Mail:**
   - Free for 5 users
   - Professional email with custom domain

### Option 2: Use Gmail with Custom Domain

1. Set up email forwarding in DNS
2. Configure "Send As" in Gmail
3. Use Gmail SMTP with tradegpt.sbs return address

### Backend Email Settings (.env)

```env
# For custom domain email
SMTP_SERVER=smtp.hostinger.com
SMTP_PORT=587
SENDER_EMAIL=support@tradegpt.sbs
SENDER_PASSWORD=your-password
ADMIN_EMAIL=admin@tradegpt.sbs

# For Gmail
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-gmail@gmail.com
SENDER_PASSWORD=your-app-password
ADMIN_EMAIL=admin@tradegpt.sbs
```

---

## 🧪 Testing Your Setup

### 1. Test DNS Propagation
```bash
# Check if DNS is working (wait 1-24 hours after setup)
nslookup tradegpt.sbs
nslookup www.tradegpt.sbs
nslookup admin.tradegpt.sbs
nslookup api.tradegpt.sbs
```

### 2. Test Website Access
```
✅ https://tradegpt.sbs (Main site)
✅ https://www.tradegpt.sbs (Redirect to main)
✅ https://admin.tradegpt.sbs (Admin dashboard)
✅ https://api.tradegpt.sbs (Should show "Not Found" - that's OK)
```

### 3. Test API Endpoints
```bash
# Test lead submission
curl -X POST https://api.tradegpt.sbs/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "investment": "250-999",
    "source": "website"
  }'

# Test admin login
curl -X POST https://api.tradegpt.sbs/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "trader07",
    "password": "trade123"
  }'
```

### 4. Test Form Submission
1. Go to https://tradegpt.sbs
2. Fill out signup form
3. Submit
4. Check admin dashboard: https://admin.tradegpt.sbs
5. Verify lead appears

### 5. Test Email Notifications
1. Submit a test lead
2. Check admin@tradegpt.sbs inbox
3. Check test lead's inbox for welcome email

---

## 🔒 Security Checklist

Before going live:

- [ ] Change admin password from `trade123`
- [ ] Update `SECRET_KEY` in backend .env
- [ ] Enable HTTPS on all domains
- [ ] Configure CORS with only your domains
- [ ] Set up email authentication (SPF, DKIM, DMARC)
- [ ] Enable rate limiting on API
- [ ] Configure backup system
- [ ] Set up monitoring and error alerts
- [ ] Review privacy policy with correct domain
- [ ] Update terms and conditions with correct domain

---

## 🌐 Folder Structure for Hosting

### Netlify/Hostinger File Structure:
```
public_html/ (or root)
├── index.html (Main landing)
├── landing-page-trade-gpt.html
├── page2-lead-capture.html
├── page3-thankyou.html
├── education.html
├── privacy-policy.html
├── terms-conditions.html
├── script.js (Updated with api.tradegpt.sbs)
├── styles.css
├── funnel-styles.css
├── education-styles.css
├── logo.svg
└── admin/ (Admin dashboard)
    ├── index.html
    ├── admin-script.js (Updated with api.tradegpt.sbs)
    └── admin-styles.css
```

---

## 📊 Subdomain Usage

### tradegpt.sbs
- Main landing page
- Lead capture forms
- Education resources
- Privacy policy, terms

### www.tradegpt.sbs
- Redirects to main domain

### admin.tradegpt.sbs
- Admin login
- Lead management
- Analytics dashboard
- Export tools

### api.tradegpt.sbs
- Backend API
- Database
- Email notifications
- CRM integrations

---

## 💡 Pro Tips

1. **Use Cloudflare** (free) for:
   - Fast DNS propagation
   - DDoS protection
   - CDN (faster site loading)
   - Additional SSL options

2. **Set up redirects:**
   - http → https (force SSL)
   - www → non-www (or vice versa)
   - old URLs → new URLs

3. **Monitor uptime:**
   - UptimeRobot (free)
   - Pingdom
   - StatusCake

4. **Analytics:**
   - Google Analytics
   - Cloudflare Analytics
   - Railway metrics

---

## 🆘 Troubleshooting

### "Unable to connect to API"
- Check DNS is propagated: `nslookup api.tradegpt.sbs`
- Verify Railway deployment is running
- Check CORS settings in backend
- Verify SSL certificates are active

### "403 Forbidden" on admin
- Check file permissions
- Verify admin folder is uploaded
- Check .htaccess rules (if using Apache)

### Email not sending
- Verify SMTP credentials in .env
- Check email provider allows SMTP
- For Gmail: use App Password, not regular password
- Check spam folder

### DNS not resolving
- Wait 1-24 hours for DNS propagation
- Clear DNS cache: `ipconfig /flushdns`
- Try different DNS server: 8.8.8.8 (Google)

---

## 📞 Support Resources

**Your Domain:** tradegpt.sbs

**Hosting Providers:**
- Railway: https://railway.app/help
- Netlify: https://www.netlify.com/support/
- Hostinger: https://www.hostinger.com/contact

**DNS Checker:** https://dnschecker.org
**SSL Checker:** https://www.sslshopper.com/ssl-checker.html

---

## ✅ Quick Deployment Checklist

- [ ] Set up DNS records for tradegpt.sbs
- [ ] Deploy backend to Railway
- [ ] Configure api.tradegpt.sbs on Railway
- [ ] Deploy frontend to Netlify/Hostinger
- [ ] Configure tradegpt.sbs on hosting
- [ ] Set up admin.tradegpt.sbs subdomain
- [ ] Enable SSL on all domains
- [ ] Test form submissions
- [ ] Configure email (support@tradegpt.sbs)
- [ ] Test email notifications
- [ ] Update admin password
- [ ] Set up daily backups
- [ ] Configure monitoring
- [ ] Test all pages and features

---

## 🎉 You're Ready!

All configuration files have been updated for **tradegpt.sbs**!

Next steps:
1. Set up DNS records
2. Deploy backend to Railway
3. Deploy frontend to Netlify
4. Configure custom domains
5. Test everything

Your system will automatically use the correct URLs based on environment (local vs production).

Good luck with your launch! 🚀
