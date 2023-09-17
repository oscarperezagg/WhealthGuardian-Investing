from datetime import datetime, timedelta
import time
from externalApis import CoreData
from externalApis import ReferenceData
from util import MongoDbFunctions
from secret import TWELVE_DATA_API_KEY
from secret import DATABASE
from logging_config import logger
from requests import Response

# Configure the logger


class TDA_CoreData:
    """
    Esta función implementa la lógica detrás de la descarga los "CoreData"
    del proveedor Twelve Data.

    """

    @staticmethod
    def downloadAsset():
        """
        Esta función descarga activos de cualquier tipo

        :return: Un diccionario con los datos descargados.
        """
        conn = None
        try:
            # Obtener todos los registros de descarga del activo seleccionado
            conn = MongoDbFunctions(
                DATABASE["host"],
                DATABASE["port"],
                DATABASE["username"],
                DATABASE["password"],
                DATABASE["dbname"],
                "DownloadRegistry",
            )

            logger.info(f"Descargando registros")
            DownloadRegistries = conn.findAll(sort=True, sortField="priority")

            # Más lógica de descarga aquí...
            for registry in DownloadRegistries:
                id = registry.get("_id")
                timespan = registry.get("timespan")
                print("")
                logger.info(f"[START] Descargando registros con timespanp {timespan}")

                for asset in registry["descargas_pendientes"]:
                    print("")
                    # Añadir check para ver si ya está
                    res = TDA_CoreData.__findAsset(asset, timespan)
                    if res[0]:
                        TDA_CoreData.__eliminateFromRegistry(id, asset)
                        continue
                    res = TDA_CoreData.__downloadAsset(id, asset, timespan)
                    if not res[0] and res[1] == "Llamadas diarias agotadas":
                        return (False, "Llamadas diarias agotadas")

                    invalid_item = False
                    try:
                        temporal_res = res[1].json()
                        invalid_item = (
                            f"**symbol** not found: {asset}. Please specify it correctly according to API Documentation."
                            == temporal_res.get("message")
                        )
                    except Exception as e:
                        pass
                    if res[0] or invalid_item:
                        TDA_CoreData.__eliminateFromRegistry(id, asset)
                        logger.info(f"Eliminado {asset} de la lista de descargas pendientes")
                    print("")
                if not registry["descargas_pendientes"]:
                    logger.info(f"No hay registros de con timespan {timespan}")
                logger.info(f"Descargados todos los registros con timespan {timespan}")

            conn.close()
        except Exception as e:
            if conn:
                conn.close()

            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __downloadAsset(id, asset, interval):
        
       pass

    def __getConfig():
        conn = None
        try:
            conn = MongoDbFunctions(
                DATABASE["host"],
                DATABASE["port"],
                DATABASE["username"],
                DATABASE["password"],
                DATABASE["dbname"],
                "config",
            )
            logger.info("Obteniendo configuración de la API Twelve Data")
            config_twelve_data_api = conn.findByField("nombre_api", "alphavantage")
            logger.info("Configuración obtenida")
            conn.close()
            return config_twelve_data_api
        except Exception as e:
            if conn:
                conn.close()
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __anotherCall(config_twelve_data_api):
        conn = None
        try:
            # Comprobamos si el tiempo de modificación es de hace un año
            last_modification_date = config_twelve_data_api.get("fecha_modificacion")
            if last_modification_date:
                current_date = datetime.now()
                one_day_ago = current_date - timedelta(days=1)
                if last_modification_date < one_day_ago:
                    logger.info("La fecha de modificación es de hace un día.")
                    TDA_CoreData.__DailyCallTOZero()
                    TDA_CoreData.__minuteCallTOZero()
                    return (True, "")
        
            # Verificamos si la fecha de modificación es de hace más de un minuto y medio
            if last_modification_date:
                current_date = datetime.now()
                one_and_a_half_minutes_ago = current_date - timedelta(minutes=1, seconds=30)
                if last_modification_date < one_and_a_half_minutes_ago:
                    logger.info("La fecha de modificación es de hace más de un minuto y medio.")
                    TDA_CoreData.__minuteCallTOZero()
                    return (True, "")
            
            # Comprobamos llamadas diarias
            check = (
                config_twelve_data_api["llamadas_actuales_diarias"]
                < config_twelve_data_api["max_llamadas_diarias"] - 20
            )
            if not check:
                logger.info("Llamadas diarias agotadas")
                return (False, "Llamadas diarias agotadas")
            # Comprobamos llamadas por minuto
            check = (
                config_twelve_data_api["llamadas_actuales_por_minuto"]
                < config_twelve_data_api["max_llamadas_por_minuto"] - 2
            )
            if not check:
                TDA_CoreData.__minuteCallTOZero()
                time.sleep(120)
            return (True, "")
        except Exception as e:
            logger.error("An error occurred: %s", str(e))
            return (False, e)


    def __assetDataRange(asset, interval, end_date=None, parseData={}):
        # TODO
        pass

    def __oneMoreCall():
        conn = None
        try:
            conn = MongoDbFunctions(
                DATABASE["host"],
                DATABASE["port"],
                DATABASE["username"],
                DATABASE["password"],
                DATABASE["dbname"],
                "config",
            )

            logger.info("Obteniendo configuración de la API Twelve Data")
            config_twelve_data_api = conn.findByField("nombre_api", "alphavantage")
            logger.info("Configuración obtenida")
            config_twelve_data_api["llamadas_actuales_diarias"] += 1
            config_twelve_data_api["llamadas_actuales_por_minuto"] += 1
            config_twelve_data_api["fecha_modificacion"] = datetime.now()

            conn.updateById(config_twelve_data_api["_id"], config_twelve_data_api)

            logger.info("Registry updated successfully")
            conn.close()
            return (True, "")
        except Exception as e:
            if conn:
                conn.close()
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __uploadAssetDate(assetData):
        conn = None
        try:
            conn = MongoDbFunctions(
                DATABASE["host"],
                DATABASE["port"],
                DATABASE["username"],
                DATABASE["password"],
                DATABASE["dbname"],
                "CoreData",
            )
            logger.info("Uploading data for %s", assetData["symbol"])
            assetData["last_modified"] = datetime.now()

            conn.insert(dict(assetData))
            logger.info("Asset uploaded successfully to the database")
            conn.close()
            return (True, "")
        except Exception as e:
            if conn:
                conn.close()
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __eliminateFromRegistry(id, asset):
        conn = None
        try:
            conn = MongoDbFunctions(
                DATABASE["host"],
                DATABASE["port"],
                DATABASE["username"],
                DATABASE["password"],
                DATABASE["dbname"],
                "DownloadRegistry",
            )
            registry = conn.findById(id)
            logger.info("Deleting %s from %s registry", asset, registry["timespan"])

            registry["descargas_pendientes"].remove(asset)
            conn.updateById(id, registry)

            logger.info("Delete successfully")
            conn.close()
            return (True, "")
        except Exception as e:
            if conn:
                conn.close()
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __findAsset(asset, interval):
        conn = None
        try:
            conn = MongoDbFunctions(
                DATABASE["host"],
                DATABASE["port"],
                DATABASE["username"],
                DATABASE["password"],
                DATABASE["dbname"],
                "CoreData",
            )
            logger.info("Finding %s data for %s", interval, asset)
            fields = {"symbol": asset, "interval": interval}
            res = conn.findByMultipleFields(fields)
            conn.close()
            if res:
                logger.info("Asset already in the database")
                return (True, "")
            return (False, "")
        except Exception as e:
            if conn:
                conn.close()
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __minuteCallTOZero():
        conn = None
        try:
            conn = MongoDbFunctions(
                DATABASE["host"],
                DATABASE["port"],
                DATABASE["username"],
                DATABASE["password"],
                DATABASE["dbname"],
                "config",
            )
            logger.info("Obteniendo configuración de la API Twelve Data")
            config_twelve_data_api = conn.findByField("nombre_api", "alphavantage")
            logger.info("Configuración obtenida")
            config_twelve_data_api["llamadas_actuales_por_minuto"] = 0
            conn.updateById(config_twelve_data_api["_id"], config_twelve_data_api)
            logger.info("Configuración actualizada")
            conn.close()
            logger.info("Llamadas por minuto zeorizadas")
            return (False, "")
        except Exception as e:
            if conn:
                conn.close()
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __DailyCallTOZero():
        conn = None
        try:
            conn = MongoDbFunctions(
                DATABASE["host"],
                DATABASE["port"],
                DATABASE["username"],
                DATABASE["password"],
                DATABASE["dbname"],
                "config",
            )
            logger.info("Obteniendo configuración de la API Twelve Data")
            config_twelve_data_api = conn.findByField("nombre_api", "alphavantage")
            logger.info("Configuración obtenida")
            config_twelve_data_api["llamadas_actuales_diarias"] = 0
            conn.updateById(config_twelve_data_api["_id"], config_twelve_data_api)
            logger.info("Llamadas diarias zeorizadas")
            conn.close()
            return (False, "")
        except Exception as e:
            if conn:
                conn.close()
            logger.error("An error occurred: %s", str(e))
            return (False, e)
