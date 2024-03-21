import React from "react";
import Chart from "react-apexcharts";

const ViviendasDonutViviendas = ({ remuneracionesMensuales, legales }) => {
  // Obtener los datos de remuneracionesMensuales
  const dataRemuneraciones = remuneracionesMensuales.map((salida) => ({
    x: new Date(salida.created_at).toLocaleDateString(),
    y: salida?.datos_cliente?.datosCliente?.length || 0,
  }));

  // Obtener los datos de legales
  const dataLegales = legales.map((salida) => ({
    x: new Date(salida.created_at).toLocaleDateString(),
    y: salida?.datos_cliente?.datosCliente?.length || 0,
  }));

  // Combinar los datos de remuneracionesMensuales y legales
  const data = [...dataRemuneraciones, ...dataLegales];

  // Configurar opciones para el gráfico de donut
  const options = {
    chart: {
      type: "donut",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    labels: data.map((item) => item.x),
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "TOTAL",
              formatter: function () {
                const total = data.reduce((acc, item) => acc + item.y, 0);
                return total + " VIVIENDAS ENTREGADAS";
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#000"],
      },
    },
    colors: ["#42b0f5"], // Color de las barras
    grid: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  };

  // Configurar la serie de datos
  const series = data.map((item) => item.y);

  return (
    <div className="bg-white border-slate-200 border-[1px] py-8 px-5 rounded-xl shadow w-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-700 text-lg uppercase font-bold">
          Viviendas entregadas Grafico Donut
        </p>
      </div>
      <Chart options={options} series={series} type="donut" height={300} />
    </div>
  );
};

export default ViviendasDonutViviendas;
