#  DEPLOY NOW - Quick Start Guide

##  5-Minute Deployment

### Step 1: Commit Your Code (1 min)
```bash
cd /home/c0bw3b/Documents/bontez_suppliers
git add -A
git commit -m "Production ready: Enhanced reports + Sales wizard + Auto-deploy"
git push origin main
```

### Step 2: Deploy to Render (2 min)
1. Go to: https://dashboard.render.com
2. Sign up/Login with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select **bontez_suppliers** repo
5. Configure:
   - **Name**: `bontez-suppliers`
   - **Environment**: Python 3
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn -w 2 -b 0.0.0.0:$PORT run:app`
   - **Plan**: Free

### Step 3: Set Environment Variables (1 min)
```
FLASK_ENV = production
FLASK_DEBUG = 0
SECRET_KEY = <generate-with-python>
```

Generate SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### Step 4: Deploy! (1 min)
Click **"Create Web Service"**

Wait 10-15 minutes for build to complete.

### Step 5: Done! 
Your app will be live at:
```
https://bontez-suppliers-XXXX.onrender.com
```

---

## 🔄 Update Your App Later

```bash
# Make changes
nano app/routes.py

# Commit
git add -A
git commit -m "Updated XYZ"

# Push (auto-deploys!)
git push origin main
```

Render rebuilds automatically in 10-15 minutes.

---

##  What's Included

Your deployed app includes:

 **Flask Backend** - All API endpoints  
 **React Frontend** - Modern UI with:
   - Dashboard with KPIs
   - Enhanced Reports (Charts, PDF/CSV export)
   - Sales Wizard (Offline support, M-Pesa QR)
   - Clients & Suppliers management
   - Dark mode support
   - Mobile responsive
   - Kenyan currency formatting

 **Auto-Deploy** - Push to GitHub → Auto-deploy  
 **HTTPS** - Secure by default  
 **Free Hosting** - No credit card required  

---

##  Test Your Deployment

After deploy completes:

```bash
# Replace with your actual URL
export APP_URL="https://bontez-suppliers-XXXX.onrender.com"

# Test endpoints
curl $APP_URL
curl $APP_URL/api/clients
curl $APP_URL/api/reports/sales
```

Or visit in browser:
- Dashboard: `https://your-app.onrender.com/`
- Reports: `https://your-app.onrender.com/reports`
- API: `https://your-app.onrender.com/api/clients`

---

##  Troubleshooting

**Build fails?**
- Check build logs in Render dashboard
- Ensure `build.sh` has execute permissions
- Verify Node.js is available

**App won't start?**
- Check environment variables are set
- Verify `requirements.txt` is complete
- Check logs for Python errors

**React app not loading?**
- Build takes 10-15 min first time
- Check if `frontend/dist` folder exists after build
- Try rebuilding manually: `cd frontend && npm run build`

**API calls fail?**
- Check Network tab in browser DevTools
- Verify API_BASE_URL in console
- Should be `/api` in production

---

##  Free Tier Limits

- **Bandwidth**: 50GB/month (plenty for testing)
- **RAM**: 512MB (sufficient for small apps)
- **Spins down**: After 15 min inactivity
- **Cold start**: ~30 seconds when waking up
- **Builds**: Unlimited

**Tip**: First request after inactivity will be slow (cold start). After that, it's fast!

---

##  Success!

Once deployed, share this URL with clients:
```
https://bontez-suppliers-XXXX.onrender.com
```

They can:
- View dashboard
- Browse clients/sales
- Generate reports
- Test features
- Access from any device
- No installation needed!

---

##  Full Documentation

For detailed guides:
- **Complete Guide**: `COMPLETE_DEPLOYMENT_GUIDE.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.txt`
- **Render Setup**: `RENDER_DEPLOYMENT.md`
- **GitHub Setup**: `GITHUB_AND_RENDER_SETUP.md`

---

**Built by Llakterian for Kenyan gas distributors**

 Bontez Suppliers - Complete Gas Distribution Management System
