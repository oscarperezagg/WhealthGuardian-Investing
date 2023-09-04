from services import CoreStockAPIs
from secret import *

if __name__ == "__main__":
    # Parameters for the API request
    params = {"symbol": "IBM", "interval": "5min", "apikey": API_KEY}

    # Make the API request using CoreStockAPIs
    response = CoreStockAPIs.time_series_intraday(**params)
    

    # Print the JSON response
    print(response[1].json())
