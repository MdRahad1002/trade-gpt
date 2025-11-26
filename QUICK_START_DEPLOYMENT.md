# 🚀 QUICK DEPLOY - Get Live in 15 Minutes

## Your files are ready! Follow these steps:

---

## STEP 1: Deploy Backend to Railway (5 min)

### 1.1 Create Account
- Go to: **https://railway.app**
- Click "Sign up with GitHub"
- Authorize Railway

### 1.2 Deploy
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose `trade-gpt-landing` (or upload files manually)
4. Click on the deployment

### 1.3 Configure
1. Go to **Settings** → Set **Root Directory**: `backend`
2. Go to **Variables** → Add:
   - `FLASK_ENV` = `production`
   - `PORT` = `5000`
3. Go to **Settings** → **Networking** → Click **"Generate Domain"**
4. **COPY YOUR RAILWAY URL** (something like: `https://tradegpt-production-xxxx.up.railway.app`)

---

## STEP 2: Update Frontend URLs (2 min)

### 2.1 Update script.js
Open `script.js` and change line ~250:
```javascript
// FROM:
const API_URL = 'http://localhost:5000';

// TO (use YOUR Railway URL):
const API_URL = 'https://tradegpt-production-xxxx.up.railway.app';
```

### 2.2 Update admin-script.js  
Open `admin/admin-script.js` and change line ~3:
```javascript
// FROM:
const API_URL = 'http://localhost:5000';

// TO (use YOUR Railway URL):
const API_URL = 'https://tradegpt-production-xxxx.up.railway.app';
```

---

## STEP 3: Deploy Frontend to Netlify (5 min)

### 3.1 Create Account
- Go to: **https://netlify.com**
- Click "Sign up with GitHub"

### 3.2 Deploy by Drag & Drop
1. Click **"Add new site"** → **"Deploy manually"**
2. Open your project folder in Windows Explorer
3. **Drag these files/folders** into Netlify drop zone:
   ```
   ✓ index.html
   ✓ education.html
   ✓ styles.css
   ✓ education-styles.css
   ✓ script.js
   ✓ logo.svg (if you have it)
   ✓ admin folder (entire folder)
   ```
4. Wait 30 seconds... **DONE!** 🎉

### 3.3 Get Your URL
Netlify gives you: `https://something-unique-abc123.netlify.app`

---

## STEP 4: Test Your Live Site (3 min)

### Test Landing Page
1. Go to: `https://your-site.netlify.app`
2. Fill out form → Submit
3. Should see success message ✅

### Test Admin Panel
1. Go to: `https://your-site.netlify.app/admin/admin.html`
2. Login: `admin` / `admin123`
3. Check if lead appeared ✅

### Test Education Page
1. Go to: `https://your-site.netlify.app/education.html`
2. Verify content loads ✅

---

## 🎉 YOU'RE LIVE!

Your sites:
- **Landing:** `https://your-site.netlify.app`
- **Admin:** `https://your-site.netlify.app/admin/admin.html`  
- **Education:** `https://your-site.netlify.app/education.html`
- **API:** `https://your-backend.railway.app`

**Cost:** $0/month (free tier)

---

## 🔒 Important: Change Admin Password!

After deployment:
1. Login to admin panel
2. Go to settings (if available) or change in database
3. Change from `admin123` to strong password

---

## ⚠️ Troubleshooting

### Forms not working?
- Check if Railway backend is running (check Railway dashboard)
- Verify API URLs in script.js and admin-script.js are correct
- Check browser console (F12) for errors

### Admin panel not loading?
- Clear browser cache (Ctrl+F5)
- Check if you updated admin-script.js API_URL

### Need help?
- Check DEPLOYMENT_GUIDE.md for detailed instructions
- Railway logs: Railway dashboard → Your project → Logs
- Netlify logs: Netlify dashboard → Your site → Deploys

---

## 📱 Optional: Custom Domain

### Netlify:
1. Buy domain (Namecheap, GoDaddy, etc.)
2. Netlify → Domain settings → Add custom domain
3. Update DNS records

### Railway:
1. Railway → Settings → Domains → Custom domain
2. Add CNAME record to DNS

---

**Total Time:** 15 minutes  
**Total Cost:** FREE

🚀 You're now live! Start collecting leads!
