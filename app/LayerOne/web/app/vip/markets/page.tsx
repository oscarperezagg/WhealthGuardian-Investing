'use client'
import { FullNavBar } from "../navbar/fullnavbar"
import DemoPage from "@/components/mine/table"
import { Checkbox } from "@/components/ui/checkbox"



import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColumnDef } from "@tanstack/react-table"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"



import { referenceData, columns } from "@/components/columns/referenceData"
import axios from "axios"
import { FormEvent, useEffect, useState } from "react"
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

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { ToastAction } from "@/components/ui/toast"
import { DialogClose } from "@radix-ui/react-dialog"
import React from "react"

const timestamps = [
    {
        id: "1month",
        label: "1 month",
    },
    {
        id: "1week",
        label: "1 week",
    },
    {
        id: "1day",
        label: "1 day",
    },
    {
        id: "4h",
        label: "4 hours",
    },
    {
        id: "2h",
        label: "2 hours",
    },
    {
        id: "1h",
        label: "1 hour",
    },
    {
        id: "45min",
        label: "45 minutes",
    },
    {
        id: "30min",
        label: "30 minutes",
    },
    {
        id: "15min",
        label: "15 minutes",
    },
    {
        id: "5min",
        label: "5 min",
    },
    {
        id: "1min",
        label: "1 minute",
    },
] as const;


const FormSchema = z.object({
    timestamps: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
    country: z
        .string({
            required_error: "Please select a contry to display.",
        })
})


export default function markets() {
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [PersonalAlertTitle, setPersonalAlertTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

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



    // Función para leer un archivo y devolver su contenido como una cadena
    async function readFile(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && event.target.result) {
                    resolve(event.target.result as string);
                } else {
                    reject(new Error('Error reading file'));
                }
            };
            reader.onerror = (event) => {
                reject(new Error('Error reading file'));
            };
            reader.readAsText(file);
        });
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            timestamps: ["1month", "1week", "1day"],
        },

    })

    const [submittedData, setSubmittedData] = useState("")
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (!selectedFile) {
            console.log('Please select a file.');
            return;
        }


        try {
            // Lee el archivo seleccionado
            const fileContent = await readFile(selectedFile);

            // Toma la primera línea del archivo
            const firstLine = fileContent.split('\n')[0];

            // Guarda la primera línea en una variable
            const assets = firstLine.trim().split(",");
            console.log(assets)

            const res = await axios.post('/api/eu/newregistry', {
                timestamps: data.timestamps,
                country: data.country,
                assets: assets
            })
            console.log(res)
            
            setPersonalAlertTitle("Status: " + res.statusText + " - " + res.status)
            setSubmittedData(res.data)
            opeAlert()
        } catch (error) {
            console.error('Error uploading file:', error);
        }
        setOpen(false)

    }

    function opeAlert() {
        setTimeout(() => {
            console.log("myfunc")
            
            setAlertStatus(true)


        }, 1000)
    }


    const [open, setOpen] = React.useState(false);
    const [alertStatus, setAlertStatus] = React.useState(false);

    return (
        <>
            <AlertDialog open={alertStatus} onOpenChange={setAlertStatus}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{PersonalAlertTitle}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {submittedData}

                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Tabs defaultValue="stocks" className="hidden md:block">
                    <div className="flex justify-between">
                        <TabsList>

                            <TabsTrigger value="stocks">Stocks</TabsTrigger>
                            <TabsTrigger value="indexes">Indexes</TabsTrigger>
                        </TabsList>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">Upload List</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Upload List</DialogTitle>
                                    <DialogDescription>
                                        Upload the list of assets you want to download.
                                    </DialogDescription>
                                </DialogHeader>



                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="file">File</Label>
                                            <Input id="file" type="file"
                                                onChange={handleFileChange}
                                                required
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Country</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Choose a country" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="United States">United States</SelectItem>
                                                            <SelectItem value="Spain">Spain</SelectItem>
                                                            <SelectItem value="Japan">Japan</SelectItem>

                                                            <SelectItem value="China">China</SelectItem>
                                                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                                            <SelectItem value="Germany">Germany</SelectItem>
                                                            <SelectItem value="France">France</SelectItem>
                                                            <SelectItem value="Canada">Canada</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="timestamps"
                                            render={() => (
                                                <FormItem>
                                                    <div className="mb-4">
                                                        <FormLabel className="text-base">Timestamps</FormLabel>
                                                        <FormDescription>
                                                            Select the timestamps you want to display in the sidebar.
                                                        </FormDescription>
                                                    </div>
                                                    {timestamps.map((timestamp) => (
                                                        <FormField
                                                            key={timestamp.id}
                                                            control={form.control}
                                                            name="timestamps"
                                                            render={({ field }) => {
                                                                return (
                                                                    <FormItem
                                                                        key={timestamp.id}
                                                                        className="flex flex-row items-start space-x-2 space-y-0"
                                                                    >
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(timestamp.id)}
                                                                                onCheckedChange={(checked) => {
                                                                                    return checked
                                                                                        ? field.onChange([...field.value, timestamp.id])
                                                                                        : field.onChange(
                                                                                            field.value?.filter(
                                                                                                (value) => value !== timestamp.id
                                                                                            )
                                                                                        )
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="text-sm font-normal">
                                                                            {timestamp.label}
                                                                        </FormLabel>
                                                                    </FormItem>
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                    <FormMessage />
                                                </FormItem>

                                            )}
                                        />

                                        <DialogFooter >
                                            <Button type="submit">Submit</Button>
                                        </DialogFooter>


                                    </form>
                                </Form>

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
                


            </div>



        </>
    )
}