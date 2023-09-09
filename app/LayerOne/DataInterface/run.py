from jobs import TDA_CoreData
import logging

# Configure the logger
logging.basicConfig(level=logging.INFO, format="|     [%(asctime)s] [%(levelname)s] [%(filename)s] [Line %(lineno)d] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")

logger = logging.getLogger(__name__)
print("|     ")
logger.info("Starting the data interface...\n|     ")

TDA_CoreData.downloadStocks()