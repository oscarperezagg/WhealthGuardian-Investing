// db.ts

import { MongoClient, Db } from 'mongodb';

let cachedDb: Db;

export async function connectToDatabase(uri: string): Promise<Db> {
    if (cachedDb) {
        return cachedDb;
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        cachedDb = db;

        return db;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }
}

