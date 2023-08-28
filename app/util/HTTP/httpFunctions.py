import logging
import requests

# Configure the logger
logger = logging.getLogger(__name__)


class HttpFunctions:
   
   @staticmethod
   def httpRequest(method,url,payload=None,proxy=None,**parameters):
      """
      Send a GET/POST request to the specified URL with optional payload and parameters.
      
      Args:
         method (str): The Method of the the request.      
         url (str): The URL to send the request to.
         payload (dict, optional): The payload to include in the request.
         proxy (dict, optional): Proxy configuration to use for the request.
         **parameters: Additional parameters to include in the URL.
      
      Returns:
            tuple: A tuple containing a response message and the response object.
      """
      logger.debug("Sending GET request to URL: %s", url)
      
      if parameters:
         parameters = HttpFunctions.buildParameterQuery(**parameters)
         url = url + parameters
      
      logger.debug("Request URL with parameters: %s", url)
      
      if method == "GET":
         response = requests.get(url, params=payload, proxies=proxy)
      elif method == "POST":
         response = requests.post(url, params=payload, proxies=proxy)
      else:
         logger.error("Invalid HTTP method")
         return "Invalid HTTP method", None
      
      if response.status_code == 200:
         logger.info("Request successful. Status code: %d", response.status_code)
         return "Response data:", response
      elif response.status_code == 201:
         logger.info("Request successful. Status code: %d", response.status_code)
         return "Response data:", response
      elif response.status_code == 204:
         logger.info("Request successful. Status code: %d", response.status_code)
         return "Response data is empty", response
      elif response.status_code == 301:
         logger.warning("Resource moved permanently. Status code: %d", response.status_code)
         return "Resource moved permanently", response
      elif response.status_code == 302:
         logger.warning("Resource found, temporary redirection. Status code: %d", response.status_code)
         return "Resource found, temporary redirection", response
      elif response.status_code == 400:
         logger.error("Bad request. Status code: %d", response.status_code)
         return "Bad request", response
      elif response.status_code == 401:
         logger.error("Unauthorized access. Status code: %d", response.status_code)
         return "Unauthorized access", response
      elif response.status_code == 403:
         logger.error("Access forbidden. Status code: %d", response.status_code)
         return "Access forbidden", response
      elif response.status_code == 404:
         logger.error("Resource not found. Status code: %d", response.status_code)
         return "Resource not found", response
      elif response.status_code == 500:
         logger.error("Internal server error. Status code: %d", response.status_code)
         return "Internal server error", response
      else:
         logger.error("Unknown error. Status code: %d", response.status_code)
         return "Error:", response

   @staticmethod
   def buildParameterQuery(**kwargs):
      logger.debug("Building parameter query")
      params = []
      for key, value in kwargs.items():
         params.append("=".join([str(key),str(value)]))
         logger.debug("Parameter: %s", params[-1])
      return "?" + "&".join(params)
      


# Example usage
if __name__ == "__main__":
   logging.basicConfig(level=logging.DEBUG)  # Set the desired logging level
   logger.debug(HttpFunctions.getRequest("http://127.0.0.1:5000",name="John", age=25)[1])
