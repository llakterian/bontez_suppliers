# Render Deployment Troubleshooting Guide

## Issues Fixed

### 1. Build Script had Emojis
**Problem**: Emojis in echo statements can cause encoding issues on Render
**Fixed**: Removed all emojis from build.sh

### 2. Procfile was Running npm in Web Command
**Problem**: Build should happen in build phase, not web startup
**Fixed**: Procfile now only runs gunicorn (build happens in build.sh)

### 3. CORS Blocked Production Access
**Problem**: CORS only allowed localhost:5173, blocking Render domain
**Fixed**: CORS now allows all origins (safe since Flask serves React)

### 4. Missing Node.js Configuration
**Problem**: Render might not know which Node.js version to use
**Fixed**: Added .node-version file and render.yaml

## Render Configuration

### Required Files

1. **Procfile** (web server command)
```
web: gunicorn -w 2 -b 0.0.0.0:$PORT run:app
```

2. **build.sh** (build command)
```bash
#!/bin/bash
pip install -r requirements.txt
cd frontend
npm install
npm run build
cd ..
```

3. **render.yaml** (Render configuration)
```yaml
services:
  - type: web
    name: bontez-suppliers
    env: python
    buildCommand: "./build.sh"
    startCommand: "gunicorn -w 2 -b 0.0.0.0:$PORT run:app"
    envVars:
      - key: NODE_VERSION
        value: 18.17.0
```

4. **.node-version** (Node.js version)
```
18.17.0
```

## Render Dashboard Settings

### Environment Section
Make sure these are set:

**Build Command**:
```
./build.sh
```

**Start Command**:
```
gunicorn -w 2 -b 0.0.0.0:$PORT run:app
```

### Environment Variables (if needed)
- `PYTHON_VERSION`: 3.11.0
- `NODE_VERSION`: 18.17.0

## Manual Deployment Steps

If auto-deploy isn't working:

1. **Go to Render Dashboard**
   - https://dashboard.render.com

2. **Select Your Service**
   - Click on "bontez-suppliers"

3. **Manual Deploy**
   - Click "Manual Deploy" button
   - Select "Clear build cache & deploy"

4. **Watch Build Logs**
   - Monitor the logs for errors
   - Build should complete in 10-15 minutes

## Common Errors & Solutions

### Error: "npm: command not found"
**Solution**: Add .node-version file (done)
```
18.17.0
```

### Error: "Permission denied: ./build.sh"
**Solution**: Ensure build.sh is executable
```bash
chmod +x build.sh
git add build.sh
git commit -m "Fix: Make build.sh executable"
git push
```

### Error: "No such file or directory: frontend/dist"
**Solution**: React build failed, check frontend/package.json
- Verify "build" script exists
- Check for TypeScript errors

### Error: "CORS policy blocked"
**Solution**: Already fixed - CORS allows all origins

### Error: 404 on all routes
**Solution**: Check that:
- frontend/dist exists after build
- Flask static_folder points to '../frontend/dist'
- catch-all route serves index.html

## Verify Deployment

### 1. Check Build Logs
Look for these success messages:
```
Installing backend dependencies...
Installing frontend dependencies...
Building React app...
Build complete!
```

### 2. Check Build Output
Ensure these exist:
```
frontend/dist/index.html
frontend/dist/assets/
```

### 3. Test Endpoints

**Frontend (React)**:
```
https://your-app.onrender.com/
https://your-app.onrender.com/dashboard
https://your-app.onrender.com/suppliers
```

**Backend (API)**:
```
https://your-app.onrender.com/api/clients
https://your-app.onrender.com/api/suppliers
```

### 4. Check Developer Console
Open browser console (F12) and check for:
- No CORS errors
- No 404 errors for static assets
- API calls returning data

## Mobile Testing

### Clear Browser Cache
On mobile:
1. Open browser settings
2. Clear browsing data
3. Select "Cached images and files"
4. Reload the app

### Force Refresh
- **iOS Safari**: Settings > Safari > Clear History
- **Android Chrome**: Settings > Privacy > Clear browsing data

### Check Mobile Network
- Ensure you're not on VPN
- Try both WiFi and mobile data
- Check if desktop browser works first

## Build Time Expectations

| Phase | Duration |
|-------|----------|
| Python deps | 1-2 min |
| npm install | 3-5 min |
| React build | 2-3 min |
| Server start | 30 sec |
| **Total** | **10-15 min** |

## If Still Not Working

### 1. Check Render Service Status
```
https://status.render.com
```

### 2. View Full Logs
- Render Dashboard > Your Service > Logs
- Look for "Error", "Failed", "Warning"

### 3. Test Locally First
```bash
cd /home/c0bw3b/Documents/bontez_suppliers
./build.sh
python run.py
# Visit http://localhost:5000
```

### 4. Contact Support
If all else fails:
- Email: llakterian@gmail.com
- Subject: "Bontez Suppliers - Render Deployment Issue"
- Include: Build logs, error messages, screenshot

## Next Steps After This Fix

1. **Commit the fixes**:
```bash
git add -A
git commit -m "Fix: Render deployment configuration issues"
git push origin main
```

2. **Trigger New Deploy**:
- Render auto-deploys on push
- Or click "Manual Deploy" in dashboard

3. **Wait 10-15 minutes**:
- Monitor build logs
- Check for "Deploy succeeded"

4. **Test on mobile**:
- Clear cache first
- Visit your Render URL
- Check all pages work

## Success Indicators

Build logs should show:
```
Installing backend dependencies...
Successfully installed Flask...
Installing frontend dependencies...
added 1234 packages...
Building React app...
vite v5.x.x building for production...
dist/index.html    x.xx kB
Build complete!
==> Build successful!
==> Starting service...
[INFO] Starting gunicorn...
```

Built by Llakterian | llakterian@gmail.com
