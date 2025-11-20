GITHUB PAGES DEPLOYMENT (OPTIONAL: Frontend Demo Only)
Author: Llakterian

OVERVIEW
========
This guide shows how to export your Flask app to static HTML and host it on GitHub Pages for client review. This is OPTIONAL - we recommend Render for full functionality.

WHEN TO USE GITHUB PAGES
========================
GitHub Pages is suitable for:
- Sharing a static prototype/demo
- Read-only client review
- Lightweight distribution

GitHub Pages is NOT suitable for:
- Live sales transactions (need backend)
- Database operations
- Form submissions
- Real-time reporting

We recommend: Deploy to Render instead (see RENDER_DEPLOYMENT.md)

IF YOU WANT GITHUB PAGES
========================

APPROACH 1: Host on Render (RECOMMENDED)
========================================
This is the best option - full functionality.

See: RENDER_DEPLOYMENT.md

APPROACH 2: Static HTML Export to GitHub Pages
===============================================
This requires manual steps and loses functionality.

Prerequisites:
- Frozen-Flask installed
- GitHub Pages enabled in repo settings

Step 1: Install Frozen-Flask
-----------------------------
$ pip install Frozen-Flask
$ pip freeze > requirements.txt
$ git add requirements.txt && git commit -m "Add Frozen-Flask"

Step 2: Create Freezer Script
-----------------------------
Create file: freeze.py

```python
from flask_frozen import Freezer
from app import create_app

app = create_app()
freezer = Freezer(app)

if __name__ == '__main__':
    freezer.freeze()
```

Step 3: Generate Static Files
-----------------------------
$ python freeze.py

This creates a /build directory with all static HTML files.

Step 4: Push to GitHub
---------------------
$ git add build/
$ git commit -m "Add frozen static site"
$ git push origin master

Step 5: Enable GitHub Pages
----------------------------
1. Go to repo settings: https://github.com/YOU/bontez_suppliers/settings
2. Scroll to "Pages"
3. Select "Deploy from branch"
4. Choose branch: "master"
5. Choose folder: "/build"
6. Click "Save"

Step 6: Access Your Site
------------------------
Your site is live at:
https://YOUR_USERNAME.github.io/bontez_suppliers/

LIMITATIONS OF GITHUB PAGES APPROACH
====================================
1. No database - reads from pre-existing data only
2. No form submissions - all buttons disabled
3. No real-time updates
4. Read-only demo only
5. Requires manual rebuild on changes

RECOMMENDED: Use Render Instead
===============================
Render gives you:
✓ Full functionality
✓ Database support
✓ Real sales transactions
✓ Form submissions work
✓ Auto-deploy on push
✓ Free tier available
✓ No manual rebuilds

See RENDER_DEPLOYMENT.md for 10-minute setup.

---
Author: Llakterian
Date: November 20, 2025
