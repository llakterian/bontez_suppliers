# Netlify Deployment Guide - Bontez Suppliers

**Built by Llakterian** | llakterian@gmail.com

## Overview

This guide explains how to deploy the Bontez Suppliers app to Netlify for phone testing with full offline support using localStorage.

### Key Features on Netlify
- Frontend-only deployment (React app)
- Data stored in browser's localStorage
- Full offline functionality
- Works on phones for testing
- Data persists between sessions
- No backend required for testing

---

## Prerequisites

1. **GitHub Account** with your code repository
2. **Netlify Account** (free tier available)
   - Sign up at: https://netlify.com
3. **Git** installed locally

---

## Quick Deploy (5 Minutes)

### Step 1: Push to GitHub

```bash
cd /home/c0bw3b/Documents/bontez_suppliers
git add -A
git commit -m "Configure for Netlify deployment with localStorage"
git push origin main
```

### Step 2: Connect to Netlify

1. **Login to Netlify**: https://app.netlify.com
2. **Click "Add new site"** → "Import an existing project"
3. **Connect to Git provider**: Select GitHub
4. **Authorize Netlify** to access your repositories
5. **Select repository**: `llakterian/bontez_suppliers`

### Step 3: Configure Build Settings

**Build settings**:
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`
- **Node version**: 18.17.0

**Environment variables** (optional):
```
VITE_API_URL=mock
VITE_USE_LOCAL_STORAGE=true
VITE_APP_NAME=Bontez Suppliers
VITE_AUTHOR=Llakterian
```

### Step 4: Deploy

1. Click **"Deploy site"**
2. Wait 2-3 minutes for build
3. Get your URL: `https://your-app-name.netlify.app`

---

## Testing on Your Phone

### Step 1: Get Your Netlify URL

After deployment, you'll get a URL like:
```
https://bontez-suppliers-abc123.netlify.app
```

### Step 2: Open on Phone

1. **Open browser** on your phone (Safari/Chrome)
2. **Visit the URL**
3. **Add to Home Screen** (optional):
   - **iPhone**: Safari → Share → Add to Home Screen
   - **Android**: Chrome → Menu → Add to Home Screen

### Step 3: Test Features

The app will work completely offline with data stored locally:

**Test these features**:
- Add clients → Stored in localStorage
- Add suppliers → Stored in localStorage
- Record sales → Stored in localStorage
- View reports → Generated from localStorage
- Close and reopen → Data persists!

---

## How localStorage Works

### Data Storage

All data is stored in your phone's browser:

```javascript
// Stored in browser's localStorage
{
  "bontez_clients": [...],      // All clients
  "bontez_suppliers": [...],    // All suppliers
  "bontez_sales": [...],        // All sales
  "bontez_products": [...]      // All products
}
```

### Data Persistence

- Data stays even after closing browser
- Survives phone restarts
- Cleared only if you clear browser data
- Each user has their own data

### Sample Data

On first use, the app creates sample data:
- 2 sample clients (John Kamau, Sarah Mwangi)
- 2 sample suppliers (Top Gas, K-Gas)
- 6 sample products (cylinders, accessories)

Users can add/edit/delete this data freely.

---

## Sharing with Clients for Testing

### Option 1: Share URL Directly

Send your Netlify URL to clients:
```
Hey, test our new app:
https://bontez-suppliers-abc123.netlify.app

Add it to your home screen for the best experience!
```

### Option 2: Custom Domain (Optional)

**Free Netlify subdomain**:
```
bontez-suppliers.netlify.app
```

**Custom domain** (if you own one):
1. Netlify Dashboard → Domain settings
2. Add custom domain: `app.yourdomain.com`
3. Follow DNS configuration steps

---

## Data Management

### Export Data

Users can export their data:
1. Open browser console (F12)
2. Run: `localStorage.getItem('bontez_clients')`
3. Copy and save JSON

### Import Data

Users can import data:
1. Open browser console
2. Run: `localStorage.setItem('bontez_clients', 'YOUR_JSON_DATA')`

### Reset Data

To start fresh:
1. Open browser console
2. Run: `localStorage.clear()`
3. Refresh page (sample data loads)

---

## Updating Your Deployment

### Auto-Deploy from GitHub

Netlify auto-deploys when you push to GitHub:

```bash
# Make changes locally
cd /home/c0bw3b/Documents/bontez_suppliers

# Commit and push
git add -A
git commit -m "Update: your changes"
git push origin main

# Netlify automatically rebuilds (2-3 min)
```

### Manual Deploy

**Option 1 - Netlify Dashboard**:
1. Go to Netlify Dashboard
2. Click "Deploys"
3. Click "Trigger deploy" → "Deploy site"

**Option 2 - Netlify CLI**:
```bash
cd frontend
npm run deploy
```

---

## Converting to Android APK (Future)

Once testing is complete, you can convert to a native Android app.

### Using Google Play Console

**Requirements**:
- Google Developer Account ($25 one-time fee)
- Android Studio or online converter
- App icons (192x192, 512x512)

### Steps:

1. **Use TWA (Trusted Web Activities)**:
   - Wraps your web app as native app
   - No code changes needed
   - Uses Chrome rendering engine

2. **Tools**:
   - **PWA Builder**: https://www.pwabuilder.com
   - **Bubblewrap**: Google's TWA generator
   - **Android Studio**: Full control

3. **Process**:
   ```bash
   # Install Bubblewrap
   npm install -g @bubblewrap/cli
   
   # Initialize TWA project
   bubblewrap init --manifest https://your-app.netlify.app/manifest.json
   
   # Build APK
   bubblewrap build
   
   # Output: app-release-signed.apk
   ```

4. **Upload to Google Play**:
   - Sign APK with your keystore
   - Upload to Play Console
   - Fill out store listing
   - Submit for review

### Alternative: Capacitor

Convert to full native app:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap sync
npx cap open android
```

---

## Troubleshooting

### Build Fails on Netlify

**Check build logs**:
1. Netlify Dashboard → Deploys → Failed deploy
2. Click "Deploy log"
3. Look for errors

**Common issues**:
```
Error: npm install failed
→ Solution: Check package.json is valid

Error: Build command failed
→ Solution: Check netlify.toml configuration

Error: TypeScript errors
→ Solution: Fix TypeScript errors locally first
```

### App Not Loading on Phone

**Clear browser cache**:
- **iPhone**: Settings → Safari → Clear History
- **Android**: Chrome → Settings → Clear browsing data

**Check network**:
- Ensure phone has internet (first load)
- After first load, works offline

### Data Not Persisting

**Check localStorage**:
1. Open phone browser's dev tools
2. Go to Application → Local Storage
3. Verify `bontez_*` keys exist

**Browser issues**:
- Some browsers block localStorage in private mode
- Use regular browsing mode

---

## Configuration Files

### netlify.toml

Located at: `/frontend/netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"
  base = "frontend"

[build.environment]
  NODE_VERSION = "18.17.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### .env.production

Located at: `/frontend/.env.production`

```env
VITE_API_URL=mock
VITE_USE_LOCAL_STORAGE=true
VITE_APP_NAME=Bontez Suppliers
VITE_AUTHOR=Llakterian
VITE_CONTACT_EMAIL=llakterian@gmail.com
```

### manifest.json

Located at: `/frontend/public/manifest.json`

PWA manifest for Add to Home Screen functionality.

---

## Comparison: Netlify vs Backend Deployment

| Feature | Netlify (localStorage) | Flask Backend |
|---------|------------------------|---------------|
| Cost | Free | Paid hosting |
| Setup Time | 5 minutes | 30 minutes |
| Data Storage | Browser localStorage | Database |
| Multi-user | No (per device) | Yes (shared) |
| Offline | Yes | Limited |
| Best For | Testing, demos | Production |

---

## Next Steps

### For Testing Phase (Current)

1. Deploy to Netlify
2. Share URL with testers
3. Collect feedback
4. Iterate on features

### For Production (Later)

**Option 1**: Keep Netlify + Add Backend
- Deploy Flask backend separately
- Update `VITE_API_URL` to backend URL
- Data syncs to database

**Option 2**: Convert to APK
- Use PWA Builder or Capacitor
- Submit to Google Play Store
- Native app experience

**Option 3**: Hybrid Approach
- Web app on Netlify (for desktop/web users)
- Native APK (for mobile users)
- Same codebase, different packaging

---

## Cost Breakdown

### Netlify (Free Tier)

**Included**:
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- HTTPS/SSL included
- Auto-deploy from Git

**Paid** (if needed):
- Pro: $19/month (more bandwidth)
- Business: $99/month (teams)

### Google Play (APK Distribution)

**One-time**:
- Developer account: $25

**Ongoing**:
- Free to distribute
- Optional: In-app purchases (30% fee)

---

## Support

**For deployment issues**:
- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://answers.netlify.com

**For app development**:
- Developer: llakterian@gmail.com
- GitHub: https://github.com/llakterian/bontez_suppliers

---

## Summary

**Current Setup**:
- Frontend hosted on Netlify
- Data stored in localStorage
- Works offline on phones
- Perfect for testing

**Deployment Steps**:
1. Push to GitHub
2. Connect to Netlify
3. Configure build settings
4. Deploy (2-3 min)
5. Share URL with testers

**Future Options**:
- Convert to Android APK
- Add Flask backend for production
- Publish to Google Play Store

**Built by Llakterian** | llakterian@gmail.com
