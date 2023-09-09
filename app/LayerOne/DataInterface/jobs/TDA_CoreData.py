import time
from externalApis import CoreData
from externalApis import ReferenceData
from util import MongoDbFunctions
from secret import TWELVE_DATA_API_KEY
from secret import DATABASE
import logging

# Configure the logger
logger = logging.getLogger(__name__)


class TDA_CoreData:
    """
    Esta función implementa la lógica detrás de la descarga los "CoreData"
    del proveedor Twelve Data.

    """

    @staticmethod
    def downloadStocks():
        """
        Esta función descarga

        :return: Un diccionario con los datos descargados.
        """
        conn = None
        try:
            # Obtener todos los registros de descarga de stocks
            conn = MongoDbFunctions(
                DATABASE["host"],
                DATABASE["port"],
                DATABASE["username"],
                DATABASE["password"],
                DATABASE["dbname"],
                "DownloadRegistry",
            )

            logger.info("Descargando registros de stock")
            DownloadRegistries = conn.findByField(
                "type", "stocks", get_all=True, sort=True, sortField="priority"
            )

            # Más lógica de descarga aquí...
            for registry in DownloadRegistries:
                # {'_id': ObjectId('64fc82fb33f2da9a8d8eaecf'), 'timespan': '1month', 'type': 'stocks', 'descargas_pendientes': [], 'priority': 0}
                id = registry.get("_id")
                timespan = registry.get("timespan")
                for stock in registry["descargas_pendientes"]:
                    # Añadir check para ver si ya está
                    res = TDA_CoreData.__findAsset(stock, timespan)
                    if res[0]:
                        TDA_CoreData.__eliminateFromRegistry(id, stock)
                        continue
                    res = TDA_CoreData.__downloadStock(id, stock, timespan)
                    if not res[0] and res[1] == "Llamadas diarias agotadas":
                        return (False, "Llamadas diarias agotadas")

                    if res[0]:
                        TDA_CoreData.__eliminateFromRegistry(id, stock)

            conn.close()
        except Exception as e:
            if conn:
                conn.close()

            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __downloadStock(id, stock, interval):
        conn = None
        try:
            # Obtener la configuración de la API
            config_twelve_data_api = TDA_CoreData.__getConfig()

            # Descargar datos
            finalDataSet = {}
            moreData = True
            earliestTimestamp = None
            end_date = None

            while moreData:
                # Comprobar si hay llamadas disponibles
                check = TDA_CoreData.__anotherCall(config_twelve_data_api)
                if not check[0]:
                    return check

                response = TDA_CoreData.__stockRange(stock, interval, end_date)
                if not response[0]:
                    return response

                # Sumar 1 call
                TDA_CoreData.__oneMoreCall()

                finalDataSet = response[1]

                if not earliestTimestamp:
                    res = TDA_CoreData.__earliestTimestamp(
                        stock, interval, finalDataSet["mic_code"]
                    )

                    # Sumar 1 call
                    TDA_CoreData.__oneMoreCall()

                    if not res[0]:
                        return res

                    earliestTimestamp = res[1]["datetime"]

                if finalDataSet["data"][-1]["datetime"] == earliestTimestamp:
                    moreData = False
                else:
                    end_date = finalDataSet["data"][-1]["datetime"]
            # Subir datos
            res = TDA_CoreData.__uploadAssetDate(finalDataSet)
            if not res[0]:
                return res
            # Fin
            logger.info("%s data downloaded successfully", str(stock))
            return (True, stock)
        except Exception as e:
            if conn:
                conn.close()
            logger.error("An error occurred: %s", str(e))
            return (False, e)

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
            config_twelve_data_api = conn.findByField("nombre_api", "twelvedataapi")
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
                conn = MongoDbFunctions(
                    DATABASE["host"],
                    DATABASE["port"],
                    DATABASE["username"],
                    DATABASE["password"],
                    DATABASE["dbname"],
                    "config",
                )
                logger.info("Obteniendo configuración de la API Twelve Data")
                config_twelve_data_api = conn.findByField("nombre_api", "twelvedataapi")
                logger.info("Configuración obtenida")
                config_twelve_data_api["llamadas_actuales_por_minuto"] = 0

                conn.updateById(config_twelve_data_api["_id"], config_twelve_data_api)

                logger.info("Configuración actualizada")
                conn.close()
                logger.info("Llamadas por minuto agotadas, esperando 1 minuto")
                time.sleep(60)
            return (True, "")
        except Exception as e:
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __earliestTimestamp(stock, interval, mic_code):
        try:
            date = ReferenceData.earliest_timestamp(
                symbol=stock,
                interval=interval,
                mic_code=mic_code,
                apikey=TWELVE_DATA_API_KEY,
            )

            if not date[0]:
                return (False, date)

            date = date[1].json()
            if date.get("status") == "error":
                return (False, date)

            return (True, date)
        except Exception as e:
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __stockRange(stock, interval, end_date=None, parseData={}):
        try:
            logger.info(
                "Downloading stock data for %s with interval %s", stock, interval
            )

            params = {
                "symbol": stock,
                "interval": interval,
                "outputsize": "5000",
                "previous_close": "true",
                "apikey": TWELVE_DATA_API_KEY,
            }

            if end_date:
                params["end_date"] = end_date

            response = CoreData.time_series_intraday(**params)

            if not response[0]:
                logger.error(
                    "Failed to download data for %s with interval %s", stock, interval
                )
                return (False, response)

            temporalDataSet = response[1].json()

            if temporalDataSet["status"] == "error":
                logger.error(
                    "Received an error response: %s",
                    temporalDataSet.get("message", "Unknown error"),
                )
                return (False, response)

            if parseData == {}:
                parseData.update(temporalDataSet["meta"])
                parseData["data"] = temporalDataSet["values"]
            else:
                parseData["data"].extend(temporalDataSet["values"])

            logger.info(
                "Data successfully downloaded for %s with interval %s", stock, interval
            )
            return (True, parseData)
        except Exception as e:
            logger.error("An error occurred: %s", str(e))
            return (False, e)

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
            config_twelve_data_api = conn.findByField("nombre_api", "twelvedataapi")
            logger.info("Configuración obtenida")
            config_twelve_data_api["llamadas_actuales_diarias"] += 1
            config_twelve_data_api["llamadas_actuales_por_minuto"] += 1

            conn.updateById(config_twelve_data_api["_id"], config_twelve_data_api)

            logger.info("Registry updated successfully")
            conn.close()
            return (True, "")
            return (True, "parseData")
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

            conn.insert(dict(assetData))
            logger.info("Data uploaded successfully")
            conn.close()
            return (True, "")
        except Exception as e:
            if conn:
                conn.close()
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __eliminateFromRegistry(id, stock):
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
            logger.info("Deleting %s from %s registry", stock, registry["timespan"])

            registry["descargas_pendientes"].remove(stock)
            conn.updateById(id, registry)

            logger.info("Delete successfully")
            conn.close()
            return (True, "")
        except Exception as e:
            if conn:
                conn.close()
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __findAsset(stock, interval):
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
            logger.info("Finding %s data for %s", interval, stock)
            fields = {"symbol": stock, "interval": interval}
            res = conn.findByMultipleFields(fields)
            conn.close()
            if res:
                logger.info("Stock already downloaded")
                return (True, "")
            return (False, "")
        except Exception as e:
            if conn:
                conn.close()
            logger.error("An error occurred: %s", str(e))
            return (False, e)
