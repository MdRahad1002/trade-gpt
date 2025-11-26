# 🚀 Quick Start Deployment Guide

## Choose Your Path:

### 🟢 Easiest (Recommended for Beginners) - 15 minutes
**Railway + Netlify (Both Free)**

1. **Deploy Backend (Railway)**
   - Go to https://railway.app
   - Click "Start a New Project"
   - Choose "Deploy from GitHub repo"
   - Select backend folder
   - Copy your Railway URL: `https://xxxxx.railway.app`

2. **Update Frontend API URL**
   - Open `script.js` line 250
   - Change: `http://localhost:5000` → `https://xxxxx.railway.app`
   - Open `admin/admin-script.js` line 3
   - Change: `http://localhost:5000` → `https://xxxxx.railway.app`

3. **Deploy Frontend (Netlify)**
   - Go to https://netlify.com
   - Drag & drop your project folder
   - Done! Your site is live at `https://xxxxx.netlify.app`

### 🟡 Intermediate - 30 minutes
**Render (Free Tier)**

1. Go to https://render.com
2. Connect GitHub
3. Deploy backend as "Web Service"
4. Deploy frontend as "Static Site"
5. Update API URLs
6. Done!

### 🔴 Advanced (Full Control) - 1-2 hours
**VPS (DigitalOcean/Linode)**

Follow the complete guide in `DEPLOYMENT_GUIDE.md`

---

## 🎯 After Deployment Checklist

- [ ] Test form submission on live site
- [ ] Login to admin panel: `https://your-site.com/admin`
- [ ] Create a test lead
- [ ] Check if lead appears in admin
- [ ] Test webhook integration
- [ ] Update default admin password
- [ ] Add your custom domain (optional)
- [ ] Setup monitoring (UptimeRobot)

---

## 🆘 Need Help?

**Common Issues:**

1. **CORS Error**
   - Update CORS in `backend/app.py` with your production URL

2. **API Not Connecting**
   - Check API URL in `script.js` and `admin-script.js`
   - Make sure backend is deployed and running

3. **Database Issues**
   - Railway/Render handle SQLite automatically
   - Check logs in dashboard

4. **Form Not Submitting**
   - Open browser console (F12)
   - Check for error messages
   - Verify API endpoint is correct

---

## 📞 Support

Check the full guide: `DEPLOYMENT_GUIDE.md`
API Documentation: `API_DOCUMENTATION.md`

**Ready to deploy?** Start with Railway + Netlify (easiest option)!
