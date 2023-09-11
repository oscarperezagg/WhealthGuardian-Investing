import { DataTable } from "./data-table"


// Define los tipos de los parámetros
type DataTableProps = {
    columns: any[]; // Cambia el tipo según el tipo real de las columnas
    data: any[]; // Cambia el tipo según el tipo real de los datos
    filter: string;
};


// Exporta el componente para que pueda ser importado desde otros archivos
export default function DemoPage(props: DataTableProps) {
    const { columns, data, filter } = props;

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-1 md:flex">
            {/* Utiliza los parámetros en la llamada a DataTable */}
            <DataTable columns={columns} data={data} filter={filter} />
        </div>
    );
}