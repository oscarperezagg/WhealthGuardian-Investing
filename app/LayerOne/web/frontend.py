# Import the Flask library
from flask import Flask

# Create an instance of the Flask app
app = Flask(__name__)

# Define a route for the root URL ("/")
@app.route('/')
def hello():
    return "Hello, Flask!"

# Run the app when the script is executed
if __name__ == '__main__':
    app.run()
