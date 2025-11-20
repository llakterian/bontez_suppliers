#  Complete Deployment Guide - Bontez Suppliers
**Both Frontend & Backend Deployment Options**

---

## 📋 Overview

Your Bontez Suppliers app has **TWO deployment options**:

### **Option 1: Single Deployment** (Recommended for simplicity)
-  **One URL** for everything
-  **One deployment** to manage
-  Flask serves React build
-  Auto-deploys from GitHub
-  **Deploy to: Render.com**

### **Option 2: Separate Deployments** (Recommended for scale)
-  **Two URLs**: Frontend + Backend
-  **Better performance** (CDN for frontend)
-  **Independent scaling**
-  Auto-deploys from GitHub
-  **Deploy to: Netlify (Frontend) + Render (Backend)**

---

##  OPTION 1: Single Deployment (Flask + React on Render)

###  What's Already Configured

I've already set up everything you need:

1.  **Flask configured** to serve React build (`app/__init__.py`)
2.  **Catch-all route** for React Router
3.  **API URL updated** for production (`frontend/.env.production`)
4.  **Procfile updated** to build React before starting
5.  **Build script created** (`build.sh`)

###  Prerequisites

1. **Node.js** installed on Render (automatic)
2. **Python 3.11** specified in `runtime.txt` (already done)
3. **GitHub repo** connected to Render

###  Deployment Steps

#### Step 1: Push to GitHub

```bash
cd /home/c0bw3b/Documents/bontez_suppliers

# Add all changes
git add -A

# Commit with message
git commit -m "Configure single deployment: Flask + React"

# Push to GitHub
git push origin main
```

#### Step 2: Configure Render

1. **Go to**: [dashboard.render.com](https://dashboard.render.com)
2. **Click**: "New +" → "Web Service"
3. **Connect**: Your `bontez_suppliers` repo
4. **Configure**:

```
Name: bontez-suppliers
Environment: Python 3
Branch: main
Root Directory: (leave empty)

Build Command:
./build.sh

Start Command:
gunicorn -w 2 -b 0.0.0.0:$PORT run:app

Plan: Free
```

5. **Environment Variables**:
```
FLASK_ENV = production
FLASK_DEBUG = 0
SECRET_KEY = (generate with: python -c "import secrets; print(secrets.token_hex(32))")
```

6. **Click**: "Create Web Service"

#### Step 3: Wait for Build

- Build takes **5-10 minutes** (includes npm install + build)
- Watch the logs in Render dashboard
- When you see "=== Build successful ===" → Done!

#### Step 4: Access Your App

Your app will be live at:
```
https://bontez-suppliers-XXXX.onrender.com
```

**Everything works from ONE URL**:
- Dashboard: `https://bontez-suppliers-XXXX.onrender.com/`
- Reports: `https://bontez-suppliers-XXXX.onrender.com/reports`
- Sales Wizard: `https://bontez-suppliers-XXXX.onrender.com/sales/wizard`
- API: `https://bontez-suppliers-XXXX.onrender.com/api/clients`

### 🔄 Auto-Deploy

Every time you push to GitHub:
```bash
git add -A
git commit -m "Your changes"
git push origin main
```

Render will automatically:
1. Pull latest code
2. Build React app
3. Start Flask server
4. Deploy in 5-10 minutes

---

##  OPTION 2: Separate Deployments (Netlify + Render)

### Frontend (React) → Netlify

#### Step 1: Update API URL

Already done! File: `frontend/.env.production`
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

You'll update this with your Render backend URL after deploying.

#### Step 2: Deploy to Netlify

**Option A: Netlify CLI**
```bash
cd frontend

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Option B: Netlify Dashboard**
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import from Git"
3. Connect GitHub repo
4. Configure:
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```
5. Add environment variable:
```
VITE_API_URL = https://your-backend.onrender.com/api
```
6. Deploy!

### Backend (Flask) → Render

Use simpler Procfile (without React build):

**Update `Procfile`**:
```
web: gunicorn -w 2 -b 0.0.0.0:$PORT run:app
```

**Deploy on Render**:
```
Build Command: pip install -r requirements.txt
Start Command: gunicorn -w 2 -b 0.0.0.0:$PORT run:app
```

**Update CORS** in `app/__init__.py`:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://your-frontend.netlify.app"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }
})
```

### URLs

After deployment:
- **Frontend**: `https://bontez-suppliers.netlify.app`
- **Backend**: `https://bontez-suppliers.onrender.com`

---

##  Comparison: Which Option?

| Feature | Option 1 (Single) | Option 2 (Separate) |
|---------|------------------|---------------------|
| **URLs** | 1 (simpler) | 2 (cleaner) |
| **Deployment** | Slower (10 min) | Faster (3 min each) |
| **CORS** | Not needed | Must configure |
| **Performance** | Good | Better (CDN) |
| **Scalability** | Limited | High |
| **Cost (Free)** | Yes | Yes |
| **Complexity** | Low  | Medium |

**Recommendation**: 
- **Option 1** for quick deployment and simplicity
- **Option 2** for production and better performance

---

##  Testing Your Deployment

After deployment, test these:

### Functional Tests
- [ ] Homepage loads
- [ ] Dashboard shows data
- [ ] Navigate to Clients page
- [ ] Navigate to Reports page
- [ ] Generate PDF export
- [ ] Create new sale
- [ ] API endpoints respond

### Performance Tests
- [ ] First load < 3 seconds
- [ ] Navigation smooth
- [ ] Charts render properly
- [ ] Mobile responsive

### Cross-Browser
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## 🐛 Troubleshooting

### Build Fails on Render

**Error**: `npm: command not found`
- **Fix**: Render needs Node.js. Add to `render.yaml`:
```yaml
services:
  - type: web
    name: bontez-suppliers
    env: python
    buildCommand: |
      pip install -r requirements.txt
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
      export NVM_DIR="$HOME/.nvm"
      [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
      nvm install --lts
      cd frontend && npm install && npm run build
    startCommand: gunicorn -w 2 -b 0.0.0.0:$PORT run:app
```

**Error**: `Build timed out`
- **Fix**: Build takes 10-15 minutes first time. Increase timeout in Render settings.

**Error**: `Module not found`
- **Fix**: Check `requirements.txt` has all dependencies:
```bash
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update dependencies"
git push
```

### React App Not Loading

**Error**: 404 on routes
- **Fix**: Catch-all route already configured in `app/__init__.py`

**Error**: API calls fail
- **Fix**: Check API_BASE_URL in browser console
  - Should be `/api` in production
  - Check network tab for requests

**Error**: White screen
- **Fix**: Build React locally first to test:
```bash
cd frontend
npm run build
cd ..
python run.py
# Visit http://localhost:5000
```

### CORS Errors (Option 2 only)

**Error**: `CORS policy: No 'Access-Control-Allow-Origin'`
- **Fix**: Update CORS origins in `app/__init__.py`:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://your-frontend.netlify.app"],
    }
})
```

---

##  Security Checklist

Before sharing with clients:

- [ ] Set strong `SECRET_KEY` environment variable
- [ ] `FLASK_DEBUG=0` in production
- [ ] HTTPS enabled (automatic on Render/Netlify)
- [ ] API rate limiting (optional, for later)
- [ ] Add authentication (recommended)
- [ ] Sanitize user inputs
- [ ] Keep dependencies updated

---

##  Monitoring

### Render Dashboard
- View real-time logs
- Monitor CPU/memory usage
- Check deploy history
- Set up alerts

### Netlify Dashboard (Option 2)
- View build logs
- Monitor bandwidth
- Check deploy previews
- Set up notifications

---

##  Cost Breakdown

### Free Tier (Both Options)

**Option 1 (Render only)**:
- $0/month
- 50GB bandwidth
- 512MB RAM
- Spins down after 15 min inactivity

**Option 2 (Netlify + Render)**:
- $0/month
- 100GB Netlify bandwidth
- 50GB Render bandwidth
- Better performance (CDN)

### Paid Upgrades

**Render Starter** ($7/month):
- Always-on (no cold starts)
- 2GB RAM
- PostgreSQL included
- Better performance

**Netlify Pro** ($19/month):
- 400GB bandwidth
- Background functions
- Analytics
- Priority support

---

##  You're All Set!

### What You've Accomplished

 Flask backend ready for deployment  
 React frontend builds properly  
 Single deployment configured  
 Separate deployment option available  
 Auto-deploy from GitHub set up  
 Production environment configured  
 API routing working  
 CORS configured  

### Next Steps

1. **Choose your option** (1 or 2)
2. **Push to GitHub**
3. **Deploy to Render** (and Netlify if Option 2)
4. **Test thoroughly**
5. **Share with clients**!

### Quick Commands

**Single Deployment**:
```bash
git add -A && git commit -m "Deploy" && git push origin main
# Render auto-deploys in 10 minutes
```

**Separate Deployments**:
```bash
# Backend
git add -A && git commit -m "Deploy backend" && git push origin main

# Frontend (if using Netlify CLI)
cd frontend && netlify deploy --prod
```

---

##  Need Help?

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Flask Docs**: https://flask.palletsprojects.com
- **React Docs**: https://react.dev

---

**Author**: Llakterian  
**Date**: November 20, 2025  
**Project**: Bontez Suppliers - Gas Distribution Management System

 Built by Llakterian for Kenyan gas distributors
