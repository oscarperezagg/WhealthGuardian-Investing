"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"

import { Button } from "@/components/ui/button"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"


import { Input } from "@/components/ui/input"


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    filter: string,
    filter2: string,
    filter3: string

}

export function DataTable<TData, TValue>({
    columns,
    data,
    filter,
    filter2,
    filter3,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [rowSelection, setRowSelection] = React.useState({})
    const [message, setMessage] = React.useState('Loading...');

    React.useEffect(() => {
        // Cambiar el mensaje a "Maybe it's taking too much" después de 2 segundos
        const timer1 = setTimeout(() => {
            setMessage("Maybe it's taking too much");
        }, 2000);

        // Cambiar el mensaje a "Something went wrong" después de 6 segundos (2 segundos + 4 segundos)
        const timer2 = setTimeout(() => {
            setMessage("Something went wrong");
        }, 6000);

        // Limpia los temporizadores al desmontar el componente (importante para evitar memory leaks)
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []); // Empty dependency array ensures this runs only once after initial render


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,

        state: {
            columnFilters,
            rowSelection,

        },
    })

    return (
        // El div exterior contiene los controles del extras
        <div>
            {/* Aquí van los controles del filtrado */}
            <div className="flex items-center py-4 space-x-4">
                <Input
                    placeholder={"Filter " + filter + "..."}
                    value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filter)?.setFilterValue(event.target.value)
                    }
                    className="max-w-xs"
                />
                <Input
                    placeholder={"Filter " + filter2 + "..."}
                    value={(table.getColumn(filter2)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filter2)?.setFilterValue(event.target.value)
                    }
                    className="max-w-xs"
                />
                <Input
                    placeholder={"Filter " + filter3 + "..."}
                    value={(table.getColumn(filter3)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filter3)?.setFilterValue(event.target.value)
                    }
                    className="max-w-xs"
                />
            </div>


            <div className="rounded-md border">

                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {message}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Aquí van los controles del paginado */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
