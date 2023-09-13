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
        id: "4hours",
        label: "4 hours",
    },
    {
        id: "2hours",
        label: "2 hours",
    },
    {
        id: "1hour",
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
        id: "1minute",
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





    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            timestamps: ["1month", "1week", "1day"],
        },

    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        myfunc()
        setOpen(false)

    }

    function myfunc() {
        setTimeout(() => {
            console.log("myfunc")
            setPersonalAlertTitle("Upload Successful")
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
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <FullNavBar />
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
                                            <Label htmlFor="file">Picture</Label>
                                            <Input id="file" type="file" />
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
                                                                <SelectValue placeholder="Select a verified email to display" />
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