"use client"


import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type referenceData = {
    symbol: string
    name: string
    country: string
    exchange: string
    mic_code: string
}

export const columns: ColumnDef<referenceData>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "symbol",
        header: "Symbol",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "country",
        header: "Country",
    },
    {
        accessorKey: "exchange",
        header: "Exchange",
    },
    {
        accessorKey: "mic_code",
        header: "MIC Code",
    },
]
