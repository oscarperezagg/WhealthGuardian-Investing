"use client"


import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { FormEvent } from "react"
import { signIn } from "next-auth/react"

import { useRouter } from "next/navigation"

import { databaseConfig } from '../../config';


export default function LoginPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [host, setHost] = useState("");
    const [port, setPort] = useState("");
    console.log(host, port)
    const onHandleClick = () => {
        router.push("/login")
    }

    useEffect(() => {
        // Realizar una solicitud GET para obtener los valores de host y puerto
        fetch("/config/db")
            .then((response) => response.json())
            .then((data) => {
                setHost(data.host);
                setPort(data.port);
            })
            .catch((error) => {
                console.error("Error al obtener la configuración:", error);
            });
    }, []);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Construye el objeto de datos que deseas enviar en la solicitud POST
        const data = {
            host: host,
            port: port,
        };

        try {
            // Realiza la solicitud POST a la URL /config/db
            const response = await fetch("/config/db", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data), // Convierte los datos a formato JSON
            });

            if (response.ok) {
                // La solicitud fue exitosa, muestra un mensaje de éxito en Toast
                toast({
                    title: "Success",
                    description: "Solicitud POST exitosa",
                    action: (
                        <ToastAction altText="Close">X</ToastAction>
                    ),
                });
            } else {
                // La solicitud falló, muestra un mensaje de error en Toast
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error en la solicitud POST",
                    action: (
                        <ToastAction altText="Close">X</ToastAction>
                    ),
                });
                console.error("Error en la solicitud POST");
            }
        } catch (error) {
            // Error al realizar la solicitud POST, muestra un mensaje de error en Toast
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error al realizar la solicitud POST",
                action: (
                    <ToastAction altText="Close">X</ToastAction>
                ),
            });
            console.error("Error al realizar la solicitud POST:", error);
        }
    };
    return (
        <div className="formulario">
            <Toaster />
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Connection</CardTitle>
                    <CardDescription>Enter IP and port.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>

                    <CardContent className="grid gap-4">

                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="host">Host</Label>
                                <Input
                                    type="host"
                                    id="host"
                                    name="host"
                                    placeholder="127.0.0.1"
                                    value={host} onChange={(e) => setHost(e.target.value)} // Manejar cambios en el estado local
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="port">Service port</Label>
                                <Input
                                    type="port"
                                    id="port"
                                    name="port"
                                    placeholder="27017"
                                    value={port} // Usar el estado local como valor

                                    onChange={(e) => setPort(e.target.value)} // Manejar cambios en el estado local

                                />
                            </div>



                        </div>

                        <Button type="submit" className="w-full">Connect</Button>

                    </CardContent>

                </form>
                <CardFooter className="grid gap-4" >

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <Button onClick={onHandleClick} id="signup" className="w-full" variant="secondary">Log in</Button>

                </CardFooter >

            </Card>
        </div>

    )
}
