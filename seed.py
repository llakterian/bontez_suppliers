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
            # Gas Cylinders - New
            Product(name='Gas Cylinder 6Kg - New', supplier_id=suppliers[0].id, category='cylinder_6kg', price=3200, description='New 6Kg gas cylinder with gas'),
            Product(name='Gas Cylinder 13Kg - New', supplier_id=suppliers[0].id, category='cylinder_13kg', price=5500, description='New 13Kg gas cylinder with gas'),
            
            # Gas Cylinders - Refill
            Product(name='Gas Cylinder 6Kg - Refill', supplier_id=suppliers[0].id, category='cylinder_6kg_refill', price=1200, description='6Kg gas cylinder refill/swap'),
            Product(name='Gas Cylinder 13Kg - Refill', supplier_id=suppliers[0].id, category='cylinder_13kg_refill', price=2600, description='13Kg gas cylinder refill/swap'),
            
            # Accessories
            Product(name='Grill', category='accessory_grill', price=350, description='Gas grill'),
            Product(name='Burner (Ksh 300)', category='accessory_burner', price=300, description='Gas burner - Standard'),
            Product(name='Burner (Ksh 350)', category='accessory_burner', price=350, description='Gas burner - Medium'),
            Product(name='Burner (Ksh 450)', category='accessory_burner', price=450, description='Gas burner - Large'),
            Product(name='Burner (Ksh 600)', category='accessory_burner', price=600, description='Gas burner - Premium'),
            Product(name='Regulator 6Kg', category='accessory_regulator', price=500, description='Gas regulator for 6Kg cylinder'),
            Product(name='Regulator 13Kg', category='accessory_regulator', price=700, description='Gas regulator for 13Kg cylinder'),
            Product(name='Hose Pipe 1.5M', category='accessory_pipe', price=300, description='Gas hose pipe 1.5 meters'),
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
                total_amount=5850,
                amount_paid=2925,
                notes='3 installments',
                sale_date=today - timedelta(days=5)
            ),
            Sale(
                client_id=clients[3].id,
                supplier_id=suppliers[3].id,
                payment_method='cash',
                total_amount=1850,
                amount_paid=1850,
                sale_date=today - timedelta(days=10)
            ),
            Sale(
                client_id=clients[4].id,
                supplier_id=None,
                payment_method='mpesa',
                mpesa_code='DEF456GHI',
                total_amount=6600,
                amount_paid=6600,
                notes='Mixed suppliers',
                sale_date=today - timedelta(days=3)
            ),
        ]
        
        for sale in sales:
            db.session.add(sale)
        
        db.session.flush()
        
        sale_items = [
            # Sale 1: 6Kg new cylinder
            SaleItem(sale_id=sales[0].id, product_id=products[0].id, quantity=1, unit_price=3200, subtotal=3200),
            
            # Sale 2: 13Kg new cylinder
            SaleItem(sale_id=sales[1].id, product_id=products[1].id, quantity=1, unit_price=5500, subtotal=5500),
            
            # Sale 3: 13Kg new + Burner
            SaleItem(sale_id=sales[2].id, product_id=products[1].id, quantity=1, unit_price=5500, subtotal=5500),
            SaleItem(sale_id=sales[2].id, product_id=products[6].id, quantity=1, unit_price=350, subtotal=350),
            
            # Sale 4: 6Kg refill + Hose Pipe + Grill
            SaleItem(sale_id=sales[3].id, product_id=products[2].id, quantity=1, unit_price=1200, subtotal=1200),
            SaleItem(sale_id=sales[3].id, product_id=products[11].id, quantity=1, unit_price=300, subtotal=300),
            SaleItem(sale_id=sales[3].id, product_id=products[4].id, quantity=1, unit_price=350, subtotal=350),
            
            # Sale 5: Mixed - 13Kg new + Burner + Grill + Hose Pipe
            SaleItem(sale_id=sales[4].id, product_id=products[1].id, quantity=1, unit_price=5500, subtotal=5500),
            SaleItem(sale_id=sales[4].id, product_id=products[7].id, quantity=1, unit_price=450, subtotal=450),
            SaleItem(sale_id=sales[4].id, product_id=products[4].id, quantity=1, unit_price=350, subtotal=350),
            SaleItem(sale_id=sales[4].id, product_id=products[11].id, quantity=1, unit_price=300, subtotal=300),
        ]
        
        for sale_item in sale_items:
            db.session.add(sale_item)
        
        db.session.flush()
        
        installments = [
            Installment(sale_id=sales[2].id, amount=2925, due_date=today + timedelta(days=30), is_paid=True, paid_date=today - timedelta(days=2)),
            Installment(sale_id=sales[2].id, amount=2925, due_date=today + timedelta(days=60), is_paid=False),
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
