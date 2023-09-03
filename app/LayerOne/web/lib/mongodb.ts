// Importar el módulo mongoose para interactuar con MongoDB
import mongoose from 'mongoose';

// Obtener la URL de conexión a MongoDB desde las variables de entorno
const { MONGODB_URI,MONGODB_USER,MONGODB_PASS} = process.env;

// Verificar si la URL de conexión a MongoDB está definida en las variables de entorno
if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

// Exportar una función asincrónica llamada "connect" para establecer la conexión a MongoDB
export const connect = async () => {
    try {
        // Establecer la conexión a MongoDB utilizando la URL obtenida de las variables de entorno
        const { connection } = await mongoose.connect(process.env.MONGODB_URI);

        // Verificar el estado de la conexión y mostrar un mensaje si está conectado
        if (connection.readyState === 1) {
            console.log('Connected to MongoDB');
            return Promise.resolve(true);
        }
    } catch (error) {
        // Mostrar un mensaje si ocurre un error al conectarse a MongoDB
        console.error(error);
        return Promise.reject(false);
    }
}
