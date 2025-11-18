"""
Seed data script to populate database with sample data.
Author: Llakterian
"""

from app import create_app
from app.models import db, Supplier, Product, Client, Sale, SaleItem, Installment
from datetime import datetime, timedelta

def seed_database():
    """Populate the database with seed data."""
    
    app = create_app()
    
    with app.app_context():
        db.drop_all()
        db.create_all()
        
        suppliers = [
            Supplier(name='Top Gas', color='red'),
            Supplier(name='K-Gas', color='black'),
            Supplier(name='Total Gas', color='orange'),
            Supplier(name='Rubis Gas', color='green'),
            Supplier(name='OiLibya Gas', color='brown'),
            Supplier(name='Men Gas', color='maroon'),
            Supplier(name='Hashi Gas', color='yellow'),
            Supplier(name='Hass Gas', color='blue'),
        ]
        
        for supplier in suppliers:
            db.session.add(supplier)
        
        db.session.flush()
        
        products = [
            Product(name='Gas Cylinder 6Kg - New', supplier_id=suppliers[0].id, category='cylinder_6kg', price=3200, description='New 6Kg gas cylinder with gas'),
            Product(name='Gas Cylinder 6Kg - Refill', supplier_id=suppliers[0].id, category='cylinder_6kg_refill', price=2000, description='6Kg gas cylinder refill/swap'),
            Product(name='Gas Cylinder 12Kg - New', supplier_id=suppliers[0].id, category='cylinder_12kg', price=5500, description='New 12Kg gas cylinder with gas'),
            Product(name='Gas Cylinder 12Kg - Refill', supplier_id=suppliers[0].id, category='cylinder_12kg_refill', price=3100, description='12Kg gas cylinder refill/swap'),
            Product(name='Burner', category='accessory', price=750, description='Gas burner'),
            Product(name='Grill', category='accessory', price=1000, description='Gas grill'),
            Product(name='Pipe', category='accessory', price=400, description='Gas connection pipe'),
        ]
        
        for product in products:
            db.session.add(product)
        
        db.session.flush()
        
        clients = [
            Client(name='John Kariuki', phone='0712345678', email='john@example.com', address='Nairobi, Westlands'),
            Client(name='Mary Ochieng', phone='0701234567', email='mary@example.com', address='Mombasa, Tudor'),
            Client(name='Peter Kamau', phone='0722233445', email='peter@example.com', address='Kisumu, Nyalenda'),
            Client(name='Alice Wanjiru', phone='0798765432', email='alice@example.com', address='Nakuru, Menengai'),
            Client(name='Joseph Kipchoge', phone='0756789012', email='joseph@example.com', address='Eldoret, Kapsabet'),
        ]
        
        for client in clients:
            db.session.add(client)
        
        db.session.flush()
        
        today = datetime.utcnow()
        
        sales = [
            Sale(
                client_id=clients[0].id,
                supplier_id=suppliers[0].id,
                payment_method='cash',
                total_amount=3200,
                amount_paid=3200,
                sale_date=today
            ),
            Sale(
                client_id=clients[1].id,
                supplier_id=suppliers[1].id,
                payment_method='mpesa',
                mpesa_code='ABC123XYZ',
                total_amount=5500,
                amount_paid=5500,
                sale_date=today
            ),
            Sale(
                client_id=clients[2].id,
                supplier_id=suppliers[2].id,
                payment_method='installment',
                total_amount=7100,
                amount_paid=3550,
                notes='3 installments',
                sale_date=today - timedelta(days=5)
            ),
            Sale(
                client_id=clients[3].id,
                supplier_id=suppliers[3].id,
                payment_method='cash',
                total_amount=2750,
                amount_paid=2750,
                sale_date=today - timedelta(days=10)
            ),
            Sale(
                client_id=clients[4].id,
                supplier_id=None,
                payment_method='mpesa',
                mpesa_code='DEF456GHI',
                total_amount=8500,
                amount_paid=8500,
                notes='Mixed suppliers',
                sale_date=today - timedelta(days=3)
            ),
        ]
        
        for sale in sales:
            db.session.add(sale)
        
        db.session.flush()
        
        sale_items = [
            SaleItem(sale_id=sales[0].id, product_id=products[0].id, quantity=1, unit_price=3200, subtotal=3200),
            SaleItem(sale_id=sales[1].id, product_id=products[2].id, quantity=1, unit_price=5500, subtotal=5500),
            SaleItem(sale_id=sales[2].id, product_id=products[2].id, quantity=1, unit_price=5500, subtotal=5500),
            SaleItem(sale_id=sales[2].id, product_id=products[4].id, quantity=1, unit_price=750, subtotal=750),
            SaleItem(sale_id=sales[3].id, product_id=products[1].id, quantity=1, unit_price=2000, subtotal=2000),
            SaleItem(sale_id=sales[3].id, product_id=products[6].id, quantity=1, unit_price=400, subtotal=400),
            SaleItem(sale_id=sales[3].id, product_id=products[5].id, quantity=1, unit_price=1000, subtotal=1000),
            SaleItem(sale_id=sales[4].id, product_id=products[2].id, quantity=1, unit_price=5500, subtotal=5500),
            SaleItem(sale_id=sales[4].id, product_id=products[4].id, quantity=1, unit_price=750, subtotal=750),
            SaleItem(sale_id=sales[4].id, product_id=products[5].id, quantity=1, unit_price=1000, subtotal=1000),
            SaleItem(sale_id=sales[4].id, product_id=products[6].id, quantity=1, unit_price=400, subtotal=400),
        ]
        
        for sale_item in sale_items:
            db.session.add(sale_item)
        
        db.session.flush()
        
        installments = [
            Installment(sale_id=sales[2].id, amount=3550, due_date=today + timedelta(days=30), is_paid=True, paid_date=today - timedelta(days=2)),
            Installment(sale_id=sales[2].id, amount=3550, due_date=today + timedelta(days=60), is_paid=False),
        ]
        
        for installment in installments:
            db.session.add(installment)
        
        db.session.commit()
        
        print("Database seeded successfully!")
        print(f"Created {len(suppliers)} suppliers")
        print(f"Created {len(products)} products")
        print(f"Created {len(clients)} clients")
        print(f"Created {len(sales)} sales with items and installments")

if __name__ == '__main__':
    seed_database()
