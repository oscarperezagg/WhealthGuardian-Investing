# Importa los Blueprints de las rutas definidas en otros archivos
from .mongo_routes import mongo_routes
from .asset_routes import asset


# Esta función será llamada por create_app() para registrar los Blueprints en la aplicación
def register_routes(app):
    app.register_blueprint(mongo_routes, url_prefix="/mongo")
    app.register_blueprint(asset, url_prefix="/asset")


# Importa las rutas aquí
# Si tienes más archivos de rutas, puedes importarlos y registrarlos de manera similar.

# Asegúrate de que todas las rutas estén importadas y registradas correctamente en esta sección.
