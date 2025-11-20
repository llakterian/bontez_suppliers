# Flask Backend Setup for React Frontend

##  Quick Start

### 1. Create Virtual Environment (if not exists)
```bash
python3 -m venv venv
source venv/bin/activate  # On Linux/Mac
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Start the Flask Backend
```bash
python run.py
```

The backend will run on `http://localhost:5000`

##  What Was Changed

### CORS Support Added
- **File**: `app/__init__.py`
- **Change**: Added Flask-CORS to allow React frontend (port 5173) to connect
- **Allows**: Requests from `http://localhost:5173` and `http://127.0.0.1:5173`

### API Endpoints Added/Updated

#### Dashboard API
- **Endpoint**: `GET /api/dashboard`
- **Returns**: Dashboard stats and recent sales in JSON format

#### Client API
- **Base**: `/api/clients/`
- **Endpoints**:
  - `GET /api/clients/` - List all clients (paginated)
  - `POST /api/clients/create` - Create new client
  - `GET /api/clients/<id>` - View client details

#### Supplier API
- **Base**: `/api/suppliers/`
- **Endpoints**:
  - `GET /api/suppliers/` - List all suppliers
  - `POST /api/suppliers/create` - Create new supplier

#### Sales API
- **Base**: `/api/sales/`
- **Endpoints**:
  - `GET /api/sales/` - List all sales
  - `POST /api/sales/create` - Create new sale
  - `GET /api/sales/<id>` - View sale details

#### Reports API
- **Base**: `/api/reports/`
- **Endpoints**:
  - `GET /api/reports/daily-data` - Daily sales data for charts
  - `GET /api/reports/monthly-data` - Monthly sales data for charts

##  Notes

### Existing Routes Still Work
The original Jinja2 template routes still work:
- Dashboard: `http://localhost:5000/`
- Clients: `http://localhost:5000/clients`
- Suppliers: `http://localhost:5000/suppliers`
- Sales: `http://localhost:5000/sales`
- Reports: `http://localhost:5000/reports`

### New API Routes for React
All new `/api/*` routes return JSON data for the React frontend.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill existing Flask process
pkill -f "python run.py"
# Or find and kill specific process
lsof -ti:5000 | xargs kill -9
```

### Database Migrations
If you need to reset the database:
```bash
rm instance/bontez_suppliers.db  # Remove old database
python run.py  # Creates new database on startup
```

### CORS Errors
If you still see CORS errors:
1. Make sure Flask-CORS is installed: `pip list | grep Flask-CORS`
2. Check that Flask backend is running on port 5000
3. Check that React frontend is running on port 5173
4. Clear browser cache and reload

##  Development Workflow

### Terminal 1 - Backend
```bash
cd /home/c0bw3b/Documents/bontez_suppliers
source venv/bin/activate
python run.py
```

### Terminal 2 - Frontend
```bash
cd /home/c0bw3b/Documents/bontez_suppliers/frontend
npm run dev
```

Then open `http://localhost:5173` in your browser!

##  Expected Database Schema

The backend expects these tables (created automatically on first run):
- `suppliers` - Gas suppliers with colors
- `products` - Gas cylinders and accessories
- `clients` - Customers
- `sales` - Sales transactions
- `sale_items` - Individual items in a sale
- `installments` - Payment installments
- `accessory_sales` - Accessory sales tracking

##  Next Steps

1.  Activate virtual environment
2.  Install Flask-CORS: `pip install -r requirements.txt`
3.  Start Flask backend: `python run.py`
4.  Start React frontend: `cd frontend && npm run dev`
5.  Open browser to `http://localhost:5173`
6.  Enjoy your modern React frontend! 
