from flask import Flask
from routes import authenticationRoutes, indexRoutes

def create_app():
    app = Flask(__name__)
    app.secret_key = "secret_key"
    authenticationRoutes(app)
    indexRoutes(app)
    return app
