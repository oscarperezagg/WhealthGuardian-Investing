from app import create_app

# Crea una instancia de la aplicación Flask utilizando la función create_app
app = create_app()

if __name__ == "__main__":
    # Si ejecutas este archivo directamente, inicia la aplicación Flask
    app.run(debug=True,port=3002)