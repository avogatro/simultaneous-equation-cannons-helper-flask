"""Initialize Flask app."""
from flask import Flask
from flask_assets import Environment
from flask_sitemapper import Sitemapper

def create_app():
    """Create Flask application."""
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object("config.Config")
    assets = Environment()
    assets.init_app(app)
    
    with app.app_context():
        # Import parts of our application
        from .assets import compile_static_assets
        from .home import home
        from .sec_helper import sec_helper

       
        # Register Blueprints
        app.register_blueprint(sec_helper.sec_helper_blueprint, url_prefix='/sec_helper' )
        app.register_blueprint(home.home_blueprint)
        
        # Compile static assets
        compile_static_assets(assets)
        sec_helper.sitemapper.init_app(app)
        return app
