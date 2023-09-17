from flask import Blueprint, jsonify

# Creamos una instancia de Blueprint llamada 'asset' y la asignamos a la variable 'asset'
asset = Blueprint('asset', __name__)

# Rutas de ejemplo para manejar activos
@asset.route('/listar', methods=['GET'])
def listar():
    # Lógica para listar activos y devolver una respuesta
    return jsonify(assets=['activo1', 'activo2', 'activo3'])

@asset.route('/detalle/<int:id>', methods=['GET'])
def detalle(id):
    # Lógica para obtener detalles de un activo según su ID y devolver una respuesta
    return jsonify(asset={'id': id, 'nombre': 'activo', 'valor': 100})

# Otras rutas y lógica de negocio relacionadas con activos pueden agregarse aquí

# Nota: Asegúrate de importar todas las dependencias necesarias en este archivo.
