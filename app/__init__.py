"""
Flask application factory and configuration.
Author: Llakterian
"""

from flask import Flask
from app.models import db


def create_app(config=None):
    """Create and configure Flask application."""
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bontez_suppliers.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
    app.config['UPLOAD_FOLDER'] = 'uploads'
    
    if config:
        app.config.update(config)
    
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
    
    from app.routes import main_bp, clients_bp, suppliers_bp, sales_bp, reports_bp, accessories_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(clients_bp)
    app.register_blueprint(suppliers_bp)
    app.register_blueprint(sales_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(accessories_bp)
    
    return app
