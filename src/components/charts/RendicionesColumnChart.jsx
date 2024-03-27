import React from "react";
import Chart from "react-apexcharts";

const RendicionesColumnChart = ({ rendicionesMensuales }) => {
  // Extracting data for the chart
  const fechas = rendicionesMensuales.map(
    (remuneracion) => remuneracion.created_at.split("T")[0]
  ); // Extracting only date, removing time

  const remuneracionesData = rendicionesMensuales.map((remuneracion) =>
    parseFloat(remuneracion.rendicion_final)
  ); // Convert to ARS (considering 1 USD = 97 ARS)

  // Configuring chart options
  const options = {
    chart: {
      type: "bar",
      height: 200,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: fechas,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumIntegerDigits: 2,
          }); // Add currency symbol to y-axis labels and format as currency
        },
        style: {
          fontSize: "12px",
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 1,
        colors: {
          ranges: [
            {
              from: Number.MIN_SAFE_INTEGER,
              to: 3,
              color: "#FF0000",
            },
          ],
          backgroundBarColors: [],
          backgroundBarOpacity: 1,
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
  };

  // Configuring chart series
  const series = [
    {
      name: "Remuneración",
      data: remuneracionesData,
    },
  ];

  return (
    <div className="w-full max-md:overflow-x-scroll">
      {" "}
      <Chart
        options={options}
        series={series}
        type="bar"
        className="max-md:w-[1500px] md:w-[100%]"
        height={500} // Adjust chart height as needed
      />
    </div>
  );
};

export default RendicionesColumnChart;
