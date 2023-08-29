from config import create_app
# Create an instance of the Flask app



# Run the app when the script is executed
if __name__ == '__main__':

    app = create_app()
    app.run(debug=True)
