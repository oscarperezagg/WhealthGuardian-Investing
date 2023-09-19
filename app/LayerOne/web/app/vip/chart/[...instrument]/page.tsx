'use client';
import { FullNavBar } from "../../navbar/fullnavbar";
import { useRouter } from "next/navigation"
import axios from 'axios';
import React, { useEffect, useState } from "react";
import ApexCharts from 'apexcharts'
import Chart from "react-apexcharts";
import ChartComponent from "@/components/mine/chartElement";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function Charts({ params }: { params: { instrument: string } }) {
    const { instrument } = params;
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [endDate, setEndDate] = React.useState<Date>()
    const [startDate, setStartDate] = React.useState<Date>()

    const postData = {
        collection_name: "CoreData",
        fields: { "symbol": instrument[0], "interval": "1month" },
    };


    const options = {
        chart: {
            type: 'candlestick',
            height: 1000
        },

        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            tooltip: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: undefined,
            options: {},
        }]
    }

    useEffect(() => {
        // Realiza la solicitud POST cuando el componente se monta
        axios.post('http://127.0.0.1:3002/mongo/find_by_multiple_fields', postData)
            .then(response => {
                // Verifica si la respuesta contiene la clave "documents"
                if (response.data && response.data.documents) {
                    const documents = response.data.documents;
                    // Verifica si la clave "data" existe y si es un arreglo
                    if (documents.data && Array.isArray(documents.data)) {
                        // Imprime el primer elemento de "data"
                        setSeries(documents.data);
                        setLoading(false);
                        setError(false);

                    }
                } else {
                    console.log("La respuesta no contiene la clave 'documents'.");
                    setLoading(false);
                    setError(true);
                }
            })
            .catch(error => {
                // Maneja los errores aquí
                setLoading(false);
                setError(true);
                console.error("Error:", error);
            });
    }, []);

    return (
        <>
            <div>
                <div className="p-8">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error loading data</p>
                    ) : (
                        <div>
                            <div className="hidden space-y-6 pb-16 md:block">
                                <div className="space-y-0.5">
                                    <h2 className="text-xl font-bold tracking-tight">{instrument[0]} Chart</h2>


                                    <div className="pt-3 flex  space-x-2">
                                        <Select>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Timestamp" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1month">1 month</SelectItem>
                                                <SelectItem value="1week">1 week</SelectItem>
                                                <SelectItem value="1day">1 day</SelectItem>
                                                <SelectItem value="4hours">4 hours</SelectItem>
                                                <SelectItem value="2hours">2 hours</SelectItem>
                                                <SelectItem value="1hour">1 hour</SelectItem>
                                                <SelectItem value="45min">45 minutes</SelectItem>
                                                <SelectItem value="30min">30 minutes</SelectItem>
                                                <SelectItem value="15min">15 minutes</SelectItem>
                                                <SelectItem value="5min">5 minutes</SelectItem>
                                                <SelectItem value="1min">1 minute</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
                                                        !startDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {startDate ? format(startDate, "PPP") : <span>Pick start date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={setStartDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
                                                        !endDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={setEndDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>

                                        </Popover>

                                    </div>
                                </div>

                                <ChartComponent options={options} data={series} />

                            </div>


                        </div>

                    )}
                </div>
            </div>
        </>
    )
}