# 🌐 Hosting on Hostinger - Complete Guide

## Yes, You Can Host on Hostinger!

Hostinger is a traditional web hosting provider that can host your Trade GPT website, but you'll need the right plan.

---

## ⚠️ Important: Two Parts to Host

Your Trade GPT system has **TWO parts**:

1. **Frontend** (HTML/CSS/JS) → ✅ Can host on Hostinger easily
2. **Backend** (Python/Flask API) → ⚠️ Requires specific Hostinger plan

---

## 📋 Hostinger Plan Requirements

### Option 1: Hostinger VPS (RECOMMENDED for full system)

**What you need:**
- **VPS Hosting Plan** (not shared hosting)
- Minimum: VPS 1 plan ($5.99/month)
- Gives you full control to run Python/Flask

**Cost:**
- VPS 1: ~$6-8/month
- VPS 2: ~$10-12/month (better performance)

**Why VPS?**
- Can run Python applications
- Can install Flask and dependencies
- Full server control
- SSH access

### Option 2: Hostinger Shared Hosting (Frontend only)

**What you can host:**
- ✅ Landing page (index.html)
- ✅ Education page (education.html)
- ✅ Admin panel (HTML/CSS/JS files)

**What WON'T work:**
- ❌ Backend API (Python/Flask)
- ❌ Database operations
- ❌ Lead collection/storage
- ❌ Form submissions

**Cost:** $2-4/month

**Solution:** Use Hostinger for frontend + Railway/Render for backend (free)

---

## 🚀 RECOMMENDED SETUP: Hostinger + Railway

**Best of both worlds - Professional + Free**

### Frontend on Hostinger ($3/month)
- Your custom domain (yourdomain.com)
- Professional appearance
- Fast loading
- Good for SEO

### Backend on Railway (FREE)
- Python/Flask API
- Database
- Lead management
- $5 credit/month free tier

**Total Cost:** ~$3/month (vs $6+ for VPS)

---

## 📝 Setup Guide: Hostinger Shared Hosting + Railway Backend

### Step 1: Deploy Backend to Railway (10 min)

1. Go to **https://railway.app**
2. Sign up with GitHub
3. Deploy your `backend` folder
4. Copy your Railway URL: `https://tradegpt-xxxx.up.railway.app`

### Step 2: Update Frontend API URLs (5 min)

Update these files with your Railway URL:

**admin/admin-script.js** (line 6):
```javascript
this.baseURL = 'https://tradegpt-xxxx.up.railway.app/api';
```

**script.js** (lines 275, 629):
```javascript
const response = await fetch('https://tradegpt-xxxx.up.railway.app/api/leads', {
```

### Step 3: Upload to Hostinger (10 min)

1. **Login to Hostinger**
   - Go to hpanel.hostinger.com
   - Access File Manager or use FTP

2. **Upload Frontend Files**
   Navigate to `public_html` folder and upload:
   ```
   ✓ index.html
   ✓ education.html
   ✓ styles.css
   ✓ education-styles.css
   ✓ script.js (with updated API URLs)
   ✓ logo.svg
   ✓ admin/ folder (entire folder)
   ```

3. **Set Permissions**
   - Right-click files → Permissions
   - Set to 644 for files
   - Set to 755 for folders

4. **Test Your Site**
   - Visit: `http://yourdomain.com`
   - Visit: `http://yourdomain.com/admin/`

---

## 🔧 Setup Guide: Hostinger VPS (Full Control)

If you want EVERYTHING on Hostinger, use VPS:

### Step 1: Order VPS

1. Go to Hostinger → VPS Hosting
2. Choose VPS 1 or VPS 2
3. Select Ubuntu 22.04 OS
4. Complete purchase

### Step 2: Connect via SSH

Hostinger will provide:
- IP address: `123.456.789.0`
- Username: `root`
- Password: (in email)

Connect using PuTTY (Windows) or Terminal:
```bash
ssh root@123.456.789.0
```

### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and tools
sudo apt install python3 python3-pip python3-venv nginx -y

# Install certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### Step 4: Upload Your Code

**Option A: Using FTP/SFTP**
- Use FileZilla
- Host: Your VPS IP
- Upload to: `/var/www/tradegpt`

**Option B: Using Git**
```bash
cd /var/www
git clone your-repo-url tradegpt
```

### Step 5: Setup Backend

```bash
cd /var/www/tradegpt/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 6: Create Systemd Service

Create file: `/etc/systemd/system/tradegpt.service`

```ini
[Unit]
Description=Trade GPT Backend
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/tradegpt/backend
Environment="PATH=/var/www/tradegpt/backend/venv/bin"
ExecStart=/var/www/tradegpt/backend/venv/bin/python app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable tradegpt
sudo systemctl start tradegpt
sudo systemctl status tradegpt
```

### Step 7: Configure Nginx

Create file: `/etc/nginx/sites-available/tradegpt`

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend
    root /var/www/tradegpt;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/tradegpt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Setup SSL (HTTPS)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 9: Point Domain to VPS

In Hostinger domain settings:
```
Type: A Record
Name: @
Value: Your VPS IP (123.456.789.0)

Type: A Record
Name: www
Value: Your VPS IP (123.456.789.0)
```

Wait 5-30 minutes for DNS propagation.

---

## 💰 Cost Comparison

### Hostinger Shared + Railway (RECOMMENDED)
- Hostinger Shared: $2-4/month
- Railway Backend: $0/month (free tier)
- **Total: $2-4/month**
- ✅ Easy to setup
- ✅ Professionally hosted frontend
- ✅ Free backend

### Hostinger VPS
- VPS 1: $6-8/month
- **Total: $6-8/month**
- ✅ Full control
- ✅ Everything in one place
- ⚠️ Requires Linux/SSH knowledge

### Railway + Netlify (Easiest)
- Railway: $0/month
- Netlify: $0/month
- **Total: $0/month**
- ✅ Fastest setup (15 minutes)
- ✅ No technical knowledge needed
- ⚠️ Free tier limitations

---

## 🎯 My Recommendation

**For you, I recommend:**

### If you already have Hostinger shared hosting:
→ **Use Hostinger (frontend) + Railway (backend)**
- Upload HTML/CSS/JS to Hostinger
- Deploy backend to Railway (free)
- Update API URLs to point to Railway
- Professional domain + free backend
- **Cost: ~$3/month**

### If you don't have any hosting yet:
→ **Use Railway + Netlify (both free)**
- Fastest setup
- Zero cost to start
- Upgrade later when needed
- **Cost: $0/month**

### If you want full control:
→ **Use Hostinger VPS**
- Everything on one server
- Full control
- Requires technical skills
- **Cost: $6-8/month**

---

## 📞 Hostinger Support

If using Hostinger VPS and need help:
- Live chat: Available 24/7
- Tutorials: hostinger.com/tutorials
- They can help with SSH, server setup

---

## ✅ Quick Decision Guide

**Choose Hostinger Shared IF:**
- ✓ You already have Hostinger hosting
- ✓ You want your own domain
- ✓ You're okay using Railway for backend

**Choose Hostinger VPS IF:**
- ✓ You want everything in one place
- ✓ You know Linux/SSH
- ✓ You want full control

**Choose Railway + Netlify IF:**
- ✓ You want fastest setup
- ✓ You want free hosting
- ✓ You're new to web hosting

---

## 🚀 Next Steps

**If choosing Hostinger Shared + Railway:**
1. Deploy backend to Railway (10 min)
2. Update API URLs in frontend files
3. Upload frontend to Hostinger via File Manager
4. Test and launch!

**If choosing Hostinger VPS:**
1. Order VPS plan
2. Follow VPS setup guide above
3. Upload code and configure
4. Setup domain and SSL

**If choosing Railway + Netlify (easiest):**
1. Read: `QUICK_START_DEPLOYMENT.md`
2. Deploy in 15 minutes
3. Free hosting!

---

**Need help?** Let me know which option you want and I'll guide you through it! 🎯
