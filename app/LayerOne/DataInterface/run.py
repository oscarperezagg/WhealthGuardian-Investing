from jobs import TDA_CoreData
from logging_config import logger

logger.info("Starting the data interface...\n|     ")

logger.info("========= DOWNLOAD STARTED =========")
TDA_CoreData.downloadAsset()
logger.info("========= DOWNLOAD FINISHED =========")


logger.info("Data interface finished.")