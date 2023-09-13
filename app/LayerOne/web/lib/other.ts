// En un archivo específico donde necesitas obtener el archivo
import { GridFSBucket } from 'mongodb';
import { Binary, BSON } from 'bson';
const fs = require('fs');

import { connectToDatabase } from './db';

export async function getFileFromGridFS() {
    const db = await connectToDatabase('mongodb://192.168.1.76:27017/WhealthGuardian');
    const bucket = new GridFSBucket(db);

    // El nombre del archivo que deseas obtener
    const fileName = 'stockList.json';
    const tempFileName = 'stockList.json';

    // Función para leer el archivo y convertirlo en un diccionario
    function parseStockList(fileContent: string): Record<string, any> {
        try {
            return JSON.parse(fileContent);
        } catch (error) {
            console.error('Error al analizar el archivo:', error);
            return {};
        }
    }


    const [file] = await bucket.find({ filename: fileName }).toArray();

    if (!file) {
        console.log('El archivo no fue encontrado.');
        return null;
    }

    // Aquí puedes realizar acciones con el archivo, como descargarlo o enviarlo como respuesta HTTP
    // Por ejemplo, para descargarlo:
    const fileStream = bucket.openDownloadStreamByName(fileName);


    // Ruta donde deseas guardar el archivo localmente
    const filePath = './tmp/' + tempFileName;

    // Crea un flujo de escritura local para guardar el archivo
    const writeStream = fs.createWriteStream(filePath);

    // Pipe (conectar) el flujo de descarga al flujo de escritura local
    fileStream.pipe(writeStream);

    // Manejar eventos de finalización para saber cuándo se ha completado la descarga
    writeStream.on('finish', () => {
        console.log(`Archivo ${fileName} descargado y guardado en ${filePath}`);
    });

    writeStream.on('error', (err: any) => {
        console.error(`Error al descargar el archivo ${fileName}: ${err}`);
    });


    // Lee el contenido del archivo
    fs.readFile("./tmp/stockList.txt", 'utf8', (err: any, data: string) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return;
        }
        const modifiedData = data.replace(/'/g, '"');
        const stockData = parseStockList(modifiedData);

        // Ahora puedes acceder a los datos en stockData como un diccionario TypeScript
        console.log(stockData);

        // Puedes acceder a los datos específicos como stockData.stocks, stockData.stocks[0].symbol, etc.
    });
    return filePath


}

// Llamas a la función para obtener el archivo
const fileStream = await getFileFromGridFS();
if (fileStream) {
    // Aquí puedes realizar acciones con el archivo, como transmitirlo al cliente
}
function callback(err: {}, arg1: null) {
    throw new Error('Function not implemented.');
}

