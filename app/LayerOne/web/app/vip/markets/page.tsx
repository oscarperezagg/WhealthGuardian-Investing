
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


import { referenceData, columns } from "@/components/columns/referenceData"

async function getData(): Promise<referenceData[]> {
    // Fetch data from your API here.
    return [
        {
            symbol: "XYZ",
            name: "Empresa XYZ",
            country: "País ABC",
            exchange: "Bolsa de Valores ABC",
            mic_code: "MIC001"
        },
        {
            symbol: "123",
            name: "Company 123",
            country: "Country XYZ",
            exchange: "Stock Exchange XYZ",
            mic_code: "MIC456"
        },
        {
            symbol: "DEF",
            name: "Empresa DEF",
            country: "País LMN",
            exchange: "Bolsa de Valores LMN",
            mic_code: "MIC789"
        },
        {
            symbol: "ABC123",
            name: "Company ABC123",
            country: "Country PQR",
            exchange: "Stock Exchange PQR",
            mic_code: "MIC234"
        },
        {
            symbol: "456",
            name: "Company 456",
            country: "Country JKL",
            exchange: "Stock Exchange JKL",
            mic_code: "MIC567"
        },
        {
            symbol: "GHI",
            name: "Empresa GHI",
            country: "País STU",
            exchange: "Bolsa de Valores STU",
            mic_code: "MIC890"
        },
        {
            symbol: "789",
            name: "Company 789",
            country: "Country UVW",
            exchange: "Stock Exchange UVW",
            mic_code: "MIC345"
        },
        {
            symbol: "JKL",
            name: "Empresa JKL",
            country: "País DEF",
            exchange: "Bolsa de Valores DEF",
            mic_code: "MIC678"
        },
        {
            symbol: "987",
            name: "Company 987",
            country: "Country XYZ",
            exchange: "Stock Exchange XYZ",
            mic_code: "MIC123"
        },
        {
            symbol: "MNO",
            name: "Empresa MNO",
            country: "País PQR",
            exchange: "Bolsa de Valores PQR",
            mic_code: "MIC901"
        }
    ]
}

export default async function markets() {
    const data = await getData()



    return (
        <>

            <FullNavBar />
            <div className="flex-1 space-y-4 p-8 pt-6">

                <Tabs defaultValue="stocks" className="">
                    <TabsList>
                        <TabsTrigger value="stocks">Stocks</TabsTrigger>
                        <TabsTrigger value="indexes">Indexes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="stocks">
                        <DemoPage columns={columns} data={data} filter="symbol" />


                    </TabsContent>
                    <TabsContent value="indexes">
                        <DemoPage columns={columns} data={data} filter="symbol" />


                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}