GITHUB SETUP & RENDER DEPLOYMENT GUIDE
Author: Llakterian
Date: November 18, 2025

STEP 1: CREATE GITHUB REPOSITORY
================================

You need a GitHub account to deploy. Here's how:

1a. Create GitHub Account (if needed)
------------------------------------
Go to: https://github.com/join
- Enter username: llakterian (or your choice)
- Enter email: llakterian@gmail.com
- Create password
- Complete email verification
- Done!

1b. Create New Repository on GitHub
-----------------------------------
After logging in:
1. Click "+" icon (top right)
2. Select "New repository"
3. Fill in:
   Repository name: bontez_suppliers
   Description: Gas sales management system for Kenya
   Public: YES (required for Render)
   Initialize: NO (don't check anything)
4. Click "Create repository"

You'll see a page with instructions. Copy the repository URL:
https://github.com/llakterian/bontez_suppliers.git

STEP 2: PUSH YOUR LOCAL CODE TO GITHUB
======================================

In your terminal:

2a. Add GitHub as remote
------------------------
cd /home/c0bw3b/Documents/bontez_suppliers

git remote add origin https://github.com/llakterian/bontez_suppliers.git

2b. Verify it was added
----------------------
git remote -v

Should show:
origin  https://github.com/llakterian/bontez_suppliers.git (fetch)
origin  https://github.com/llakterian/bontez_suppliers.git (push)

2c. Push your code to GitHub
----------------------------
git branch -M main
git push -u origin main

If asked for password:
- Enter your GitHub username: llakterian
- Enter your GitHub password (or personal access token)

Done! Your code is now on GitHub.

STEP 3: VERIFY ON GITHUB
========================

Check that your code is on GitHub:

1. Go to: https://github.com/llakterian/bontez_suppliers
2. You should see:
   - All your files (app/, seed.py, run.py, etc.)
   - All your commit history
   - All your documentation

If you see this, you're ready to deploy!

STEP 4: DEPLOY TO RENDER
========================

Now deploy your GitHub repo to Render:

4a. Sign Up for Render.com
--------------------------
Go to: https://render.com
1. Click "Get Started"
2. Click "Sign up with GitHub"
3. Authorize Render
4. Create password
5. Verify email

4b. Create Web Service
---------------------
1. Click "New +"
2. Select "Web Service"
3. Under "Connect a repository", find bontez_suppliers
4. Click "Connect"

4c. Configure Service
--------------------
Fill in these settings:

Name: bontez-suppliers

Environment: Python 3

Region: (any, recommend closest to you)

Branch: main

Build Command:
pip install -r requirements.txt

Start Command:
gunicorn -w 2 -b 0.0.0.0:8080 run:app

Plan: Free

4d. Environment Variables
-------------------------
Before deploying, add these:

Click "Environment" tab
Add these variables:

NAME: FLASK_ENV
VALUE: production

NAME: FLASK_DEBUG
VALUE: 0

Leave SECRET_KEY empty (will use default)

4e. Deploy!
----------
Click "Create Web Service"
Watch the build logs
When you see "=== Deployment successful" in green
Your app is live!

STEP 5: GET YOUR LIVE URL
=========================

After successful deployment:

1. Go to Render dashboard
2. Select "bontez-suppliers" web service
3. Look for the URL at the top
   Should be something like: https://bontez-suppliers-xxxx.onrender.com

This is your LIVE URL!

STEP 6: TEST YOUR LIVE APP
==========================

1. Open the URL in your browser
2. You should see the Bontez Suppliers dashboard
3. Verify:
   [ ] Homepage loads
   [ ] Dashboard shows stats
   [ ] Can click "Clients" link
   [ ] Can click "Sales" link
   [ ] Charts display on reports page
   [ ] Test on mobile (portrait and landscape)

STEP 7: SHARE WITH CLIENTS
==========================

Your live URL:
https://bontez-suppliers-xxxx.onrender.com

Send this link to your clients:
- Email
- WhatsApp
- Slack
- Any messaging platform

They can instantly access and review the system!
No installation needed.

STEP 8: MAKE UPDATES (AUTOMATIC)
================================

To update your live app:

1. Make changes locally
   nano app/routes.py
   nano app/templates/...

2. Test locally
   source venv/bin/activate
   python run.py
   http://localhost:5000

3. Commit and push to GitHub
   git add -A
   git commit -m "Feature: description of change"
   git push origin main

4. Render automatically rebuilds and deploys!
   (1-3 minutes later, changes are live)

No manual deployment needed!

TROUBLESHOOTING
===============

"Build failed" on Render:
1. Check the build logs for specific error
2. Common issues:
   - Missing dependencies (update requirements.txt)
   - Wrong Python version
   - Port already in use
3. Fix locally first, then push

"Can't push to GitHub":
1. Check remote is correct: git remote -v
2. Should show your GitHub URL
3. If wrong, fix with:
   git remote set-url origin https://github.com/llakterian/bontez_suppliers.git

"GitHub credentials error":
1. Create personal access token:
   - GitHub settings → Developer settings → Personal access tokens
   - Generate new token (read/write)
   - Use token as password instead of GitHub password

"App won't start on Render":
1. Check environment variables are set
2. Verify requirements.txt is complete
3. Check logs for errors
4. May need to adjust Start Command

QUICK REFERENCE
===============

Your GitHub repo:
https://github.com/llakterian/bontez_suppliers

Your live app:
https://bontez-suppliers-xxxx.onrender.com (after deployment)

Git commands for updates:
git add -A                    # Stage all changes
git commit -m "message"       # Commit changes
git push origin main          # Push to GitHub
                              # → Render auto-deploys!

NEXT STEPS
==========

1. Create GitHub account (if needed)
2. Create GitHub repository
3. Push code to GitHub
4. Deploy to Render (10 minutes)
5. Test on phone and desktop
6. Share URL with clients
7. Make updates as needed (auto-deploys)

Done!

---

Author: Llakterian
Date: November 18, 2025
