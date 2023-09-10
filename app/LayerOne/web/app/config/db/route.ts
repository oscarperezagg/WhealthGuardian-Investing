import { NextResponse } from 'next/server';
import { databaseConfig } from '../../../config';
// Función para validar una dirección IP
function isValidIPAddress(ip: string) {
    // Expresión regular para verificar una dirección IP en formato IPv4
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

// Función para validar un número de puerto
function isValidPort(port: number) {
    // Verificar que el puerto esté en el rango válido (0-65535)
    return port >= 0 && port <= 65535;
}

// Definir la función POST para manejar las solicitudes POST
export async function POST(request: Request) {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { host, port } = await request.json();

        // Verificar si host es una dirección IP válida
        if (!isValidIPAddress(host)) {
            return new Response('Host no es una dirección IP válida', { status: 400 });
        }

        // Verificar si port es un número de puerto válido
        if (!isValidPort(port)) {
            return new Response('Port no es un número de puerto válido', { status: 400 });
        }

        databaseConfig.host = host;
        databaseConfig.port = port.toString();
        // Aquí puedes continuar con el procesamiento si host y port son válidos

        // ...

        return new Response('Solicitud procesada correctamente', { status: 200 });
    } catch (error) {
        return new Response('Error en el procesamiento de la solicitud', { status: 500 });
    }
}


// Función para manejar las solicitudes GET
export async function GET(request: Request) {
    try {
        // Aquí puedes proporcionar los valores de configuración actuales en la respuesta
        const responseBody = {
            host: databaseConfig.host,
            port: databaseConfig.port,
        };

        return new Response(JSON.stringify(responseBody), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new Response('Error en el procesamiento de la solicitud', { status: 500 });
    }
}