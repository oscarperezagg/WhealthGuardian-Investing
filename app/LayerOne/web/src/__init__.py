from flask import Flask
from flask_login import LoginManager
from src.routes import basicrouting, auth
from src.models import db, User



def create_app():
    app = Flask(__name__)
    app.secret_key = "secret_key"
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # SQLite URI
    app.config['LOGIN_VIEW'] = 'login'  # Establece la ruta de inicio de sesión

    db.init_app(app)


    app.register_blueprint(basicrouting)
    app.register_blueprint(auth)
    
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    with app.app_context():
        db.create_all()  # Create the tables

    @login_manager.user_loader
    def load_user(user_id):
        # since the user_id is just the primary key of our user table, use it in the query for the user
        return User.query.get(int(user_id))
    
    return app


