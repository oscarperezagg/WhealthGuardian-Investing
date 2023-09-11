// En un archivo específico donde necesitas obtener el archivo
import { GridFSBucket } from 'mongodb';

import { connectToDatabase } from './db';

export async function getFileFromGridFS() {
    const db = await connectToDatabase('mongodb://172.20.10.2:27017/WhealthGuardian');
    const bucket = new GridFSBucket(db);

    // El nombre del archivo que deseas obtener
    const fileName = 'stockList.json';

    const [file] = await bucket.find({ filename: fileName }).toArray();

    if (!file) {
        console.log('El archivo no fue encontrado.');
        return null;
    }

    // Aquí puedes realizar acciones con el archivo, como descargarlo o enviarlo como respuesta HTTP
    // Por ejemplo, para descargarlo:
    const fileStream = bucket.openDownloadStreamByName(fileName);

    return fileStream;
}

// Llamas a la función para obtener el archivo
const fileStream = await getFileFromGridFS();
if (fileStream) {
    // Aquí puedes realizar acciones con el archivo, como transmitirlo al cliente
}
