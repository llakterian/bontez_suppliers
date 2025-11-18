COMPREHENSIVE DEPLOYMENT GUIDE - BONTEZ SUPPLIERS
Author: Llakterian
Date: November 18, 2025

TABLE OF CONTENTS
=================
1. Local Development Setup
2. Testing Responsive Design
3. Deployment Options Overview
4. Option A: Deploy to Render (Free Tier)
5. Option B: Deploy to Fly.io (Free with Credit)
6. Option C: Deploy to Railway (Free Tier)
7. GitHub Pages Static Version (Frontend Only)
8. Production Checklist
9. Monitoring & Maintenance

SECTION 1: LOCAL DEVELOPMENT SETUP
==================================

Prerequisites:
- Python 3.7+
- Git
- Virtual environment support

Quick Start:
```bash
# Clone/Navigate to project
cd /path/to/bontez_suppliers

# Create virtual environment (if not exists)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements.txt

# Initialize database (if needed)
python seed.py

# Run development server
python run.py

# Access at: http://127.0.0.1:5000
```

Environment Variables:
Create `.env` file in project root (copy from `.env.example`):
```bash
cp .env.example .env
# Edit .env with your settings
```

SECTION 2: TESTING RESPONSIVE DESIGN
====================================

The app supports all screen sizes:
- Ultra small phones: < 320px
- Small phones: 320px - 479px
- Tablets: 480px - 767px
- Tablets/Small laptops: 768px - 1024px
- Desktops: 1025px - 1439px
- 4K/Ultra-wide: 1440px+
- Landscape mobile: Special handling
- High DPI (Retina) screens: Optimized
- Touch devices: Larger hit targets
- Print media: Print-friendly styles

Local Testing with Browser DevTools:
1. Open http://127.0.0.1:5000 in Chrome/Firefox
2. Press F12 to open DevTools
3. Click device toggle (top-left, ≡ icon)
4. Select different devices from dropdown:
   - iPhone 12: 390px
   - iPad: 768px
   - iPad Pro: 1024px
5. Test all pages:
   - Dashboard (/)
   - Clients (/clients/)
   - Sales (/sales/)
   - Reports (/reports/daily)
6. Check:
   - Tables scroll horizontally on mobile
   - Forms stack vertically
   - Navigation collapses properly
   - Buttons are easily tappable (44px+ on touch)
   - Text is readable
   - Images scale correctly

Viewport Meta Tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
This is already in `base.html` - ensures mobile browsers render at correct scale.

SECTION 3: DEPLOYMENT OPTIONS OVERVIEW
=======================================

Free Hosting Options:

1. RENDER (Recommended - Easiest)
   - Free tier: 0.5 GB RAM, 0.5 vCPU
   - Database: PostgreSQL available (free tier 1 GB)
   - Auto-deploys from GitHub
   - Perfect for small teams/demos
   - No credit card required for free tier
   - https://render.com

2. FLY.IO (More Powerful Free Tier)
   - Free credits: $5/month
   - Distributed globally
   - Good for performance
   - Requires payment method
   - https://fly.io

3. RAILWAY (Simple & Fast)
   - Free tier: $5/month credit
   - Very easy setup
   - Good documentation
   - https://railway.app

4. GITHUB PAGES + BACKEND API
   - Frontend: GitHub Pages (Free)
   - Backend: Any of above
   - Static site generation with Flask-Frozen
   - Best for review/demo purposes

SECTION 4: DEPLOY TO RENDER (RECOMMENDED)
==========================================

Why Render?
- Simplest setup (5 minutes)
- Free tier sufficient for client demos
- Auto-scaling available
- Excellent uptime
- Easy custom domain later

Step-by-Step Instructions:

STEP 1: Prepare Code
```bash
cd /path/to/bontez_suppliers

# Ensure all changes committed
git add -A
git commit -m "Final changes before deployment"
git push origin main  # or master
```

STEP 2: Create Render Account
- Visit https://render.com
- Click "Sign Up"
- Choose "Continue with GitHub"
- Authorize the OAuth connection
- Complete setup

STEP 3: Create Web Service
- In Render dashboard, click "New +"
- Select "Web Service"
- Click "Connect a repository"
- Search for "bontez_suppliers"
- Click "Connect"

STEP 4: Configure Service
Fill in the form:
```
Name: bontez-suppliers
Region: Choose closest to your clients (e.g., Frankfurt for Africa)
Branch: main (or master)
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: gunicorn -w 2 -b 0.0.0.0:$PORT run:app
Env Vars: (optional, click Add Environment Variable)
  - FLASK_ENV=production
  - FLASK_DEBUG=False
Plan: Free (default)
```

STEP 5: Deploy
- Click "Create Web Service"
- Watch the deployment logs
- Wait for "Your service is live at: https://bontez-suppliers-xxxxx.onrender.com"

STEP 6: Access Your App
```
Your URL: https://bontez-suppliers-xxxxx.onrender.com
Share with clients: Send them this link
Test: Click through all features
```

STEP 7: Keep Service Active (Optional)
Render's free tier spins down after 15 minutes of inactivity.
To keep it alive, upgrade to paid ($7/month) or use a pinging service:
```bash
# Use cron-job.org to ping your app every 10 minutes:
# Visit https://cron-job.org/en/
# Create job with URL: https://your-render-url.onrender.com/
```

SECTION 5: DEPLOY TO FLY.IO
=============================

Why Fly.io?
- More powerful free tier ($5/month credit)
- Better performance globally
- Distributed edge deployment
- Good for high-traffic scenarios

Prerequisites:
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh
# or
brew install flyctl  # macOS

# Add to PATH if needed
export PATH="$HOME/.fly/bin:$PATH"
```

Setup:
```bash
cd /path/to/bontez_suppliers

# Login to Fly
flyctl auth login

# Create app
flyctl launch
# Follow prompts, accept defaults or customize

# Deploy
flyctl deploy
```

Your app will be at: `https://your-app-name.fly.dev`

More info: https://fly.io/docs/

SECTION 6: DEPLOY TO RAILWAY
==============================

Why Railway?
- Very intuitive UI
- $5/month free credit (generous)
- One-click GitHub integration
- Good for beginners

Setup:
1. Visit https://railway.app
2. Click "Start a New Project"
3. Click "Deploy from GitHub repo"
4. Select your GitHub account and repository
5. Railway auto-detects Python
6. Adds environment variables as needed
7. Click "Deploy"

Your app will be at: `https://your-project-name.up.railway.app`

SECTION 7: GITHUB PAGES STATIC VERSION (OPTIONAL)
===================================================

Why Static Export?
- Host frontend on GitHub Pages for FREE
- Share read-only demo with clients
- Backend can be on any cheap host
- Zero cost option
- Fast and reliable

Setup:

1. Install Flask-Frozen:
```bash
pip install Frozen-Flask
```

2. Create `freeze.py`:
```python
from flask_frozen import Freezer
from app import create_app

app = create_app()
freezer = Freezer(app)

if __name__ == '__main__':
    freezer.freeze()
```

3. Freeze the app:
```bash
python freeze.py
# Creates `build/` folder with static HTML
```

4. Push to GitHub Pages:
```bash
# Ensure .gitignore includes build/
echo "build/" >> .gitignore

# OR: If you want to push build folder
git add build/
git commit -m "Add frozen static site"
git push origin main

# In GitHub repo Settings > Pages:
# - Source: Deploy from branch
# - Branch: main
# - Folder: /build (or /docs)
# - Save
```

Your static site: `https://yourusername.github.io/bontez_suppliers/`

SECTION 8: PRODUCTION CHECKLIST
================================

Before going live with clients, verify:

Security:
[ ] SECRET_KEY changed to random string
[ ] FLASK_DEBUG=False in production
[ ] CSRF protection enabled (Flask-SeaSurf ready)
[ ] Database backed up
[ ] No hardcoded secrets in code
[ ] HTTPS enabled (all hosts do this automatically)

Functionality:
[ ] All pages load correctly
[ ] Forms submit successfully
[ ] Reports generate correctly
[ ] Charts render properly
[ ] Mobile design responsive
[ ] No console errors in browser DevTools
[ ] No server errors in logs

Performance:
[ ] Pages load in < 2 seconds
[ ] CSS/JS cached (304 responses)
[ ] Database queries optimized
[ ] Static files minified (optional)

Documentation:
[ ] README updated with production URL
[ ] Users know how to log in
[ ] Support contact info provided
[ ] Backup procedures documented

Testing:
[ ] Test on mobile device (not just DevTools)
[ ] Test in different browsers
[ ] Test on slow internet (DevTools throttle)
[ ] Check landscape orientation
[ ] Verify touch interactions

SECTION 9: MONITORING & MAINTENANCE
====================================

Render Monitoring:
- Dashboard shows uptime/memory
- Email alerts for failures
- View logs in web console

Database Backups:
For production SQLite:
```bash
# Manual backup
cp instance/bontez_suppliers.db backups/bontez_suppliers_$(date +%Y%m%d).db

# For production, consider migrating to PostgreSQL
# PostgreSQL included free on Render
```

Logs Access:
- Render: Dashboard > Logs tab
- Fly.io: `flyctl logs`
- Railway: Dashboard > Deployments > Logs

Updates:
```bash
# Deploy updates
git add -A
git commit -m "Update message"
git push origin main
# Render/Fly/Railway auto-redeploy from GitHub
```

Custom Domain:
- Render: Settings > Custom Domain
- Add your domain (e.g., gas-sales.com)
- Update DNS settings (provided by Render)
- Free SSL certificate included

SECTION 10: QUICK REFERENCE COMMANDS
====================================

Local Development:
```bash
source venv/bin/activate
python run.py
# Visit http://127.0.0.1:5000
```

Database:
```bash
# Seed sample data
python seed.py

# Reset database (caution!)
rm instance/bontez_suppliers.db
python seed.py
```

Git Workflow:
```bash
git add -A
git commit -m "Your message"
git push origin main
# Auto-deploys on Render/Fly/Railway
```

Production Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:8000 run:app
# w=workers (increase for high load)
# b=bind (0.0.0.0:8000 for production)
```

Testing Responsive:
```bash
# Open in browser developer tools
# Press F12 or Cmd+Option+I
# Click device toggle (mobile icon)
# Select device from list
```

CONCLUSION
==========

Recommended Path for Client Demo:
1. Use Render (free tier, no setup needed)
2. Share live URL with clients immediately
3. Update in real-time, redeploy with git push
4. Upgrade to paid tier when clients commit to use

For Production (paying customers):
1. Use Render Professional tier or Railway
2. Add custom domain
3. Setup monitoring
4. Configure backups
5. Monitor performance

All free deployment options will support client reviews and demos perfectly!

Questions or issues? Check the main README.md for troubleshooting.
