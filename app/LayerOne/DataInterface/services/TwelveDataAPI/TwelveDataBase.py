import logging
from util import HttpFunctions
# Configure the logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TwelveDataBase:
    
    url = "https://api.twelvedata.com"
    
    
    @staticmethod
    def api_request(requiered_parameters, optional_parameters,**parameters):
        required = requiered_parameters
        required.append("apikey")
        
        optional = optional_parameters
        
        # Check for missing required parameters
        for required_parameter in required:
            if required_parameter not in parameters:
                logger.error("Missing required parameter: %s", required_parameter)
                return "Missing required parameter", None
        
        # Check for invalid parameters
        for input_parameter in parameters:
            if input_parameter not in required and input_parameter not in optional:
                logger.error("Invalid parameter: %s", input_parameter)
                return "Invalid parameter", None
            
        final_parameters = []
        
        for parameter_name in parameters:
            final_parameters.append(f"{parameter_name}={parameters[parameter_name]}")
            
        final_url = TwelveDataBase.url + "?" + "&".join(final_parameters)
        print(final_url)

        return HttpFunctions.httpRequest("GET",final_url)
   
        
    
