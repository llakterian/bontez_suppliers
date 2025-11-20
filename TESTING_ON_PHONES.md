# Testing on Phones - Quick Guide

**Built by Llakterian** | llakterian@gmail.com

## Quick Start

### 1. Deploy to Netlify

```bash
cd /home/c0bw3b/Documents/bontez_suppliers
git add -A
git commit -m "Deploy to Netlify"
git push origin main
```

### 2. Get Your URL

After Netlify deployment completes:
```
https://your-app-name.netlify.app
```

### 3. Test on Phone

**Open in browser**:
- iPhone: Safari
- Android: Chrome

**Add to Home Screen**:
- Looks and feels like native app
- Opens fullscreen
- Persists data

---

## How It Works

### Data Storage

All data is stored in the phone's browser:
```javascript
Browser localStorage:
- bontez_clients    → Your clients
- bontez_suppliers  → Your suppliers  
- bontez_sales      → Your sales records
- bontez_products   → Product catalog
```

### Sample Data

First time you open the app, it creates:
- 2 sample clients (John Kamau, Sarah Mwangi)
- 2 sample suppliers (Top Gas, K-Gas)
- 6 sample products (cylinders, burners, regulators)

**You can**:
- Add new clients/suppliers/sales
- Edit existing data
- Delete sample data
- Export/import data

### Data Persistence

- Data stays when you close the app
- Survives phone restarts
- Each person has their own data
- Cleared only if browser data is cleared

---

## Testing Checklist

### Basic Features

- [ ] Open app on phone
- [ ] View dashboard
- [ ] Add new client
- [ ] Add new supplier
- [ ] Record a sale
- [ ] View reports
- [ ] Close app and reopen
- [ ] Verify data persists

### Advanced Features

- [ ] Add to Home Screen
- [ ] Test offline (airplane mode)
- [ ] Add multiple sales
- [ ] Generate reports
- [ ] Export data
- [ ] Clear and reset data

---

## Sharing with Clients

### Send URL

```
Hi [Client Name],

I'd like you to test our new gas distribution app:
https://bontez-suppliers.netlify.app

Instructions:
1. Open on your phone (Safari/Chrome)
2. Add to home screen for best experience
3. Try adding clients, recording sales
4. All data stays on your phone

Let me know what you think!

- Llakterian
llakterian@gmail.com
```

### QR Code

Generate QR code for your Netlify URL:
1. Visit: https://www.qr-code-generator.com
2. Enter your Netlify URL
3. Download QR code
4. Share with clients

---

## Common Questions

### Q: Does it need internet?

**First time**: Yes (to load the app)  
**After that**: Works completely offline

### Q: Will my data be lost?

No! Data is stored in browser's localStorage and persists between sessions.

### Q: Can multiple people use the same data?

No, each phone/browser has its own data. This is perfect for testing, but production will need a backend database.

### Q: How do I reset/clear data?

**Method 1**: Clear browser data
- iPhone: Settings → Safari → Clear History
- Android: Chrome → Settings → Clear browsing data

**Method 2**: Browser console
```javascript
localStorage.clear()
location.reload()
```

### Q: Can I export my test data?

Yes! Open browser console (F12) and run:
```javascript
// Export all data
const data = {
  clients: localStorage.getItem('bontez_clients'),
  suppliers: localStorage.getItem('bontez_suppliers'),
  sales: localStorage.getItem('bontez_sales')
};
console.log(JSON.stringify(data));
// Copy and save
```

---

## Troubleshooting

### App not loading

1. Check internet connection (first load)
2. Clear browser cache
3. Try different browser
4. Check if URL is correct

### Data not saving

1. Check if in private/incognito mode (doesn't save)
2. Check browser localStorage is enabled
3. Try regular browsing mode

### Slow performance

1. Too much data in localStorage?
2. Old phone/browser?
3. Try clearing old data

---

## Next Steps

### After Testing

Once testing is complete:

**Option 1**: Deploy with backend
- Add Flask API for shared database
- Multiple users can access same data
- Deploy backend to Render/Railway/etc

**Option 2**: Convert to Android APK
- Package as native app
- Submit to Google Play Store
- Install on phones like any app
- See: [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) → APK section

---

## Feedback

Collect feedback from testers:

**Questions to ask**:
- Is the interface intuitive?
- Are colors/fonts readable?
- Does it work smoothly?
- Any bugs or crashes?
- Missing features?
- What would you change?

**Send feedback to**: llakterian@gmail.com

---

## Support

**Questions**: llakterian@gmail.com  
**Deployment Guide**: [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)  
**GitHub**: https://github.com/llakterian/bontez_suppliers

**Built by Llakterian**
