'use client'
import { FullNavBar } from "../navbar/fullnavbar"
import DemoPage from "@/components/mine/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { getFileFromGridFS } from "@/lib/other"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColumnDef } from "@tanstack/react-table"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { referenceData, columns } from "@/components/columns/referenceData"
import axios from "axios"
import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
async function getData(endpoint: string): Promise<referenceData[]> {
    console.log("getData")
    try {
        // Realiza la solicitud HTTP a la API de Twelve Data
        const response = await axios.get('https://api.twelvedata.com/' + endpoint);

        // Analiza la respuesta JSON
        const data = response.data["data"];
        console.log("Done")
        return data;
        // Ahora puedes acceder a los datos en 'data' como un objeto JSON
    } catch (error) {
        console.error('Error al hacer la solicitud a la API:', error);
        // Maneja el error aquí, por ejemplo, puedes lanzar una excepción o devolver un valor predeterminado
        throw error; // Lanza el error para que se maneje en el nivel superior o proporciona un valor predeterminado aquí
    }
}

export default function markets() {
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);

    useEffect(() => {
        // Fetch data after the component has mounted (website has loaded)
        async function fetchData() {
            try {
                const stocksData = await getData("stocks");
                const indicesData = await getData("indices");
                setData1(stocksData);
                setData2(indicesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData(); // Call the fetchData function after the component has mounted
    }, []); // Empty dependency array ensures this runs only once after initial render


    return (
        <>

            <FullNavBar />
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Tabs defaultValue="stocks" className="hidden md:block">
                    <div className="flex justify-between">
                        <TabsList>

                            <TabsTrigger value="stocks">Stocks</TabsTrigger>
                            <TabsTrigger value="indexes">Indexes</TabsTrigger>
                        </TabsList>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Upload List</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Upload List</DialogTitle>
                                    <DialogDescription>
                                        Upload the list of assets you want to download. This list must separate symbols with a comma.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="picture" className="mb-2">List</Label>
                                        <Input id="picture" type="file" />
                                    </div>
                                    <Select>
                                        <Label htmlFor="picture">Country</Label>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="United States">United States</SelectItem>
                                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                                <SelectItem value="Japan">Japan</SelectItem>
                                                <SelectItem value="China">China</SelectItem>
                                                <SelectItem value="Singapore">Singapore</SelectItem>
                                                <SelectItem value="Switzerland">Switzerland</SelectItem>
                                                <SelectItem value="Germany">Germany</SelectItem>
                                                <SelectItem value="Canada">Canada</SelectItem>
                                                <SelectItem value="Australia">Australia</SelectItem>
                                                <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                                                <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                                                <SelectItem value="France">France</SelectItem>
                                                <SelectItem value="Netherlands">Netherlands</SelectItem>
                                                <SelectItem value="Sweden">Sweden</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Label htmlFor="picture">Timestamps</Label>
                                    <div className="flex space-x-10" >
                                        <div className="flex flex-col space-y-2">
                                            {/* Grupo izquierdo */}
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms1w" />
                                                <label
                                                    htmlFor="terms1w"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    1 month
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms1w" />
                                                <label
                                                    htmlFor="terms1w"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    1 week
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms1d" />
                                                <label
                                                    htmlFor="terms1d"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    1 day
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms4h" />
                                                <label
                                                    htmlFor="terms4h"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    4 hours
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms2h" />
                                                <label
                                                    htmlFor="terms2h"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    2 hours
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms1h" />
                                                <label
                                                    htmlFor="terms1h"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    1 hour
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms45m" />
                                                <label
                                                    htmlFor="terms45m"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    45 minutes
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms30m" />
                                                <label
                                                    htmlFor="terms30m"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    30 minutes
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms15m" />
                                                <label
                                                    htmlFor="terms15m"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    15 minutes
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms5m" />
                                                <label
                                                    htmlFor="terms5m"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    5 minutes
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms1m" />
                                                <label
                                                    htmlFor="terms1m"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    1 minute
                                                </label>
                                            </div>

                                            {/* Agrega más elementos al grupo izquierdo según sea necesario */}
                                        </div>


                                    </div>

                                </div>
                                <DialogFooter>
                                    <Button type="submit">Download</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <TabsContent value="stocks">
                        <DemoPage columns={columns} data={data1} filter="symbol" filter2="country" filter3="exchange" />


                    </TabsContent>
                    <TabsContent value="indexes">
                        <DemoPage columns={columns} data={data2} filter="symbol" filter2="country" filter3="exchange" />


                    </TabsContent>
                </Tabs>
                <div className="md:hidden">
                    <Alert >
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Attention!</AlertTitle>
                        <AlertDescription>
                            This website is not optimized for mobile devices. Please use a desktop browser to access all the features.
                        </AlertDescription>
                    </Alert>
                </div>


            </div>



        </>
    )
}