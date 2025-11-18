GITHUB PAGES DEPLOYMENT GUIDE - BONTEZ SUPPLIERS
Author: Llakterian

DEPLOYMENT OVERVIEW
===================

This document explains how to deploy Bontez Suppliers to GitHub Pages for client review and access.

METHOD 1: DEPLOY USING NETLIFY (RECOMMENDED FOR FLASK APPS)
===========================================================

Netlify is the best free option for hosting Flask applications. GitHub Pages only serves static content, but Netlify can run Python backends.

STEPS:

1. Create a Netlify Account
   - Go to https://app.netlify.com/
   - Sign up with your GitHub account
   - Authorize Netlify to access your repositories

2. Create Netlify Configuration File
   Create a `netlify.toml` file in the project root:

   [build]
     command = "pip install -r requirements.txt"
     functions = "."
     publish = "app"

   [functions]
     directory = "functions"

   [[redirects]]
     from = "/*"
     to = "/.netlify/functions/api"
     status = 200

3. Create Functions Directory
   Create `functions/api.py` to handle Flask routes

4. Deploy
   - Push to GitHub
   - Connect your GitHub repo to Netlify
   - Netlify automatically deploys on each push

Netlify Free Tier: Up to 100 hours/month of function execution time (perfect for this app)


METHOD 2: DEPLOY USING RENDER (ALTERNATIVE)
==============================================

Render offers a generous free tier for Python applications.

STEPS:

1. Create Render Account
   - Go to https://render.com/
   - Sign up with GitHub

2. Create New Web Service
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Select branch: main/master

3. Configure Service
   - Name: bontez-suppliers
   - Environment: Python 3
   - Build Command: pip install -r requirements.txt
   - Start Command: gunicorn -w 2 -b 0.0.0.0:10000 run:app

4. Add Environment Variables
   - FLASK_ENV: production
   - DATABASE_URL: sqlite:///instance/bontez_suppliers.db
   - DEBUG: False

5. Deploy
   - Click "Create Web Service"
   - Render deploys automatically from GitHub

Render Free Tier: 750 free hours/month (enough to run continuously)


METHOD 3: DEPLOY USING HEROKU (LEGACY - NO FREE TIER)
======================================================

Note: Heroku deprecated free tier in November 2022. Not recommended unless you have paid tier.


RECOMMENDED DEPLOYMENT SETUP
=============================

For Bontez Suppliers, I recommend:

PRIMARY: Netlify
- Pros: Easy setup, automatic deployments, good free tier
- Cons: Function timeout limits (10 seconds default)

BACKUP: Render
- Pros: Runs always-on, generous free tier, no timeout limits
- Cons: Slower cold starts

BOTH: Use Netlify for demo, Render for production use


GITHUB PAGES STATIC SITE ALTERNATIVE
=====================================

If you want to use GitHub Pages (free, no server costs), we can create a static version:

1. Build a static demo site with sample screenshots
2. Embed interactive charts using static data
3. Host on GitHub Pages
4. Link to live Netlify/Render deployment for full functionality

This gives clients a preview on GitHub Pages with link to full app.


PRE-DEPLOYMENT CHECKLIST
========================

Before deploying, ensure:

[] Remove DEBUG = True from run.py
[] Set up proper database path for production
[] Add SECRET_KEY environment variable
[] Create .gitignore to exclude sensitive files
[] Test all routes locally
[] Clear cache and test cold start
[] Verify database seedning works on server
[] Test all payment method flows
[] Verify charts render correctly
[] Test on mobile devices (use Developer Tools)
[] Check all images/assets load correctly


SETUP FOR DEPLOYMENT
====================

1. MODIFY run.py for production:

   if __name__ == '__main__':
       app.run(
           debug=False,
           host='0.0.0.0',
           port=int(os.environ.get('PORT', 5000))
       )

2. INSTALL GUNICORN:

   pip install gunicorn
   pip freeze > requirements.txt

3. CREATE Procfile (for Render):

   web: gunicorn -w 2 -b 0.0.0.0:$PORT run:app

4. CREATE runtime.txt (optional, specifies Python version):

   python-3.11.6

5. UPDATE .gitignore:

   *.pyc
   __pycache__/
   venv/
   instance/
   .env
   .DS_Store

6. COMMIT AND PUSH:

   git add -A
   git commit -m "Prepare for production deployment"
   git push origin main


QUICK START - NETLIFY DEPLOYMENT
=================================

1. Install Netlify CLI:
   npm install -g netlify-cli

2. Login to Netlify:
   netlify login

3. Deploy:
   netlify deploy --prod --dir=.

4. Get your live URL from the output


QUICK START - RENDER DEPLOYMENT
================================

1. Go to https://render.com/
2. Create new Web Service
3. Select GitHub repository
4. Configure as per "METHOD 2" above
5. Click "Create Web Service"
6. Get live URL from Render dashboard


DOMAIN CONFIGURATION
====================

After deploying to Netlify or Render, you can:

1. Use default subdomain (provided by service)
2. Add custom domain (requires DNS configuration)
3. Set up HTTPS (automatic with Netlify/Render)

Custom Domain Example:
- Netlify: bontez-suppliers.netlify.app
- Render: bontez-suppliers.onrender.com
- Custom: bontez.your-domain.com


SHARING WITH CLIENTS
====================

Once deployed:

1. Send them the live URL
2. Include credentials for test access (if implemented)
3. Provide README with feature overview
4. Share QUICK_START.md for feature walkthrough
5. Include contact info for feedback

Example Share Link:
https://bontez-suppliers.netlify.app/


MAINTENANCE & UPDATES
=====================

After deployment:

1. Make changes locally and test
2. Commit to GitHub
3. Push to main branch
4. Netlify/Render auto-deploys (1-2 minutes)
5. Test live site
6. Monitor for errors in service dashboard


MONITORING & LOGGING
====================

Netlify:
- View logs in Netlify Dashboard
- Check function execution time
- Monitor build status

Render:
- View logs in Render Dashboard
- Monitor memory usage
- Check error logs

Both have email alerts for deployment failures.


TROUBLESHOOTING
===============

Issue: Database not found on server
Solution: Ensure database path uses environment variables
         Update seed.py to handle deployment scenarios

Issue: Static files not loading
Solution: Ensure Flask is configured with correct static path
         Check CSS file is being served with correct Content-Type

Issue: Charts not rendering
Solution: Verify Chart.js CDN is accessible
         Check console for JavaScript errors

Issue: Slow responses
Solution: Optimize database queries
         Consider caching with Redis
         Use database connection pooling


SECURITY NOTES
==============

For production deployment:

1. Never commit .env files
2. Store sensitive data in environment variables
3. Use HTTPS (automatic on Netlify/Render)
4. Set secure SESSION_COOKIE_SECURE = True
5. Implement user authentication
6. Add CSRF protection
7. Rate limit API endpoints
8. Monitor for suspicious activity
9. Regular security audits
10. Keep dependencies updated


PERFORMANCE OPTIMIZATION
=========================

For production:

1. Enable CSS minification
2. Enable JavaScript minification
3. Compress images
4. Use CDN for static files
5. Implement caching headers
6. Use database indexes
7. Optimize database queries
8. Consider adding Redis cache
9. Monitor response times
10. Set up performance alerts


NEXT STEPS
==========

1. Choose deployment platform (Netlify or Render recommended)
2. Set up account
3. Connect GitHub repository
4. Configure environment variables
5. Deploy
6. Test all features
7. Share live URL with clients
8. Monitor for issues
9. Gather feedback
10. Make improvements

---

For questions about deployment, refer to:
- Netlify Docs: https://docs.netlify.com/
- Render Docs: https://render.com/docs/
- Flask Deployment: https://flask.palletsprojects.com/en/2.3.x/deploying/

Author: Llakterian
Last Updated: November 18, 2025
