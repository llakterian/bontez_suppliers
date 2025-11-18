"""
Database models for Bontez Suppliers.
Author: Llakterian
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import enum

db = SQLAlchemy()


class Supplier(db.Model):
    """Represents a gas supplier."""
    __tablename__ = 'suppliers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    color = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    products = db.relationship('Product', backref='supplier', lazy=True, cascade='all, delete-orphan')
    sales = db.relationship('Sale', backref='supplier', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Supplier {self.name}>'


class Product(db.Model):
    """Represents a product (gas cylinder or accessory)."""
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=True)
    category = db.Column(db.String(50), nullable=False)  # e.g., 'cylinder_6kg', 'cylinder_12kg', 'accessory'
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    sales_items = db.relationship('SaleItem', backref='product', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Product {self.name}>'


class PaymentMethod(enum.Enum):
    """Enumeration for payment methods."""
    CASH = 'cash'
    MPESA = 'mpesa'
    INSTALLMENT = 'installment'


class Client(db.Model):
    """Represents a customer."""
    __tablename__ = 'clients'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    email = db.Column(db.String(100))
    address = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    sales = db.relationship('Sale', backref='client', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Client {self.name}>'


class Sale(db.Model):
    """Represents a sale transaction."""
    __tablename__ = 'sales'
    
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=True)
    payment_method = db.Column(db.String(20), nullable=False)  # 'cash', 'mpesa', 'installment'
    mpesa_code = db.Column(db.String(50))
    total_amount = db.Column(db.Float, nullable=False)
    amount_paid = db.Column(db.Float, default=0.0)
    notes = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sale_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    items = db.relationship('SaleItem', backref='sale', lazy=True, cascade='all, delete-orphan')
    installments = db.relationship('Installment', backref='sale', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Sale {self.id}>'
    
    def remaining_balance(self):
        """Calculate remaining balance for installment plans."""
        return self.total_amount - self.amount_paid


class SaleItem(db.Model):
    """Represents individual items in a sale."""
    __tablename__ = 'sale_items'
    
    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    unit_price = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    
    def __repr__(self):
        return f'<SaleItem {self.id}>'


class Installment(db.Model):
    """Represents installment payments for a sale."""
    __tablename__ = 'installments'
    
    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    paid_date = db.Column(db.DateTime)
    is_paid = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Installment {self.id}>'


class AccessorySale(db.Model):
    """Represents daily accessory sales tracking."""
    __tablename__ = 'accessory_sales'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Grill sales
    grill_quantity = db.Column(db.Integer, default=0)
    grill_total = db.Column(db.Float, default=0.0)
    
    # Burner sales (by price variants)
    burner_300_quantity = db.Column(db.Integer, default=0)
    burner_300_total = db.Column(db.Float, default=0.0)
    
    burner_350_quantity = db.Column(db.Integer, default=0)
    burner_350_total = db.Column(db.Float, default=0.0)
    
    burner_450_quantity = db.Column(db.Integer, default=0)
    burner_450_total = db.Column(db.Float, default=0.0)
    
    burner_600_quantity = db.Column(db.Integer, default=0)
    burner_600_total = db.Column(db.Float, default=0.0)
    
    # Regulator sales (by cylinder size)
    regulator_6kg_quantity = db.Column(db.Integer, default=0)
    regulator_6kg_total = db.Column(db.Float, default=0.0)
    
    regulator_13kg_quantity = db.Column(db.Integer, default=0)
    regulator_13kg_total = db.Column(db.Float, default=0.0)
    
    # Hose Pipe sales
    hose_quantity = db.Column(db.Integer, default=0)
    hose_total = db.Column(db.Float, default=0.0)
    
    # Meta fields
    sale_date = db.Column(db.DateTime, default=datetime.utcnow, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    notes = db.Column(db.String(255))
    
    def __repr__(self):
        return f'<AccessorySale {self.sale_date.strftime("%Y-%m-%d") if self.sale_date else "N/A"}>'
    
    def get_daily_total(self):
        """Calculate total for the day."""
        total = (self.grill_total + 
                self.burner_300_total + self.burner_350_total + 
                self.burner_450_total + self.burner_600_total +
                self.regulator_6kg_total + self.regulator_13kg_total +
                self.hose_total)
        return total
    
    def get_total_quantity(self):
        """Calculate total quantity sold."""
        quantity = (self.grill_quantity +
                   self.burner_300_quantity + self.burner_350_quantity +
                   self.burner_450_quantity + self.burner_600_quantity +
                   self.regulator_6kg_quantity + self.regulator_13kg_quantity +
                   self.hose_quantity)
        return quantity
