from flask import Flask
from flask_cors import CORS

def create_app():
    # Crea una instancia de la aplicación Flask
    app = Flask(__name__)

    # Configuración de la aplicación
    app.config['SECRET_KEY'] = 'tu_clave_secreta'  # Cambia esto por tu propia clave secreta
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'  # Cambia la URL de la base de datos según tus necesidades

    # Importa y configura cualquier extensión de Flask que necesites aquí
    # Configura CORS para permitir solicitudes desde cualquier origen
    CORS(app, resources={r"/*": {"origins": "*"}})
    # Llama a la función register_routes para registrar los Blueprints en la aplicación
    from app.routes import register_routes
    register_routes(app)

    # Importa y configura cualquier extensión de Flask que necesites aquí

    return app
