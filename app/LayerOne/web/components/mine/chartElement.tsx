import React, { FunctionComponent } from 'react';
import Chart from "react-apexcharts";

interface ChartProps {
    options: { [key: string]: any }; // Diccionario de opciones
    data: Array<{
        close: string;
        datetime: string;
        high: string;
        low: string;
        open: string;
        previous_close: string;
        volume: string;
    }>; // Arreglo de series con el nuevo formato
}

const ChartComponent: FunctionComponent<ChartProps> = ({ options, data }) => {

    let series = [{
        data: []
    }];

    // Tu lógica para renderizar el gráfico utilizando las propiedades "options" y "series"
    let parseData = data
        .filter(item => parseFloat(item.open) !== 0)
        .map(item => (
            {
                x: new Date(item.datetime),
                y: [parseFloat(item.open), parseFloat(item.high), parseFloat(item.low), parseFloat(item.close)],
            }
        ));
    console.log("parseData", parseData);

    // Agregar parseData a data utilizando concat
    series[0].data = series[0].data.concat(parseData as any);




    return (
        <>
            {series[0].data.length > 0 ? (
                <Chart
                    options={options}
                    series={series}
                    type="candlestick"
                    width="100%"
                    height="500px"
                />
            ) : (
                <p>No hay datos para mostrar.</p>
            )}
        </>
    );
};

export default ChartComponent;
