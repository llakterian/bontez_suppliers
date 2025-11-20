"""
Flask application factory and configuration.
Author: Llakterian
"""

from flask import Flask, send_from_directory
from flask_cors import CORS
from app.models import db
import os


def create_app(config=None):
    """Create and configure Flask application."""
    app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')
    
    # Enable CORS for React frontend (allow all origins in production since React is served by Flask)
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bontez_suppliers.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
    app.config['UPLOAD_FOLDER'] = 'uploads'
    
    if config:
        app.config.update(config)
    
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
    
    from app.routes import main_bp, clients_bp, suppliers_bp, sales_bp, reports_bp, products_bp, accessories_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(clients_bp)
    app.register_blueprint(suppliers_bp)
    app.register_blueprint(sales_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(accessories_bp)
    
    # Serve React App (catch-all route for React Router)
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        """Serve React static files and handle client-side routing."""
        # Check if it's an API request - let blueprints handle it
        if path.startswith('api/'):
            return {'error': 'Not found'}, 404
        
        # Check if the path is a static file
        static_file_path = os.path.join(app.static_folder, path)
        if path and os.path.exists(static_file_path):
            return send_from_directory(app.static_folder, path)
        
        # Otherwise, serve index.html for React Router
        index_path = os.path.join(app.static_folder, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(app.static_folder, 'index.html')
        
        # Fallback if React build doesn't exist
        return {'message': 'React app not built. Run: cd frontend && npm run build'}, 404
    
    return app
