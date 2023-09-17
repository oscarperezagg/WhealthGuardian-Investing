from jobs import AV_CoreData
from logging_config import logger

logger.info("Starting the data interface...\n|     ")

logger.info("========= DOWNLOAD STARTED =========")
AV_CoreData.downloadAsset()
logger.info("========= DOWNLOAD FINISHED =========")


logger.info("Data interface finished.")