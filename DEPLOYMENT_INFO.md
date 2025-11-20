# Deployment Information

**Built by Llakterian** | llakterian@gmail.com

## Current Deployment: Netlify

This app is configured for **Netlify deployment** with localStorage for testing.

### Quick Deploy

See: **[NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)** for complete guide.

```bash
# Push to GitHub
git push origin main

# Deploy happens automatically on Netlify
# Visit: https://app.netlify.com
```

---

## Why Netlify?

**Perfect for testing**:
- Frontend-only (no backend setup needed)
- Data stored in browser localStorage
- Works offline on phones
- Free tier includes:
  - 100 GB bandwidth/month
  - 300 build minutes/month
  - Automatic HTTPS
  - Auto-deploy from Git

**Testing workflow**:
1. Deploy to Netlify
2. Share URL with clients
3. They test on their phones
4. Data persists in their browser
5. No database setup required

---

## Old Deployment Docs (Archived)

The following files are for **Render deployment with Flask backend**:
- `RENDER_DEPLOYMENT.md`
- `COMPLETE_DEPLOYMENT_GUIDE.md`
- `DEPLOYMENT_CHECKLIST.md`
- `DEPLOYMENT_GUIDE.md`
- `DEPLOYMENT_READY.md`
- `DEPLOY_NOW.md`
- `RENDER_FIX.md`
- `RENDER_TROUBLESHOOTING.md`
- `GITHUB_AND_RENDER_SETUP.md`

These are kept for reference if you need backend deployment later.

---

## Future: Production Deployment

### Option 1: Netlify + Backend API

**For production with database**:
1. Deploy React frontend to Netlify (as now)
2. Deploy Flask backend to:
   - Render.com (Python hosting)
   - Railway.app
   - DigitalOcean App Platform
   - AWS/GCP/Azure
3. Update `VITE_API_URL` to point to backend
4. Data syncs to real database

### Option 2: Android APK

**For native mobile app**:
1. Use current Netlify deployment
2. Convert to APK with PWA Builder or Capacitor
3. Submit to Google Play Store
4. Data still in localStorage OR connect to backend

See: **[NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)** → "Converting to Android APK"

---

## Current Configuration

**Environment**: Production (Netlify)  
**API Mode**: localStorage (mock API)  
**Data Storage**: Browser localStorage  
**Offline**: Yes, fully functional  
**Multi-user**: No (each device has own data)  

**Configuration files**:
- `/frontend/netlify.toml` - Netlify build settings
- `/frontend/.env.production` - Environment variables
- `/frontend/public/manifest.json` - PWA manifest

---

## Support

**Deployment questions**: llakterian@gmail.com  
**Netlify docs**: https://docs.netlify.com  
**GitHub repo**: https://github.com/llakterian/bontez_suppliers

**Built by Llakterian**
