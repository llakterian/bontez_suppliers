DEPLOYING BONTEZ SUPPLIERS TO RENDER.COM (FREE TIER)
Author: Llakterian

OVERVIEW
========
Render.com offers a FREE tier for hosting Flask applications. This guide walks you through deploying Bontez Suppliers to Render in 10 minutes.

PREREQUISITES
=============
1. GitHub account (already have your repo)
2. Render account (free signup at render.com)
3. Your repository pushed to GitHub

STEP-BY-STEP DEPLOYMENT
=======================

STEP 1: Verify Your Repository
------------------------------
Your Flask app must be pushed to GitHub. Check:

$ cd /home/c0bw3b/Documents/bontez_suppliers
$ git remote -v

Should show:
  origin  https://github.com/YOUR_USERNAME/bontez_suppliers.git

If not, add it:
  git remote add origin https://github.com/YOUR_USERNAME/bontez_suppliers.git
  git push -u origin master

STEP 2: Create a Render.com Account
-----------------------------------
1. Go to https://render.com
2. Sign up with GitHub (easier)
3. Authorize Render to access your GitHub account
4. You'll be redirected to the dashboard

STEP 3: Create a New Web Service
--------------------------------
1. Click "New +"
2. Select "Web Service"
3. Select "Connect a repository"
4. Find and select "bontez_suppliers"
5. Click "Connect"

STEP 4: Configure the Web Service
---------------------------------
Fill in the following fields:

Name:
  bontez-suppliers

Environment:
  Python 3

Build Command:
  pip install -r requirements.txt

Start Command:
  gunicorn -w 2 -b 0.0.0.0:8080 run:app

Plan:
  Free (Shared CPU, 0.5 GB RAM, 50GB bandwidth/month)

STEP 5: Set Environment Variables
---------------------------------
Before deploying, add these environment variables:

1. Click "Environment" tab
2. Add:

Name: FLASK_ENV
Value: production

Name: FLASK_DEBUG
Value: 0

Name: DATABASE_URL
Value: sqlite:///instance/bontez_suppliers.db

Leave SECRET_KEY empty (uses default)

STEP 6: Deploy
--------------
1. Click "Create Web Service"
2. Render will start the build
3. Watch the build logs (appears on screen)
4. Takes 2-5 minutes

DEPLOYMENT STATUS
-----------------
When you see:
  "=== Deployment successful"

Your app is live at:
  https://bontez-suppliers.onrender.com

VERIFY DEPLOYMENT
=================
Test these URLs:

1. Dashboard:
   https://bontez-suppliers.onrender.com/

2. Clients:
   https://bontez-suppliers.onrender.com/clients/

3. Sales:
   https://bontez-suppliers.onrender.com/sales/

4. Reports:
   https://bontez-suppliers.onrender.com/reports/daily

TROUBLESHOOTING
===============

ERROR: "Port 5000 in use"
Solution: Already fixed - we use port 8080 in start command

ERROR: "ModuleNotFoundError"
Solution: Check requirements.txt has all dependencies
$ pip freeze > requirements.txt
$ git add requirements.txt && git commit -m "Update deps" && git push

ERROR: "Database locked"
Solution: SQLite has limits on concurrent access
For production, upgrade to PostgreSQL on Render

ERROR: Build fails
Solution: Check build logs for specific error
Common: Missing environment variable or Python version conflict

ENABLE AUTO-DEPLOY
==================
By default, Render auto-deploys when you push to master:

1. Make changes locally
2. Commit: git commit -am "Changes"
3. Push: git push origin master
4. Render automatically rebuilds and deploys

To disable auto-deploy:
1. Go to Web Service settings
2. Uncheck "Auto-Deploy"

CUSTOM DOMAIN
=============
To use your own domain (e.g., bontez.com):

1. In Render dashboard, go to Web Service
2. Click "Settings" → "Custom Domains"
3. Add your domain
4. Update DNS records (provider-specific)
5. Takes 5-15 minutes to propagate

FREE TIER LIMITATIONS
====================
- Shared CPU (slower than paid)
- 0.5 GB RAM (sufficient for demo)
- Spins down after 15 mins inactivity (cold start ~30s)
- 50GB bandwidth/month (ample for small usage)
- SQLite database (not ideal for production)

UPGRADE TO PAID
===============
When ready for production:

1. Click "Settings" → "Plan"
2. Upgrade to "Starter" ($7/month)
3. Benefits:
   - Dedicated CPU (faster)
   - 2GB RAM
   - Always-on (no cold start)
   - PostgreSQL support
   - 100GB bandwidth

MIGRATE TO POSTGRESQL (Optional)
================================
For better performance and reliability:

1. Create PostgreSQL instance on Render
2. Update DATABASE_URL in environment variables
3. No code changes needed (SQLAlchemy handles it)
4. Backup existing SQLite data first

MONITORING & LOGS
=================
View app logs in Render dashboard:

1. Go to Web Service
2. Click "Logs" tab
3. See real-time request logs
4. Click "Access Logs" for HTTP requests

SECURITY CONSIDERATIONS
=======================
Before production:

1. Set strong SECRET_KEY
   python -c "import secrets; print(secrets.token_hex(32))"
   Add to environment variables

2. Enable HTTPS (automatic on Render)

3. Set FLASK_DEBUG=0 (already set)

4. Keep dependencies updated:
   pip list --outdated
   Update requirements.txt
   Commit and push

5. Add authentication before sharing with clients
   (Currently open access - add login system)

SAMPLE: Auto-Deploy on Every Push
=================================
Your workflow is now:

1. Make changes locally
   nano app/routes.py

2. Test locally
   python run.py
   Visit http://localhost:5000

3. Commit changes
   git add -A
   git commit -m "Feature: xyz"

4. Push to GitHub
   git push origin master

5. Render auto-deploys (1-3 min)
   Check https://bontez-suppliers.onrender.com

SHARE WITH CLIENTS
==================
Once live, share this URL:
  https://bontez-suppliers.onrender.com

Clients can:
- View dashboard
- Browse clients and sales
- Generate reports
- Test the system

No installation needed!

NEXT STEPS
==========
1. Deploy to Render (10 minutes)
2. Test all features work
3. Share URL with clients for feedback
4. Make changes as needed
5. Auto-deploy when you push

You're done! Your app is now live and ready for client review.

---
Author: Llakterian
Date: November 18, 2025
