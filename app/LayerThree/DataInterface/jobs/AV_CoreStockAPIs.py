from datetime import datetime, timedelta
import time
from externalApis import CoreStockAPIs
from externalApis import ReferenceData
from util import MongoDbFunctions
from util import HttpFunctions
from secret import ALPHA_VANTAGE_API_KEY
from secret import DATABASE
from logging_config import logger
from requests import Response

# Configure the logger

base_url = "http://localhost:3002/mongo/"


class AV_CoreData:
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
        try:
            # Obtener todos los registros de descarga del activo seleccionado
            DownloadRegistries = HttpFunctions.httpRequest(
                method="POST",
                url=base_url + "find_all",
                payload={
                    "collection_name": "DownloadRegistry",
                    "sort": True,
                    "sortField": "priority",
                    "asc": True,
                },
            )
            if not DownloadRegistries[0]:
                logger.error("An error occurred: %s", str(DownloadRegistries[1].text))
                return (False, DownloadRegistries[1].text)
            logger.info(f"Descargando registros")

            DownloadRegistries = DownloadRegistries[1].json()

            # Más lógica de descarga aquí...
            for registry in DownloadRegistries["documents"]:
                id = registry.get("_id")
                timespan = registry.get("timespan")
                logger.info(f"[START] Descargando registros con timespanp {timespan}")

                for asset in registry["descargas_pendientes"]:
                    # MODIFICAR A PARTIR DE AQUí

                    # COMPROBAMOS SI EL ACTIVO YA ESTÁ EN LA BASE DE DATOS
                    res = AV_CoreData.__findAsset(asset, timespan)
                    # SI ESTÁ EN LA BASE DE DATOS, LO ELIMINAMOS DEL REGISTRO DE DESCARGA PENDIENTE
                    if res[0]:
                        AV_CoreData.__eliminateFromRegistry(id, asset)
                        continue
                    # Descargamos el activo
                    res = AV_CoreData.__downloadAsset(id, asset, timespan)

                    if res[0] and res[1] == {}:
                        AV_CoreData.__eliminateFromRegistry(id, asset)
                        logger.info(
                            f"Eliminado {asset} por que no hay datos disponibles"
                        )
                    # ELIMINAMOS EL REGISTRO DE DESCARGA PENDIENTE
                    if res[0]:
                        AV_CoreData.__eliminateFromRegistry(id, asset)
                        logger.info(
                            f"Eliminado {asset} de la lista de descargas pendientes"
                        )
                    print("")
                if not registry["descargas_pendientes"]:
                    logger.info(f"No hay registros de con timespan {timespan}")
                logger.info(f"Descargados todos los registros con timespan {timespan}")

        except Exception as e:
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __downloadAsset(id, asset, interval):
        try:
            # OBTENEMOS LA CONFIGURACIÓN DE LA API
            config = AV_CoreData.__getConfig()
            limit_date = config["limit_date"]
            id = config["_id"]
            del config["_id"]
            # CONFIGURATION
            finalDataSet = {}
            interval = "30min"

            short_interval = ["1min", "5min", "15min", "30min", "60min"]

            if interval in short_interval:
                data = {}
                current_year = int(datetime.now().year)
                current_month = int(datetime.now().month)
                years = []
                for numero in range(current_year, limit_date - 1, -1):
                    years.append(numero)

                for year in years:
                    max = 12
                    if year == current_year:  # Si es el año actual
                        max = current_month
                    for month in range(max, 0, -1):
                        logger.info(
                            f"Descargando datos de {year}-{str(month).zfill(2)}"
                        )
                        # Comprobamos llamadas disponibles
                        check = AV_CoreData.__anotherCall()
                        if not check[0]:
                            return check
                        # Descargamos los datos
                        params = {
                            "symbol": asset,
                            "interval": interval,
                            "month": f"{year}-{str(month).zfill(2)}",
                            "apikey": ALPHA_VANTAGE_API_KEY,
                            "outputsize": "full",
                        }
                        AV_CoreData.__oneMoreCall()
                        res = CoreStockAPIs.time_series_intraday(**params)
                        if res[0]:
                            res = res[1].json()
                        if res == {}:
                            return (True, {})
                        if year == current_year and month == current_month:
                            data["symbol"] = res["Meta Data"]["2. Symbol"]
                            data["interval"] = res["Meta Data"]["4. Interval"]
                            time_series_data = []

                            for timestamp, values in res[
                                f"Time Series ({interval})"
                            ].items():
                                time_series_data.append(
                                    {
                                        "timestamp": timestamp,
                                        "open": values["1. open"],
                                        "high": values["2. high"],
                                        "low": values["3. low"],
                                        "close": values["4. close"],
                                        "volume": values["5. volume"],
                                    }
                                )
                            data["time_series"] = time_series_data
                        else:
                            time_series_data = []

                            for timestamp, values in res["Time Series (30min)"].items():
                                time_series_data.append(
                                    {
                                        "timestamp": timestamp,
                                        "open": values["1. open"],
                                        "high": values["2. high"],
                                        "low": values["3. low"],
                                        "close": values["4. close"],
                                        "volume": values["5. volume"],
                                    }
                                )
                            data["time_series"].extend(time_series_data)
                        logger.info("Datos descargados")

            # Subir datos
            res = AV_CoreData.__uploadAssetDate(finalDataSet)
            if not res[0]:
                return res
            # Fin
            logger.info("%s data downloaded successfully", str(asset))
            return (True, asset)
        except Exception as e:
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __getConfig():
        try:
            # Obtener todos los registros de descarga del activo seleccionado
            logger.info("Obteniendo configuración de la API Twelve Data")
            config = HttpFunctions.httpRequest(
                method="POST",
                url=base_url + "find_by_field",
                payload={
                    "collection_name": "config",
                    "field": "nombre_api",
                    "value": "alphavantage",
                },
            )
            if not config[0]:
                logger.warning("An error occurred: %s", str(config[1].text))
                return (False, config[1].text)

            config = config[1].json()["documents"]
            logger.info("Configuración obtenida")
            return config
        except Exception as e:
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __anotherCall():
        try:
            config = AV_CoreData.__getConfig()
            id = config["_id"]
            del config["_id"]
            logger.info("Comprobando llamadas disponibles")

            # Comprobamos si el tiempo de modificación es de hace un año
            last_modification_date = config.get("fecha_modificacion").strip()
            date_format = "%a, %d %b %Y %H:%M:%S"

            # Convert the date string to a datetime object
            last_modification_date = datetime.strptime(
                last_modification_date, date_format
            )
            if last_modification_date:
                current_date = datetime.now()
                one_day_ago = current_date - timedelta(days=1)
                if last_modification_date < one_day_ago:
                    logger.info("La fecha de modificación es de hace un día.")
                    AV_CoreData.__DailyCallTOZero()
                    AV_CoreData.__minuteCallTOZero()
                    return (True, "")

            # Verificamos si la fecha de modificación es de hace más de un minuto y medio
            if last_modification_date:
                current_date = datetime.now()

                time_difference = current_date - last_modification_date
                max_duration = timedelta(minutes=2)

                if time_difference > max_duration:
                    logger.info(
                        "La fecha de modificación es de hace más de un minuto y medio."
                    )
                    AV_CoreData.__minuteCallTOZero()
                    return (True, "")

            # Comprobamos llamadas diarias
            check = (
                config["llamadas_actuales_diarias"]
                < config["max_llamadas_diarias"] - 20
            )
            if not check:
                logger.info("Llamadas diarias agotadas")
                return (False, "Llamadas diarias agotadas")
            # Comprobamos llamadas por minuto
            check = (
                config["llamadas_actuales_por_minuto"]
                < config["max_llamadas_por_minuto"] - 1
            )
            if not check:
                AV_CoreData.__minuteCallTOZero()
                logger.info("Llamadas por minuto agotadas")
                time.sleep(120)
            return (True, "")
        except Exception as e:
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __oneMoreCall():
        conn = None
        try:
            config = AV_CoreData.__getConfig()
            id = config["_id"]
            del config["_id"]
            config["llamadas_actuales_diarias"] += 1
            config["llamadas_actuales_por_minuto"] += 1
            # Define the desired date format

            date_format = "%a, %d %b %Y %H:%M:%S"

            # Get the current datetime and format it as a string
            current_datetime = datetime.now().strftime(date_format)
            config["fecha_modificacion"] = current_datetime

            res = HttpFunctions.httpRequest(
                method="POST",
                url=base_url + "update_by_id",
                payload={
                    "collection_name": "config",
                    "id": id,
                    "updated_data": config,
                },
            )
            logger.info("Registry updated successfully")
            return (True, "")
        except Exception as e:
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
        try:
            # Obtener todos los registros de descarga del activo seleccionado
            DownloadRegistry = HttpFunctions.httpRequest(
                method="POST",
                url=base_url + "find_by_id",
                payload={
                    "collection_name": "DownloadRegistry",
                    "id": id,
                },
            )
            if not DownloadRegistry[0]:
                logger.warning("An error occurred: %s", str(DownloadRegistry[1].text))
                return (False, DownloadRegistry[1].text)
            logger.info(f"Descargando registros")

            DownloadRegistry = DownloadRegistry[1].json()["document"]
            logger.info(
                "Deleting %s from %s registry", asset, DownloadRegistry["timespan"]
            )

            DownloadRegistry["descargas_pendientes"].remove(asset)
            del DownloadRegistry["_id"]

            # Obtener todos los registros de descarga del activo seleccionado
            res = HttpFunctions.httpRequest(
                method="POST",
                url=base_url + "update_by_id",
                payload={
                    "collection_name": "DownloadRegistry",
                    "id": id,
                    "updated_data": DownloadRegistry,
                },
            )

            logger.info(f"Descargando registros")
            return (True, "")
        except Exception as e:
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __findAsset(asset, interval):
        try:
            # Obtener todos los registros de descarga del activo seleccionado
            logger.info("Finding %s data for %s", interval, asset)
            res = HttpFunctions.httpRequest(
                method="POST",
                url=base_url + "find_by_multiple_fields",
                payload={
                    "collection_name": "CoreData",
                    "fields": {"symbol": asset, "interval": interval},
                },
            )
            # CONTROL DE ERRORES
            if not res[0]:
                logger.error("An error occurred: %s", str(res[1].text))
                return (False, res[1].text)
            # FIN CONTROL DE ERRORES
            logger.info(f"Descargando registros")
            res = res[1].json()["documents"]

            if res:
                logger.info("Asset already in the database")
                return (True, "")
            return (False, "")
        except Exception as e:
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __minuteCallTOZero():
        try:
            config = AV_CoreData.__getConfig()
            id = config["_id"]
            del config["_id"]
            logger.info("Reseteando llamadas por minuto")
            config["llamadas_actuales_por_minuto"] = 0
            # Obtener todos los registros de descarga del activo seleccionado
            res = HttpFunctions.httpRequest(
                method="POST",
                url=base_url + "update_by_id",
                payload={
                    "collection_name": "config",
                    "id": id,
                    "updated_data": config,
                },
            )
            logger.info("Configuración actualizada")
            logger.info("Llamadas por minuto zeorizadas")
            return (False, "")
        except Exception as e:
            logger.error("An error occurred: %s", str(e))
            return (False, e)

    def __DailyCallTOZero():
        try:
            config = AV_CoreData.__getConfig()
            id = config["_id"]
            del config["_id"]
            logger.info("Reseteando llamadas por minuto")
            config["llamadas_actuales_diarias"] = 0
            # Obtener todos los registros de descarga del activo seleccionado
            res = HttpFunctions.httpRequest(
                method="POST",
                url=base_url + "update_by_id",
                payload={
                    "collection_name": "config",
                    "id": id,
                    "updated_data": config,
                },
            )
            logger.info("Configuración actualizada")
            logger.info("Llamadas por minuto zeorizadas")
            return (False, "")

        except Exception as e:
            logger.error("An error occurred: %s", str(e))
            return (False, e)
