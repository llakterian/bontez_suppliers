# React Frontend Quick Setup Guide

## Installation Steps

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## What's Included

### Pages
-  Dashboard with KPI cards and recent sales
-  Client management (list, create, edit)
-  Supplier management with color-coding
-  Sales transactions with payment options
-  Reports with interactive charts

### Features
-  Dark/Light theme toggle
-  Mobile-responsive design
-  Kenyan-inspired color scheme
-  Real-time form validation
-  Toast notifications
-  Smooth animations
-  Chart.js integration

### Components Created
- Common: Button, Card, Input, Modal, LoadingSpinner
- Dashboard: StatCard, RecentSales
- Layout: NavBar with theme toggle

## Backend Integration

The React app expects the Flask backend at `http://localhost:5000/api`

To change the API URL, create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://your-backend-url/api
```

## Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

## Next Steps

1. Install dependencies: `npm install`
2. Start backend: `python run.py` (in root directory)
3. Start frontend: `npm run dev` (in frontend directory)
4. Open browser to `http://localhost:5173`
