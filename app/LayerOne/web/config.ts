// config.ts

const { MONGODB_HOST, MONGODB_PORT } = process.env;

export interface DatabaseConfig {
    host: string;
    port: string;
}


export const databaseConfig = {
    host: MONGODB_HOST || "127.0.0.1",
    port: MONGODB_PORT || "27017",
};

