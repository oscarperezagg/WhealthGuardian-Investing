from flask import Blueprint, request, jsonify
from app.lib import MongoDbFunctions
from logging_config import logger

# Define un Blueprint para las rutas relacionadas con MongoDB
mongo_routes = Blueprint("mongo_routes", __name__)

# Crea una instancia de MongoDbFunctions con tus propios datos de conexión
mongo = MongoDbFunctions(host="192.168.1.76", port=27017, dbname="WhealthGuardian")


# Define una ruta POST para insertar un documento en la colección
@mongo_routes.route("/insert_document", methods=["POST"])
def insert_document():
    try:
        data = request.get_json()  # Obtiene los datos JSON del cuerpo de la solicitud
        if not data:
            return (
                jsonify(
                    {"error": "Se requiere un objeto JSON en el cuerpo de la solicitud"}
                ),
                400,
            )

        # Verifica si se proporcionó el nombre de la colección en los datos
        if "collection" not in data:
            return (
                jsonify({"error": "Se debe especificar el nombre de la colección"}),
                400,
            )

        collection_name = data["collection"]
        document_data = data.get("document", {})  # Obtiene los datos del documento
        if document_data == {}:
            return jsonify({"error": "El documento no puede estar vacio"}), 500

        # Cambia la colección actual a la especificada
        mongo.changeCollection(collection_name)

        # Llama a la función de inserción de MongoDbFunctions
        mongo.insert(document_data)

        return (
            jsonify(
                {
                    "message": "Documento insertado correctamente en la colección {}".format(
                        collection_name
                    )
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Define una ruta POST para insertar varios documentos en la colección
@mongo_routes.route("/insert_documents", methods=["POST"])
def insert_documents():
    try:
        data = request.get_json()  # Obtiene los datos JSON del cuerpo de la solicitud
        if not data:
            return (
                jsonify(
                    {
                        "error": "Se requiere una lista de documentos en formato JSON en el cuerpo de la solicitud"
                    }
                ),
                400,
            )

        # Verifica si se proporcionó el nombre de la colección en los datos
        if "collection" not in data:
            return (
                jsonify({"error": "Se debe especificar el nombre de la colección"}),
                400,
            )

        collection_name = data["collection"]
        documents = data.get("documents", [])  # Obtiene la lista de documentos
        if documents == []:
            return (
                jsonify({"error": "La lista de documentos no puede estar vacía"}),
                500,
            )

        # Cambia la colección actual a la especificada
        mongo.changeCollection(collection_name)

        # Llama a la función de inserción de MongoDbFunctions
        mongo.insert_many(documents)

        return (
            jsonify(
                {
                    "message": "Documentos insertados correctamente en la colección {}".format(
                        collection_name
                    )
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@mongo_routes.route("/find_by_id", methods=["POST"])
def find_document_by_id():
    try:
        # Obtén los datos de la solicitud en formato JSON
        request_data = request.get_json()

        # Extrae los parámetros necesarios de la solicitud
        collection_name = request_data.get("collection_name")
        id = request_data.get("id")

        if not collection_name or not id:
            message = (
                "Nombre de colección e ID son obligatorios en el cuerpo de la solicitud"
            )
            logger.error(message)
            return jsonify({"message": message}), 400

        # Cambia la colección actual a la especificada
        mongo.changeCollection(collection_name)

        # Llama a la función de búsqueda por ObjectId de MongoDbFunctions
        document = mongo.findById(id)

        if document:
            document['_id'] = str(document['_id'])
            logger.info(
                f"Documento encontrado en la colección {collection_name} con ID {id}"
            )
            return jsonify({"document": document}), 200
        else:
            message = (
                f"Documento no encontrado en la colección {collection_name} con ID {id}"
            )
            logger.warning(message)
            return jsonify({"message": message}), 404
    except Exception as e:
        error_message = f"Error al buscar el documento: {str(e)}"
        logger.error(error_message)
        return jsonify({"error": error_message}), 500


# Define una ruta POST para buscar documentos en una colección con opción de ordenar
@mongo_routes.route("/find_all", methods=["POST"])
def find_all_documents():
    try:
        # Obtén los datos de la solicitud en formato JSON
        request_data = request.get_json()

        # Extrae los parámetros necesarios de la solicitud
        collection_name = request_data.get("collection_name")

        if not collection_name:
            message = (
                "Nombre de colección no proporcionado en el cuerpo de la solicitud"
            )
            logger.error(message)
            return jsonify({"message": message}), 400

        # Cambia la colección actual a la especificada
        mongo.changeCollection(collection_name)

        # Opciones de ordenamiento (si se proporcionan)
        sort = request_data.get("sort", False)
        sortField = request_data.get("sortField", None)
        asc = request_data.get("asc", False)

        # Llama a la función findAll de MongoDbFunctions para buscar documentos
        documents = mongo.findAll(sort, sortField, asc)

        if documents:
            for document in documents:
                document['_id'] = str(document['_id'])
            logger.info(f"Documentos encontrados en la colección {collection_name}")
            return jsonify({"documents": documents}), 200
        else:
            message = f"No se encontraron documentos en la colección {collection_name}"
            logger.warning(message)
            return jsonify({"message": message}), 404
    except Exception as e:
        error_message = f"Error al buscar documentos: {str(e)}"
        logger.error(error_message)
        return jsonify({"error": error_message}), 500


# Define una ruta POST para buscar documentos en una colección por campo y valor
@mongo_routes.route("/find_by_field", methods=["POST"])
def find_documents_by_field():
    try:
        # Obtén los datos de la solicitud en formato JSON
        request_data = request.get_json()
        logger.info(f"Datos de la solicitud: {request_data}")
        # Extrae los parámetros necesarios de la solicitud
        collection_name = request_data.get("collection_name")
        field = request_data.get("field")
        value = request_data.get("value")
        exact_match = request_data.get("exact_match", True)
        get_all = request_data.get("get_all", False)
        sort = request_data.get("sort", False)
        sortField = request_data.get("sortField", None)
        asc = request_data.get("asc", True)

        if not collection_name or not field or (not value and value != 0):
            message = "Nombre de colección, campo y valor son obligatorios en el cuerpo de la solicitud"
            logger.error(message)
            return (
                jsonify({"message": message}),
                400,
            )

        # Cambia la colección actual a la especificada
        mongo.changeCollection(collection_name)
        logger.info(f"{field}, {value}, {exact_match}, {get_all}, {sort}, {sortField}, {asc}")
        # Llama a la función findByField de MongoDbFunctions para buscar documentos
        documents = mongo.findByField(
            field, value, exact_match, get_all, sort, sortField, asc
        )
        logger.info(f"Documentos encontrados: {type(documents)}")
        if documents:
            if get_all:
                for document in documents:
                    document['_id'] = str(document['_id'])
            else:
                documents['_id'] = str(documents['_id'])
            logger.info(f"Documentos encontrados en la colección {collection_name}")
            return jsonify({"documents": documents}), 200
        else:
            message = f"No se encontraron documentos en la colección {collection_name}"
            logger.warning(message)
            return jsonify({"message": message}), 404
    except Exception as e:
        error_message = f"Error al buscar documentos: {str(e)}"
        logger.error(error_message)
        return jsonify({"error": error_message}), 500


# Define una ruta POST para buscar documentos en una colección por múltiples campos y valores
@mongo_routes.route("/find_by_multiple_fields", methods=["POST"])
def find_documents_by_multiple_fields():
    try:
        # Obtén los datos de la solicitud en formato JSON
        request_data = request.get_json()

        # Extrae los parámetros necesarios de la solicitud
        collection_name = request_data.get("collection_name")
        fields = request_data.get("fields")
        exact_match = request_data.get("exact_match", True)
        get_all = request_data.get("get_all", False)

        if not collection_name or not fields:
            return (
                jsonify(
                    {
                        "message": "Nombre de colección y campos son obligatorios en el cuerpo de la solicitud"
                    }
                ),
                400,
            )

        # Cambia la colección actual a la especificada
        mongo.changeCollection(collection_name)

        # Llama a la función findByMultipleFields de MongoDbFunctions para buscar documentos
        documents = mongo.findByMultipleFields(fields, exact_match, get_all)

        if documents:
            if get_all:
                for document in documents:
                    document['_id'] = str(document['_id'])
            else:
                documents['_id'] = str(documents['_id'])
            return jsonify({"documents": documents}), 200
        else:
            return jsonify({"message": "No se encontraron documentos"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Define una ruta POST para actualizar un documento por su ObjectId
@mongo_routes.route("/update_by_id", methods=["POST"])
def update_document_by_id():
    try:
        # Obtén los datos de la solicitud en formato JSON
        request_data = request.get_json()
        logger.info(f"Datos de la solicitud: {request_data}")
        # Extrae los parámetros necesarios de la solicitud
        collection_name = request_data.get("collection_name")
        document_id = request_data.get("id")
        updated_data = request_data.get("updated_data")
        logger.info(f"Datos de la solicitud: {collection_name}, {document_id}, {updated_data}")
        if not collection_name or not document_id or not updated_data:
            return (
                jsonify(
                    {
                        "message": "Nombre de colección, ID de documento y datos actualizados son obligatorios en el cuerpo de la solicitud"
                    }
                ),
                400,
            )

        # Cambia la colección actual a la especificada
        mongo.changeCollection(collection_name)

        # Llama a la función updateById de MongoDbFunctions para actualizar el documento
        mongo.updateById(document_id, updated_data)

        return jsonify({"message": "Documento actualizado correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Define una ruta POST para actualizar documentos por campo y valor
@mongo_routes.route("/update_by_field", methods=["POST"])
def update_documents_by_field():
    try:
        # Obtén los datos de la solicitud en formato JSON
        request_data = request.get_json()

        # Extrae los parámetros necesarios de la solicitud
        collection_name = request_data.get("collection_name")
        field = request_data.get("field")
        value = request_data.get("value")
        updated_data = request_data.get("updated_data")
        exact_match = request_data.get("exact_match", True)

        if not collection_name or not field or not value or not updated_data:
            return (
                jsonify(
                    {
                        "message": "Nombre de colección, campo, valor y datos actualizados son obligatorios en el cuerpo de la solicitud"
                    }
                ),
                400,
            )

        # Cambia la colección actual a la especificada
        mongo.changeCollection(collection_name)

        # Llama a la función updateByField de MongoDbFunctions para actualizar documentos
        mongo.updateByField(field, value, updated_data, exact_match)

        return jsonify({"message": "Documentos actualizados correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Define una ruta POST para eliminar documentos por campo y valor
@mongo_routes.route("/delete_by_field", methods=["POST"])
def delete_documents_by_field():
    try:
        # Obtén los datos de la solicitud en formato JSON
        request_data = request.get_json()

        # Extrae los parámetros necesarios de la solicitud
        collection_name = request_data.get("collection_name")
        field = request_data.get("field")
        value = request_data.get("value")
        exact_match = request_data.get("exact_match", True)

        if not collection_name or not field or not value:
            return (
                jsonify(
                    {
                        "message": "Nombre de colección, campo y valor son obligatorios en el cuerpo de la solicitud"
                    }
                ),
                400,
            )

        # Cambia la colección actual a la especificada
        mongo.changeCollection(collection_name)

        # Llama a la función deleteByField de MongoDbFunctions para eliminar documentos
        mongo.deleteByField(field, value, exact_match)

        return jsonify({"message": "Documentos eliminados correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Define una ruta POST para eliminar documentos por múltiples campos y valores
@mongo_routes.route("/delete_by_multiple_fields", methods=["POST"])
def delete_documents_by_multiple_fields():
    try:
        # Obtén los datos de la solicitud en formato JSON
        request_data = request.get_json()

        # Extrae los parámetros necesarios de la solicitud
        collection_name = request_data.get("collection_name")
        fields = request_data.get("fields")
        exact_match = request_data.get("exact_match", True)

        if not collection_name or not fields:
            return (
                jsonify(
                    {
                        "message": "Nombre de colección y campos son obligatorios en el cuerpo de la solicitud"
                    }
                ),
                400,
            )

        # Cambia la colección actual a la especificada
        mongo.changeCollection(collection_name)

        # Llama a la función deleteByMultipleField de MongoDbFunctions para eliminar documentos
        mongo.deleteByMultipleField(fields, exact_match)

        return jsonify({"message": "Documentos eliminados correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
