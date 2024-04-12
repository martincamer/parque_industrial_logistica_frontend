import React from "react";
import Chart from "react-apexcharts";

const ViviendasDataCharts = ({ salidasMensuales }) => {
  // Configurar los datos y etiquetas para el gráfico de barras básico
  const data = salidasMensuales.map((salida, index) => {
    const cantidad = salida?.datos_cliente?.datosCliente?.length || 0;
    const fecha = new Date(salida.created_at).toLocaleDateString();
    return {
      x: fecha,
      y: cantidad,
    };
  });

  // Configurar opciones para el gráfico de barras básico
  const options = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barWidth: "80%", // Anchura de las barras
        borderRadius: 4, // Redondeo de las esquinas de las barras
        dataLabels: {
          position: "bottom",
        },
        columnWidth: "70%", // Anchura de las columnas
      },
    },
    xaxis: {
      categories: data.map((item) => item.x),
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val;
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + " VIVIENDAS ENTREGADAS";
      },
      offsetY: 2,
      offsetX: 80,
      style: {
        fontSize: "12px",
        colors: ["#000"],
      },
    },
    colors: ["#90EE90"], // Color de las barras
    grid: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  };

  // Configurar la serie de datos
  const series = [
    {
      data: data.map((item) => item.y),
    },
  ];

  return (
    <div className="bg-white border-slate-200 border-[1px] py-8 px-5 rounded-xl hover:shadow-md transition-all ease-linear cursor-pointer w-full max-md:py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-700 text-lg uppercase font-bold max-md:text-sm">
          Viviendas entregadas Grafico Barras
        </p>
      </div>
      <Chart
        options={options}
        series={series}
        type="bar"
        width={"100%"}
        height={salidasMensuales.length * 70}
      />
    </div>
  );
};

export default ViviendasDataCharts;
