# 🚂 Deploy to Railway - Complete Guide

## Important: Railway is for BACKEND only (Python/Flask)

Railway runs server-side applications. Your frontend (JS/HTML/CSS) needs to go to Netlify or another static host.

---

## 🎯 CORRECT SETUP: Backend on Railway + Frontend on Netlify

### Why Split Them?

**Railway (Backend):**
- ✅ Runs Python/Flask server
- ✅ Handles database operations
- ✅ Processes API requests
- ✅ Manages lead storage

**Netlify (Frontend):**
- ✅ Hosts HTML/CSS/JS files
- ✅ Fast CDN delivery
- ✅ Free tier available
- ✅ Drag & drop deployment

---

## 📦 STEP-BY-STEP: Deploy Backend to Railway

### Step 1: Prepare Your Backend Folder (2 min)

Make sure your `backend` folder has these files:

```
backend/
├── app.py              ✅ Your Flask app
├── requirements.txt    ✅ Python dependencies
├── Procfile           ✅ Railway start command
└── leads.db           (will be created automatically)
```

**Check Procfile exists:**
```powershell
cd "c:\Users\albion mulaj\trade-gpt-landing\backend"
type Procfile
```

Should show: `web: python app.py`

**Check requirements.txt:**
```powershell
type requirements.txt
```

Should have Flask, SQLAlchemy, etc.

---

### Step 2: Create Railway Account (2 min)

1. Go to **https://railway.app**
2. Click **"Login with GitHub"**
3. Authorize Railway to access your GitHub

---

### Step 3: Deploy Backend (5 min)

**Option A: Deploy from GitHub (Recommended)**

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `trade-gpt-landing` repository
4. Railway will detect it's a Python app

**Configure Root Directory:**
1. Click on your deployment
2. Go to **"Settings"** tab
3. Find **"Root Directory"**
4. Set to: `backend`
5. Click **"Save"**

**Option B: Deploy by Uploading Folder**

1. Click **"New Project"**
2. Select **"Empty Project"**
3. Click **"Deploy"** → **"Deploy from GitHub"** or upload
4. Drag your `backend` folder
5. Railway will auto-detect Python

---

### Step 4: Configure Environment Variables (2 min)

1. Click on your service
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add:
   ```
   FLASK_ENV = production
   ```
5. Click **"Add"**

---

### Step 5: Generate Domain (1 min)

1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. You'll get: `https://tradegpt-production-xxxx.up.railway.app`
5. **COPY THIS URL!** You'll need it

---

### Step 6: Wait for Build (3 min)

1. Go to **"Deployments"** tab
2. Watch the build logs
3. Wait for **"Success"** status
4. First deployment takes 2-3 minutes

---

### Step 7: Test Your Backend (1 min)

Open your Railway URL in browser:
```
https://tradegpt-production-xxxx.up.railway.app/api/leads
```

You should see:
```json
{"leads": []}
```

✅ **Backend is LIVE!**

---

## 🌐 STEP-BY-STEP: Deploy Frontend to Netlify

### Step 1: Update API URLs First (5 min)

**Before uploading to Netlify**, update these files with your Railway URL:

**File 1: `script.js`**

Find line ~275:
```javascript
const response = await fetch('http://localhost:5000/api/leads', {
```

Change to (use YOUR Railway URL):
```javascript
const response = await fetch('https://tradegpt-production-xxxx.up.railway.app/api/leads', {
```

Find line ~629:
```javascript
console.log('📧 Form submissions sending to: http://localhost:5000/api/leads');
```

Change to:
```javascript
console.log('📧 Form submissions sending to: https://tradegpt-production-xxxx.up.railway.app/api/leads');
```

**File 2: `admin/admin-script.js`**

Find line ~6:
```javascript
this.baseURL = 'http://localhost:5000/api';
```

Change to:
```javascript
this.baseURL = 'https://tradegpt-production-xxxx.up.railway.app/api';
```

---

### Step 2: Deploy to Netlify (5 min)

1. Go to **https://netlify.com**
2. Click **"Sign up"** → Login with GitHub
3. Click **"Add new site"** → **"Deploy manually"**
4. **Drag these files** into Netlify:
   ```
   ✓ index.html
   ✓ education.html
   ✓ styles.css
   ✓ education-styles.css
   ✓ script.js (UPDATED with Railway URL)
   ✓ logo.svg (if you have it)
   ✓ admin/ folder (contains UPDATED admin-script.js)
   ```
5. Wait 30 seconds... **DONE!**

You'll get: `https://your-site-name.netlify.app`

---

## ✅ Test Everything

### Test 1: Backend API
```
https://tradegpt-production-xxxx.up.railway.app/api/leads
```
Should return: `{"leads": []}`

### Test 2: Frontend Landing Page
```
https://your-site-name.netlify.app
```
Should load your landing page

### Test 3: Form Submission
1. Fill out form on landing page
2. Submit
3. Should see success message
4. Check Railway logs for request

### Test 4: Admin Panel
```
https://your-site-name.netlify.app/admin/
```
Login with:
- Username: `trader07`
- Password: `trade123`

Lead should appear in dashboard ✅

---

## 🔧 Troubleshooting

### Backend Build Failed

**Check Railway Logs:**
1. Go to Railway → Your project
2. Click **"Deployments"**
3. Click on the failed deployment
4. Read the error logs

**Common Issues:**
- ❌ Missing `requirements.txt` → Check file exists
- ❌ Wrong Root Directory → Set to `backend`
- ❌ Python version error → Railway uses Python 3.11 by default

### Frontend Can't Connect to Backend

**Check API URLs:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Submit form or login to admin
4. Look for errors

**Common Issues:**
- ❌ Wrong Railway URL in script.js
- ❌ Wrong Railway URL in admin-script.js
- ❌ CORS error → Check backend CORS settings
- ❌ Backend not running → Check Railway deployment status

### CORS Error

If you see CORS error in browser console:

1. Go to Railway → Your backend
2. Add environment variable:
   ```
   ALLOWED_ORIGINS = https://your-site-name.netlify.app
   ```
3. Redeploy backend

---

## 💰 Cost

**Railway:**
- Free tier: $5 credit/month
- Enough for ~500 hours runtime
- Backend uses ~100 hours/month
- **Cost: $0/month** (stays within free tier)

**Netlify:**
- Free tier: 100GB bandwidth
- Unlimited sites
- **Cost: $0/month**

**Total: $0/month** 🎉

---

## 📊 Monitoring Your Deployment

### Railway Dashboard

1. Go to Railway dashboard
2. Click on your project
3. See:
   - Uptime
   - Memory usage
   - Request logs
   - Build history

### Check Backend Logs

```
Railway → Your Project → Deployments → View Logs
```

Look for:
- `Running on http://0.0.0.0:5000`
- `Default admin created: trader07 / trade123`
- Any errors

---

## 🔄 Updating Your Site

### Update Backend:
1. Make changes to `backend/app.py`
2. Push to GitHub (if using GitHub deployment)
3. Railway auto-deploys
4. OR manually upload new version

### Update Frontend:
1. Make changes to HTML/CSS/JS
2. Go to Netlify
3. Drag updated files
4. New version deploys instantly

---

## 🚀 Quick Command Reference

### Check Backend is Running
```powershell
curl https://tradegpt-production-xxxx.up.railway.app/api/leads
```

### Test Backend Locally Before Deploying
```powershell
cd "c:\Users\albion mulaj\trade-gpt-landing\backend"
python app.py
```

### Find API URLs to Update
```powershell
cd "c:\Users\albion mulaj\trade-gpt-landing"
findstr /s /i "localhost:5000" *.js admin\*.js
```

---

## 📝 Summary

**What Goes Where:**

```
Railway (Backend)
├── backend/app.py
├── backend/requirements.txt
├── backend/Procfile
└── Database (SQLite)

Netlify (Frontend)
├── index.html
├── education.html
├── styles.css
├── script.js (points to Railway)
└── admin/
    ├── index.html
    └── admin-script.js (points to Railway)
```

**Connection:**
```
User Browser
    ↓
Netlify (Frontend HTML/JS)
    ↓ (API requests)
Railway (Backend Python/Flask)
    ↓
SQLite Database
```

---

## ✅ You're Done When:

- ✅ Railway backend shows "Success" status
- ✅ Railway URL returns `{"leads": []}`
- ✅ Netlify site loads landing page
- ✅ Form submission works
- ✅ Admin login works (trader07/trade123)
- ✅ Leads appear in admin panel

---

**Need help?** Check Railway logs and browser console (F12) for errors! 🎯
