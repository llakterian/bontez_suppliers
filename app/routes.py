"""
Routes and views for Bontez Suppliers.
Author: Llakterian
"""

from flask import Blueprint, render_template, request, jsonify, redirect, url_for, flash
from app.models import db, Client, Supplier, Product, Sale, SaleItem, Installment, AccessorySale
from datetime import datetime, timedelta
from sqlalchemy import func, extract

main_bp = Blueprint('main', __name__)
clients_bp = Blueprint('clients', __name__, url_prefix='/clients')
suppliers_bp = Blueprint('suppliers', __name__, url_prefix='/suppliers')
sales_bp = Blueprint('sales', __name__, url_prefix='/sales')
reports_bp = Blueprint('reports', __name__, url_prefix='/reports')
accessories_bp = Blueprint('accessories', __name__, url_prefix='/accessories')


@main_bp.route('/')
def index():
    """Dashboard homepage."""
    total_sales = db.session.query(func.sum(Sale.total_amount)).scalar() or 0
    total_clients = db.session.query(func.count(Client.id)).scalar() or 0
    total_paid = db.session.query(func.sum(Sale.amount_paid)).scalar() or 0
    pending_balance = total_sales - total_paid
    
    recent_sales = Sale.query.order_by(Sale.created_at.desc()).limit(10).all()
    
    return render_template('index.html', 
                         total_sales=total_sales,
                         total_clients=total_clients,
                         total_paid=total_paid,
                         pending_balance=pending_balance,
                         recent_sales=recent_sales)


@clients_bp.route('/')
def list_clients():
    """List all clients."""
    page = request.args.get('page', 1, type=int)
    clients = Client.query.paginate(page=page, per_page=20)
    return render_template('clients/list.html', clients=clients)


@clients_bp.route('/create', methods=['GET', 'POST'])
def create_client():
    """Create a new client."""
    if request.method == 'POST':
        name = request.form.get('name')
        phone = request.form.get('phone')
        email = request.form.get('email')
        address = request.form.get('address')
        
        if Client.query.filter_by(phone=phone).first():
            flash('Phone number already exists', 'error')
            return redirect(url_for('clients.create_client'))
        
        client = Client(name=name, phone=phone, email=email, address=address)
        db.session.add(client)
        db.session.commit()
        flash(f'Client {name} created successfully', 'success')
        return redirect(url_for('clients.list_clients'))
    
    return render_template('clients/create.html')


@clients_bp.route('/<int:client_id>')
def view_client(client_id):
    """View client details and sales history."""
    client = Client.query.get_or_404(client_id)
    sales = Sale.query.filter_by(client_id=client_id).order_by(Sale.created_at.desc()).all()
    return render_template('clients/view.html', client=client, sales=sales)


@suppliers_bp.route('/')
def list_suppliers():
    """List all suppliers."""
    suppliers = Supplier.query.all()
    return render_template('suppliers/list.html', suppliers=suppliers)


@suppliers_bp.route('/create', methods=['GET', 'POST'])
def create_supplier():
    """Create a new supplier."""
    if request.method == 'POST':
        name = request.form.get('name')
        color = request.form.get('color')
        
        supplier = Supplier(name=name, color=color)
        db.session.add(supplier)
        db.session.commit()
        flash(f'Supplier {name} created successfully', 'success')
        return redirect(url_for('suppliers.list_suppliers'))
    
    return render_template('suppliers/create.html')


@sales_bp.route('/')
def list_sales():
    """List all sales."""
    page = request.args.get('page', 1, type=int)
    sales = Sale.query.paginate(page=page, per_page=20)
    return render_template('sales/list.html', sales=sales)


@sales_bp.route('/create', methods=['GET', 'POST'])
def create_sale():
    """Create a new sale."""
    if request.method == 'POST':
        client_id = request.form.get('client_id', type=int)
        supplier_id = request.form.get('supplier_id', type=int)
        payment_method = request.form.get('payment_method')
        mpesa_code = request.form.get('mpesa_code') if payment_method == 'mpesa' else None
        notes = request.form.get('notes')
        
        client = Client.query.get_or_404(client_id)
        
        items_data = request.form.getlist('item_product_id')
        items_qty = request.form.getlist('item_quantity')
        
        total_amount = 0.0
        sale_items = []
        
        for product_id, qty in zip(items_data, items_qty):
            if product_id and qty:
                product = Product.query.get_or_404(product_id)
                quantity = int(qty)
                subtotal = product.price * quantity
                total_amount += subtotal
                sale_items.append({'product': product, 'quantity': quantity, 'subtotal': subtotal})
        
        if not sale_items:
            flash('Sale must have at least one item', 'error')
            return redirect(url_for('sales.create_sale'))
        
        sale = Sale(
            client_id=client_id,
            supplier_id=supplier_id,
            payment_method=payment_method,
            mpesa_code=mpesa_code,
            total_amount=total_amount,
            notes=notes
        )
        
        if payment_method == 'cash':
            sale.amount_paid = total_amount
        elif payment_method == 'mpesa':
            sale.amount_paid = total_amount
        
        db.session.add(sale)
        db.session.flush()
        
        for item_data in sale_items:
            sale_item = SaleItem(
                sale_id=sale.id,
                product_id=item_data['product'].id,
                quantity=item_data['quantity'],
                unit_price=item_data['product'].price,
                subtotal=item_data['subtotal']
            )
            db.session.add(sale_item)
        
        if payment_method == 'installment':
            num_installments = request.form.get('num_installments', 3, type=int)
            installment_amount = total_amount / num_installments
            for i in range(num_installments):
                due_date = datetime.utcnow() + timedelta(days=30 * (i + 1))
                installment = Installment(
                    sale_id=sale.id,
                    amount=installment_amount,
                    due_date=due_date
                )
                db.session.add(installment)
        
        db.session.commit()
        flash(f'Sale created successfully for {client.name}', 'success')
        return redirect(url_for('sales.list_sales'))
    
    clients = Client.query.all()
    suppliers = Supplier.query.all()
    products = Product.query.all()
    
    return render_template('sales/create.html', clients=clients, suppliers=suppliers, products=products)


@sales_bp.route('/<int:sale_id>')
def view_sale(sale_id):
    """View sale details."""
    sale = Sale.query.get_or_404(sale_id)
    return render_template('sales/view.html', sale=sale)


@reports_bp.route('/daily')
def daily_report():
    """Generate daily sales report."""
    date_str = request.args.get('date', datetime.utcnow().strftime('%Y-%m-%d'))
    report_date = datetime.strptime(date_str, '%Y-%m-%d')
    
    sales = Sale.query.filter(
        func.date(Sale.sale_date) == report_date.date()
    ).all()
    
    return render_template('reports/daily.html', sales=sales, report_date=report_date)


@reports_bp.route('/daily-data')
def daily_data():
    """API endpoint for daily sales data (for charts)."""
    date_str = request.args.get('date', datetime.utcnow().strftime('%Y-%m-%d'))
    report_date = datetime.strptime(date_str, '%Y-%m-%d')
    
    sales = Sale.query.filter(
        func.date(Sale.sale_date) == report_date.date()
    ).all()
    
    supplier_sales = {}
    for sale in sales:
        supplier_name = sale.supplier.name if sale.supplier else 'Mixed Gas'
        if supplier_name not in supplier_sales:
            supplier_sales[supplier_name] = 0
        supplier_sales[supplier_name] += sale.total_amount
    
    suppliers_all = Supplier.query.all()
    color_map = {s.name: s.color for s in suppliers_all}
    color_map['Mixed Gas'] = 'purple'
    
    labels = list(supplier_sales.keys())
    data = list(supplier_sales.values())
    colors = [color_map.get(label, 'gray') for label in labels]
    
    return jsonify({'labels': labels, 'data': data, 'colors': colors})


@reports_bp.route('/monthly')
def monthly_report():
    """Generate monthly sales report."""
    year = request.args.get('year', datetime.utcnow().year, type=int)
    month = request.args.get('month', datetime.utcnow().month, type=int)
    
    return render_template('reports/monthly.html', year=year, month=month)


@reports_bp.route('/monthly-data')
def monthly_data():
    """API endpoint for monthly sales data (for charts)."""
    year = request.args.get('year', datetime.utcnow().year, type=int)
    month = request.args.get('month', datetime.utcnow().month, type=int)
    
    sales = Sale.query.filter(
        extract('year', Sale.sale_date) == year,
        extract('month', Sale.sale_date) == month
    ).all()
    
    supplier_sales = {}
    for sale in sales:
        supplier_name = sale.supplier.name if sale.supplier else 'Mixed Gas'
        if supplier_name not in supplier_sales:
            supplier_sales[supplier_name] = 0
        supplier_sales[supplier_name] += sale.total_amount
    
    suppliers_all = Supplier.query.all()
    color_map = {s.name: s.color for s in suppliers_all}
    color_map['Mixed Gas'] = 'purple'
    
    labels = list(supplier_sales.keys())
    data = list(supplier_sales.values())
    colors = [color_map.get(label, 'gray') for label in labels]
    
    total_revenue = sum(data)
    
    return jsonify({
        'labels': labels,
        'data': data,
        'colors': colors,
        'total_revenue': total_revenue
    })


@sales_bp.route('/<int:sale_id>/add-installment', methods=['POST'])
def add_installment(sale_id):
    """Record an installment payment."""
    sale = Sale.query.get_or_404(sale_id)
    amount = request.form.get('amount', type=float)
    
    if amount <= 0 or amount > sale.remaining_balance():
        flash('Invalid installment amount', 'error')
        return redirect(url_for('sales.view_sale', sale_id=sale_id))
    
    sale.amount_paid += amount
    db.session.commit()
    flash('Installment recorded successfully', 'success')
    
    return redirect(url_for('sales.view_sale', sale_id=sale_id))


# ============= ACCESSORIES ROUTES =============

@accessories_bp.route('/')
def list_accessories():
    """List daily accessory sales."""
    page = request.args.get('page', 1, type=int)
    sales = AccessorySale.query.order_by(AccessorySale.sale_date.desc()).paginate(page=page, per_page=20)
    return render_template('accessories/list.html', sales=sales)


@accessories_bp.route('/today')
def today_accessories():
    """Show today's accessories entry."""
    today = datetime.utcnow().date()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())
    
    sale = AccessorySale.query.filter(
        AccessorySale.sale_date >= today_start,
        AccessorySale.sale_date <= today_end
    ).first()
    
    if sale:
        return redirect(url_for('accessories.edit_accessories', sale_id=sale.id))
    
    return redirect(url_for('accessories.create_accessories'))


@accessories_bp.route('/create', methods=['GET', 'POST'])
def create_accessories():
    """Create new daily accessory sales entry."""
    if request.method == 'POST':
        today = datetime.utcnow().date()
        today_start = datetime.combine(today, datetime.min.time())
        today_end = datetime.combine(today, datetime.max.time())
        
        # Check if entry exists
        existing = AccessorySale.query.filter(
            AccessorySale.sale_date >= today_start,
            AccessorySale.sale_date <= today_end
        ).first()
        
        if existing:
            flash('Accessory entry for today already exists', 'warning')
            return redirect(url_for('accessories.edit_accessories', sale_id=existing.id))
        
        sale = AccessorySale(
            grill_quantity=int(request.form.get('grill_quantity', 0)),
            grill_total=float(request.form.get('grill_total', 0)),
            
            burner_300_quantity=int(request.form.get('burner_300_quantity', 0)),
            burner_300_total=float(request.form.get('burner_300_total', 0)),
            
            burner_350_quantity=int(request.form.get('burner_350_quantity', 0)),
            burner_350_total=float(request.form.get('burner_350_total', 0)),
            
            burner_450_quantity=int(request.form.get('burner_450_quantity', 0)),
            burner_450_total=float(request.form.get('burner_450_total', 0)),
            
            burner_600_quantity=int(request.form.get('burner_600_quantity', 0)),
            burner_600_total=float(request.form.get('burner_600_total', 0)),
            
            regulator_6kg_quantity=int(request.form.get('regulator_6kg_quantity', 0)),
            regulator_6kg_total=float(request.form.get('regulator_6kg_total', 0)),
            
            regulator_13kg_quantity=int(request.form.get('regulator_13kg_quantity', 0)),
            regulator_13kg_total=float(request.form.get('regulator_13kg_total', 0)),
            
            hose_quantity=int(request.form.get('hose_quantity', 0)),
            hose_total=float(request.form.get('hose_total', 0)),
            
            notes=request.form.get('notes', ''),
            sale_date=datetime.utcnow()
        )
        
        db.session.add(sale)
        db.session.commit()
        flash('Accessory sales recorded successfully', 'success')
        return redirect(url_for('accessories.view_accessories', sale_id=sale.id))
    
    return render_template('accessories/create.html')


@accessories_bp.route('/<int:sale_id>')
def view_accessories(sale_id):
    """View accessory sales details."""
    sale = AccessorySale.query.get_or_404(sale_id)
    return render_template('accessories/view.html', sale=sale)


@accessories_bp.route('/<int:sale_id>/edit', methods=['GET', 'POST'])
def edit_accessories(sale_id):
    """Edit accessory sales entry."""
    sale = AccessorySale.query.get_or_404(sale_id)
    
    if request.method == 'POST':
        sale.grill_quantity = int(request.form.get('grill_quantity', 0))
        sale.grill_total = float(request.form.get('grill_total', 0))
        
        sale.burner_300_quantity = int(request.form.get('burner_300_quantity', 0))
        sale.burner_300_total = float(request.form.get('burner_300_total', 0))
        
        sale.burner_350_quantity = int(request.form.get('burner_350_quantity', 0))
        sale.burner_350_total = float(request.form.get('burner_350_total', 0))
        
        sale.burner_450_quantity = int(request.form.get('burner_450_quantity', 0))
        sale.burner_450_total = float(request.form.get('burner_450_total', 0))
        
        sale.burner_600_quantity = int(request.form.get('burner_600_quantity', 0))
        sale.burner_600_total = float(request.form.get('burner_600_total', 0))
        
        sale.regulator_6kg_quantity = int(request.form.get('regulator_6kg_quantity', 0))
        sale.regulator_6kg_total = float(request.form.get('regulator_6kg_total', 0))
        
        sale.regulator_13kg_quantity = int(request.form.get('regulator_13kg_quantity', 0))
        sale.regulator_13kg_total = float(request.form.get('regulator_13kg_total', 0))
        
        sale.hose_quantity = int(request.form.get('hose_quantity', 0))
        sale.hose_total = float(request.form.get('hose_total', 0))
        
        sale.notes = request.form.get('notes', '')
        sale.updated_at = datetime.utcnow()
        
        db.session.commit()
        flash('Accessory sales updated successfully', 'success')
        return redirect(url_for('accessories.view_accessories', sale_id=sale.id))
    
    return render_template('accessories/edit.html', sale=sale)


@accessories_bp.route('/report')
def accessories_report():
    """Generate accessory sales report."""
    period = request.args.get('period', 'week')
    
    if period == 'week':
        start_date = datetime.utcnow() - timedelta(days=7)
    elif period == 'month':
        start_date = datetime.utcnow() - timedelta(days=30)
    else:
        start_date = datetime.utcnow() - timedelta(days=1)
    
    sales = AccessorySale.query.filter(AccessorySale.sale_date >= start_date).all()
    
    # Aggregate data
    totals = {
        'grill': {'qty': 0, 'amount': 0},
        'burner_300': {'qty': 0, 'amount': 0},
        'burner_350': {'qty': 0, 'amount': 0},
        'burner_450': {'qty': 0, 'amount': 0},
        'burner_600': {'qty': 0, 'amount': 0},
        'regulator_6kg': {'qty': 0, 'amount': 0},
        'regulator_13kg': {'qty': 0, 'amount': 0},
        'hose': {'qty': 0, 'amount': 0},
    }
    
    for sale in sales:
        totals['grill']['qty'] += sale.grill_quantity
        totals['grill']['amount'] += sale.grill_total
        
        totals['burner_300']['qty'] += sale.burner_300_quantity
        totals['burner_300']['amount'] += sale.burner_300_total
        
        totals['burner_350']['qty'] += sale.burner_350_quantity
        totals['burner_350']['amount'] += sale.burner_350_total
        
        totals['burner_450']['qty'] += sale.burner_450_quantity
        totals['burner_450']['amount'] += sale.burner_450_total
        
        totals['burner_600']['qty'] += sale.burner_600_quantity
        totals['burner_600']['amount'] += sale.burner_600_total
        
        totals['regulator_6kg']['qty'] += sale.regulator_6kg_quantity
        totals['regulator_6kg']['amount'] += sale.regulator_6kg_total
        
        totals['regulator_13kg']['qty'] += sale.regulator_13kg_quantity
        totals['regulator_13kg']['amount'] += sale.regulator_13kg_total
        
        totals['hose']['qty'] += sale.hose_quantity
        totals['hose']['amount'] += sale.hose_total
    
    return render_template('accessories/report.html', totals=totals, period=period, sales=sales)
