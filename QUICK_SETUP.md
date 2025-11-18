QUICK SETUP GUIDE - BONTEZ SUPPLIERS
Author: Llakterian
Date: November 18, 2025

FOR CLIENTS: GET THE APP RUNNING IN 5 MINUTES
==============================================

Option 1: Use The Live Web Version (Easiest - 2 minutes)
=========================================================
No installation needed!

1. Visit your deployed link (you'll get this from the team)
   Example: https://bontez-suppliers.onrender.com

2. Start using immediately:
   - View dashboard
   - Manage clients
   - Record sales
   - Check reports
   - All on any device (phone, tablet, desktop)

3. Share feedback via email or WhatsApp


Option 2: Run Locally on Your Computer (5 minutes)
==================================================

Prerequisites:
- Python 3.7 or higher
- Git (optional, but recommended)

Step 1: Download the code
```bash
# Option A: Clone from GitHub
git clone https://github.com/[username]/bontez_suppliers.git
cd bontez_suppliers

# Option B: Download ZIP and extract
# Then open Terminal/CMD in that folder
```

Step 2: Set up Python
```bash
# Create virtual environment
python3 -m venv venv

# Activate it
# On Mac/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

Step 3: Install requirements
```bash
pip install -r requirements.txt
```

Step 4: Seed sample data (optional)
```bash
python seed.py
# Creates 8 suppliers, 5 clients, sample sales
```

Step 5: Run the app
```bash
python run.py
```

Step 6: Open in browser
```
Visit: http://127.0.0.1:5000
```

Step 7: Explore!
- Dashboard: See sales summary
- Clients: Add/view customer info
- Sales: Record new transactions
- Reports: View charts and analytics
- Suppliers: Manage gas suppliers

To Stop the App:
Press Ctrl+C in terminal


RESPONSIVE DESIGN - ALL DEVICES SUPPORTED
==========================================

The app works perfectly on:

Phones (320px - 480px):
- Tables scroll horizontally
- Stacked layout for readability
- Touch-friendly buttons (44px minimum)
- Mobile optimized navigation

Tablets (480px - 1024px):
- 2-column layouts
- Balanced spacing
- Touch-friendly interface
- Forms easy to fill

Desktops (1024px+):
- Full 4-column layouts
- Charts side by side
- Professional appearance
- Mouse + keyboard friendly

Ultra-wide (1440px+):
- Maximum layout optimization
- Large readable text
- Professional dashboard view

Browser Testing:
1. Open http://127.0.0.1:5000
2. Press F12 (or Cmd+Option+I on Mac)
3. Click the device toggle icon (top-left)
4. Select device from dropdown
5. Test pages:
   - Dashboard
   - Clients list
   - Sales form
   - Reports
6. Rotate to landscape
7. Test all buttons and forms


DEPLOYMENT OPTIONS
===================

Option A: Deploy on Render.com (Recommended)
- Free tier included
- 5-minute setup
- Share live link with clients
- See DEPLOYMENT_GUIDE.md for full steps

Option B: Deploy on Fly.io
- More powerful free tier
- Global performance
- See DEPLOYMENT_GUIDE.md for full steps

Option C: Deploy on Railway.app
- Simple interface
- $5/month free credit
- See DEPLOYMENT_GUIDE.md for full steps

Option D: Run Locally Only
- Good for testing
- Not accessible to external clients
- Good for single-user setup


DATABASE & DATA
===============

Data Storage:
- All data stored in SQLite database
- Located at: instance/bontez_suppliers.db
- Created automatically on first run

Sample Data:
Running `python seed.py` creates:
- 8 Gas Suppliers (Top Gas, K-Gas, Total, etc.)
- 7 Products (6Kg, 12Kg cylinders + accessories)
- 5 Sample Clients
- 5 Sample Sales with different payment methods
- Complete installment schedules

Resetting Data:
To clear and start fresh:
```bash
rm instance/bontez_suppliers.db
python seed.py
```

Backing Up Data:
```bash
# Simple copy
cp instance/bontez_suppliers.db backups/backup_$(date +%Y%m%d).db

# On Linux/Mac
mkdir -p backups
cp instance/bontez_suppliers.db backups/backup_$(date +%Y%m%d_%H%M%S).db
```


TROUBLESHOOTING
===============

App Won't Start - "Address already in use"
Solution:
```bash
# Kill process using port 5000
# On Mac/Linux:
lsof -i :5000
kill -9 [PID]

# On Windows:
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

"ModuleNotFoundError: No module named 'flask'"
Solution:
```bash
# Make sure virtual environment is activated
source venv/bin/activate
# Then reinstall
pip install -r requirements.txt
```

Database Issues
Solution:
```bash
# Backup current database
cp instance/bontez_suppliers.db instance/bontez_suppliers.db.backup

# Reseed
python seed.py
```

Charts Not Showing
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Try incognito/private window
- Check browser console for errors (F12)

Not Responsive on Mobile
- Make sure viewport meta tag present in base.html
- Clear DevTools cache (if testing locally)
- Try different browser

Page Too Slow
- This is normal on first load
- App loads faster on repeat visits (caching)
- If deployed on Render free tier, may be slower initially
- Speed improves with time


KEYBOARD SHORTCUTS
==================

In the Web Interface:
- Tab: Move between form fields
- Enter: Submit form
- Esc: Cancel (if implemented in forms)
- Ctrl+P / Cmd+P: Print page (works with reports!)

Browser DevTools (Testing):
- F12: Open DevTools
- Ctrl+Shift+I: Open DevTools (Windows/Linux)
- Cmd+Option+I: Open DevTools (Mac)
- Ctrl+Shift+M: Toggle device toolbar
- Ctrl+Shift+C: Select element


FEATURES OVERVIEW
=================

Dashboard:
- Total sales count
- Active clients count
- Paid invoices count
- Pending payments count
- Recent sales activity
- Quick action buttons

Clients Management:
- Add new clients
- View client details
- See sales history
- Track outstanding balances
- Phone number validation
- Contact information

Suppliers:
- View all 8 major suppliers
- Supplier details
- Color-coded identification
- Add new suppliers if needed

Sales Transactions:
- Record multi-item sales
- Select clients
- Add multiple products
- Three payment methods:
  * Cash (instant payment)
  * Mpesa (with transaction code)
  * Installment (flexible plans: 2/3/4/6 months)
- View sale history
- Track payment status

Reports:
- Daily sales report
- Monthly sales report
- Bar charts by supplier
- Pie charts for distribution
- Summary statistics
- Printable layouts

Payment Tracking:
- Automatic balance calculation
- Installment schedules
- Payment status indicators
- Payment history


NEXT STEPS
==========

1. Understand the System
   - Spend 10 minutes exploring the interface
   - Check the dashboard
   - Review sample data

2. Test with Real Data
   - Add your actual clients
   - Record sample transactions
   - Verify calculations

3. Customize (if needed)
   - Edit pricing in seed.py
   - Add/remove suppliers
   - Adjust product types

4. Deploy for Clients
   - Choose deployment option
   - Share live link
   - Get client feedback

5. Go Live
   - Start recording actual sales
   - Monitor performance
   - Update inventory as needed


SUPPORT
=======

For issues or questions:
1. Check DEPLOYMENT_GUIDE.md
2. Check main README.md
3. Review code comments in app/routes.py
4. Check browser console (F12) for errors
5. Check server logs in terminal

Report bugs by:
- Taking a screenshot
- Noting the URL/page
- Describing what happened
- Sharing your browser and OS


FEATURES IMPLEMENTED
====================

All major features are complete:
✓ Responsive design (all screen sizes)
✓ Multi-item sales
✓ Three payment methods
✓ Installment tracking
✓ Daily/monthly reports
✓ Interactive charts
✓ Client management
✓ Supplier management
✓ Professional UI
✓ Mobile optimized
✓ Print-friendly pages
✓ Touch-friendly interface
✓ Accessibility features


CONGRATULATIONS!
================

You now have a complete, professional gas sales management system!

This system includes:
- Complete inventory management
- Flexible payment tracking
- Beautiful reporting
- Works on all devices
- Easy to deploy
- Ready for real customers

Use it with confidence and share feedback for improvements!

---

For more technical details, see:
- README.md (main documentation)
- DEPLOYMENT_GUIDE.md (hosting options)
- DESIGN_SUMMARY.md (design details)
- PROJECT_OVERVIEW.md (technical overview)

Happy selling!
