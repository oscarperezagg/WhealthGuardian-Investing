import { databaseConfig } from "@/config";
import { connect, connection } from "@/lib/mongodb";
import { IncomingForm } from "formidable";
import fs from "fs";
import { IncomingMessage } from "http";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


const { MongoClient } = require('mongodb');


const { MONGODB_URI, MONGODB_DBNAME, MONGODB_USER, MONGODB_PASS } = process.env;

// Verificar si la URL de conexión a MongoDB está definida en las variables de entorno
if (!MONGODB_URI || !MONGODB_DBNAME) {
    throw new Error(
        'Please define all the required MONGODB environment variables inside .env.local'
    );
}

if (!databaseConfig.host || !databaseConfig.port) {
    throw new Error(
        'Please define all the required MONGODB environment variables inside .env.local'
    );
}

// Datos que deseas añadir
const datosAAgregar = {
    campo1: 'Valor 1',
    campo2: 42,
};

export async function POST(request: Request) {
    // Obtener los datos del cuerpo de la solicitud
    const { assets, timestamps, country } = await request.json();

    console.log(assets, timestamps)

    // Definir la conexión a la base de datos
    const CONNECTION_STRING = "mongodb://" + databaseConfig.host + ":" + databaseConfig.port + "/" + MONGODB_DBNAME;

    const client = new MongoClient(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Conexión a MongoDB establecida');

        const db = client.db(); // Obtener una instancia de la base de datos

        // Nombre de la colección en la que deseas actualizar datos
        const nombreColeccion = 'DownloadRegistry';

        // Iterar a través de los valores de timestamps
        for (const timestamp of timestamps) {
            // Filtro para identificar los documentos que deseas actualizar
            const filtro = { timespan: timestamp };

            // Obtener el documento actual
            const documento = await db.collection(nombreColeccion).findOne(filtro);

            if (documento) {
                // Obtener el array "descargas_pendientes" del documento
                const descargasPendientes = documento.descargas_pendientes || [];

                // Calcular los elementos que no están en descargasPendientes
                const nuevosElementos = assets.filter((asset: any) => !descargasPendientes.includes(asset));

                if (nuevosElementos.length > 0) {
                    // Actualizar el documento con los nuevos elementos en "descargas_pendientes"
                    const resultado = await db.collection(nombreColeccion).updateOne(
                        filtro,
                        { $addToSet: { descargas_pendientes: { $each: nuevosElementos } } }
                    );

                    console.log(`Se actualizaron ${resultado.modifiedCount} documentos para timestamp ${timestamp}`);
                }
            }
        }
    } catch (error) {
        console.error('Error al conectar o actualizar datos:', error);
        return new Response('Error al conectar o actualizar datos:', { status: 400 });
    } finally {
        client.close(); // Cierra la conexión cuando hayas terminado
    }

    return new Response('Se añadieron al registro correctamente:', { status: 200 });

}
