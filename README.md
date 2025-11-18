Bontez Suppliers - Gas Sales Management System

Author: Llakterian

Overview

Bontez Suppliers is a comprehensive gas sales management system designed for a Kenyan gas distribution company. The system allows tracking of clients, suppliers, sales transactions, and provides detailed reporting with visual charts and analytics.

Features

Dashboard
- Overview of total sales, clients, and pending balances
- Recent sales activity feed

Client Management
- Register and manage customer information
- Track individual client sales history
- Monitor outstanding balances

Supplier Management
- Maintain list of gas suppliers (Top Gas, K-Gas, Total Gas, Rubis Gas, OiLibya Gas, Men Gas, Hashi Gas, Hass Gas)
- Track supplier colors for visual reporting

Sales Management
- Create sales transactions with multiple items
- Support for 6Kg and 12Kg cylinders (new purchases or refills)
- Track accessory sales (burners, grills, pipes, etc.)
- Three payment methods: Cash, Mpesa, and Installment

Payment Tracking
- Cash payments recorded immediately
- Mpesa payments with transaction code tracking
- Installment plans with flexible payment schedules
- Outstanding balance tracking

Reporting
- Daily sales reports with bar and pie charts
- Monthly sales reports with visual analytics
- Supplier-wise sales breakdown
- Revenue tracking in Kenyan Shillings (KES)

Color Coding for Charts
- Top Gas: Red
- K-Gas: Black
- Total Gas: Orange
- Rubis Gas: Green
- OiLibya Gas: Brown
- Men Gas: Maroon
- Hashi Gas: Yellow
- Hass Gas: Blue
- Mixed Gas: Purple

Installation

Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

Steps

1. Clone the repository:
   git clone https://github.com/llakterian/bontez_suppliers.git
   cd bontez_suppliers

2. Create a virtual environment:
   python -m venv venv

3. Activate the virtual environment:
   On Linux/Mac:
   source venv/bin/activate
   On Windows:
   venv\Scripts\activate

4. Install dependencies:
   pip install -r requirements.txt

5. Seed the database with sample data:
   python seed.py

6. Run the application:
   python run.py

7. Open your browser and navigate to:
   http://127.0.0.1:5000

Project Structure

bontez_suppliers/
    app/
        __init__.py              - Flask app factory
        models.py                - Database models (Client, Supplier, Sale, etc.)
        routes.py                - Application routes and view handlers
        templates/
            base.html            - Base template with navigation
            index.html           - Dashboard
            clients/
                list.html        - Client list
                create.html      - Create new client
                view.html        - View client details
            suppliers/
                list.html        - Supplier list
                create.html      - Create new supplier
            sales/
                list.html        - Sales list
                create.html      - Create new sale
                view.html        - View sale details
            reports/
                daily.html       - Daily sales report
                monthly.html     - Monthly sales report
        static/
            css/
                style.css        - Main stylesheet
            js/                  - JavaScript files
    uploads/                     - Directory for file uploads
    seed.py                      - Database seeding script
    run.py                       - Application entry point
    requirements.txt             - Python dependencies
    README.md                    - This file

Database Schema

Suppliers Table
- id (Primary Key)
- name (String, unique)
- color (String) - for chart visualization
- created_at (DateTime)

Products Table
- id (Primary Key)
- name (String)
- supplier_id (Foreign Key, nullable)
- category (String) - e.g., 'cylinder_6kg', 'cylinder_12kg_refill', 'accessory'
- price (Float) - in Kenyan Shillings
- description (String)
- created_at (DateTime)

Clients Table
- id (Primary Key)
- name (String)
- phone (String, unique)
- email (String)
- address (String)
- created_at (DateTime)

Sales Table
- id (Primary Key)
- client_id (Foreign Key)
- supplier_id (Foreign Key, nullable)
- payment_method (String) - 'cash', 'mpesa', 'installment'
- mpesa_code (String, nullable) - for Mpesa transactions
- total_amount (Float) - in KES
- amount_paid (Float) - in KES
- notes (String)
- created_at (DateTime)
- sale_date (DateTime)

SaleItems Table
- id (Primary Key)
- sale_id (Foreign Key)
- product_id (Foreign Key)
- quantity (Integer)
- unit_price (Float) - in KES
- subtotal (Float) - in KES

Installments Table
- id (Primary Key)
- sale_id (Foreign Key)
- amount (Float) - in KES
- due_date (DateTime)
- paid_date (DateTime, nullable)
- is_paid (Boolean)
- created_at (DateTime)

Usage Guide

1. Adding Suppliers
   - Navigate to Suppliers -> Add New Supplier
   - Enter supplier name and color code
   - The color is used for chart visualization

2. Adding Clients
   - Navigate to Clients -> Add New Client
   - Enter client name, phone number, email, and address
   - Phone number must be unique

3. Creating a Sale
   - Navigate to Sales -> Create New Sale
   - Select customer
   - Add products (cylinders or accessories)
   - Select payment method:
     * Cash: Payment recorded immediately
     * Mpesa: Enter transaction code (e.g., ABC123XYZ)
     * Installment: Specify number of payments (2, 3, 4, or 6)
   - Submit the sale

4. Recording Installment Payments
   - Open a sale with pending balance
   - Enter payment amount
   - Submit to update the outstanding balance

5. Viewing Reports
   - Daily Report: Shows sales for a specific date with charts
   - Monthly Report: Shows aggregated sales for a month with supplier breakdown

Pricing Reference (Kenyan Shillings)

New Cylinders (with gas):
- 6Kg: KES 3,200
- 12Kg: KES 5,500

Refills/Swaps (empty for full):
- 6Kg: KES 2,000
- 12Kg: KES 3,100

Accessories:
- Burner: KES 750
- Grill: KES 1,000
- Pipe: KES 400

Future Enhancements

1. Authentication & Authorization
   - User login and roles (admin, sales staff, manager)
   - Role-based access control

2. Mpesa Integration
   - Real-time Mpesa API integration for payment verification
   - Automatic payment confirmation

3. SMS Notifications
   - Send payment reminders to customers
   - Payment confirmations via SMS

4. Advanced Reporting
   - Customer loyalty reports
   - Sales trends analysis
   - Best-selling products
   - Supplier performance metrics

5. Inventory Management
   - Track cylinder stock levels
   - Automatic low-stock alerts
   - Supplier order management

6. Mobile App
   - Mobile-friendly interface
   - Offline capability for sales entry
   - Barcode scanning for products

7. Export Functionality
   - Export reports to PDF
   - Export to Excel for further analysis

8. Multi-branch Support
   - Manage multiple sales locations
   - Branch-wise sales tracking

9. Debt Recovery
   - Automated reminders for overdue installments
   - Debt aging reports
   - Customer credit limits

10. Audit Trail
    - Track all changes to sales and client data
    - User activity logging

Production Deployment

For production deployment:

1. Use a production WSGI server (e.g., Gunicorn):
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 run:app

2. Use a production database (PostgreSQL recommended):
   Update SQLALCHEMY_DATABASE_URI in app/__init__.py

3. Set up proper security:
   - HTTPS/SSL certificates
   - CSRF protection
   - Input validation and sanitization
   - Rate limiting

4. Environment variables:
   - Store sensitive configuration in environment variables
   - Use .env files (not in version control)

5. Database backups:
   - Regular automated backups
   - Test backup restoration

6. Logging:
   - Implement proper logging system
   - Monitor application health

Troubleshooting

Database Issues
- If the database appears corrupted, delete bontez_suppliers.db and run seed.py again

Port Already in Use
- If port 5000 is in use, modify run.py to use a different port

Missing Dependencies
- Run: pip install --upgrade -r requirements.txt

Charts Not Displaying
- Ensure JavaScript is enabled in your browser
- Check browser console for errors

Support & Contribution

For issues, questions, or contributions, please contact the development team at Bontez Suppliers.

License

All rights reserved. Bontez Suppliers Management System - Author: Llakterian
